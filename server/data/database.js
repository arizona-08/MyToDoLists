import mariadb from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export async function getConnection(){
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}
async function close(connection){
    if(connection){
        connection.release();
    }
}

/**
 * 
 * @param {string} table 
 * @param {object} valuesObj
 * 
 * 
 */
export async function insert(table, valuesObj){
    const connection = await getConnection();
    const columnsArr = [];
    const valuesArr = [];
    const bindParams = [];

    for(const key in valuesObj){
        columnsArr.push(key);
        valuesArr.push(valuesObj[key]);
        bindParams.push("?");
    }
    const columnsString = columnsArr.join(",");
    const bindParamsString = bindParams.join(",");

    try{
        let query = `INSERT INTO ${table} (${columnsString}) VALUES(${bindParamsString})`;
        return await connection.query(query, valuesArr);
    }catch (err) {
        console.error(`Error when inserting data in ${table}: `, err);
    } finally {
        await close(connection);
    }
}

export async function get(table, whereObj = null){
    const connection = await getConnection();
    
    try{
        let query = `SELECT * FROM ${table} `;
        if(whereObj !== null){
            const params = [];
            query += "WHERE ";
            for(const key in whereObj){
                params.push(whereObj[key]);
                query += `${key} = ? AND `;
            }
            query = query.slice(0, -5);
            const result = await connection.query(query, params);
            return result;
        } else {
            const result = await connection.query(query);
            return result;
        }
        
    }catch (err){
        console.error(`Something went wrong when retrieving data from ${table} table`, err);
    } finally{
        close(connection);
    }
}

export async function getWhere(table, whereArr){
    //example whereArr = [["id", ">", 3], ["role", "=", 1]]

    const connection = await getConnection();

    try{
        const bindParams = [];
        let query = `SELECT * FROM ${table} WHERE `;

        whereArr.forEach(whereClause => {
            query += `${whereClause[0]} ${whereClause[1]} ? AND `
            bindParams.push(whereClause[2]);
        });

        query = query.slice(0, -5); // retirer le AND en trop
        const results = await connection.query(query, bindParams);
        return results;
    }catch(err){
        console.error(`Something went wrong when fetching data in ${table} table. func: getWhere() :`, err);
    }finally{
        close(connection);
    }
}

export async function getOneBy(table, whereObj = null){
    const result = await get(table, whereObj);
    return result[0];
}

export async function update(table, setObj, whereObj){
    const connection = await getConnection();
    
    try{
        const params = [];
        let query = `UPDATE ${table} SET `;
        for(const key in setObj){
            params.push(setObj[key]);
            query += `${key} = ?, `;
        }

        query = query.slice(0, -2); //retire l'espace et la virgule

        query += " WHERE ";
        for(const key in whereObj){
            params.push(whereObj[key]);
            query += `${key} = ? AND `;
        }
        query = query.slice(0, -5);
        return await connection.query(query, params);
    }catch (err){
        console.error(`Something went wrong when updating data in ${table} table`, err);
    } finally{
        close(connection);
    }
}

// export async function deleteData(table, whereObj){
//     const connection = await getConnection();
//     try{
//         const params = [];
//         let query = `DELETE FROM ${table} WHERE `;
//         for(const key in whereObj){
//             params.push(whereObj[key]);
//             query += `${key} = ? AND `;
//         }
//         query = query.slice(0, -5);
//         return await connection.query(query, params);
        
//     }catch (err){
//         console.error(`Something went wrong when deleting data from ${table} table`, err);
//     } finally{
//         close(connection);
//     }
// }

export async function deleteData(table, whereArr){
    const connection = await getConnection();
    try{
        const params = [];
        let query = `DELETE FROM ${table} WHERE `;

        whereArr.forEach(whereClause => {
            params.push(whereClause[2]); // ajoute le paramètre dans le tableau de paramètre
            query += `${whereClause[0]} ${whereClause[1]} ? AND `;
        })
        query = query.slice(0, -5);
        return await connection.query(query, params);
        
    }catch (err){
        console.error(`Something went wrong when deleting data from ${table} table`, err);
    } finally{
        close(connection);
    }
}