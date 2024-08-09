import * as Utils from "./utils.js";
import { getConnection } from "./database.js";

export async function createUser(name, firstname, email, password){
    const connection = await getConnection();
    try{
        const hashedPassword = await Utils.passwordHash(password);
        const query = `INSERT INTO users (name, firstname, email, password) VALUES(?, ?, ?, ?)`;
        await connection.query(query, [name, firstname, email, hashedPassword])
    } catch (err) {
        console.error("Something went wrong when creating user: ", err)
    } finally {
        if(connection){
            //always close the connection
            connection.release();
        }
    }
}

export async function getUsers(){
    const connection = await getConnection();
    try{
        const result = await connection.query("SELECT * FROM users");
        return result;

    } catch(err){
        console.error("Somthing went wrong when fetching users: ", err);
    }finally{
        if(connection){
            connection.release();
        }
    }
}

export async function getUser(id){
    const connection = await getConnection();
    try{
        const query = `SELECT * FROM users WHERE id = ?`;
        const result = connection.query(query, [id]);
        return result;
    } catch (err){
        console.error("Something went wrong when retrieving user from database: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

export async function getUserBy(array){
    const connection = await getConnection();
    
    try{
        let query = "SELECT * FROM users WHERE ";
        const params = [];
        for(const obj of array){
            query += `${obj.type} = ? `;
            params.push(obj.val);
        }
        
        const users = await connection.query(query, params);
        if(users.length !== 0){
            return users[0];
        } else {
            return null;
        }
        
    } catch(err){
        console.error("Something went wrong when fetching data from users: ", err);
        
    }finally{
        if(connection){
            connection.release();
        }
    }
}

export async function deleteuser(id){
    const connection = await getConnection();
    try{
        const query = "DELETE FROM users WHERE id = ?";
        await connection.query(query, [id]);
    } catch (err) {
        console.error("Something went wrong when deleting user: ", err);
    } finally{
        if(connection){
            connection.release();
        }
    }
}