var express = require('express');
var router = express.Router();
const DataManagement = require('../dataManagement/dataManagement.js')
const myDb = new DataManagement('TodoListDB.db');


/* GET home page. */
router.get('/', (req,res)=>
    res.sendFile(process.cwd()+'/logPage/loadingPage.html'));
router.get('/loadingPageStyle.css', (req,res)=>
    res.sendFile(process.cwd()+'/logPage/loadingPageStyle.css'))
router.get('/loadingPage.js', (req,res)=>
    res.sendFile(process.cwd()+'/logPage/loadingPage.js'))

router.post('/', (req,res)=>
{
    myDb.getUserId(req.headers.username, (id)=>{
    res.json({userId : id});})
})

router.get('/stylesheet.css',(req, res)=> res.sendFile(process.cwd()+'/clientToDo/stylesheet.css'));
router.get('/clientTodo.js',(req, res)=> res.sendFile(process.cwd()+'/clientToDo/clientTodo.js'));


router.get('/getToDos', (req, res)=>
{
  myDb.getAllUserToDos(req.query.userId, (todos)=>{
    res.json(todos);
  })
});

router.delete('/deleteToDo', (req, res)=>
{
  myDb.deleteTodo(req.query.todoId);
});

router.delete('/deleteUserToDo', (req, res)=>
{
  myDb.deleteUserTodo(req.query.userId);
});

router.post('/updateToDo', (req, res)=>
{
  myDb.editTodo(req.query.todoHeader, req.query.todoBody, req.query.todoStatus, req.query.todoId);
});

router.post('/addToDo', (req, res)=>
{
  myDb.addTodo(req.query.todoHeader, req.query.todoBody, req.query.userId,
      (todoID)=> {res.json({ newId: todoID})});
});



module.exports = router;
