/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/appLogic.js":
/*!*********************************!*\
  !*** ./src/modules/appLogic.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addExpirationStatus": () => (/* binding */ addExpirationStatus),
/* harmony export */   "deleteTodo": () => (/* binding */ deleteTodo),
/* harmony export */   "getChangedTodos": () => (/* binding */ getChangedTodos),
/* harmony export */   "getChosenProject": () => (/* binding */ getChosenProject),
/* harmony export */   "getCurrentProject": () => (/* binding */ getCurrentProject),
/* harmony export */   "highlightChosenTaskGroup": () => (/* binding */ highlightChosenTaskGroup),
/* harmony export */   "highlightProject": () => (/* binding */ highlightProject),
/* harmony export */   "isFormValid": () => (/* binding */ isFormValid),
/* harmony export */   "isTodoExpired": () => (/* binding */ isTodoExpired),
/* harmony export */   "sortTasksAccordingToChosenTaskGroup": () => (/* binding */ sortTasksAccordingToChosenTaskGroup),
/* harmony export */   "todoFactory": () => (/* binding */ todoFactory)
/* harmony export */ });
/* harmony import */ var _domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulations */ "./src/modules/domManipulations.js");


const todoFactory = function(form, checkStatus) {
    let todoObject = {}; // object that collects info from new task form!
    const formElements = form.elements;
    for (let i = 0; i < formElements.length - 1; i++) { // all fields except submit button
        const element = formElements[i];
        if (element.name == 'title' || element.name == 'description') {
            todoObject[element.name] = element.value;
        } else if (element.name == 'priority' && element.checked) {

            if (element.id == 'edit-low') { //these checks for edit-... needs to show priority - editForm priority buttons id's differ newTaskForm's (obviously)
                todoObject[element.name] = 'low';
            } else if (element.id == 'edit-medium') {
                todoObject[element.name] = 'medium';
            } else if (element.id == 'edit-high') {
                todoObject[element.name] = 'high';
            } else {
                todoObject[element.name] = element.id;
            }

        } else if (element.name == 'dueDate') {
            todoObject[element.name] = element.value;
        }
    }
    todoObject.check = checkStatus;
    return todoObject;
}

const isFormValid = function(form) {
    const titleInput = form.title;
    const dueDateInput = form.dueDate;
    const priorityInputs = form.priority; 
    // const titleInput = form.querySelector('input#title');
    // const dueDateInput = form.querySelector('input#dueDate');
    // const priorityInputs = form.querySelectorAll('input[name=priority]');
    const priorityButtons = form.querySelector('.priority__buttons, .edit-form-priority__buttons');

    let validPriority;
    let priorityCheck = false;
    for (let i = 0; i < priorityInputs.length; i++) {
        const currentPriorityInput = priorityInputs[i];
        if (currentPriorityInput.checked) {
            priorityCheck = true;
            break;
        }
    }

    if (!priorityCheck && !priorityInputs[0].previousElementSibling) {
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(priorityInputs[0]);
        validPriority = false;
    } else if (priorityCheck) {
        validPriority = true;
        if (priorityInputs[0].previousElementSibling && priorityInputs[0].previousElementSibling.classList.contains('error-paragraph')) {
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(priorityInputs[0]);
        }
    }

    let validDueDate;
    if (dueDateInput.value.trim() == '') {
        validDueDate = false;
        if (!dueDateInput.classList.contains('invalid')) {
            dueDateInput.classList.add('invalid');
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(dueDateInput);
            dueDateInput.focus();
        }
    } else if (dueDateInput.value.trim() != '') {
        validDueDate = true;
        if (dueDateInput.classList.contains('invalid')) {
            dueDateInput.classList.remove('invalid');
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(dueDateInput);
        }
    }

    let validTitle;
    if (titleInput.value.trim() == '' && !titleInput.classList.contains('invalid')) {
        titleInput.classList.add('invalid');
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(titleInput);
        titleInput.focus();
        validTitle = false;

    } else if (titleInput.value.trim() != '') {
        validTitle = true;
        if (titleInput.classList.contains('invalid')) {
            titleInput.classList.remove('invalid');
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(titleInput);
        }
    }

    const valid = validPriority && validDueDate && validTitle;
    return valid;
}

const highlightChosenTaskGroup = function(taskGroups, clickedObject) {
    const taskGroupsElements = taskGroups.querySelectorAll('li');
    for (let i = 0; i < taskGroupsElements.length; i++) {
        const currentTaskGroup = taskGroupsElements[i];
        if (currentTaskGroup == clickedObject && !currentTaskGroup.classList.contains('chosen-task-group')) {
            currentTaskGroup.classList.add('chosen-task-group');
        } else if (currentTaskGroup != clickedObject && currentTaskGroup.classList.contains('chosen-task-group')) {
            currentTaskGroup.classList.remove('chosen-task-group');
        }
    }
}

const sortCurrentTodo = function(clickedObject, todo) {
    const currentDateAndTime = new Date();
    const currentYear = currentDateAndTime.getFullYear();
    const currentMonth = currentDateAndTime.getMonth() + 1;
    const currentDate = currentDateAndTime.getDate();
    const currentHours = currentDateAndTime.getHours();
    const currentMinutes = currentDateAndTime.getMinutes();
    const currentSeconds = currentDateAndTime.getSeconds();

    const todoFullDate = todo.dueDate.split('-');
    const todoYear = todoFullDate[0];
    const todoMonth = todoFullDate[1];
    const todoDate = todoFullDate[2];
    const todoDateObj = new Date(todoYear, todoMonth - 1, todoDate); //Date Obj for todo

    if (clickedObject.classList.contains('today')) { // checks if clicked object is "today"
        if ( isToday(todoYear, todoMonth, todoDate, currentYear, currentMonth, currentDate) ) {
            return todo;
        } else {
            return null;
        }
    } else if ( clickedObject.classList.contains('week') ) { // checks if clicked object is "this week"
        if ( isWeek(todoDateObj, currentDateAndTime) ) {
            return todo;
        } else {
            return null;
        }
    } else if ( clickedObject.classList.contains('month') ) { // checks if clicked object is "month"
        if ( isMonth(todoDateObj, currentDateAndTime) ) {
            return todo;
        } else {
            return null;
        }
    } else if ( clickedObject.classList.contains('all-tasks') ) { // checks if clicked object is "all tasks"
        return todo;
    }
}

const isToday = function(todoYear, todoMonth, todoDate, currentYear, currentMonth, currentDate) { //function checks if todo's date expired today
    if ( todoYear == currentYear && todoMonth == currentMonth && todoDate == currentDate ) {
        return true;
    } else {
        return false;
    }
}

const isWeek = function(todoDateObj, currentDateAndTime) { //function checks if todo's date and current date differs by no more than 1 week
    const differenceInDays = (todoDateObj - currentDateAndTime) / (1000 * 60 * 60 * 24);
    if (differenceInDays <= 7 && differenceInDays >= -1) {
        return true;
    } else {
        return false;
    }
}

const isMonth = function(todoDateObj, currentDateAndTime) { //function checks if todo's date and current date differs by no more than 1 month
    const differenceInDays = (todoDateObj - currentDateAndTime) / (1000 * 60 * 60 * 24) + 1;
    if ( differenceInDays <= 32 && differenceInDays >= 0) {
        const currentMonth = currentDateAndTime.getMonth() + 1;
        const currentYear = currentDateAndTime.getFullYear();
        if ( currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12 ) {
            return true;
        } else if ( differenceInDays <= 31 && (currentMonth == 4 || currentMonth == 6 || currentMonth == 9 || currentMonth == 11) ) {
            return true;
        } else if (  currentMonth == 2 && (differenceInDays <= (29 + isLeapYear(currentYear))) ) {
            return true;
        }
    }
    return false;
}

const isLeapYear = function(year) {
    if (year % 4 == 0) {
        if (year % 100 == 0) {
            if (year % 400 == 0) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return 1;
        }
    } else {
        return 0;
    }
}

const sortTasksAccordingToChosenTaskGroup = function(clickedObject, todos) {
    
    let todoListToShow = []; //current todoList that we going to show, we'll fill it
    if (todos.length > 0) {
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            const sortedTodo = sortCurrentTodo(clickedObject, todo); //either return todo or null
            todoListToShow.push(sortedTodo);
        }
    }
    return todoListToShow;
}

const isTodoExpired = function(todo) {
    const todoFullDate = todo.dueDate.split('-');
    const todoYear = todoFullDate[0];
    const todoMonth = todoFullDate[1];
    const todoDate = todoFullDate[2];
    const todoDateObj = new Date(todoYear, +todoMonth - 1, +todoDate +1 );
    const currentDateObj = new Date();
    if ( todoDateObj - currentDateObj < 0 ) {
        return true;
    } else {
        return false;
    }
}

const addExpirationStatus = function(todos) {
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        if (todo) {
            todo.expired = isTodoExpired(todo);
        }
    }
}

const deleteTodo = function(currentTodo, todos) {
    for (let i = 0; i < todos.length; i++) {
        if ( todos[i] == currentTodo ) {
            todos.splice(i, 1);
        }
    }
}

