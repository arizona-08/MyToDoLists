import * as Utils from "./utils.js";
import crypto from "crypto";
import { insert, get, getOneBy, deleteData, getWhere, update } from "./database.js";

export async function createUser(name, firstname, email, password){
    const hashedPassword = await Utils.passwordHash(password);
    const randomBytes = crypto.randomBytes(16);
    const auth_token = randomBytes.toString('hex');
    return await insert("users", {
        name: name,
        firstname: firstname,
        email: email,
        password: hashedPassword,
        auth_token: auth_token
    });
}

export async function getUsers(){
    const results = await get("users");
    if(results.length > 0){
        return results
    }
    return null
}

export async function getUsersWhere(whereArr){
    const results = await getWhere("users", whereArr);
    if(results.length > 0){
        return results
    }
    return null
}

export async function getUser(wherObj){
    const result = await getOneBy("users", wherObj)
    if(result !== undefined){
        return result;
    }
    return null;
    
}

export async function getUsersBy(whereObj){
    const results = await get("users", whereObj);
    if(results.length > 0){
        return results;
    }
    return null;
}

export async function updateUser(setObj, whereObj){
    await update("users", setObj, whereObj);
}

export async function deleteUser(whereArr){

    await deleteData("users", whereArr);
}