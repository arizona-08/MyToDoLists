import express from "express";
import * as USER from "./data/user.js";

const app = express();
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something wrong happened");
});

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

app.post("/api/create-user", async (request, response) => {
    const {name, firstname, email, password} = request.body;
    await USER.createUser(name, firstname, email, password);
    response.status(201).send();
});

app.delete("/api/delete-user/:id", async (request, response) => {
    const userId = request.params.id;
    await USER.deleteuser(userId);
    response.status(201).send();
})

app.listen(3000, () => console.log("app is running on http://localhost:3000"))