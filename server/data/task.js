import { deleteData, get, getOneBy, insert, update } from "./database.js";

export async function getTasks(whereObj, orderBy){
    const results = await get("tasks", whereObj, orderBy);
    if(results.length > 0){
        return results;
    }
    return null;
}

export async function getTask(task_id){
    const result = await getOneBy("tasks", {task_id: task_id});
    if(result !== undefined){
        return result;
    }
    return null;
}

export async function createTask(task_id, content, positionIndex, slot_id){
    try{
        const result = await insert("tasks", {task_id: task_id, content: content, positionIndex: positionIndex, slot_id: slot_id});
        return result;
    }catch (err){
        console.error("Something went wrong when creating task: ", err);
    }
}

export async function updateTask(task_id, content, positionIndex, slot_id){
    const result = await update("tasks", {content: content, positionIndex: positionIndex, slot_id: slot_id}, {task_id: task_id});
    return result;
}

export async function deleteTask(task_id){
    await deleteData("tasks", [["task_id", "=", task_id]]);
}