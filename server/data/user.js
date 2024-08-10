import * as Utils from "./utils.js";
import { insert, get, getOneBy, deleteData } from "./database.js";

export async function createUser(name, firstname, email, password){
    const hashedPassword = await Utils.passwordHash(password);
    return await insert("users", {
        name: name,
        firstname: firstname,
        email: email,
        password: hashedPassword
    });
}

export async function getUsers(){
    return await get("users")
}

export async function getUser(wherObj){
    return getOneBy("users", wherObj)
}

export async function getUsersBy(whereObj){
    return get("users", whereObj);
}

export async function deleteUser(whereObj){

    await deleteData("users", whereObj);
}