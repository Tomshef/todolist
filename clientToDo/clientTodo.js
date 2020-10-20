// ALL Magic variables
const MagicVar = {
    STORAGE_NAME: 'todoList',
    EMPTY_TEXT: "",
    EMPTY_ARRAY: [],
    HEADER_TEXT: "Task Header",
    DETAIL_TEXT: "Task details",
    ADD_BTN_TEXT: "Add TO DO",
    CLR_BTN_TEXT: "Clear All",
    DEL_BTN_TEXT: "Delete task",
    FILTER_BTN_TEXT: "Clear Done",
    NO_TASK_TEXT: "Nothing to do? don't be lazy",
    TASKS_TEXT_HEADER_SEP: ('\u00A0'  + ":" + '\u00A0'),
    NOT_INIT: 0,
    NONE_CHOSEN: -1,
    FIRST_FUNC: 0,
    MONSTER_MOOD_TIMING: 1000
}


// class Data responsible for all to-do list data
class Data {

        constructor()
        {
            // get current to-do list from local storage if exists or start a new array
            this.toDoList = [];
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = ()=>
            {
                if (xhr.readyState === 4)
                {
                    this.toDoList = JSON.parse(xhr.responseText);
                    this.__updatedList();
                }
            };
            let idNum = localStorage.getItem("userId");
            xhr.open('GET', '/getToDos' + '?userId=' +  idNum, true);
            xhr.send();
        }

        // adding new task to task list. gets the task header and text
        addData(header, text)
        {
            if (header !== MagicVar.EMPTY_TEXT || text !== MagicVar.EMPTY_TEXT)
            {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = ()=>
                {
                    if (xhr.readyState === 4)
                    {
                        this.toDoList.push({todoHeader: header, todoBody: text, todoStatus: 0, todoID: xhr.response.newId});
                        this.__updatedList();
                    }
                };
                let userIdNum =  localStorage.getItem("userId");
                xhr.open('POST', '/addToDo' + '?todoHeader=' +  header + "&todoBody=" + text + "&userId=" + userIdNum, true);
                xhr.send();
            }
        }

        // returns the task list
        getTasksList()
        {
            return this.toDoList;
        }

        // binds a show func to the data module
        bindShowFunc(showFunc)
        {
            this.showFunc = showFunc;
        }

        // updated list protocols: show the to-do list and update storage
        __updatedList()
        {
            this.showFunc(this.toDoList); // use external module to show to-do list
        }

        // change done flag status.
        toggleTaskDoneFlag(taskIndex)
        {
            this.toDoList[taskIndex].todoStatus = (this.toDoList[taskIndex].todoStatus == 0 ? 1 : 0);
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/updateToDo' + '?todoHeader=' +  this.toDoList[taskIndex].todoHeader + "&todoBody=" + this.toDoList[taskIndex].todoBody + "&todoStatus=" + this.toDoList[taskIndex].todoStatus + "&todoId=" + this.toDoList[taskIndex].todoID, true);
            xhr.send();
            this.__updatedList();
        }

        //delete a task by index
        deleteTask(taskIndex)
        {
            let xhr = new XMLHttpRequest();
            let idNum = this.toDoList[taskIndex].todoID;
            xhr.open('DELETE', '/deleteToDo' + '?todoId=' +  idNum, true);
            xhr.send();
            this.toDoList.splice(taskIndex, 1);
            this.__updatedList();
        }

        // clear all data from the task list
        clearData()
        {
            let xhr = new XMLHttpRequest();
            let idNum =  localStorage.getItem("userId");
            xhr.open('DELETE', '/deleteUserToDo' + '?userId=' +  idNum, true);
            xhr.send();
            this.toDoList = [];
            this.__updatedList();
        }

        // edit a task in the task list, gets an index, new header and new text and update task
        editTask(index, newHeader, newText)
        {
            this.toDoList[index].todoHeader = newHeader;
            this.toDoList[index].todoBody = newText;
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/updateToDo' + '?todoHeader=' +  this.toDoList[index].todoHeader + "&todoBody=" + this.toDoList[index].todoBody + "&todoStatus=" + this.toDoList[index].todoStatus + "&todoId=" + this.toDoList[index].todoID, true);
            xhr.send();
            this.__updatedList();
        }

        // filter all completed tasks from the task list
        deleteCompletedTasks()
        {
            for (let i = this.toDoList.length-1; i >= 0; i--)
            {
                if (this.toDoList[i].todoStatus == 1){
                    this.deleteTask(i);
                }
            }
            this.__updatedList();
        }
}

