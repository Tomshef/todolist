var express = require('express');
var router = express.Router();
const DataManagement = require('../dataManagement/dataManagement.js')
const myDb = new DataManagement('TodoListDB.db');


/* GET users listing. */
router.get('/',(req, res)=> {
    res.sendFile(process.cwd()+'/clientToDo/index.html')});

router.post('/newUser',(req, res)=>
    {
        myDb.registerNewUser(req.headers.username, (id)=>
        {
            res.json({userId : id})
        })
    }
);

module.exports = router;
