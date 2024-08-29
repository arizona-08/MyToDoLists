import { deleteData, get, getOneBy, insert, update } from "./database.js";

export async function createSlot(uuid, title, board_id){
    return await insert("slots", {char_id: uuid, title: title, board_id: board_id})
}

export async function getSlot(whereObj){
    const result = await getOneBy("slots", whereObj);
    if(result !== undefined){
        return result;
    }
    return null;
}

export async function getSlots(board_id){
    const results = await get("slots", {board_id: board_id});
    if(results.length > 0){
        return results;
    }
    return null;
}

export async function updateSlot(setObj, whereObj){
    return await update("slots", setObj, whereObj);
}

export async function deleteSlot(char_id){
    await deleteData("slots", [["char_id", "=", char_id]])
}