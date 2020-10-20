let sqlite3 = require('sqlite3').verbose();


const DataManagement = class {
    constructor(dbLocation)
    {
        this.db = new sqlite3.Database('TodoListDB.db');
    }

    getUserId(userName, callback)
    {
        let sql = 'SELECT UserId id, UserName name FROM users WHERE UserName = ?';
        this.db.get(sql, [userName], (err,row)=>{
            if (err){
                console.log('not found');
            }
            else if (row === undefined) {
                return  callback(-1);
            }
            else {
                return callback(row.id);
            }
        })
    }

    registerNewUser(userName, callback)
    {
        this.getUserId(userName, (id) =>
        {
            console.log("id = " + id);
            if (id !== -1)
            {
                callback(-1);
            }
            else
            {
                let sql = 'INSERT INTO users (UserName) VALUES (?)'
                this.db.run(sql, [userName], function (err)
                {
                    if (err){
                        throw err;
                    }
                    callback(this.lastID);
                });
            }
        })
    }

    getAllUserToDos(userId, callback)
    {
        let sql = 'SELECT todoID, todoHeader, todoBody, todoStatus FROM todos WHERE userId = ?';
        this.db.all(sql, [userId], (err, rows) =>
        {
            if (err) {
                throw err;
            }
            return callback(rows);
        });
    }

    deleteTodo(todoID)
    {
        let sql = "DELETE FROM todos WHERE todoId = ?";
        this.db.run(sql,[todoID] ,function (err, result)
        {
            if (err) throw err;

        });
    }

    deleteUserTodo(userID)
    {
        let sql = "DELETE FROM todos WHERE userId = ?";
        this.db.run(sql,[userID] ,function (err, result)
        {
            if (err) throw err;

        });
    }


    addTodo(todoHeader, todoBody, userId, callback)
    {
        let sql = 'INSERT INTO todos (todoHeader, todoBody, todoStatus, userId) VALUES (?,?,?,?)'
        this.db.run(sql, [todoHeader, todoBody, 0, userId] , function (err)
        {
            if (err){
                throw err;
            }
            callback(this.lastID);
        });
    }

    editTodo(todoHeader, todoBody, todoStatus, todoId)
    {
        let sql = 'UPDATE todos SET todoHeader = ?, todoBody = ?, todoStatus = ? WHERE todoID = ?'
        this.db.run(sql, [todoHeader, todoBody, todoStatus, todoId], (err)=> {
            if (err) {
                throw err;
            }
        });
    }

}

module.exports = DataManagement;