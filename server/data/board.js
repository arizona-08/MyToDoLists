import { insert, get, getOneBy, getWithJoin, deleteData, getWhere, update } from "./database.js";

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

export async function getBoardWithJoin(column_alias_array, joined_table, on_keys, whereClause){
    const results = await getWithJoin(column_alias_array, "boards", joined_table, on_keys, whereClause);
    // return results;
    if(results.length > 0){
        return results;
    };
    return null;
}

export async function getSingleBoard(whereObj){
    const result = await getOneBy("boards", whereObj);
    return result;
}

export async function deleteBoard(whereArray){
    const result = await deleteData("boards", whereArray);
    return result;
}

// [ // column as alias
//     ["users.id", "u_id"], 
//     ["boards.id", "b_id"], 
//     ["boards.board_name", "board_name"]
// ], "boards", "users", // tables
//  //tableA.key = tableB.key
// [
//     ["boards.user_id", "users.id"]
// ], 
// [// where 
//     ["users.auth_token", "e423898f2cd5370c3e495eb894444d08"]
// ]