const getChangedTodos = function(todo, todos, editForm) {
    console.log(todo);
    console.log(todos);
    console.log(editForm);
    const newTodo = todoFactory(editForm, todo.check);
    const todoIndexToReplace = todos.indexOf(todo);

    if (todoIndexToReplace != -1) {
        todos[todoIndexToReplace] = newTodo;
    }
    return todos;
}

const getCurrentProject = function(projectsList) {
    const projects = document.querySelectorAll('.single-project');
    for (let i = 0; i < projects.length; i++) {
        if ( projects[i].classList.contains('chosen-project') ) {
            return projectsList[i];
        }
    }
    return null;
}

const getChosenProject = function(currentChosenProjectInDOM, projectsList) {
    if (projectsList.length > 0) {
        for (let i = 0; i < projectsList.length; i++) {
            const currentProject = projectsList[i];
            if (currentProject.title == currentChosenProjectInDOM.textContent) {
                return currentProject;
            } 
        }
    }
}

const highlightProject = function(project) {

    const allProjects = document.querySelectorAll('.single-project');
    if (allProjects.length > 0) {
        for (let i = 0; i < allProjects.length; i++) {
            const currentProject = allProjects[i];
            currentProject.classList.remove('chosen-project');
            if (currentProject.textContent == project.title) {
                currentProject.classList.add('chosen-project');
            }
        }
    }
}



/***/ }),

/***/ "./src/modules/controller.js":
/*!***********************************!*\
  !*** ./src/modules/controller.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addToProjectsList": () => (/* binding */ addToProjectsList),
/* harmony export */   "addToTheTodoList": () => (/* binding */ addToTheTodoList),
/* harmony export */   "showAllProjects": () => (/* binding */ showAllProjects),
/* harmony export */   "showAllTodos": () => (/* binding */ showAllTodos),
/* harmony export */   "todoFunctions": () => (/* binding */ todoFunctions)
/* harmony export */ });
/* harmony import */ var _domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulations */ "./src/modules/domManipulations.js");
/* harmony import */ var _appLogic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./appLogic */ "./src/modules/appLogic.js");



const addToTheTodoList = function(form, todos) {
    const newTodo = (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.todoFactory)(form);
    todos.push(newTodo);
}

const compareFunction = function(first, second) { // sort by priority of todo and expired todos will be in the bottom. Also most urge todos will be in first place
    if (first && second) {

        const compareDates = function(first, second) {
            const firstDate = first.dueDate.split('-');
            const secondDate = second.dueDate.split('-');
            const firstDateObj = new Date( firstDate[0], firstDate[1], firstDate[2] );
            const secondDateObj = new Date( secondDate[0], secondDate[1], secondDate[2] );
            const dateDifference = firstDateObj - secondDateObj;
            return dateDifference;
        }

        const comparePriority = function(first, second) {
            if ( first.priority == 'high' ) {
                if ( second.priority == 'high' ) {
                    return 0;
                } else {
                    return -1;
                }
    
            } else if ( first.priority == 'medium' ) {
                if ( second.priority == 'medium' ) {
                    return 0;
                } else if ( second.priority == 'high' ) {
                    return +1;
                } else if ( second.priority == 'low' ) {
                    return -1;
                }
    
            } else if ( first.priority == 'low' ) {
                if ( second.priority == 'low' ) {
                    return 0;
                } else {
                    return +1;
                }
            }
        }

        if (first.expired) {
            if (second.expired) {
                const priorityDifference = comparePriority(first, second);
                if (priorityDifference == 0) {
                    const dateDifference = compareDates(first, second);
                    return dateDifference;
                } else {
                    return priorityDifference;
                }
            } else if (!second.expired) {
                return +1;
            }
        } else if (!first.expired) {
            if (second.expired) {
                return -1;
            } else if (!second.expired) {
                const priorityDifference = comparePriority(first, second);
                if (priorityDifference == 0) {
                    const dateDifference = compareDates(first, second);
                    return dateDifference;
                } else {
                    return priorityDifference;
                }
            }
        }
    }
}

const showAllTodos = function(todosForShow, allTodos, clickedObject) {
    ;(0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.clearTodoContainer)(); // clears todo container of all tasks and then we will create it again with chosen parameters
    if (clickedObject) {
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.showTodoGroupTitle)(clickedObject);
    }

    if (todosForShow && todosForShow.length > 0) {
        (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.addExpirationStatus)(todosForShow);
        todosForShow.sort(compareFunction);
        
        for (let i = 0; i < todosForShow.length; i++) {
            const todo = todosForShow[i];
            if (todo) {
                (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createTodoBlockInDOM)(todo, (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.isTodoExpired)(todo), allTodos);
            }
        }
    }
}

const todoFunctions = function(todos, currentTodo, e) {
    const clickedButton = e.target.closest('button'); // get clicked Button or null
    if (clickedButton) {
        if ( clickedButton.classList.contains('delete-todo') ) {
            (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.deleteTodo)(currentTodo, todos);
            showAllTodos(todos, todos);
            console.log(todos);
        } else if ( clickedButton.classList.contains('edit-todo') ) {
            const editForm = (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.openEditForm)(); // opens edit form and returns it
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.fillEditForm)(currentTodo, editForm);
            const acceptChangesButton = editForm.querySelector('.edit-form__submit button');

            class editButtonClass {
                constructor(todo) {
                    this.boundEventHandler = this.eventHandler.bind(this, todo, todos, editForm);
                    acceptChangesButton.addEventListener('click', this.boundEventHandler);
                }

                eventHandler(todo, todos, editForm, e) {
                    e.preventDefault();

                    if ( (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.isFormValid)(editForm) ) {

                        todos = (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.getChangedTodos)(todo, todos, editForm);
                        this.removeListener();
                        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.closeEditForm)();
                        showAllTodos(todos, todos);
                    }
                }

                removeListener() {
                    acceptChangesButton.removeEventListener('click', this.boundEventHandler);
                    this.clickEventStatus = false;
                }
            }

            let button = new editButtonClass(currentTodo, todos, editForm);
        } else if ( clickedButton.classList.contains('details-todo') ) {
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.openDetailsWindow)(currentTodo);
        }
        // return todos to index.js
    }
}

const addToProjectsList = function(project, projectsList) {
    projectsList.push(project);
}

const showAllProjects = function(projectsList) {

    if (projectsList.length > 0) {
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.clearProjectsMenu)();
        for (let i = 0; i < projectsList.length; i++) {
            const project = projectsList[i];
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.addProjectDOM)(project);
        }
    }
}



/***/ }),

/***/ "./src/modules/domManipulations.js":
/*!*****************************************!*\
  !*** ./src/modules/domManipulations.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addProjectDOM": () => (/* binding */ addProjectDOM),
/* harmony export */   "clearProjectsMenu": () => (/* binding */ clearProjectsMenu),
/* harmony export */   "clearTodoContainer": () => (/* binding */ clearTodoContainer),
/* harmony export */   "closeEditForm": () => (/* binding */ closeEditForm),
/* harmony export */   "createErrorParagraph": () => (/* binding */ createErrorParagraph),
/* harmony export */   "createTodoBlockInDOM": () => (/* binding */ createTodoBlockInDOM),
/* harmony export */   "deleteErrorParagraph": () => (/* binding */ deleteErrorParagraph),
/* harmony export */   "fillEditForm": () => (/* binding */ fillEditForm),
/* harmony export */   "hideNewTaskWindow": () => (/* binding */ hideNewTaskWindow),
/* harmony export */   "openDetailsWindow": () => (/* binding */ openDetailsWindow),
/* harmony export */   "openEditForm": () => (/* binding */ openEditForm),
/* harmony export */   "resetErrors": () => (/* binding */ resetErrors),
/* harmony export */   "showNewTaskWindow": () => (/* binding */ showNewTaskWindow),
/* harmony export */   "showTodoGroupTitle": () => (/* binding */ showTodoGroupTitle)
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./src/modules/controller.js");


const changeTodoStatus = function(todoData) {
    if (this.checked) {
        todoData.check = true;
        this.closest('.single-todo').classList.add('hide-todo');
    } else {
        todoData.check = false;
        this.closest('.single-todo').classList.remove('hide-todo');
    }
}

const showNewTaskWindow = function() {
    const newTaskWindow = document.querySelector('.new-task');
    const newTaskWindowForm = newTaskWindow.querySelector('.form');
    newTaskWindow.classList.remove('hidden');
    newTaskWindowForm.classList.remove('hidden-form');
}

const hideNewTaskWindow = function() {
    const newTaskWindow = document.querySelector('.new-task');
    const newTaskWindowForm = newTaskWindow.querySelector('.form');
    newTaskWindowForm.classList.add('hidden-form');
    newTaskWindow.classList.add('hidden');
}

