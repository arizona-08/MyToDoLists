import { insert, get, getOneBy, deleteData, getWhere, update } from "./database.js";

export async function getBoards(whereObj){
    const result = await get("boards", whereObj);
    if(result.length >= 0){
        return result;
    }
    return null;
}

export async function createBoard(board_name, user_id){
    return await insert("boards", {board_name: board_name, user_id: user_id});
}