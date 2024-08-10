import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as USER from "./data/user.js";
import { comparePasswords } from "./data/utils.js";
import { runMigration } from "./data/migrations.js";
import { access, writeFile } from "fs/promises";


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
    const user = await USER.getUser(id);
    response.send(user);
});

//transformer route pour avoir vrai paramètre dynamique du type user?type=email&val=something
app.get("/api/user/:type/:val", async (request, response) => {
    const type = request.params.type;
    const val = request.params.val;
    const user = await USER.getUser([
        {[type] : val}
    ]);
    response.send(user);
})

app.post("/api/create-user", async (request, response) => {
    const {name, firstname, email, password} = request.body;
    await USER.createUser(name, firstname, email, password);
    response.status(201).send();
});

app.delete("/api/delete-user/:id", async (request, response) => {
    const userId = request.params.id;
    await USER.deleteUser({id: id});
    response.status(201).send();
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await USER.getUser([
        {email: email}
    ]);

    
    if (user === null) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatching = await comparePasswords(password, user.password);

    if (isMatching) {
        return res.status(200).json({ success: true, message: 'Login successful', id: user.id });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.listen(3000, () => console.log("app is running on http://localhost:3000"))