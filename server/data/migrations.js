import { getConnection } from "./database.js";

export async function runMigration(api_key){
    await drop_tables();
    await create_users_table();
    await create_boards_table();
    await create_slots_table();
    await create_tasks_table();
    await create_api_keys_table();
    await insert_api_key(api_key);
}

async function drop_tables(){
    await drop_table("api_keys");
    await drop_table("tasks");
    await drop_table("slots");
    await drop_table("boards");
    await drop_table("users");
    
}

async function drop_table(table){
    const connection = await getConnection();
    try{
        const dropQuery = `DROP TABLE IF EXISTS ${table}`;
        await connection.query(dropQuery);
    } catch (err){
        console.error(`Something went wrong when dropping ${table} table: `, err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function create_users_table(){
    const connection = await getConnection();
    try{
        const query = `
        CREATE TABLE IF NOT EXISTS users(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            firstname VARCHAR(255),
            email VARCHAR(320),
            password CHAR(60),
            auth_token VARCHAR(32),
            is_logged BOOL DEFAULT false
        )`;
        await connection.query(query);
    } catch (err){
        console.error("Something went wrong when creating users table: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function create_boards_table(){

    const connection = await getConnection();
    try{
        const query = `
        CREATE TABLE IF NOT EXISTS boards(
            id INT AUTO_INCREMENT PRIMARY KEY,
            board_name VARCHAR(20),
            user_id INT,
            CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`;
        await connection.query(query);
    } catch (err){
        console.error("Something went wrong when creating boards table: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function create_slots_table(){

    const connection = await getConnection();
    try{
        const query = `
        CREATE TABLE IF NOT EXISTS slots(
            id INT AUTO_INCREMENT PRIMARY KEY,
            char_id UUID UNIQUE,
            title VARCHAR(20),
            board_id INT,
            CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
        )`;
        await connection.query(query);
    } catch (err){
        console.error("Something went wrong when creating slots table: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function create_tasks_table(){

    const connection = await getConnection();
    try{
        const query = `
        CREATE TABLE IF NOT EXISTS tasks(
            id INT AUTO_INCREMENT PRIMARY KEY,
            task_id UUID UNIQUE,
            content VARCHAR(50),
            positionIndex INT,
            slot_id UUID,
            CONSTRAINT fk_slot_id FOREIGN KEY (slot_id) REFERENCES slots(char_id) ON DELETE CASCADE
        )`;
        await connection.query(query);
    } catch (err){
        console.error("Something went wrong when creating tasks table: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function create_api_keys_table(){

    const connection = await getConnection();
    try{
        const query = `
        CREATE TABLE IF NOT EXISTS api_keys(
            id INT AUTO_INCREMENT PRIMARY KEY,
            value VARCHAR(255)
        )`;
        await connection.query(query);
    } catch (err){
        console.error("Something went wrong when creating api_keys table: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}

async function insert_api_key(key){
    const connection = await getConnection();
    try{
        const query = `INSERT INTO api_keys (value) VALUES (?)`;
        await connection.query(query, [key]);
    } catch (err){
        console.error("Something went wrong when inserting api key: ", err);
    } finally {
        if(connection){
            connection.release();
        }
    }
}