//class view responsible for data presentation and events
class View {
    constructor()
    {
        this.inputBoxHeader = this.__elemCreator("input", "inputText", "headerText");
        this.inputBoxHeader.type = "text";
        this.inputBoxHeader.placeholder= MagicVar.HEADER_TEXT;
        this.inputBoxText =  this.__elemCreator("input", "inputText", "bodyText");
        this.inputBoxText.type = "text";
        this.inputBoxText.placeholder=  MagicVar.DETAIL_TEXT;
        this.buttons = this.__elemCreator("div", "buttons");
        document.getElementById("submitNewTask").append(this.inputBoxHeader,this.inputBoxText);

        this.SubmitButton = this.__elemCreator("button", "submitButton");
        this.SubmitButton.innerHTML = MagicVar.ADD_BTN_TEXT;

        this.ClearButton = this.__elemCreator("button", "submitButton")
        this.ClearButton.innerHTML = MagicVar.CLR_BTN_TEXT;

        this.ClearDoneButton = this.__elemCreator("button", "submitButton")
        this.ClearDoneButton.innerHTML = MagicVar.FILTER_BTN_TEXT;

        document.getElementById("buttons").append(this.SubmitButton, this.ClearButton, this.ClearDoneButton)
        this.currentTask = MagicVar.NONE_CHOSEN;
    }

    // create a new element using document.createElement using the type and optional className and id
    __elemCreator(type, className= MagicVar.NOT_INIT, id= MagicVar.NOT_INIT)
    {
        const newElem = document.createElement(type);
        if (className !== MagicVar.NOT_INIT)
        { newElem.setAttribute("class",className);}
        if (id !== MagicVar.NOT_INIT)
        {newElem.id = id;}
        return newElem;
    }

    // event listener to the submission button for submitting new task
    submitNewTask(addToDataFunc)
    {
        this.SubmitButton.addEventListener('click',
            event => {
                event.preventDefault();
                document.getElementById("jelly-body").setAttribute("class", "jelly-body-sad")
                addToDataFunc(this.inputBoxHeader.value, this.inputBoxText.value);
                this.inputBoxHeader.value = MagicVar.EMPTY_TEXT;
                this.inputBoxText.value = MagicVar.EMPTY_TEXT;
                setTimeout(()=>document.getElementById("jelly-body").setAttribute("class", "jelly-body"),  MagicVar.MONSTER_MOOD_TIMING)
            })
    }

    // bind the complete task (receives a complete task data function and save it as object variable)
    bindCompleteTask(completeTaskFunc)
    {
        this.completeTaskFunc = completeTaskFunc;
    }

    // bind the delete task (receives a delete task data function and save it as object variable)
    bindDeleteTask(deleteTaskFunc)
    {
        this.deleteTaskFunc = deleteTaskFunc;
    }

    // bind the edit task (receives a edit task data function and save it as object variable)
    bindEditText(editTaskFunc)
    {
        this.editTaskFunc = editTaskFunc;
    }

    // adding event listener to clear all, handler is given as argument
    clearAll(clearDataFunc)
    {
        this.ClearButton.addEventListener('click', ()=>{this.currentTask = MagicVar.NONE_CHOSEN; clearDataFunc()});
    }

    // adding event listener to clear done, handler is given as argument
    clearDone(clearDoneDataFunc)
    {
        this.ClearDoneButton.addEventListener('click', ()=>{this.currentTask = MagicVar.NONE_CHOSEN; clearDoneDataFunc()});
    }

    // creates an empty task-list to-do list to screen
    __showEmptyArrayList()
    {
        const task = this.__elemCreator("div");
        const noTaskMsg = document.createTextNode(MagicVar.NO_TASK_TEXT);
        const noTaskMsgTxt = this.__elemCreator("p1", "TextHeader");
        noTaskMsgTxt.appendChild(noTaskMsg);
        task.appendChild(noTaskMsgTxt);
        (document.getElementById("Tasks")).appendChild(task);
    }