const createTodoBlockInDOM = function(todoData, todoExpiredStatus, todos) {
    // console.log(todos);
    const tasksContainer = document.querySelector('.content__tasks');

    const todoBlock = document.createElement('div');
    todoBlock.classList.add('single-todo');
    todoBlock.classList.add(todoData.priority);

    if (todoExpiredStatus) {
        todoBlock.classList.add('expired');
        todoData.expired = true;
    } else {
        todoData.expired = false;
    }

    const title = document.createElement('div');
    title.textContent = todoData.title;
    title.classList.add('todo__title');
    todoBlock.appendChild(title);

    const dueDate = document.createElement('div');
    dueDate.textContent = todoData.dueDate;
    dueDate.classList.add('todo__due-date');
    todoBlock.appendChild(dueDate);


    const buttons = document.createElement('div');
    buttons.classList.add('todo__buttons');

    const details = document.createElement('button');
    details.textContent = 'details';
    details.classList.add('details-todo');
    buttons.appendChild(details);

    const edit = document.createElement('button');
    const editImage = document.createElement('img');
    editImage.src = './images/icons/edit.svg';
    edit.appendChild(editImage);
    edit.classList.add('edit-todo');
    buttons.appendChild(edit);

    const deleteTodo = document.createElement('button');
    const deleteTodoImage = document.createElement('img');
    deleteTodoImage.src = './images/icons/delete.svg';
    deleteTodo.appendChild(deleteTodoImage);
    deleteTodo.classList.add('delete-todo');
    buttons.appendChild(deleteTodo);
    buttons.addEventListener('click', _controller__WEBPACK_IMPORTED_MODULE_0__.todoFunctions.bind(buttons, todos, todoData));

    todoBlock.appendChild(buttons);


    const checkbox = document.createElement('input');
    todoBlock.appendChild(checkbox);
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo__checkbox');
    if (todoData.check == true) {
        checkbox.checked = true;
        checkbox.closest('.single-todo').classList.add('hide-todo');
    }
    checkbox.addEventListener('change', changeTodoStatus.bind(checkbox, todoData));

    todoBlock.dataset.title = todoData.title;
    tasksContainer.appendChild(todoBlock); // adding new todoBlock into tasks container
}

const clearTodoContainer = function() {
    const currentTodos = document.querySelectorAll('.single-todo');
    currentTodos.forEach(todo => {
        todo.remove();
    });
}

const createErrorParagraph = function(inputField, projectOrNot) {
    const errorParagraph = document.createElement('div');

    if (inputField.name == 'dueDate') {
        errorParagraph.classList.add('error-paragraph');
        errorParagraph.classList.add('error-paragraph__shifted');
    }

    if (inputField.name == 'priority') {
        errorParagraph.classList.add('error-paragraph');
        errorParagraph.textContent = 'Choose priority of the task';
    } else if (inputField.name == 'dueDate') {
        errorParagraph.classList.add('error-paragraph');
        errorParagraph.textContent = 'Choose due date of the task';
    } else {
        errorParagraph.classList.add('error-paragraph');
        errorParagraph.textContent = 'This field must be filled';
    }

    if (inputField.name == 'projectTitle') {
        errorParagraph.classList.remove('error-paragraph');
        errorParagraph.classList.add('error-paragraph-project');
        errorParagraph.textContent = "Write project's name!";
    }
 
    inputField.before(errorParagraph);
}

const deleteErrorParagraph = function(inputField) {
    inputField.previousElementSibling.remove();
}

const resetErrors = function(form) {
    const errors = form.querySelectorAll('.error-paragraph');
    for (let i = 0; i < errors.length; i++) {
        errors[i].remove();
    }
    const errorBorders = form.querySelectorAll('.invalid'); //get inputs with "invalid" class
    for (let i = 0; i < errorBorders.length; i++) {
        errorBorders[i].classList.remove('invalid');
    }
}

const showTodoGroupTitle = function(clickedObject) {
    const currentTitle = clickedObject.textContent;
    const titleDOMElement = document.querySelector('.content__title');
    titleDOMElement.textContent = currentTitle;
}

const openEditForm = function() {
    const editTaskWindow = document.querySelector('.edit-task');
    const editTaskWindowForm = editTaskWindow.querySelector('.edit-task__form');
    editTaskWindow.classList.remove('hidden');
    editTaskWindowForm.classList.remove('hidden-form');

    return editTaskWindowForm;
}

const fillEditForm = function(todo, form) {
    // console.log(todo);
    // console.log(form);
    form.title.value = todo.title;
    form.description.value = todo.description;
    form.dueDate.value = todo.dueDate;

    if (todo.priority == 'low') {
        form.querySelector('#edit-low').checked = true;
    } else if (todo.priority == 'medium') {
        form.querySelector('#edit-medium').checked = true;
    } else if (todo.priority == 'high') {
        form.querySelector('#edit-high').checked = true;
    }

}

const closeEditForm = function(todo) {
    const editTaskWindow = document.querySelector('.edit-task');
    const editTaskWindowForm = editTaskWindow.querySelector('form');
    editTaskWindowForm.classList.add('hidden-form');
    editTaskWindow.classList.add('hidden');
}

const openDetailsWindow = function(todo) {
    const detailsWindow = document.querySelector('.task-details');
    detailsWindow.classList.add('active');

    const title = detailsWindow.querySelector('.task-details__title');
    title.textContent = todo.title;
    
    const description = detailsWindow.querySelector('.task-details__description');
    description.textContent = 'Description: ' + todo.description;

    const dueDate = detailsWindow.querySelector('.task-details__dueDate');
    dueDate.textContent = 'Due date: ' + todo.dueDate;

    const priority = detailsWindow.querySelector('.task-details__priority');
    priority.textContent = 'Priority: ' + todo.priority;
    priority.classList.add('details-priority__' + todo.priority);
}

const addProjectDOM = function(project) {
    const projects = document.querySelector('.projects ul');
    const currentProject = document.createElement('li');
    currentProject.classList.add('single-project');
    currentProject.textContent = project.title;
    currentProject
    projects.appendChild(currentProject); 
}

const clearProjectsMenu = function() {
    const projectsList = document.querySelector('.projects ul');
    const projects = projectsList.querySelectorAll('li');
    if (projects.length > 1) {
        for (let i = 1; i < projects.length; i++) {
            const projectToRemove = projects[i]; 
            projectsList.removeChild(projectToRemove);
        }
    }
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/domManipulations */ "./src/modules/domManipulations.js");
/* harmony import */ var _modules_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/controller */ "./src/modules/controller.js");
/* harmony import */ var _modules_appLogic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modules/appLogic */ "./src/modules/appLogic.js");




