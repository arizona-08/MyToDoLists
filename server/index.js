import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { comparePasswords } from "./data/utils.js";
import { runMigration } from "./data/migrations.js";
import { access, writeFile } from "fs/promises";
import * as USER from "./data/user.js";
import * as BOARD from "./data/board.js";
import * as SLOT from "./data/slot.js";
import * as TASK from "./data/task.js";


dotenv.config();
const api_key = process.env.API_KEY;

try {
    await access("migrated.txt");
} catch (err){
    await runMigration(api_key);
    try{
        await writeFile("migrated.txt", "ran migration")
    } catch (err){
        console.error("something went wrong when writing to file migrated.txt: ", err);
    }
}


const app = express();
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something wrong happened");
});

app.use(cors());
app.use(express.json());

//------ USER RELATED ROUTES -------

app.get("/api/users", async (request, response) => {
    const users = await USER.getUsers();
    response.send(users);
});

app.get("/api/user/:id", async (request, response) => {
    const id = request.params.id;
    const user = await USER.getUser({id: id});
    response.send(user);
});


app.post("/api/create-user", async (request, response) => {
    const {name, firstname, email, password} = request.body;
    const existingusers = await USER.getUsersBy({email: email});
    if(existingusers){
        response.status(400).json({
            success: false,
            message: "Email déja associé à un compte."
        })
    } else {
        await USER.createUser(name, firstname, email, password);
        response.status(201).send();
    }
    
});

app.delete("/api/delete-user/:id", async (request, response) => {
    const userId = request.params.id;
    await USER.deleteUser([["id", "=", userId]]);
    response.status(201).send();
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await USER.getUser({email: email});

    // res.send(user);
    
    if (user === null) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatching = await comparePasswords(password, user.password);

    if (isMatching) {
        await USER.updateUser({is_logged: true}, {email: email});
        return res.status(200).json({ success: true, message: 'Login successful', token: user.auth_token });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


app.patch('/api/logout', async (req, res) => {
    const auth_token = req.body.auth_token;
    const user = await USER.getUser({auth_token: auth_token});
    if(user !== null){
        await USER.updateUser({is_logged: false}, {auth_token: auth_token});
        return res.json({success: true, message: "Successfully logged out", requested: req.body});
    } else {
        return res.json({success: false, message: "Utilisateur introuvable", requested: auth_token});
    }
    
})

// -------- BOARD RELATED ROUTES --------
app.get('/api/get-boards', async (req, res) => {
    const auth_token = req.query.auth_token;
    const user = await USER.getUser({auth_token: auth_token});
    if(user !== null){
        const boards = await BOARD.getBoards({user_id: user.id});
        if(boards !== null){
            res.status(201).json({success: true, boards: boards, user: {
                id: user.id,
                auth_token: user.auth_token
            }});
        }
    } else {
        res.json({success: false, message: "wrong URL"})
    }
});

app.post('/api/create-board', async (req, res) => {
    const {board_name, user_id} = req.body;
    await BOARD.createBoard(board_name, user_id);
    res.status(201).json({success: true});
})

app.get('/api/get-board', async (req, res) => {
    const auth_token = req.query.auth_token;
    const board_id = req.query.board_id;
    const boards = await BOARD.getBoardWithJoin(
        [
            ["users.id", "u_id"], 
            ["boards.id", "b_id"], 
            ["boards.board_name", "board_name"]
        ], 
        "users",
        [
            ["boards.user_id", "users.id"]
        ], 
        [
            ["users.auth_token", auth_token],
            ["boards.id", board_id]
        ]
    );

    if(boards !== null){
        return res.status(200).json({success: true, boards: boards[0]});
    } else {
        return res.json({success: false, message: "wrong URL", requested: req.query});
    }
});

// -------- SLOT RELATED ROUTES --------

app.post("/api/create-slot", async (req, res) => {
    const {uuid, title, board_id} = req.body;
    const existing_board = await BOARD.getSingleBoard({id: board_id});

    if(existing_board){
        await SLOT.createSlot(uuid, title, board_id);
        res.status(201).json({success: true, message: `Successfully created slot ${uuid}`});
    } else {
        res.json({success: false, message: `Board ${board_id} not found`});
    }
});

app.get("/api/get-slot", async (req, res) => {
    const {char_id} = req.query;
    const slot = await SLOT.getSlot({char_id: char_id});
    if(slot){
        return res.status(200).json({success: true, slot: slot});
    } else {
        return res.json({success: false, message: "slot not found"});
    }
});

app.get("/api/get-slots", async (req, res) => {
    const {board_id} = req.query;
    const slots = await SLOT.getSlots(board_id);
    if(slots){
        return res.status(200).json({success: true, slots: slots});
    } else {
        return res.json({success: false, message: `board with board_id ${board_id} not found.`})
    }
});

app.patch("/api/update-slot-name", async (req, res) => {
    const {char_id, title} = req.body.data;
    const existing_slot = await SLOT.getSlot({char_id: char_id});

    if(existing_slot){
        await SLOT.updateSlot({title: title}, {char_id: char_id});
        return res.status(200).json({success: true, message: "slot name successfully changed"});
    } else {
        return res.json({success: false, message: "slot not found"});
    }
});

app.delete("/api/delete-slot", async(req, res) => {
    const {char_id} = req.body;
    const existing_slot = await SLOT.getSlot({char_id: char_id});
    if(existing_slot){
        try{
            await SLOT.deleteSlot(char_id);
            return res.status(200).json({success: true, message: "slot deleted successfully"})
        } catch (err) {
            return res.json({success: false, message: err});
        }
        
    }
})

// -------- TASKS RELATED ROUTES --------

app.get("/api/get-tasks", async (req, res) => {
    const {slot_id} = req.query;
    const tasks = await TASK.getTasks({slot_id: slot_id}, "positionIndex");
    if(tasks){
        return res.status(200).json({success: true, tasks: tasks});
    } else {
        return res.json({success: false, message: `Tasks for slot: ${slot_id} not found`})
    }
});

app.post("/api/create-task", async(req, res) => {
    const {task_id, content, positionIndex, slot_id} = req.body.data;
    const existing_slot = await SLOT.getSlot({char_id: slot_id});

    if(existing_slot){
        await TASK.createTask(task_id, content, positionIndex, slot_id);
        return res.status(201).json({success: true, message: "task successfully created"});
    } else {
        return res.json({success: false, message: "Could not create task, slot not found", sended: req.body});
    }
});

app.put("/api/update-task", async (req, res) => {
    const {task_id, content, positionIndex, slot_id} = req.body.data;
    const existing_slot = await SLOT.getSlot({char_id: slot_id});

    if(existing_slot){
        try{
            await TASK.updateTask(task_id, content, positionIndex, slot_id);
            return res.status(201).json({success: true, message: "task successfully updated"});
        } catch (err) {
            throw new Error("Something went wrong when updating task");
        }
        
    } else {
        return res.json({success: false, message: "Could not create task, slot not found", sended: req.body});
    }
});

app.delete("/api/delete-task", async (req, res) => {
    const { task_id } = req.body;
    const existing_task = await TASK.getTask(task_id);

    if(existing_task){
        await TASK.deleteTask(task_id);
        return res.status(200).json({success: true, message: "Task successfully deleted"});
    } else {
        return res.json({success: false, message: `Task: ${task_id} not found`});
    }
})


app.listen(3000, () => console.log("app is running on http://localhost:3000"));