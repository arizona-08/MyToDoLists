import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as USER from "./data/user.js";
import { comparePasswords } from "./data/utils.js";
import { runMigration } from "./data/migrations.js";
import { access, writeFile } from "fs/promises";
import * as BOARDS from "./data/board.js";


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

app.get("/api/tasks", (request, response) => {
    response.send("hello worlds");
});

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
    const {auth_token} = req.body;
    await USER.updateUser({is_logged: false}, {auth_token: auth_token});
    res.send("logged out");
})

app.get('/api/get-boards', async (req, res) => {
    const auth_token = req.query.auth_token;
    const user = await USER.getUser({auth_token: auth_token});
    if(user !== null){
        const boards = await BOARDS.getBoards({user_id: user.id});
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
    await BOARDS.createBoard(board_name, user_id);
    res.status(201).json({success: true});
})

app.listen(3000, () => console.log("app is running on http://localhost:3000"));