    // create task-list to-do list to screen given a to-do list given as argument
    showToDos(ListArray)
    {
        const arrayLength = ListArray.length;
        (document.getElementById("Tasks")).innerHTML = ""; // clear tasks window
        if (arrayLength === 0)
        {
            this.__showEmptyArrayList()
        }
        for (let i = 0; i < arrayLength; i++)
        {
            const task = this.__elemCreator("div", "task", "divTask"+i)
            const taskHeadertext = document.createTextNode(ListArray[i].todoHeader);
            const taskHeader = this.__elemCreator("p1", "TextHeader", "taskHeaderTask"+i)
            taskHeader.contentEditable = true;
            taskHeader.append(taskHeadertext);
            taskHeader.addEventListener('focusout',event =>
            {
                this.editTaskFunc(i, taskHeader.textContent, taskText.textContent)
            });
            const taskTextText = document.createTextNode(ListArray[i].todoBody);
            const taskText = this.__elemCreator("p1", "taskText", "taskTextTask"+i)
            taskText.contentEditable = true;
            taskText.appendChild(taskTextText);
            taskText.addEventListener('focusout',event =>
            {
                this.editTaskFunc(i, taskHeader.textContent, taskText.textContent)
            });
            const checkBox = this.__elemCreator("input",MagicVar.NOT_INIT,"checkBoxId" + i)
            checkBox.setAttribute("type", "checkbox");
            checkBox.addEventListener("click",
                ()=> {
                        if (checkBox.checked===true)
                        {
                            this.makeTheThingHappy();
                        }
                            this.completeTaskFunc(i)
                })
            if (ListArray[i].todoStatus === 1)
            {
                checkBox.checked = true;
                taskHeader.setAttribute("class","TextHeaderDone");
            }
            const deleteTaskButton = this.__elemCreator("button", "deleteButton",  "deleteTaskButtonId" + i)
            deleteTaskButton.innerHTML = MagicVar.DEL_BTN_TEXT;
            deleteTaskButton.addEventListener("click",()=>
            {this.currentTask = MagicVar.NONE_CHOSEN; this.deleteTaskFunc(i)});
            const format = document.createTextNode(MagicVar.TASKS_TEXT_HEADER_SEP);
            const formatType = this.__elemCreator("p3", "format");
            formatType.append(format);
            task.append(checkBox, taskHeader, formatType, taskText, deleteTaskButton);
            document.getElementById("Tasks").appendChild(task);
        }
    }

    // manage up-key action (previous task)
    upKey()
    {
        if (this.currentTask === MagicVar.FIRST_FUNC)
        {
            document.getElementById("taskHeaderTask" + this.currentTask).blur();
            this.currentTask--;
        }
        else if (this.currentTask === MagicVar.NONE_CHOSEN)
        {}
        else
        {
            if (this.currentTask !== MagicVar.NONE_CHOSEN)
            {
                document.getElementById("taskHeaderTask" + this.currentTask).blur();
            }
            this.currentTask--;
            document.getElementById("taskHeaderTask" + this.currentTask).focus();
        }
    }

    // manage down-key action (next task)
    downKey()
    {
        if (document.getElementById("taskHeaderTask" + (this.currentTask+1)) != null)
        {
            if (this.currentTask !== MagicVar.NONE_CHOSEN)
            {
                document.getElementById("taskHeaderTask" + this.currentTask).blur();
            }
            this.currentTask++;
            document.getElementById("taskHeaderTask" + this.currentTask).focus();
        }
    }

    // manage all relevant key listeners
    keyListeners()
    {
        document.addEventListener('keydown', (event) =>
        {
            const keyName = event.key;
            switch(keyName)
            {
                case "ArrowUp":
                    this.upKey();
                    break;
                case "ArrowDown":
                    this.downKey();
                    break;
                case "Enter":
                    if (this.currentTask !== MagicVar.NONE_CHOSEN)
                    {
                        if (document.getElementById("checkBoxId" + this.currentTask).checked === false)
                        {
                            this.makeTheThingHappy();
                        }
                        this.completeTaskFunc(this.currentTask);
                    }
                    break;
                case "Escape":
                    if (this.currentTask !== MagicVar.NONE_CHOSEN)
                    {
                        document.getElementById("taskHeaderTask" + this.currentTask).blur();
                        this.deleteTaskFunc(this.currentTask);
                        this.currentTask = MagicVar.NONE_CHOSEN;
                    }
                    break;
            }
        })
    }

    makeTheThingHappy()
    {
    document.getElementById("jelly-body").setAttribute("class", "jelly-body-happy");
    setTimeout(() => document.getElementById("jelly-body").setAttribute("class", "jelly-body"), MagicVar.MONSTER_MOOD_TIMING)
    }

}
// control binds the data module and view module to create a complete to-do list
class Control
{
    constructor()
    {
        this.data = new Data();
        this.view = new View();
        this.data.bindShowFunc((todos) => this.view.showToDos(todos));
        this.view.bindCompleteTask((taskIndex)=>this.data.toggleTaskDoneFlag(taskIndex));
        this.view.bindDeleteTask((taskIndex)=>this.data.deleteTask(taskIndex));
        this.view.bindEditText((index, head, text)=>this.data.editTask(index, head, text));
        this.view.clearAll(()=>this.data.clearData());
        this.view.clearDone(()=>this.data.deleteCompletedTasks());
        this.view.submitNewTask((head, text)=> {this.data.addData(head,text)});
        this.view.keyListeners();
        this.view.showToDos(this.data.getTasksList());
    }
}

const control = new Control();