(function() {
    let todos = [];
    let projectsList = [];
    
    // creating example todos ===================================================
    const firstTodo = {
        title: 'Call to Irina',
        description: 'I have to call to Irina and know where she is.',
        dueDate: '2022-06-17',
        priority: 'high',
        check: false,
    };

    const secondTodo = {
        title: 'Buy a pizza',
        description: 'I need to buy two pizzas for me and Irina.',
        dueDate: '2022-08-19',
        priority: 'medium',
        check: false,
    };

    const thirdTodo = {
        title: 'Hmmm',
        description: 'Hmmmmmmmm.',
        dueDate: '2022-07-18',
        priority: 'low',
        check: true,
    };

    const fourthTodo = {
        title: 'Check Todo',
        description: 'I am just checking.',
        dueDate: '2022-07-15',
        priority: 'low',
        check: true,
    };

    todos.push(firstTodo);
    todos.push(secondTodo);
    todos.push(thirdTodo);
    todos.push(fourthTodo);
    // ==========================================================================

    const mainProject = {
        title: 'Main',
        todos: todos,
    };

    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToProjectsList)(mainProject, projectsList);
    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllProjects)(projectsList);
    (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(mainProject);

    const todosForShow = mainProject.todos;
    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, todos);

    

    // Add Event Listeners for the new task form and closing conditions ===========================================
    const taskFunctions = function(e) {
        const addTaskWindowButton = document.querySelector('.add-task'); // button that opens new task form
        const newTaskWindow = document.querySelector('.new-task'); // form's outer div block
        const form = document.querySelector('.form'); // new task form
        const closeTaskWindowButton = document.querySelector('.form__closing-button'); // close form button
        const submitButton = document.querySelector('.form__submit button'); // form's submit button
        const clickedObject = e.target;
        const currentTaskToEdit = clickedObject.closest('.single-todo'); // this need to open edit todo form
        const editFormContainer = document.querySelector('.edit-task');
        const editForm = editFormContainer.querySelector('form');
        const editFormCloseButton = document.querySelector('.edit-form__closing-button');
        const detailsWindow = document.querySelector('.task-details');
        const newProject = document.querySelector('.new-project');
        const newProjectForm = newProject.querySelector('form');
        const newProjectClosingButton = newProject.querySelector('.new-project__closing-button');
        
        const currentProject = (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.getCurrentProject)(projectsList); 
        todos = currentProject.todos;

        if (!newTaskWindow.classList.contains('hidden')) { //if the new task form is open
            if ( clickedObject == closeTaskWindowButton || !clickedObject.closest('.form') ) { //check if clicked Object is the "close form" button or is not form window
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                form.reset();
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.resetErrors)(form); //reset error paragraphs if they are exist
            } else if (clickedObject == submitButton) {
                e.preventDefault();
                if ( (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.isFormValid)(form) ) {
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToTheTodoList)(form, todos); // creates and insert new todo in DOM

                    const allTasks = document.querySelector('.all-tasks'); // these three lines need to highlight 
                    const tasksGroup = document.querySelector('.tasks ul'); // "all tasks" button after
                    (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightChosenTaskGroup)(tasksGroup, allTasks); // creating a new task
                    
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos);
                    (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                    form.reset();
                }
            }
        } else { //if the new task form is closed
            if (clickedObject == addTaskWindowButton) { //check if clicked Object is "add task" button
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.showNewTaskWindow)();
            } else if ( (clickedObject == editFormContainer && !editFormContainer.classList.contains('hidden') && 
            !clickedObject.closest('.edit-task__form') ) || clickedObject == editFormCloseButton) { // if edit form is open. Then close button clicked
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.closeEditForm)();
                editForm.reset();
            } else if ( detailsWindow.classList.contains('active') && !clickedObject.closest('.task-details') ) {
                const detailsPriority = detailsWindow.querySelector('.task-details__priority');
                if ( detailsPriority.classList.contains('details-priority__low') ) {
                    detailsPriority.classList.remove('details-priority__low');
                } else if ( detailsPriority.classList.contains('details-priority__medium') ) {
                    detailsPriority.classList.remove('details-priority__medium');
                } else if ( detailsPriority.classList.contains('details-priority__high') ) {
                    detailsPriority.classList.remove('details-priority__high');
                }
                detailsWindow.classList.remove('active');
            } else if (clickedObject.closest('.new-project') && !clickedObject.closest('.new-project form') || clickedObject == newProjectClosingButton) {
                newProject.classList.add('hidden');
                newProjectForm.classList.add('hidden-form');
                newProjectForm.reset();
            }
        }
    }
    window.addEventListener('mousedown', taskFunctions);

    // Add Event Listeners for task groups
    const taskGroups = document.querySelector('.tasks ul'); //get sidebar task groups

    const taskGroupsFunctions = function(e) {
        
        const clickedObject = e.target;
        if (clickedObject != taskGroups) {
            (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightChosenTaskGroup)(taskGroups, clickedObject);
            const todosForShow = (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.sortTasksAccordingToChosenTaskGroup)(clickedObject, todos);
            (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, todos, clickedObject);
        }
    }
    taskGroups.addEventListener('click', taskGroupsFunctions);

    // Add Event Listeners for projects
    const projects = document.querySelector('.projects');
    const createProjectButton = document.querySelector('.new-project__accept-title');

    const projectsFunctions = function(e) {
        const clickedObject = e.target;
        const addProjectButton = projects.querySelector('.projects__create');
        const newProject = document.querySelector('.new-project');
        const newProjectForm = newProject.querySelector('form');
        const allProjects = document.querySelectorAll('.projects ul li');
        
        if (addProjectButton && addProjectButton == clickedObject.closest('.projects__create')) {
            newProject.classList.remove('hidden');
            newProjectForm.classList.remove('hidden-form');
        } else if ( clickedObject.classList.contains('single-project') ) {
            if (projectsList.length > 0) {
                for (let i = 0; i < projectsList.length; i++) {
                    const currentProject = projectsList[i];
                    if (currentProject.title == clickedObject.textContent) {
                        (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(currentProject);
                        todos = currentProject.todos;
                        (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos);
                    }
                }
            }
        }
    }
    projects.addEventListener('click', projectsFunctions);


    const addProject = function(e) {
        e.preventDefault();
        const projectTitle = document.querySelector('#project-title');
        const newProject = document.querySelector('.new-project');
        const newProjectForm = newProject.querySelector('form');
        const currentHighlightedProjectInDOM = document.querySelector('.chosen-project');
        const chosenProject = (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.getChosenProject)(currentHighlightedProjectInDOM, projectsList);
        

        if ( projectTitle.previousElementSibling.classList.contains('error-paragraph-project') ) {
            (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(projectTitle);
            projectTitle.classList.remove('invalid');
        }

        if (projectTitle.value.trim() == '') {
            (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(projectTitle);
            projectTitle.classList.add('invalid');

        } else {
            const currentProject = {
                title: projectTitle.value,
                todos: [],
            }

            ;(0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToProjectsList)(currentProject, projectsList);
            (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllProjects)(projectsList);
            (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(chosenProject);
            
            newProject.classList.add('hidden');
            newProjectForm.classList.add('hidden-form');
            newProjectForm.reset();
        }
        
    }
    createProjectButton.addEventListener('click', addProject);

})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixtRUFBZ0I7QUFDOUM7O0FBRUE7QUFDQSxZQUFZLCtFQUFvQjtBQUNoQztBQUNBOztBQUVBO0FBQ0EsWUFBWSwrRUFBb0I7QUFDaEM7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVksdUVBQWlCO0FBQzdCLFlBQVksb0VBQWU7QUFDM0IsWUFBWSxtRUFBZ0I7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHBMb2dpYy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9jb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuXG5jb25zdCB0b2RvRmFjdG9yeSA9IGZ1bmN0aW9uKGZvcm0sIGNoZWNrU3RhdHVzKSB7XG4gICAgbGV0IHRvZG9PYmplY3QgPSB7fTsgLy8gb2JqZWN0IHRoYXQgY29sbGVjdHMgaW5mbyBmcm9tIG5ldyB0YXNrIGZvcm0hXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gZm9ybS5lbGVtZW50cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1FbGVtZW50cy5sZW5ndGggLSAxOyBpKyspIHsgLy8gYWxsIGZpZWxkcyBleGNlcHQgc3VibWl0IGJ1dHRvblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZm9ybUVsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoZWxlbWVudC5uYW1lID09ICd0aXRsZScgfHwgZWxlbWVudC5uYW1lID09ICdkZXNjcmlwdGlvbicpIHtcbiAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09ICdwcmlvcml0eScgJiYgZWxlbWVudC5jaGVja2VkKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlkID09ICdlZGl0LWxvdycpIHsgLy90aGVzZSBjaGVja3MgZm9yIGVkaXQtLi4uIG5lZWRzIHRvIHNob3cgcHJpb3JpdHkgLSBlZGl0Rm9ybSBwcmlvcml0eSBidXR0b25zIGlkJ3MgZGlmZmVyIG5ld1Rhc2tGb3JtJ3MgKG9idmlvdXNseSlcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnbG93JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1tZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ21lZGl1bSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtaGlnaCcpIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnaGlnaCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZG9PYmplY3QuY2hlY2sgPSBjaGVja1N0YXR1cztcbiAgICByZXR1cm4gdG9kb09iamVjdDtcbn1cblxuY29uc3QgaXNGb3JtVmFsaWQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0udGl0bGU7XG4gICAgY29uc3QgZHVlRGF0ZUlucHV0ID0gZm9ybS5kdWVEYXRlO1xuICAgIGNvbnN0IHByaW9yaXR5SW5wdXRzID0gZm9ybS5wcmlvcml0eTsgXG4gICAgLy8gY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjdGl0bGUnKTtcbiAgICAvLyBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I2R1ZURhdGUnKTtcbiAgICAvLyBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1wcmlvcml0eV0nKTtcbiAgICBjb25zdCBwcmlvcml0eUJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eV9fYnV0dG9ucywgLmVkaXQtZm9ybS1wcmlvcml0eV9fYnV0dG9ucycpO1xuXG4gICAgbGV0IHZhbGlkUHJpb3JpdHk7XG4gICAgbGV0IHByaW9yaXR5Q2hlY2sgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByaW9yaXR5SW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcmlvcml0eUlucHV0ID0gcHJpb3JpdHlJbnB1dHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50UHJpb3JpdHlJbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICBwcmlvcml0eUNoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwcmlvcml0eUNoZWNrICYmICFwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByaW9yaXR5SW5wdXRzWzBdKTtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocHJpb3JpdHlDaGVjaykge1xuICAgICAgICB2YWxpZFByaW9yaXR5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yLXBhcmFncmFwaCcpKSB7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWREdWVEYXRlO1xuICAgIGlmIChkdWVEYXRlSW5wdXQudmFsdWUudHJpbSgpID09ICcnKSB7XG4gICAgICAgIHZhbGlkRHVlRGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSB0cnVlO1xuICAgICAgICBpZiAoZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB2YWxpZFRpdGxlO1xuICAgIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJyAmJiAhdGl0bGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIHRpdGxlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgdmFsaWRUaXRsZSA9IGZhbHNlO1xuXG4gICAgfSBlbHNlIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZFRpdGxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIHRpdGxlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YWxpZCA9IHZhbGlkUHJpb3JpdHkgJiYgdmFsaWREdWVEYXRlICYmIHZhbGlkVGl0bGU7XG4gICAgcmV0dXJuIHZhbGlkO1xufVxuXG5jb25zdCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAgPSBmdW5jdGlvbih0YXNrR3JvdXBzLCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY29uc3QgdGFza0dyb3Vwc0VsZW1lbnRzID0gdGFza0dyb3Vwcy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza0dyb3Vwc0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrR3JvdXAgPSB0YXNrR3JvdXBzRWxlbWVudHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50VGFza0dyb3VwID09IGNsaWNrZWRPYmplY3QgJiYgIWN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRhc2tHcm91cCAhPSBjbGlja2VkT2JqZWN0ICYmIGN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5yZW1vdmUoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNvcnRDdXJyZW50VG9kbyA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG8pIHtcbiAgICBjb25zdCBjdXJyZW50RGF0ZUFuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGVBbmRUaW1lLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBbmRUaW1lLmdldERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50SG91cnMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0SG91cnMoKTtcbiAgICBjb25zdCBjdXJyZW50TWludXRlcyA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNaW51dGVzKCk7XG4gICAgY29uc3QgY3VycmVudFNlY29uZHMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0U2Vjb25kcygpO1xuXG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsIHRvZG9Nb250aCAtIDEsIHRvZG9EYXRlKTsgLy9EYXRlIE9iaiBmb3IgdG9kb1xuXG4gICAgaWYgKGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2RheScpKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRvZGF5XCJcbiAgICAgICAgaWYgKCBpc1RvZGF5KHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlZWsnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwidGhpcyB3ZWVrXCJcbiAgICAgICAgaWYgKCBpc1dlZWsodG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ21vbnRoJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcIm1vbnRoXCJcbiAgICAgICAgaWYgKCBpc01vbnRoKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbGwtdGFza3MnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwiYWxsIHRhc2tzXCJcbiAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgfVxufVxuXG5jb25zdCBpc1RvZGF5ID0gZnVuY3Rpb24odG9kb1llYXIsIHRvZG9Nb250aCwgdG9kb0RhdGUsIGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXRlKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGV4cGlyZWQgdG9kYXlcbiAgICBpZiAoIHRvZG9ZZWFyID09IGN1cnJlbnRZZWFyICYmIHRvZG9Nb250aCA9PSBjdXJyZW50TW9udGggJiYgdG9kb0RhdGUgPT0gY3VycmVudERhdGUgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzV2VlayA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIHdlZWtcbiAgICBjb25zdCBkaWZmZXJlbmNlSW5EYXlzID0gKHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVBbmRUaW1lKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KTtcbiAgICBpZiAoZGlmZmVyZW5jZUluRGF5cyA8PSA3ICYmIGRpZmZlcmVuY2VJbkRheXMgPj0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaXNNb250aCA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIG1vbnRoXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkgKyAxO1xuICAgIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMiAmJiBkaWZmZXJlbmNlSW5EYXlzID49IDApIHtcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoIGN1cnJlbnRNb250aCA9PSAxIHx8IGN1cnJlbnRNb250aCA9PSAzIHx8IGN1cnJlbnRNb250aCA9PSA1IHx8IGN1cnJlbnRNb250aCA9PSA3IHx8IGN1cnJlbnRNb250aCA9PSA4IHx8IGN1cnJlbnRNb250aCA9PSAxMCB8fCBjdXJyZW50TW9udGggPT0gMTIgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMSAmJiAoY3VycmVudE1vbnRoID09IDQgfHwgY3VycmVudE1vbnRoID09IDYgfHwgY3VycmVudE1vbnRoID09IDkgfHwgY3VycmVudE1vbnRoID09IDExKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCAgY3VycmVudE1vbnRoID09IDIgJiYgKGRpZmZlcmVuY2VJbkRheXMgPD0gKDI5ICsgaXNMZWFwWWVhcihjdXJyZW50WWVhcikpKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaXNMZWFwWWVhciA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICBpZiAoeWVhciAlIDQgPT0gMCkge1xuICAgICAgICBpZiAoeWVhciAlIDEwMCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoeWVhciAlIDQwMCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5cbmNvbnN0IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCwgdG9kb3MpIHtcbiAgICBcbiAgICBsZXQgdG9kb0xpc3RUb1Nob3cgPSBbXTsgLy9jdXJyZW50IHRvZG9MaXN0IHRoYXQgd2UgZ29pbmcgdG8gc2hvdywgd2UnbGwgZmlsbCBpdFxuICAgIGlmICh0b2Rvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFRvZG8gPSBzb3J0Q3VycmVudFRvZG8oY2xpY2tlZE9iamVjdCwgdG9kbyk7IC8vZWl0aGVyIHJldHVybiB0b2RvIG9yIG51bGxcbiAgICAgICAgICAgIHRvZG9MaXN0VG9TaG93LnB1c2goc29ydGVkVG9kbyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvZG9MaXN0VG9TaG93O1xufVxuXG5jb25zdCBpc1RvZG9FeHBpcmVkID0gZnVuY3Rpb24odG9kbykge1xuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCArdG9kb01vbnRoIC0gMSwgK3RvZG9EYXRlICsxICk7XG4gICAgY29uc3QgY3VycmVudERhdGVPYmogPSBuZXcgRGF0ZSgpO1xuICAgIGlmICggdG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZU9iaiA8IDAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGFkZEV4cGlyYXRpb25TdGF0dXMgPSBmdW5jdGlvbih0b2Rvcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG9kbyA9IHRvZG9zW2ldO1xuICAgICAgICBpZiAodG9kbykge1xuICAgICAgICAgICAgdG9kby5leHBpcmVkID0gaXNUb2RvRXhwaXJlZCh0b2RvKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgZGVsZXRlVG9kbyA9IGZ1bmN0aW9uKGN1cnJlbnRUb2RvLCB0b2Rvcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCB0b2Rvc1tpXSA9PSBjdXJyZW50VG9kbyApIHtcbiAgICAgICAgICAgIHRvZG9zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgZ2V0Q2hhbmdlZFRvZG9zID0gZnVuY3Rpb24odG9kbywgdG9kb3MsIGVkaXRGb3JtKSB7XG4gICAgY29uc29sZS5sb2codG9kbyk7XG4gICAgY29uc29sZS5sb2codG9kb3MpO1xuICAgIGNvbnNvbGUubG9nKGVkaXRGb3JtKTtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZWRpdEZvcm0sIHRvZG8uY2hlY2spO1xuICAgIGNvbnN0IHRvZG9JbmRleFRvUmVwbGFjZSA9IHRvZG9zLmluZGV4T2YodG9kbyk7XG5cbiAgICBpZiAodG9kb0luZGV4VG9SZXBsYWNlICE9IC0xKSB7XG4gICAgICAgIHRvZG9zW3RvZG9JbmRleFRvUmVwbGFjZV0gPSBuZXdUb2RvO1xuICAgIH1cbiAgICByZXR1cm4gdG9kb3M7XG59XG5cbmNvbnN0IGdldEN1cnJlbnRQcm9qZWN0ID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXByb2plY3QnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICggcHJvamVjdHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tcHJvamVjdCcpICkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgZ2V0Q2hvc2VuUHJvamVjdCA9IGZ1bmN0aW9uKGN1cnJlbnRDaG9zZW5Qcm9qZWN0SW5ET00sIHByb2plY3RzTGlzdCkge1xuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY3VycmVudENob3NlblByb2plY3RJbkRPTS50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50UHJvamVjdDtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGhpZ2hsaWdodFByb2plY3QgPSBmdW5jdGlvbihwcm9qZWN0KSB7XG5cbiAgICBjb25zdCBhbGxQcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtcHJvamVjdCcpO1xuICAgIGlmIChhbGxQcm9qZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gYWxsUHJvamVjdHNbaV07XG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tcHJvamVjdCcpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LnRleHRDb250ZW50ID09IHByb2plY3QudGl0bGUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tcHJvamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge3RvZG9GYWN0b3J5LCBpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgXG4gICAgZ2V0Q2hhbmdlZFRvZG9zLCBnZXRDdXJyZW50UHJvamVjdCwgZ2V0Q2hvc2VuUHJvamVjdCwgaGlnaGxpZ2h0UHJvamVjdH0iLCJpbXBvcnQge2NyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIHNob3dUb2RvR3JvdXBUaXRsZSwgb3BlbkVkaXRGb3JtLCBmaWxsRWRpdEZvcm0sIGNsb3NlRWRpdEZvcm0sIG9wZW5EZXRhaWxzV2luZG93LCBhZGRQcm9qZWN0RE9NLCBjbGVhclByb2plY3RzTWVudX0gZnJvbSAnLi9kb21NYW5pcHVsYXRpb25zJztcbmltcG9ydCB7dG9kb0ZhY3RvcnksIGlzVG9kb0V4cGlyZWQsIGFkZEV4cGlyYXRpb25TdGF0dXMsIGRlbGV0ZVRvZG8sIGlzRm9ybVZhbGlkLCBnZXRDaGFuZ2VkVG9kb3MsIGhpZ2hsaWdodFByb2plY3R9IGZyb20gJy4vYXBwTG9naWMnO1xuXG5jb25zdCBhZGRUb1RoZVRvZG9MaXN0ID0gZnVuY3Rpb24oZm9ybSwgdG9kb3MpIHtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZm9ybSk7XG4gICAgdG9kb3MucHVzaChuZXdUb2RvKTtcbn1cblxuY29uc3QgY29tcGFyZUZ1bmN0aW9uID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkgeyAvLyBzb3J0IGJ5IHByaW9yaXR5IG9mIHRvZG8gYW5kIGV4cGlyZWQgdG9kb3Mgd2lsbCBiZSBpbiB0aGUgYm90dG9tLiBBbHNvIG1vc3QgdXJnZSB0b2RvcyB3aWxsIGJlIGluIGZpcnN0IHBsYWNlXG4gICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVEYXRlcyA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF0ZSA9IGZpcnN0LmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGUgPSBzZWNvbmQuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlT2JqID0gbmV3IERhdGUoIGZpcnN0RGF0ZVswXSwgZmlyc3REYXRlWzFdLCBmaXJzdERhdGVbMl0gKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGVPYmogPSBuZXcgRGF0ZSggc2Vjb25kRGF0ZVswXSwgc2Vjb25kRGF0ZVsxXSwgc2Vjb25kRGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBmaXJzdERhdGVPYmogLSBzZWNvbmREYXRlT2JqO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcGFyZVByaW9yaXR5ID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghZmlyc3QuZXhwaXJlZCkge1xuICAgICAgICAgICAgaWYgKHNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNob3dBbGxUb2RvcyA9IGZ1bmN0aW9uKHRvZG9zRm9yU2hvdywgYWxsVG9kb3MsIGNsaWNrZWRPYmplY3QpIHtcbiAgICBjbGVhclRvZG9Db250YWluZXIoKTsgLy8gY2xlYXJzIHRvZG8gY29udGFpbmVyIG9mIGFsbCB0YXNrcyBhbmQgdGhlbiB3ZSB3aWxsIGNyZWF0ZSBpdCBhZ2FpbiB3aXRoIGNob3NlbiBwYXJhbWV0ZXJzXG4gICAgaWYgKGNsaWNrZWRPYmplY3QpIHtcbiAgICAgICAgc2hvd1RvZG9Hcm91cFRpdGxlKGNsaWNrZWRPYmplY3QpO1xuICAgIH1cblxuICAgIGlmICh0b2Rvc0ZvclNob3cgJiYgdG9kb3NGb3JTaG93Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWRkRXhwaXJhdGlvblN0YXR1cyh0b2Rvc0ZvclNob3cpO1xuICAgICAgICB0b2Rvc0ZvclNob3cuc29ydChjb21wYXJlRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvc0ZvclNob3cubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc0ZvclNob3dbaV07XG4gICAgICAgICAgICBpZiAodG9kbykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRvZG9CbG9ja0luRE9NKHRvZG8sIGlzVG9kb0V4cGlyZWQodG9kbyksIGFsbFRvZG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgdG9kb0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKHRvZG9zLCBjdXJyZW50VG9kbywgZSkge1xuICAgIGNvbnN0IGNsaWNrZWRCdXR0b24gPSBlLnRhcmdldC5jbG9zZXN0KCdidXR0b24nKTsgLy8gZ2V0IGNsaWNrZWQgQnV0dG9uIG9yIG51bGxcbiAgICBpZiAoY2xpY2tlZEJ1dHRvbikge1xuICAgICAgICBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkZWxldGUtdG9kbycpICkge1xuICAgICAgICAgICAgZGVsZXRlVG9kbyhjdXJyZW50VG9kbywgdG9kb3MpO1xuICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGdldENoYW5nZWRUb2Rvcyh0b2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrRXZlbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgZWRpdEJ1dHRvbkNsYXNzKGN1cnJlbnRUb2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkQnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnZGV0YWlscy10b2RvJykgKSB7XG4gICAgICAgICAgICBvcGVuRGV0YWlsc1dpbmRvdyhjdXJyZW50VG9kbyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIHRvZG9zIHRvIGluZGV4LmpzXG4gICAgfVxufVxuXG5jb25zdCBhZGRUb1Byb2plY3RzTGlzdCA9IGZ1bmN0aW9uKHByb2plY3QsIHByb2plY3RzTGlzdCkge1xuICAgIHByb2plY3RzTGlzdC5wdXNoKHByb2plY3QpO1xufVxuXG5jb25zdCBzaG93QWxsUHJvamVjdHMgPSBmdW5jdGlvbihwcm9qZWN0c0xpc3QpIHtcblxuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhclByb2plY3RzTWVudSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGFkZFByb2plY3RET00ocHJvamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zLCB0b2RvRnVuY3Rpb25zLCBhZGRUb1Byb2plY3RzTGlzdCwgc2hvd0FsbFByb2plY3RzfTsiLCJpbXBvcnQgeyB0b2RvRnVuY3Rpb25zIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xuXG5jb25zdCBjaGFuZ2VUb2RvU3RhdHVzID0gZnVuY3Rpb24odG9kb0RhdGEpIHtcbiAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5jaGVjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtdG9kbycpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hvd05ld1Rhc2tXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvd0Zvcm0gPSBuZXdUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xufVxuXG5jb25zdCBoaWRlTmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmNvbnN0IGNyZWF0ZVRvZG9CbG9ja0luRE9NID0gZnVuY3Rpb24odG9kb0RhdGEsIHRvZG9FeHBpcmVkU3RhdHVzLCB0b2Rvcykge1xuICAgIC8vIGNvbnNvbGUubG9nKHRvZG9zKTtcbiAgICBjb25zdCB0YXNrc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190YXNrcycpO1xuXG4gICAgY29uc3QgdG9kb0Jsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ3NpbmdsZS10b2RvJyk7XG4gICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQodG9kb0RhdGEucHJpb3JpdHkpO1xuXG4gICAgaWYgKHRvZG9FeHBpcmVkU3RhdHVzKSB7XG4gICAgICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKCdleHBpcmVkJyk7XG4gICAgICAgIHRvZG9EYXRhLmV4cGlyZWQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmV4cGlyZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gdG9kb0RhdGEudGl0bGU7XG4gICAgdGl0bGUuY2xhc3NMaXN0LmFkZCgndG9kb19fdGl0bGUnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgY29uc3QgZHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGR1ZURhdGUudGV4dENvbnRlbnQgPSB0b2RvRGF0YS5kdWVEYXRlO1xuICAgIGR1ZURhdGUuY2xhc3NMaXN0LmFkZCgndG9kb19fZHVlLWRhdGUnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoZHVlRGF0ZSk7XG5cblxuICAgIGNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b25zLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2J1dHRvbnMnKTtcblxuICAgIGNvbnN0IGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBkZXRhaWxzLnRleHRDb250ZW50ID0gJ2RldGFpbHMnO1xuICAgIGRldGFpbHMuY2xhc3NMaXN0LmFkZCgnZGV0YWlscy10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChkZXRhaWxzKTtcblxuICAgIGNvbnN0IGVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0SW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBlZGl0SW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2VkaXQuc3ZnJztcbiAgICBlZGl0LmFwcGVuZENoaWxkKGVkaXRJbWFnZSk7XG4gICAgZWRpdC5jbGFzc0xpc3QuYWRkKCdlZGl0LXRvZG8nKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGVkaXQpO1xuXG4gICAgY29uc3QgZGVsZXRlVG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZVRvZG9JbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGRlbGV0ZVRvZG9JbWFnZS5zcmMgPSAnLi9pbWFnZXMvaWNvbnMvZGVsZXRlLnN2Zyc7XG4gICAgZGVsZXRlVG9kby5hcHBlbmRDaGlsZChkZWxldGVUb2RvSW1hZ2UpO1xuICAgIGRlbGV0ZVRvZG8uY2xhc3NMaXN0LmFkZCgnZGVsZXRlLXRvZG8nKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGRlbGV0ZVRvZG8pO1xuICAgIGJ1dHRvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2RvRnVuY3Rpb25zLmJpbmQoYnV0dG9ucywgdG9kb3MsIHRvZG9EYXRhKSk7XG5cbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XG5cblxuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2NoZWNrYm94Jyk7XG4gICAgaWYgKHRvZG9EYXRhLmNoZWNrID09IHRydWUpIHtcbiAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIGNoZWNrYm94LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH1cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VUb2RvU3RhdHVzLmJpbmQoY2hlY2tib3gsIHRvZG9EYXRhKSk7XG5cbiAgICB0b2RvQmxvY2suZGF0YXNldC50aXRsZSA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRhc2tzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRvZG9CbG9jayk7IC8vIGFkZGluZyBuZXcgdG9kb0Jsb2NrIGludG8gdGFza3MgY29udGFpbmVyXG59XG5cbmNvbnN0IGNsZWFyVG9kb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUb2RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtdG9kbycpO1xuICAgIGN1cnJlbnRUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICB0b2RvLnJlbW92ZSgpO1xuICAgIH0pO1xufVxuXG5jb25zdCBjcmVhdGVFcnJvclBhcmFncmFwaCA9IGZ1bmN0aW9uKGlucHV0RmllbGQsIHByb2plY3RPck5vdCkge1xuICAgIGNvbnN0IGVycm9yUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoX19zaGlmdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJpb3JpdHknKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXBhcmFncmFwaCcpO1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgcHJpb3JpdHkgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnQ2hvb3NlIGR1ZSBkYXRlIG9mIHRoZSB0YXNrJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIGZpbGxlZCc7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJvamVjdFRpdGxlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoLXByb2plY3QnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSBcIldyaXRlIHByb2plY3QncyBuYW1lIVwiO1xuICAgIH1cbiBcbiAgICBpbnB1dEZpZWxkLmJlZm9yZShlcnJvclBhcmFncmFwaCk7XG59XG5cbmNvbnN0IGRlbGV0ZUVycm9yUGFyYWdyYXBoID0gZnVuY3Rpb24oaW5wdXRGaWVsZCkge1xuICAgIGlucHV0RmllbGQucHJldmlvdXNFbGVtZW50U2libGluZy5yZW1vdmUoKTtcbn1cblxuY29uc3QgcmVzZXRFcnJvcnMgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgZXJyb3JzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JzW2ldLnJlbW92ZSgpO1xuICAgIH1cbiAgICBjb25zdCBlcnJvckJvcmRlcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnZhbGlkJyk7IC8vZ2V0IGlucHV0cyB3aXRoIFwiaW52YWxpZFwiIGNsYXNzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckJvcmRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JCb3JkZXJzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICB9XG59XG5cbmNvbnN0IHNob3dUb2RvR3JvdXBUaXRsZSA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QpIHtcbiAgICBjb25zdCBjdXJyZW50VGl0bGUgPSBjbGlja2VkT2JqZWN0LnRleHRDb250ZW50O1xuICAgIGNvbnN0IHRpdGxlRE9NRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aXRsZScpO1xuICAgIHRpdGxlRE9NRWxlbWVudC50ZXh0Q29udGVudCA9IGN1cnJlbnRUaXRsZTtcbn1cblxuY29uc3Qgb3BlbkVkaXRGb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3dGb3JtID0gZWRpdFRhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmVkaXQtdGFza19fZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIGVkaXRUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xuXG4gICAgcmV0dXJuIGVkaXRUYXNrV2luZG93Rm9ybTtcbn1cblxuY29uc3QgZmlsbEVkaXRGb3JtID0gZnVuY3Rpb24odG9kbywgZm9ybSkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRvZG8pO1xuICAgIC8vIGNvbnNvbGUubG9nKGZvcm0pO1xuICAgIGZvcm0udGl0bGUudmFsdWUgPSB0b2RvLnRpdGxlO1xuICAgIGZvcm0uZGVzY3JpcHRpb24udmFsdWUgPSB0b2RvLmRlc2NyaXB0aW9uO1xuICAgIGZvcm0uZHVlRGF0ZS52YWx1ZSA9IHRvZG8uZHVlRGF0ZTtcblxuICAgIGlmICh0b2RvLnByaW9yaXR5ID09ICdsb3cnKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtbG93JykuY2hlY2tlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09ICdtZWRpdW0nKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtbWVkaXVtJykuY2hlY2tlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09ICdoaWdoJykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LWhpZ2gnKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG5cbn1cblxuY29uc3QgY2xvc2VFZGl0Rm9ybSA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvd0Zvcm0gPSBlZGl0VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmNvbnN0IG9wZW5EZXRhaWxzV2luZG93ID0gZnVuY3Rpb24odG9kbykge1xuICAgIGNvbnN0IGRldGFpbHNXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzJyk7XG4gICAgZGV0YWlsc1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcblxuICAgIGNvbnN0IHRpdGxlID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX190aXRsZScpO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gdG9kby50aXRsZTtcbiAgICBcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fZGVzY3JpcHRpb24nKTtcbiAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9ICdEZXNjcmlwdGlvbjogJyArIHRvZG8uZGVzY3JpcHRpb247XG5cbiAgICBjb25zdCBkdWVEYXRlID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX19kdWVEYXRlJyk7XG4gICAgZHVlRGF0ZS50ZXh0Q29udGVudCA9ICdEdWUgZGF0ZTogJyArIHRvZG8uZHVlRGF0ZTtcblxuICAgIGNvbnN0IHByaW9yaXR5ID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX19wcmlvcml0eScpO1xuICAgIHByaW9yaXR5LnRleHRDb250ZW50ID0gJ1ByaW9yaXR5OiAnICsgdG9kby5wcmlvcml0eTtcbiAgICBwcmlvcml0eS5jbGFzc0xpc3QuYWRkKCdkZXRhaWxzLXByaW9yaXR5X18nICsgdG9kby5wcmlvcml0eSk7XG59XG5cbmNvbnN0IGFkZFByb2plY3RET00gPSBmdW5jdGlvbihwcm9qZWN0KSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMgdWwnKTtcbiAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgY3VycmVudFByb2plY3QuY2xhc3NMaXN0LmFkZCgnc2luZ2xlLXByb2plY3QnKTtcbiAgICBjdXJyZW50UHJvamVjdC50ZXh0Q29udGVudCA9IHByb2plY3QudGl0bGU7XG4gICAgY3VycmVudFByb2plY3RcbiAgICBwcm9qZWN0cy5hcHBlbmRDaGlsZChjdXJyZW50UHJvamVjdCk7IFxufVxuXG5jb25zdCBjbGVhclByb2plY3RzTWVudSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHByb2plY3RzTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cyB1bCcpO1xuICAgIGNvbnN0IHByb2plY3RzID0gcHJvamVjdHNMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgaWYgKHByb2plY3RzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdFRvUmVtb3ZlID0gcHJvamVjdHNbaV07IFxuICAgICAgICAgICAgcHJvamVjdHNMaXN0LnJlbW92ZUNoaWxkKHByb2plY3RUb1JlbW92ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCBjcmVhdGVUb2RvQmxvY2tJbkRPTSwgY2xlYXJUb2RvQ29udGFpbmVyLCBjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGgsIHJlc2V0RXJyb3JzLFxuc2hvd1RvZG9Hcm91cFRpdGxlLCBvcGVuRWRpdEZvcm0sIGNsb3NlRWRpdEZvcm0sIGZpbGxFZGl0Rm9ybSwgb3BlbkRldGFpbHNXaW5kb3csIGFkZFByb2plY3RET00sIGNsZWFyUHJvamVjdHNNZW51fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCByZXNldEVycm9ycywgY2xvc2VFZGl0Rm9ybSwgY3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL21vZHVsZXMvZG9tTWFuaXB1bGF0aW9ucyc7XG5pbXBvcnQge2FkZFRvVGhlVG9kb0xpc3QsIHNob3dBbGxUb2RvcywgYWRkVG9Qcm9qZWN0c0xpc3QsIHNob3dBbGxQcm9qZWN0c30gZnJvbSAnLi9tb2R1bGVzL2NvbnRyb2xsZXInO1xuaW1wb3J0IHtpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgZ2V0Q3VycmVudFByb2plY3QsIGdldENob3NlblByb2plY3QsIGhpZ2hsaWdodFByb2plY3R9IGZyb20gJy4vbW9kdWxlcy9hcHBMb2dpYyc7XG5cbihmdW5jdGlvbigpIHtcbiAgICBsZXQgdG9kb3MgPSBbXTtcbiAgICBsZXQgcHJvamVjdHNMaXN0ID0gW107XG4gICAgXG4gICAgLy8gY3JlYXRpbmcgZXhhbXBsZSB0b2RvcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCBmaXJzdFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQ2FsbCB0byBJcmluYScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBoYXZlIHRvIGNhbGwgdG8gSXJpbmEgYW5kIGtub3cgd2hlcmUgc2hlIGlzLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA2LTE3JyxcbiAgICAgICAgcHJpb3JpdHk6ICdoaWdoJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBzZWNvbmRUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0J1eSBhIHBpenphJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIG5lZWQgdG8gYnV5IHR3byBwaXp6YXMgZm9yIG1lIGFuZCBJcmluYS4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wOC0xOScsXG4gICAgICAgIHByaW9yaXR5OiAnbWVkaXVtJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCB0aGlyZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSG1tbW1tbW1tLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA3LTE4JyxcbiAgICAgICAgcHJpb3JpdHk6ICdsb3cnLFxuICAgICAgICBjaGVjazogdHJ1ZSxcbiAgICB9O1xuXG4gICAgY29uc3QgZm91cnRoVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDaGVjayBUb2RvJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGFtIGp1c3QgY2hlY2tpbmcuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTUnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICB0b2Rvcy5wdXNoKGZpcnN0VG9kbyk7XG4gICAgdG9kb3MucHVzaChzZWNvbmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHRoaXJkVG9kbyk7XG4gICAgdG9kb3MucHVzaChmb3VydGhUb2RvKTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgY29uc3QgbWFpblByb2plY3QgPSB7XG4gICAgICAgIHRpdGxlOiAnTWFpbicsXG4gICAgICAgIHRvZG9zOiB0b2RvcyxcbiAgICB9O1xuXG4gICAgYWRkVG9Qcm9qZWN0c0xpc3QobWFpblByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgaGlnaGxpZ2h0UHJvamVjdChtYWluUHJvamVjdCk7XG5cbiAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBtYWluUHJvamVjdC50b2RvcztcbiAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93LCB0b2Rvcyk7XG5cbiAgICBcblxuICAgIC8vIEFkZCBFdmVudCBMaXN0ZW5lcnMgZm9yIHRoZSBuZXcgdGFzayBmb3JtIGFuZCBjbG9zaW5nIGNvbmRpdGlvbnMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHRhc2tGdW5jdGlvbnMgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnN0IGFkZFRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRhc2snKTsgLy8gYnV0dG9uIHRoYXQgb3BlbnMgbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7IC8vIGZvcm0ncyBvdXRlciBkaXYgYmxvY2tcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7IC8vIG5ldyB0YXNrIGZvcm1cbiAgICAgICAgY29uc3QgY2xvc2VUYXNrV2luZG93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2Nsb3NpbmctYnV0dG9uJyk7IC8vIGNsb3NlIGZvcm0gYnV0dG9uXG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWJtaXQgYnV0dG9uJyk7IC8vIGZvcm0ncyBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGNvbnN0IGNsaWNrZWRPYmplY3QgPSBlLnRhcmdldDtcbiAgICAgICAgY29uc3QgY3VycmVudFRhc2tUb0VkaXQgPSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpOyAvLyB0aGlzIG5lZWQgdG8gb3BlbiBlZGl0IHRvZG8gZm9ybVxuICAgICAgICBjb25zdCBlZGl0Rm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICAgICAgY29uc3QgZWRpdEZvcm0gPSBlZGl0Rm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIGNvbnN0IGVkaXRGb3JtQ2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1mb3JtX19jbG9zaW5nLWJ1dHRvbicpO1xuICAgICAgICBjb25zdCBkZXRhaWxzV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlscycpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0Jyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RGb3JtID0gbmV3UHJvamVjdC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RDbG9zaW5nQnV0dG9uID0gbmV3UHJvamVjdC5xdWVyeVNlbGVjdG9yKCcubmV3LXByb2plY3RfX2Nsb3NpbmctYnV0dG9uJyk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IGdldEN1cnJlbnRQcm9qZWN0KHByb2plY3RzTGlzdCk7IFxuICAgICAgICB0b2RvcyA9IGN1cnJlbnRQcm9qZWN0LnRvZG9zO1xuXG4gICAgICAgIGlmICghbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7IC8vaWYgdGhlIG5ldyB0YXNrIGZvcm0gaXMgb3BlblxuICAgICAgICAgICAgaWYgKCBjbGlja2VkT2JqZWN0ID09IGNsb3NlVGFza1dpbmRvd0J1dHRvbiB8fCAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZm9ybScpICkgeyAvL2NoZWNrIGlmIGNsaWNrZWQgT2JqZWN0IGlzIHRoZSBcImNsb3NlIGZvcm1cIiBidXR0b24gb3IgaXMgbm90IGZvcm0gd2luZG93XG4gICAgICAgICAgICAgICAgaGlkZU5ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvcnMoZm9ybSk7IC8vcmVzZXQgZXJyb3IgcGFyYWdyYXBocyBpZiB0aGV5IGFyZSBleGlzdFxuICAgICAgICAgICAgfSBlbHNlIGlmIChjbGlja2VkT2JqZWN0ID09IHN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIGlzRm9ybVZhbGlkKGZvcm0pICkge1xuICAgICAgICAgICAgICAgICAgICBhZGRUb1RoZVRvZG9MaXN0KGZvcm0sIHRvZG9zKTsgLy8gY3JlYXRlcyBhbmQgaW5zZXJ0IG5ldyB0b2RvIGluIERPTVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyBuZWVkIHRvIGhpZ2hsaWdodCBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3NHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvLyBcImFsbCB0YXNrc1wiIGJ1dHRvbiBhZnRlclxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zKTtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBjbG9zZWRcbiAgICAgICAgICAgIGlmIChjbGlja2VkT2JqZWN0ID09IGFkZFRhc2tXaW5kb3dCdXR0b24pIHsgLy9jaGVjayBpZiBjbGlja2VkIE9iamVjdCBpcyBcImFkZCB0YXNrXCIgYnV0dG9uXG4gICAgICAgICAgICAgICAgc2hvd05ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIChjbGlja2VkT2JqZWN0ID09IGVkaXRGb3JtQ29udGFpbmVyICYmICFlZGl0Rm9ybUNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpICYmIFxuICAgICAgICAgICAgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLmVkaXQtdGFza19fZm9ybScpICkgfHwgY2xpY2tlZE9iamVjdCA9PSBlZGl0Rm9ybUNsb3NlQnV0dG9uKSB7IC8vIGlmIGVkaXQgZm9ybSBpcyBvcGVuLiBUaGVuIGNsb3NlIGJ1dHRvbiBjbGlja2VkXG4gICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgIGVkaXRGb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBkZXRhaWxzV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykgJiYgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnRhc2stZGV0YWlscycpICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbHNQcmlvcml0eSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fcHJpb3JpdHknKTtcbiAgICAgICAgICAgICAgICBpZiAoIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtcHJpb3JpdHlfX2xvdycpICkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LnJlbW92ZSgnZGV0YWlscy1wcmlvcml0eV9fbG93Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5jb250YWlucygnZGV0YWlscy1wcmlvcml0eV9fbWVkaXVtJykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWxzLXByaW9yaXR5X19tZWRpdW0nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRhaWxzLXByaW9yaXR5X19oaWdoJykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWxzLXByaW9yaXR5X19oaWdoJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRldGFpbHNXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLm5ldy1wcm9qZWN0JykgJiYgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLm5ldy1wcm9qZWN0IGZvcm0nKSB8fCBjbGlja2VkT2JqZWN0ID09IG5ld1Byb2plY3RDbG9zaW5nQnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRhc2tGdW5jdGlvbnMpO1xuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGFzayBncm91cHNcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vZ2V0IHNpZGViYXIgdGFzayBncm91cHNcblxuICAgIGNvbnN0IHRhc2tHcm91cHNGdW5jdGlvbnMgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIGlmIChjbGlja2VkT2JqZWN0ICE9IHRhc2tHcm91cHMpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCh0YXNrR3JvdXBzLCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRvZG9zRm9yU2hvdyA9IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwKGNsaWNrZWRPYmplY3QsIHRvZG9zKTtcbiAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2Rvc0ZvclNob3csIHRvZG9zLCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciBwcm9qZWN0c1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzJyk7XG4gICAgY29uc3QgY3JlYXRlUHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdF9fYWNjZXB0LXRpdGxlJyk7XG5cbiAgICBjb25zdCBwcm9qZWN0c0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBhZGRQcm9qZWN0QnV0dG9uID0gcHJvamVjdHMucXVlcnlTZWxlY3RvcignLnByb2plY3RzX19jcmVhdGUnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBhbGxQcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0cyB1bCBsaScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFkZFByb2plY3RCdXR0b24gJiYgYWRkUHJvamVjdEJ1dHRvbiA9PSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5wcm9qZWN0c19fY3JlYXRlJykpIHtcbiAgICAgICAgICAgIG5ld1Byb2plY3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnc2luZ2xlLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZE9iamVjdC50ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0UHJvamVjdChjdXJyZW50UHJvamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGN1cnJlbnRQcm9qZWN0LnRvZG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvamVjdHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcm9qZWN0c0Z1bmN0aW9ucyk7XG5cblxuICAgIGNvbnN0IGFkZFByb2plY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgcHJvamVjdFRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2plY3QtdGl0bGUnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBjdXJyZW50SGlnaGxpZ2h0ZWRQcm9qZWN0SW5ET00gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvc2VuLXByb2plY3QnKTtcbiAgICAgICAgY29uc3QgY2hvc2VuUHJvamVjdCA9IGdldENob3NlblByb2plY3QoY3VycmVudEhpZ2hsaWdodGVkUHJvamVjdEluRE9NLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICBcblxuICAgICAgICBpZiAoIHByb2plY3RUaXRsZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3ItcGFyYWdyYXBoLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2plY3RUaXRsZS52YWx1ZS50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHtcbiAgICAgICAgICAgICAgICB0aXRsZTogcHJvamVjdFRpdGxlLnZhbHVlLFxuICAgICAgICAgICAgICAgIHRvZG9zOiBbXSxcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWRkVG9Qcm9qZWN0c0xpc3QoY3VycmVudFByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICBzaG93QWxsUHJvamVjdHMocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QoY2hvc2VuUHJvamVjdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG5ld1Byb2plY3QuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgY3JlYXRlUHJvamVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFByb2plY3QpO1xuXG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==