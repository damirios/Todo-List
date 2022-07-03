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
/* harmony export */   "isTitleUsable": () => (/* binding */ isTitleUsable),
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
            if (currentProject.title == currentChosenProjectInDOM.dataset.title) {
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
            if (currentProject.dataset.title == project.title) {
                currentProject.classList.add('chosen-project');
            }
        }
    }
}

const isTitleUsable = function(projectTitle, projectsList) {
    for (let i = 0; i < projectsList.length; i++) {
        const project = projectsList[i];
        if (project.title == projectTitle) {
            return false;
        }
    }
    return true;
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
/* harmony export */   "deleteProject": () => (/* binding */ deleteProject),
/* harmony export */   "renameProject": () => (/* binding */ renameProject),
/* harmony export */   "showAllProjects": () => (/* binding */ showAllProjects),
/* harmony export */   "showAllTodos": () => (/* binding */ showAllTodos),
/* harmony export */   "todoFunctions": () => (/* binding */ todoFunctions)
/* harmony export */ });
/* harmony import */ var _domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulations */ "./src/modules/domManipulations.js");
/* harmony import */ var _appLogic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./appLogic */ "./src/modules/appLogic.js");
/* harmony import */ var _localStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./localStorage */ "./src/modules/localStorage.js");




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

const showAllTodos = function(todosForShow, allTodos, projectsList, clickedObject) {
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
                (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createTodoBlockInDOM)(todo, (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.isTodoExpired)(todo), projectsList, allTodos);
            }
        }
    }
}

const todoFunctions = function(todos, currentTodo, projectsList, e) {
    const clickedButton = e.target.closest('button'); // get clicked Button or null
    if (clickedButton) {
        if ( clickedButton.classList.contains('delete-todo') ) {
            (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.deleteTodo)(currentTodo, todos);
            (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
            showAllTodos(todos, todos, projectsList);
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
                        (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
                        showAllTodos(todos, todos, projectsList);
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

const renameProject = function(currentProject, projectsList) {
    
}

const deleteProject = function(clickedProject, projectsList) {
    if (projectsList.length > 0) {
        for (let i = 0; i < projectsList.length; i++) {
            const currentProject = projectsList[i];
            if (currentProject.title == clickedProject.dataset.title) {
                if (projectsList.length == 1) {
                    console.log("you can't delete the last project");
                } else {
                    projectsList.splice(i, 1);
                    (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
                    showAllProjects(projectsList);
                    (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.highlightProject)(projectsList[0]);
                    showAllTodos(projectsList[0].todos, projectsList[0].todos, projectsList);
                }
            }
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

const createTodoBlockInDOM = function(todoData, todoExpiredStatus, projectsList, todos) {
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
    buttons.addEventListener('click', _controller__WEBPACK_IMPORTED_MODULE_0__.todoFunctions.bind(buttons, todos, todoData, projectsList));

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
        if ( inputField.value.trim() == '' ) {
            errorParagraph.textContent = "Write project's name!";
        } else {
            errorParagraph.textContent = "Project with this name already exist!";
        }
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
    currentProject.dataset.title = project.title;
    
    if ( !project.nonremovable ) {
        const editButton = document.createElement('div');
        editButton.classList.add('edit-project-button');
        const editMenu = document.createElement('div');
        editMenu.classList.add('edit-project');
    
        const renameProject = document.createElement('p');
        renameProject.classList.add('rename-project');
        renameProject.textContent = 'Rename project';
        const deleteProject = document.createElement('p');
        deleteProject.classList.add('delete-project');
        deleteProject.textContent = 'Delete project';
    
        editMenu.appendChild(renameProject);
        editMenu.appendChild(deleteProject);
        editButton.appendChild(editMenu);
        currentProject.appendChild(editButton);
    }

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



/***/ }),

/***/ "./src/modules/localStorage.js":
/*!*************************************!*\
  !*** ./src/modules/localStorage.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getFromLocalStorage": () => (/* binding */ getFromLocalStorage),
/* harmony export */   "saveInLocalStorage": () => (/* binding */ saveInLocalStorage)
/* harmony export */ });
const saveInLocalStorage = function(projectsList) {
    let serialProjectsList = JSON.stringify(projectsList);
    localStorage.setItem('projectsList', serialProjectsList);
}

const getFromLocalStorage = function() {
    let projectsList = JSON.parse(localStorage.getItem('projectsList'));
    
    return projectsList;
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
/* harmony import */ var _modules_localStorage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modules/localStorage */ "./src/modules/localStorage.js");





(function() {
    let todos = [];
    let projectsList = [];
    
    // creating example todos ===================================================
    const firstTodo = {
        title: 'Call to Irina',
        description: 'I have to call to Irina and know where she is.',
        dueDate: '2022-07-17',
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
    
    // localStorage.clear();
    // console.log( JSON.parse(localStorage.getItem('undefined')) );

    if ( !JSON.parse(localStorage.getItem('projectsList')) ) {
        console.log('You are first time here. Or something went wrong with Local Storage. So we show standart projects. \
        You should write me (damirios). Sorry(');
        const mainProject = {
            title: 'Main',
            todos: todos,
            nonremovable: true,
        };
        (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToProjectsList)(mainProject, projectsList);
        (0,_modules_localStorage__WEBPACK_IMPORTED_MODULE_3__.saveInLocalStorage)(projectsList);
    } else {    
        projectsList = (0,_modules_localStorage__WEBPACK_IMPORTED_MODULE_3__.getFromLocalStorage)();
    }

    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllProjects)(projectsList);
    (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(projectsList[0]);
    todos = projectsList[0].todos;

    const todosForShow = projectsList[0].todos;
    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, todos, projectsList);

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
        const activeEditProjectMenu = document.querySelector('.active-edit-menu');
        
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
                    (0,_modules_localStorage__WEBPACK_IMPORTED_MODULE_3__.saveInLocalStorage)(projectsList); // save new Todo through projectsList in localStorage

                    const allTasks = document.querySelector('.all-tasks'); // these three lines need to highlight 
                    const tasksGroup = document.querySelector('.tasks ul'); // "all tasks" button after
                    (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightChosenTaskGroup)(tasksGroup, allTasks); // creating a new task
                    
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos, projectsList);
                    (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                    form.reset();
                }
            }
        } else { //if the new task form is closed

            if ( activeEditProjectMenu && clickedObject.closest('.edit-project') != activeEditProjectMenu ) {
                activeEditProjectMenu.classList.remove('active-edit-menu');
            }

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
            (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, todos, projectsList, clickedObject);
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
                    if (currentProject.title == clickedObject.dataset.title) {
                        (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(currentProject);

                        const allTasks = document.querySelector('.all-tasks'); // these three lines need to highlight 
                        const tasksGroup = document.querySelector('.tasks ul'); // "all tasks" button after
                        (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightChosenTaskGroup)(tasksGroup, allTasks); // creating a new task

                        todos = currentProject.todos;
                        (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos, projectsList);
                    }
                }
            }
        } else if ( clickedObject.classList.contains('edit-project-button') ) {
            const clickedProject = clickedObject.closest('.single-project');
            const projectEditMenu = clickedObject.querySelector('.edit-project');
            projectEditMenu.classList.add('active-edit-menu');

            if (projectsList.length > 0) {
                for (let i = 0; i < projectsList.length; i++) {
                    const currentProject = projectsList[i];
                    if (currentProject.title == clickedProject.dataset.title) {
                        (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(currentProject);

                        todos = currentProject.todos;
                        (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos, projectsList);
                    }
                }
            }
        } else if ( clickedObject.closest('.active-edit-menu') ) {
            const clickedProject = clickedObject.closest('.single-project');

            if ( clickedObject.classList.contains('delete-project') ) {
                (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.deleteProject)(clickedProject, projectsList); // CREATE THIS FUNCTION!!!!
            } else if ( clickedObject.classList.contains('rename-project') ) {
                (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.renameProject)(clickedProject, projectsList); // CREATE THIS FUNCTION!!!!
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
            if ( (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.isTitleUsable)(projectTitle.value, projectsList) ) {
                const currentProject = {
                    title: projectTitle.value,
                    todos: [],
                    nonremovable: false,
                }
    
                ;(0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToProjectsList)(currentProject, projectsList);
                (0,_modules_localStorage__WEBPACK_IMPORTED_MODULE_3__.saveInLocalStorage)(projectsList);
                (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllProjects)(projectsList);
                console.log(currentHighlightedProjectInDOM);
                (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightProject)(chosenProject);
                
                newProject.classList.add('hidden');
                newProjectForm.classList.add('hidden-form');
                newProjectForm.reset();
            } else {
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(projectTitle);
                projectTitle.classList.add('invalid');
            }
        }
        
    }
    createProjectButton.addEventListener('click', addProject);

})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG1FQUFnQjtBQUM5Qzs7QUFFQTtBQUNBLFlBQVksK0VBQW9CO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLCtFQUFvQjtBQUNoQzs7QUFFQSxVQUFVO0FBQ1YsaUJBQWlCLGdFQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix1RUFBaUI7QUFDakMsZ0JBQWdCLHlFQUFrQjtBQUNsQyxnQkFBZ0Isb0VBQWU7QUFDL0I7QUFDQSxnQkFBZ0IsbUVBQWdCO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGdCQUFnQiwrRUFBb0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUMsSSIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2FwcExvZ2ljLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvZG9tTWFuaXB1bGF0aW9ucy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9sb2NhbFN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuXG5jb25zdCB0b2RvRmFjdG9yeSA9IGZ1bmN0aW9uKGZvcm0sIGNoZWNrU3RhdHVzKSB7XG4gICAgbGV0IHRvZG9PYmplY3QgPSB7fTsgLy8gb2JqZWN0IHRoYXQgY29sbGVjdHMgaW5mbyBmcm9tIG5ldyB0YXNrIGZvcm0hXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gZm9ybS5lbGVtZW50cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1FbGVtZW50cy5sZW5ndGggLSAxOyBpKyspIHsgLy8gYWxsIGZpZWxkcyBleGNlcHQgc3VibWl0IGJ1dHRvblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZm9ybUVsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoZWxlbWVudC5uYW1lID09ICd0aXRsZScgfHwgZWxlbWVudC5uYW1lID09ICdkZXNjcmlwdGlvbicpIHtcbiAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09ICdwcmlvcml0eScgJiYgZWxlbWVudC5jaGVja2VkKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlkID09ICdlZGl0LWxvdycpIHsgLy90aGVzZSBjaGVja3MgZm9yIGVkaXQtLi4uIG5lZWRzIHRvIHNob3cgcHJpb3JpdHkgLSBlZGl0Rm9ybSBwcmlvcml0eSBidXR0b25zIGlkJ3MgZGlmZmVyIG5ld1Rhc2tGb3JtJ3MgKG9idmlvdXNseSlcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnbG93JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1tZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ21lZGl1bSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtaGlnaCcpIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnaGlnaCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZG9PYmplY3QuY2hlY2sgPSBjaGVja1N0YXR1cztcbiAgICByZXR1cm4gdG9kb09iamVjdDtcbn1cblxuY29uc3QgaXNGb3JtVmFsaWQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0udGl0bGU7XG4gICAgY29uc3QgZHVlRGF0ZUlucHV0ID0gZm9ybS5kdWVEYXRlO1xuICAgIGNvbnN0IHByaW9yaXR5SW5wdXRzID0gZm9ybS5wcmlvcml0eTsgXG4gICAgLy8gY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjdGl0bGUnKTtcbiAgICAvLyBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I2R1ZURhdGUnKTtcbiAgICAvLyBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1wcmlvcml0eV0nKTtcbiAgICBjb25zdCBwcmlvcml0eUJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eV9fYnV0dG9ucywgLmVkaXQtZm9ybS1wcmlvcml0eV9fYnV0dG9ucycpO1xuXG4gICAgbGV0IHZhbGlkUHJpb3JpdHk7XG4gICAgbGV0IHByaW9yaXR5Q2hlY2sgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByaW9yaXR5SW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcmlvcml0eUlucHV0ID0gcHJpb3JpdHlJbnB1dHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50UHJpb3JpdHlJbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICBwcmlvcml0eUNoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwcmlvcml0eUNoZWNrICYmICFwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByaW9yaXR5SW5wdXRzWzBdKTtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocHJpb3JpdHlDaGVjaykge1xuICAgICAgICB2YWxpZFByaW9yaXR5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yLXBhcmFncmFwaCcpKSB7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWREdWVEYXRlO1xuICAgIGlmIChkdWVEYXRlSW5wdXQudmFsdWUudHJpbSgpID09ICcnKSB7XG4gICAgICAgIHZhbGlkRHVlRGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSB0cnVlO1xuICAgICAgICBpZiAoZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB2YWxpZFRpdGxlO1xuICAgIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJyAmJiAhdGl0bGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIHRpdGxlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgdmFsaWRUaXRsZSA9IGZhbHNlO1xuXG4gICAgfSBlbHNlIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZFRpdGxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIHRpdGxlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YWxpZCA9IHZhbGlkUHJpb3JpdHkgJiYgdmFsaWREdWVEYXRlICYmIHZhbGlkVGl0bGU7XG4gICAgcmV0dXJuIHZhbGlkO1xufVxuXG5jb25zdCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAgPSBmdW5jdGlvbih0YXNrR3JvdXBzLCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY29uc3QgdGFza0dyb3Vwc0VsZW1lbnRzID0gdGFza0dyb3Vwcy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza0dyb3Vwc0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrR3JvdXAgPSB0YXNrR3JvdXBzRWxlbWVudHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50VGFza0dyb3VwID09IGNsaWNrZWRPYmplY3QgJiYgIWN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRhc2tHcm91cCAhPSBjbGlja2VkT2JqZWN0ICYmIGN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5yZW1vdmUoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNvcnRDdXJyZW50VG9kbyA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG8pIHtcbiAgICBjb25zdCBjdXJyZW50RGF0ZUFuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGVBbmRUaW1lLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBbmRUaW1lLmdldERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50SG91cnMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0SG91cnMoKTtcbiAgICBjb25zdCBjdXJyZW50TWludXRlcyA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNaW51dGVzKCk7XG4gICAgY29uc3QgY3VycmVudFNlY29uZHMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0U2Vjb25kcygpO1xuXG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsIHRvZG9Nb250aCAtIDEsIHRvZG9EYXRlKTsgLy9EYXRlIE9iaiBmb3IgdG9kb1xuXG4gICAgaWYgKGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2RheScpKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRvZGF5XCJcbiAgICAgICAgaWYgKCBpc1RvZGF5KHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlZWsnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwidGhpcyB3ZWVrXCJcbiAgICAgICAgaWYgKCBpc1dlZWsodG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ21vbnRoJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcIm1vbnRoXCJcbiAgICAgICAgaWYgKCBpc01vbnRoKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbGwtdGFza3MnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwiYWxsIHRhc2tzXCJcbiAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgfVxufVxuXG5jb25zdCBpc1RvZGF5ID0gZnVuY3Rpb24odG9kb1llYXIsIHRvZG9Nb250aCwgdG9kb0RhdGUsIGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXRlKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGV4cGlyZWQgdG9kYXlcbiAgICBpZiAoIHRvZG9ZZWFyID09IGN1cnJlbnRZZWFyICYmIHRvZG9Nb250aCA9PSBjdXJyZW50TW9udGggJiYgdG9kb0RhdGUgPT0gY3VycmVudERhdGUgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzV2VlayA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIHdlZWtcbiAgICBjb25zdCBkaWZmZXJlbmNlSW5EYXlzID0gKHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVBbmRUaW1lKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KTtcbiAgICBpZiAoZGlmZmVyZW5jZUluRGF5cyA8PSA3ICYmIGRpZmZlcmVuY2VJbkRheXMgPj0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaXNNb250aCA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIG1vbnRoXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkgKyAxO1xuICAgIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMiAmJiBkaWZmZXJlbmNlSW5EYXlzID49IDApIHtcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoIGN1cnJlbnRNb250aCA9PSAxIHx8IGN1cnJlbnRNb250aCA9PSAzIHx8IGN1cnJlbnRNb250aCA9PSA1IHx8IGN1cnJlbnRNb250aCA9PSA3IHx8IGN1cnJlbnRNb250aCA9PSA4IHx8IGN1cnJlbnRNb250aCA9PSAxMCB8fCBjdXJyZW50TW9udGggPT0gMTIgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMSAmJiAoY3VycmVudE1vbnRoID09IDQgfHwgY3VycmVudE1vbnRoID09IDYgfHwgY3VycmVudE1vbnRoID09IDkgfHwgY3VycmVudE1vbnRoID09IDExKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCAgY3VycmVudE1vbnRoID09IDIgJiYgKGRpZmZlcmVuY2VJbkRheXMgPD0gKDI5ICsgaXNMZWFwWWVhcihjdXJyZW50WWVhcikpKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaXNMZWFwWWVhciA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICBpZiAoeWVhciAlIDQgPT0gMCkge1xuICAgICAgICBpZiAoeWVhciAlIDEwMCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoeWVhciAlIDQwMCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5cbmNvbnN0IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCwgdG9kb3MpIHtcbiAgICBcbiAgICBsZXQgdG9kb0xpc3RUb1Nob3cgPSBbXTsgLy9jdXJyZW50IHRvZG9MaXN0IHRoYXQgd2UgZ29pbmcgdG8gc2hvdywgd2UnbGwgZmlsbCBpdFxuICAgIGlmICh0b2Rvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFRvZG8gPSBzb3J0Q3VycmVudFRvZG8oY2xpY2tlZE9iamVjdCwgdG9kbyk7IC8vZWl0aGVyIHJldHVybiB0b2RvIG9yIG51bGxcbiAgICAgICAgICAgIHRvZG9MaXN0VG9TaG93LnB1c2goc29ydGVkVG9kbyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvZG9MaXN0VG9TaG93O1xufVxuXG5jb25zdCBpc1RvZG9FeHBpcmVkID0gZnVuY3Rpb24odG9kbykge1xuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCArdG9kb01vbnRoIC0gMSwgK3RvZG9EYXRlICsxICk7XG4gICAgY29uc3QgY3VycmVudERhdGVPYmogPSBuZXcgRGF0ZSgpO1xuICAgIGlmICggdG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZU9iaiA8IDAgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGFkZEV4cGlyYXRpb25TdGF0dXMgPSBmdW5jdGlvbih0b2Rvcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdG9kbyA9IHRvZG9zW2ldO1xuICAgICAgICBpZiAodG9kbykge1xuICAgICAgICAgICAgdG9kby5leHBpcmVkID0gaXNUb2RvRXhwaXJlZCh0b2RvKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgZGVsZXRlVG9kbyA9IGZ1bmN0aW9uKGN1cnJlbnRUb2RvLCB0b2Rvcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCB0b2Rvc1tpXSA9PSBjdXJyZW50VG9kbyApIHtcbiAgICAgICAgICAgIHRvZG9zLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgZ2V0Q2hhbmdlZFRvZG9zID0gZnVuY3Rpb24odG9kbywgdG9kb3MsIGVkaXRGb3JtKSB7XG4gICAgY29uc29sZS5sb2codG9kbyk7XG4gICAgY29uc29sZS5sb2codG9kb3MpO1xuICAgIGNvbnNvbGUubG9nKGVkaXRGb3JtKTtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZWRpdEZvcm0sIHRvZG8uY2hlY2spO1xuICAgIGNvbnN0IHRvZG9JbmRleFRvUmVwbGFjZSA9IHRvZG9zLmluZGV4T2YodG9kbyk7XG5cbiAgICBpZiAodG9kb0luZGV4VG9SZXBsYWNlICE9IC0xKSB7XG4gICAgICAgIHRvZG9zW3RvZG9JbmRleFRvUmVwbGFjZV0gPSBuZXdUb2RvO1xuICAgIH1cbiAgICByZXR1cm4gdG9kb3M7XG59XG5cbmNvbnN0IGdldEN1cnJlbnRQcm9qZWN0ID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXByb2plY3QnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICggcHJvamVjdHNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tcHJvamVjdCcpICkge1xuICAgICAgICAgICAgcmV0dXJuIHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgZ2V0Q2hvc2VuUHJvamVjdCA9IGZ1bmN0aW9uKGN1cnJlbnRDaG9zZW5Qcm9qZWN0SW5ET00sIHByb2plY3RzTGlzdCkge1xuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY3VycmVudENob3NlblByb2plY3RJbkRPTS5kYXRhc2V0LnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9qZWN0O1xuICAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgaGlnaGxpZ2h0UHJvamVjdCA9IGZ1bmN0aW9uKHByb2plY3QpIHtcbiAgICBjb25zdCBhbGxQcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtcHJvamVjdCcpO1xuICAgIGlmIChhbGxQcm9qZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsUHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gYWxsUHJvamVjdHNbaV07XG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tcHJvamVjdCcpO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LmRhdGFzZXQudGl0bGUgPT0gcHJvamVjdC50aXRsZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LmNsYXNzTGlzdC5hZGQoJ2Nob3Nlbi1wcm9qZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGlzVGl0bGVVc2FibGUgPSBmdW5jdGlvbihwcm9qZWN0VGl0bGUsIHByb2plY3RzTGlzdCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgIGlmIChwcm9qZWN0LnRpdGxlID09IHByb2plY3RUaXRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5cbmV4cG9ydCB7dG9kb0ZhY3RvcnksIGlzRm9ybVZhbGlkLCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAsIHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwLCBpc1RvZG9FeHBpcmVkLCBhZGRFeHBpcmF0aW9uU3RhdHVzLCBkZWxldGVUb2RvLCBcbiAgICBnZXRDaGFuZ2VkVG9kb3MsIGdldEN1cnJlbnRQcm9qZWN0LCBnZXRDaG9zZW5Qcm9qZWN0LCBoaWdobGlnaHRQcm9qZWN0LCBpc1RpdGxlVXNhYmxlfSIsImltcG9ydCB7Y3JlYXRlVG9kb0Jsb2NrSW5ET00sIGNsZWFyVG9kb0NvbnRhaW5lciwgc2hvd1RvZG9Hcm91cFRpdGxlLCBvcGVuRWRpdEZvcm0sIGZpbGxFZGl0Rm9ybSwgY2xvc2VFZGl0Rm9ybSwgb3BlbkRldGFpbHNXaW5kb3csIGFkZFByb2plY3RET00sIGNsZWFyUHJvamVjdHNNZW51fSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHt0b2RvRmFjdG9yeSwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgaXNGb3JtVmFsaWQsIGdldENoYW5nZWRUb2RvcywgaGlnaGxpZ2h0UHJvamVjdH0gZnJvbSAnLi9hcHBMb2dpYyc7XG5pbXBvcnQgeyBzYXZlSW5Mb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IGFkZFRvVGhlVG9kb0xpc3QgPSBmdW5jdGlvbihmb3JtLCB0b2Rvcykge1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShmb3JtKTtcbiAgICB0b2Rvcy5wdXNoKG5ld1RvZG8pO1xufVxuXG5jb25zdCBjb21wYXJlRnVuY3Rpb24gPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7IC8vIHNvcnQgYnkgcHJpb3JpdHkgb2YgdG9kbyBhbmQgZXhwaXJlZCB0b2RvcyB3aWxsIGJlIGluIHRoZSBib3R0b20uIEFsc28gbW9zdCB1cmdlIHRvZG9zIHdpbGwgYmUgaW4gZmlyc3QgcGxhY2VcbiAgICBpZiAoZmlyc3QgJiYgc2Vjb25kKSB7XG5cbiAgICAgICAgY29uc3QgY29tcGFyZURhdGVzID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlID0gZmlyc3QuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZSA9IHNlY29uZC5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdERhdGVPYmogPSBuZXcgRGF0ZSggZmlyc3REYXRlWzBdLCBmaXJzdERhdGVbMV0sIGZpcnN0RGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZU9iaiA9IG5ldyBEYXRlKCBzZWNvbmREYXRlWzBdLCBzZWNvbmREYXRlWzFdLCBzZWNvbmREYXRlWzJdICk7XG4gICAgICAgICAgICBjb25zdCBkYXRlRGlmZmVyZW5jZSA9IGZpcnN0RGF0ZU9iaiAtIHNlY29uZERhdGVPYmo7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wYXJlUHJpb3JpdHkgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpcnN0LmV4cGlyZWQpIHtcbiAgICAgICAgICAgIGlmIChzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3Qgc2hvd0FsbFRvZG9zID0gZnVuY3Rpb24odG9kb3NGb3JTaG93LCBhbGxUb2RvcywgcHJvamVjdHNMaXN0LCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY2xlYXJUb2RvQ29udGFpbmVyKCk7IC8vIGNsZWFycyB0b2RvIGNvbnRhaW5lciBvZiBhbGwgdGFza3MgYW5kIHRoZW4gd2Ugd2lsbCBjcmVhdGUgaXQgYWdhaW4gd2l0aCBjaG9zZW4gcGFyYW1ldGVyc1xuICAgIGlmIChjbGlja2VkT2JqZWN0KSB7XG4gICAgICAgIHNob3dUb2RvR3JvdXBUaXRsZShjbGlja2VkT2JqZWN0KTtcbiAgICB9XG5cbiAgICBpZiAodG9kb3NGb3JTaG93ICYmIHRvZG9zRm9yU2hvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFkZEV4cGlyYXRpb25TdGF0dXModG9kb3NGb3JTaG93KTtcbiAgICAgICAgdG9kb3NGb3JTaG93LnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3NGb3JTaG93Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NGb3JTaG93W2ldO1xuICAgICAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVUb2RvQmxvY2tJbkRPTSh0b2RvLCBpc1RvZG9FeHBpcmVkKHRvZG8pLCBwcm9qZWN0c0xpc3QsIGFsbFRvZG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgdG9kb0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKHRvZG9zLCBjdXJyZW50VG9kbywgcHJvamVjdHNMaXN0LCBlKSB7XG4gICAgY29uc3QgY2xpY2tlZEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbicpOyAvLyBnZXQgY2xpY2tlZCBCdXR0b24gb3IgbnVsbFxuICAgIGlmIChjbGlja2VkQnV0dG9uKSB7XG4gICAgICAgIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RlbGV0ZS10b2RvJykgKSB7XG4gICAgICAgICAgICBkZWxldGVUb2RvKGN1cnJlbnRUb2RvLCB0b2Rvcyk7XG4gICAgICAgICAgICBzYXZlSW5Mb2NhbFN0b3JhZ2UocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGdldENoYW5nZWRUb2Rvcyh0b2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdENoYW5nZXNCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja0V2ZW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IGVkaXRCdXR0b25DbGFzcyhjdXJyZW50VG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtdG9kbycpICkge1xuICAgICAgICAgICAgb3BlbkRldGFpbHNXaW5kb3coY3VycmVudFRvZG8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0b2RvcyB0byBpbmRleC5qc1xuICAgIH1cbn1cblxuY29uc3QgYWRkVG9Qcm9qZWN0c0xpc3QgPSBmdW5jdGlvbihwcm9qZWN0LCBwcm9qZWN0c0xpc3QpIHtcbiAgICBwcm9qZWN0c0xpc3QucHVzaChwcm9qZWN0KTtcbn1cblxuY29uc3Qgc2hvd0FsbFByb2plY3RzID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG5cbiAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJQcm9qZWN0c01lbnUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBhZGRQcm9qZWN0RE9NKHByb2plY3QpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCByZW5hbWVQcm9qZWN0ID0gZnVuY3Rpb24oY3VycmVudFByb2plY3QsIHByb2plY3RzTGlzdCkge1xuICAgIFxufVxuXG5jb25zdCBkZWxldGVQcm9qZWN0ID0gZnVuY3Rpb24oY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCkge1xuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ5b3UgY2FuJ3QgZGVsZXRlIHRoZSBsYXN0IHByb2plY3RcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdHNMaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxQcm9qZWN0cyhwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRQcm9qZWN0KHByb2plY3RzTGlzdFswXSk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyhwcm9qZWN0c0xpc3RbMF0udG9kb3MsIHByb2plY3RzTGlzdFswXS50b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zLCB0b2RvRnVuY3Rpb25zLCBhZGRUb1Byb2plY3RzTGlzdCwgc2hvd0FsbFByb2plY3RzLCByZW5hbWVQcm9qZWN0LCBkZWxldGVQcm9qZWN0fTsiLCJpbXBvcnQgeyB0b2RvRnVuY3Rpb25zIH0gZnJvbSBcIi4vY29udHJvbGxlclwiO1xuXG5jb25zdCBjaGFuZ2VUb2RvU3RhdHVzID0gZnVuY3Rpb24odG9kb0RhdGEpIHtcbiAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5jaGVjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtdG9kbycpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hvd05ld1Rhc2tXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvd0Zvcm0gPSBuZXdUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xufVxuXG5jb25zdCBoaWRlTmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmNvbnN0IGNyZWF0ZVRvZG9CbG9ja0luRE9NID0gZnVuY3Rpb24odG9kb0RhdGEsIHRvZG9FeHBpcmVkU3RhdHVzLCBwcm9qZWN0c0xpc3QsIHRvZG9zKSB7XG4gICAgLy8gY29uc29sZS5sb2codG9kb3MpO1xuICAgIGNvbnN0IHRhc2tzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3Rhc2tzJyk7XG5cbiAgICBjb25zdCB0b2RvQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnc2luZ2xlLXRvZG8nKTtcbiAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCh0b2RvRGF0YS5wcmlvcml0eSk7XG5cbiAgICBpZiAodG9kb0V4cGlyZWRTdGF0dXMpIHtcbiAgICAgICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ2V4cGlyZWQnKTtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0b2RvRGF0YS50aXRsZTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0b2RvX190aXRsZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICBjb25zdCBkdWVEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZHVlRGF0ZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLmR1ZURhdGU7XG4gICAgZHVlRGF0ZS5jbGFzc0xpc3QuYWRkKCd0b2RvX19kdWUtZGF0ZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZChkdWVEYXRlKTtcblxuXG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgndG9kb19fYnV0dG9ucycpO1xuXG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRldGFpbHMudGV4dENvbnRlbnQgPSAnZGV0YWlscyc7XG4gICAgZGV0YWlscy5jbGFzc0xpc3QuYWRkKCdkZXRhaWxzLXRvZG8nKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuXG4gICAgY29uc3QgZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVkaXRJbWFnZS5zcmMgPSAnLi9pbWFnZXMvaWNvbnMvZWRpdC5zdmcnO1xuICAgIGVkaXQuYXBwZW5kQ2hpbGQoZWRpdEltYWdlKTtcbiAgICBlZGl0LmNsYXNzTGlzdC5hZGQoJ2VkaXQtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZWRpdCk7XG5cbiAgICBjb25zdCBkZWxldGVUb2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlVG9kb0ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZGVsZXRlVG9kb0ltYWdlLnNyYyA9ICcuL2ltYWdlcy9pY29ucy9kZWxldGUuc3ZnJztcbiAgICBkZWxldGVUb2RvLmFwcGVuZENoaWxkKGRlbGV0ZVRvZG9JbWFnZSk7XG4gICAgZGVsZXRlVG9kby5jbGFzc0xpc3QuYWRkKCdkZWxldGUtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGVsZXRlVG9kbyk7XG4gICAgYnV0dG9ucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZG9GdW5jdGlvbnMuYmluZChidXR0b25zLCB0b2RvcywgdG9kb0RhdGEsIHByb2plY3RzTGlzdCkpO1xuXG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGJ1dHRvbnMpO1xuXG5cbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcbiAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBjaGVja2JveC5jbGFzc0xpc3QuYWRkKCd0b2RvX19jaGVja2JveCcpO1xuICAgIGlmICh0b2RvRGF0YS5jaGVjayA9PSB0cnVlKSB7XG4gICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICBjaGVja2JveC5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlVG9kb1N0YXR1cy5iaW5kKGNoZWNrYm94LCB0b2RvRGF0YSkpO1xuXG4gICAgdG9kb0Jsb2NrLmRhdGFzZXQudGl0bGUgPSB0b2RvRGF0YS50aXRsZTtcbiAgICB0YXNrc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2RvQmxvY2spOyAvLyBhZGRpbmcgbmV3IHRvZG9CbG9jayBpbnRvIHRhc2tzIGNvbnRhaW5lclxufVxuXG5jb25zdCBjbGVhclRvZG9Db250YWluZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjdXJyZW50VG9kb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXRvZG8nKTtcbiAgICBjdXJyZW50VG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgdG9kby5yZW1vdmUoKTtcbiAgICB9KTtcbn1cblxuY29uc3QgY3JlYXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkLCBwcm9qZWN0T3JOb3QpIHtcbiAgICBjb25zdCBlcnJvclBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAnZHVlRGF0ZScpIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXBhcmFncmFwaF9fc2hpZnRlZCcpO1xuICAgIH1cblxuICAgIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ3ByaW9yaXR5Jykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnQ2hvb3NlIHByaW9yaXR5IG9mIHRoZSB0YXNrJztcbiAgICB9IGVsc2UgaWYgKGlucHV0RmllbGQubmFtZSA9PSAnZHVlRGF0ZScpIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ0Nob29zZSBkdWUgZGF0ZSBvZiB0aGUgdGFzayc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ1RoaXMgZmllbGQgbXVzdCBiZSBmaWxsZWQnO1xuICAgIH1cblxuICAgIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ3Byb2plY3RUaXRsZScpIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LnJlbW92ZSgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXBhcmFncmFwaC1wcm9qZWN0Jyk7XG4gICAgICAgIGlmICggaW5wdXRGaWVsZC52YWx1ZS50cmltKCkgPT0gJycgKSB7XG4gICAgICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9IFwiV3JpdGUgcHJvamVjdCdzIG5hbWUhXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9IFwiUHJvamVjdCB3aXRoIHRoaXMgbmFtZSBhbHJlYWR5IGV4aXN0IVwiO1xuICAgICAgICB9XG4gICAgfVxuIFxuICAgIGlucHV0RmllbGQuYmVmb3JlKGVycm9yUGFyYWdyYXBoKTtcbn1cblxuY29uc3QgZGVsZXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkKSB7XG4gICAgaW5wdXRGaWVsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xufVxuXG5jb25zdCByZXNldEVycm9ycyA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICBjb25zdCBlcnJvcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5lcnJvci1wYXJhZ3JhcGgnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvcnNbaV0ucmVtb3ZlKCk7XG4gICAgfVxuICAgIGNvbnN0IGVycm9yQm9yZGVycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmludmFsaWQnKTsgLy9nZXQgaW5wdXRzIHdpdGggXCJpbnZhbGlkXCIgY2xhc3NcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yQm9yZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvckJvcmRlcnNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hvd1RvZG9Hcm91cFRpdGxlID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IGN1cnJlbnRUaXRsZSA9IGNsaWNrZWRPYmplY3QudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgdGl0bGVET01FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RpdGxlJyk7XG4gICAgdGl0bGVET01FbGVtZW50LnRleHRDb250ZW50ID0gY3VycmVudFRpdGxlO1xufVxuXG5jb25zdCBvcGVuRWRpdEZvcm0gPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvd0Zvcm0gPSBlZGl0VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrX19mb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgZWRpdFRhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG5cbiAgICByZXR1cm4gZWRpdFRhc2tXaW5kb3dGb3JtO1xufVxuXG5jb25zdCBmaWxsRWRpdEZvcm0gPSBmdW5jdGlvbih0b2RvLCBmb3JtKSB7XG4gICAgLy8gY29uc29sZS5sb2codG9kbyk7XG4gICAgLy8gY29uc29sZS5sb2coZm9ybSk7XG4gICAgZm9ybS50aXRsZS52YWx1ZSA9IHRvZG8udGl0bGU7XG4gICAgZm9ybS5kZXNjcmlwdGlvbi52YWx1ZSA9IHRvZG8uZGVzY3JpcHRpb247XG4gICAgZm9ybS5kdWVEYXRlLnZhbHVlID0gdG9kby5kdWVEYXRlO1xuXG4gICAgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ2xvdycpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1sb3cnKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ21lZGl1bScpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1tZWRpdW0nKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ2hpZ2gnKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtaGlnaCcpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cblxufVxuXG5jb25zdCBjbG9zZUVkaXRGb3JtID0gZnVuY3Rpb24odG9kbykge1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93Rm9ybSA9IGVkaXRUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvd0Zvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3Qgb3BlbkRldGFpbHNXaW5kb3cgPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgZGV0YWlsc1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHMnKTtcbiAgICBkZXRhaWxzV2luZG93LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgY29uc3QgdGl0bGUgPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX3RpdGxlJyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0b2RvLnRpdGxlO1xuICAgIFxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX19kZXNjcmlwdGlvbicpO1xuICAgIGRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gJ0Rlc2NyaXB0aW9uOiAnICsgdG9kby5kZXNjcmlwdGlvbjtcblxuICAgIGNvbnN0IGR1ZURhdGUgPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX2R1ZURhdGUnKTtcbiAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gJ0R1ZSBkYXRlOiAnICsgdG9kby5kdWVEYXRlO1xuXG4gICAgY29uc3QgcHJpb3JpdHkgPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX3ByaW9yaXR5Jyk7XG4gICAgcHJpb3JpdHkudGV4dENvbnRlbnQgPSAnUHJpb3JpdHk6ICcgKyB0b2RvLnByaW9yaXR5O1xuICAgIHByaW9yaXR5LmNsYXNzTGlzdC5hZGQoJ2RldGFpbHMtcHJpb3JpdHlfXycgKyB0b2RvLnByaW9yaXR5KTtcbn1cblxuY29uc3QgYWRkUHJvamVjdERPTSA9IGZ1bmN0aW9uKHByb2plY3QpIHtcbiAgICBjb25zdCBwcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cyB1bCcpO1xuICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBjdXJyZW50UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdzaW5nbGUtcHJvamVjdCcpO1xuICAgIGN1cnJlbnRQcm9qZWN0LnRleHRDb250ZW50ID0gcHJvamVjdC50aXRsZTtcbiAgICBjdXJyZW50UHJvamVjdC5kYXRhc2V0LnRpdGxlID0gcHJvamVjdC50aXRsZTtcbiAgICBcbiAgICBpZiAoICFwcm9qZWN0Lm5vbnJlbW92YWJsZSApIHtcbiAgICAgICAgY29uc3QgZWRpdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlZGl0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2VkaXQtcHJvamVjdC1idXR0b24nKTtcbiAgICAgICAgY29uc3QgZWRpdE1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZWRpdE1lbnUuY2xhc3NMaXN0LmFkZCgnZWRpdC1wcm9qZWN0Jyk7XG4gICAgXG4gICAgICAgIGNvbnN0IHJlbmFtZVByb2plY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIHJlbmFtZVByb2plY3QuY2xhc3NMaXN0LmFkZCgncmVuYW1lLXByb2plY3QnKTtcbiAgICAgICAgcmVuYW1lUHJvamVjdC50ZXh0Q29udGVudCA9ICdSZW5hbWUgcHJvamVjdCc7XG4gICAgICAgIGNvbnN0IGRlbGV0ZVByb2plY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICAgIGRlbGV0ZVByb2plY3QuY2xhc3NMaXN0LmFkZCgnZGVsZXRlLXByb2plY3QnKTtcbiAgICAgICAgZGVsZXRlUHJvamVjdC50ZXh0Q29udGVudCA9ICdEZWxldGUgcHJvamVjdCc7XG4gICAgXG4gICAgICAgIGVkaXRNZW51LmFwcGVuZENoaWxkKHJlbmFtZVByb2plY3QpO1xuICAgICAgICBlZGl0TWVudS5hcHBlbmRDaGlsZChkZWxldGVQcm9qZWN0KTtcbiAgICAgICAgZWRpdEJ1dHRvbi5hcHBlbmRDaGlsZChlZGl0TWVudSk7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LmFwcGVuZENoaWxkKGVkaXRCdXR0b24pO1xuICAgIH1cblxuICAgIHByb2plY3RzLmFwcGVuZENoaWxkKGN1cnJlbnRQcm9qZWN0KTsgXG59XG5cbmNvbnN0IGNsZWFyUHJvamVjdHNNZW51ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcHJvamVjdHNMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzIHVsJyk7XG4gICAgY29uc3QgcHJvamVjdHMgPSBwcm9qZWN0c0xpc3QucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgICBpZiAocHJvamVjdHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0VG9SZW1vdmUgPSBwcm9qZWN0c1tpXTsgXG4gICAgICAgICAgICBwcm9qZWN0c0xpc3QucmVtb3ZlQ2hpbGQocHJvamVjdFRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIGNyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIGNyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaCwgcmVzZXRFcnJvcnMsXG5zaG93VG9kb0dyb3VwVGl0bGUsIG9wZW5FZGl0Rm9ybSwgY2xvc2VFZGl0Rm9ybSwgZmlsbEVkaXRGb3JtLCBvcGVuRGV0YWlsc1dpbmRvdywgYWRkUHJvamVjdERPTSwgY2xlYXJQcm9qZWN0c01lbnV9OyIsImNvbnN0IHNhdmVJbkxvY2FsU3RvcmFnZSA9IGZ1bmN0aW9uKHByb2plY3RzTGlzdCkge1xuICAgIGxldCBzZXJpYWxQcm9qZWN0c0xpc3QgPSBKU09OLnN0cmluZ2lmeShwcm9qZWN0c0xpc3QpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwcm9qZWN0c0xpc3QnLCBzZXJpYWxQcm9qZWN0c0xpc3QpO1xufVxuXG5jb25zdCBnZXRGcm9tTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IHByb2plY3RzTGlzdCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2plY3RzTGlzdCcpKTtcbiAgICBcbiAgICByZXR1cm4gcHJvamVjdHNMaXN0O1xufVxuXG5leHBvcnQge3NhdmVJbkxvY2FsU3RvcmFnZSwgZ2V0RnJvbUxvY2FsU3RvcmFnZX0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCByZXNldEVycm9ycywgY2xvc2VFZGl0Rm9ybSwgY3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL21vZHVsZXMvZG9tTWFuaXB1bGF0aW9ucyc7XG5pbXBvcnQge2FkZFRvVGhlVG9kb0xpc3QsIHNob3dBbGxUb2RvcywgYWRkVG9Qcm9qZWN0c0xpc3QsIHNob3dBbGxQcm9qZWN0cywgcmVuYW1lUHJvamVjdCwgZGVsZXRlUHJvamVjdH0gZnJvbSAnLi9tb2R1bGVzL2NvbnRyb2xsZXInO1xuaW1wb3J0IHtpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgZ2V0Q3VycmVudFByb2plY3QsIGdldENob3NlblByb2plY3QsIGhpZ2hsaWdodFByb2plY3QsIGlzVGl0bGVVc2FibGV9IGZyb20gJy4vbW9kdWxlcy9hcHBMb2dpYyc7XG5pbXBvcnQge3NhdmVJbkxvY2FsU3RvcmFnZSwgZ2V0RnJvbUxvY2FsU3RvcmFnZX0gZnJvbSAnLi9tb2R1bGVzL2xvY2FsU3RvcmFnZSc7XG5cbihmdW5jdGlvbigpIHtcbiAgICBsZXQgdG9kb3MgPSBbXTtcbiAgICBsZXQgcHJvamVjdHNMaXN0ID0gW107XG4gICAgXG4gICAgLy8gY3JlYXRpbmcgZXhhbXBsZSB0b2RvcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCBmaXJzdFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQ2FsbCB0byBJcmluYScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBoYXZlIHRvIGNhbGwgdG8gSXJpbmEgYW5kIGtub3cgd2hlcmUgc2hlIGlzLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA3LTE3JyxcbiAgICAgICAgcHJpb3JpdHk6ICdoaWdoJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBzZWNvbmRUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0J1eSBhIHBpenphJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIG5lZWQgdG8gYnV5IHR3byBwaXp6YXMgZm9yIG1lIGFuZCBJcmluYS4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wOC0xOScsXG4gICAgICAgIHByaW9yaXR5OiAnbWVkaXVtJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCB0aGlyZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSG1tbW1tbW1tLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA3LTE4JyxcbiAgICAgICAgcHJpb3JpdHk6ICdsb3cnLFxuICAgICAgICBjaGVjazogdHJ1ZSxcbiAgICB9O1xuXG4gICAgY29uc3QgZm91cnRoVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDaGVjayBUb2RvJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGFtIGp1c3QgY2hlY2tpbmcuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTUnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICB0b2Rvcy5wdXNoKGZpcnN0VG9kbyk7XG4gICAgdG9kb3MucHVzaChzZWNvbmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHRoaXJkVG9kbyk7XG4gICAgdG9kb3MucHVzaChmb3VydGhUb2RvKTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIFxuICAgIC8vIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIC8vIGNvbnNvbGUubG9nKCBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1bmRlZmluZWQnKSkgKTtcblxuICAgIGlmICggIUpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Byb2plY3RzTGlzdCcpKSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgZmlyc3QgdGltZSBoZXJlLiBPciBzb21ldGhpbmcgd2VudCB3cm9uZyB3aXRoIExvY2FsIFN0b3JhZ2UuIFNvIHdlIHNob3cgc3RhbmRhcnQgcHJvamVjdHMuIFxcXG4gICAgICAgIFlvdSBzaG91bGQgd3JpdGUgbWUgKGRhbWlyaW9zKS4gU29ycnkoJyk7XG4gICAgICAgIGNvbnN0IG1haW5Qcm9qZWN0ID0ge1xuICAgICAgICAgICAgdGl0bGU6ICdNYWluJyxcbiAgICAgICAgICAgIHRvZG9zOiB0b2RvcyxcbiAgICAgICAgICAgIG5vbnJlbW92YWJsZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgYWRkVG9Qcm9qZWN0c0xpc3QobWFpblByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgICAgIHNhdmVJbkxvY2FsU3RvcmFnZShwcm9qZWN0c0xpc3QpO1xuICAgIH0gZWxzZSB7ICAgIFxuICAgICAgICBwcm9qZWN0c0xpc3QgPSBnZXRGcm9tTG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgaGlnaGxpZ2h0UHJvamVjdChwcm9qZWN0c0xpc3RbMF0pO1xuICAgIHRvZG9zID0gcHJvamVjdHNMaXN0WzBdLnRvZG9zO1xuXG4gICAgY29uc3QgdG9kb3NGb3JTaG93ID0gcHJvamVjdHNMaXN0WzBdLnRvZG9zO1xuICAgIHNob3dBbGxUb2Rvcyh0b2Rvc0ZvclNob3csIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGhlIG5ldyB0YXNrIGZvcm0gYW5kIGNsb3NpbmcgY29uZGl0aW9ucyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgdGFza0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgYWRkVGFza1dpbmRvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdGFzaycpOyAvLyBidXR0b24gdGhhdCBvcGVucyBuZXcgdGFzayBmb3JtXG4gICAgICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTsgLy8gZm9ybSdzIG91dGVyIGRpdiBibG9ja1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0nKTsgLy8gbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBjbG9zZVRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fY2xvc2luZy1idXR0b24nKTsgLy8gY2xvc2UgZm9ybSBidXR0b25cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCBidXR0b24nKTsgLy8gZm9ybSdzIHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza1RvRWRpdCA9IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnNpbmdsZS10b2RvJyk7IC8vIHRoaXMgbmVlZCB0byBvcGVuIGVkaXQgdG9kbyBmb3JtXG4gICAgICAgIGNvbnN0IGVkaXRGb3JtQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IGVkaXRGb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICAgICAgY29uc3QgZWRpdEZvcm1DbG9zZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LWZvcm1fX2Nsb3NpbmctYnV0dG9uJyk7XG4gICAgICAgIGNvbnN0IGRldGFpbHNXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzJyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXByb2plY3QnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEZvcm0gPSBuZXdQcm9qZWN0LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdENsb3NpbmdCdXR0b24gPSBuZXdQcm9qZWN0LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdF9fY2xvc2luZy1idXR0b24nKTtcbiAgICAgICAgY29uc3QgYWN0aXZlRWRpdFByb2plY3RNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFjdGl2ZS1lZGl0LW1lbnUnKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gZ2V0Q3VycmVudFByb2plY3QocHJvamVjdHNMaXN0KTtcbiAgICAgICAgdG9kb3MgPSBjdXJyZW50UHJvamVjdC50b2RvcztcblxuICAgICAgICBpZiAoIW5ld1Rhc2tXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkgeyAvL2lmIHRoZSBuZXcgdGFzayBmb3JtIGlzIG9wZW5cbiAgICAgICAgICAgIGlmICggY2xpY2tlZE9iamVjdCA9PSBjbG9zZVRhc2tXaW5kb3dCdXR0b24gfHwgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLmZvcm0nKSApIHsgLy9jaGVjayBpZiBjbGlja2VkIE9iamVjdCBpcyB0aGUgXCJjbG9zZSBmb3JtXCIgYnV0dG9uIG9yIGlzIG5vdCBmb3JtIHdpbmRvd1xuICAgICAgICAgICAgICAgIGhpZGVOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHJlc2V0RXJyb3JzKGZvcm0pOyAvL3Jlc2V0IGVycm9yIHBhcmFncmFwaHMgaWYgdGhleSBhcmUgZXhpc3RcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZE9iamVjdCA9PSBzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCBpc0Zvcm1WYWxpZChmb3JtKSApIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9UaGVUb2RvTGlzdChmb3JtLCB0b2Rvcyk7IC8vIGNyZWF0ZXMgYW5kIGluc2VydCBuZXcgdG9kbyBpbiBET01cbiAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7IC8vIHNhdmUgbmV3IFRvZG8gdGhyb3VnaCBwcm9qZWN0c0xpc3QgaW4gbG9jYWxTdG9yYWdlXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsLXRhc2tzJyk7IC8vIHRoZXNlIHRocmVlIGxpbmVzIG5lZWQgdG8gaGlnaGxpZ2h0IFxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrc0dyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vIFwiYWxsIHRhc2tzXCIgYnV0dG9uIGFmdGVyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCh0YXNrc0dyb3VwLCBhbGxUYXNrcyk7IC8vIGNyZWF0aW5nIGEgbmV3IHRhc2tcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vaWYgdGhlIG5ldyB0YXNrIGZvcm0gaXMgY2xvc2VkXG5cbiAgICAgICAgICAgIGlmICggYWN0aXZlRWRpdFByb2plY3RNZW51ICYmIGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLmVkaXQtcHJvamVjdCcpICE9IGFjdGl2ZUVkaXRQcm9qZWN0TWVudSApIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVFZGl0UHJvamVjdE1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlLWVkaXQtbWVudScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCA9PSBhZGRUYXNrV2luZG93QnV0dG9uKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgXCJhZGQgdGFza1wiIGJ1dHRvblxuICAgICAgICAgICAgICAgIHNob3dOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoY2xpY2tlZE9iamVjdCA9PSBlZGl0Rm9ybUNvbnRhaW5lciAmJiAhZWRpdEZvcm1Db250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSAmJiBcbiAgICAgICAgICAgICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5lZGl0LXRhc2tfX2Zvcm0nKSApIHx8IGNsaWNrZWRPYmplY3QgPT0gZWRpdEZvcm1DbG9zZUJ1dHRvbikgeyAvLyBpZiBlZGl0IGZvcm0gaXMgb3Blbi4gVGhlbiBjbG9zZSBidXR0b24gY2xpY2tlZFxuICAgICAgICAgICAgICAgIGNsb3NlRWRpdEZvcm0oKTtcbiAgICAgICAgICAgICAgICBlZGl0Rm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggZGV0YWlsc1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpICYmICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy50YXNrLWRldGFpbHMnKSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzUHJpb3JpdHkgPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX3ByaW9yaXR5Jyk7XG4gICAgICAgICAgICAgICAgaWYgKCBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRhaWxzLXByaW9yaXR5X19sb3cnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtcHJpb3JpdHlfX2xvdycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtcHJpb3JpdHlfX21lZGl1bScpICkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LnJlbW92ZSgnZGV0YWlscy1wcmlvcml0eV9fbWVkaXVtJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5jb250YWlucygnZGV0YWlscy1wcmlvcml0eV9faGlnaCcpICkge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LnJlbW92ZSgnZGV0YWlscy1wcmlvcml0eV9faGlnaCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZXRhaWxzV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5uZXctcHJvamVjdCcpICYmICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5uZXctcHJvamVjdCBmb3JtJykgfHwgY2xpY2tlZE9iamVjdCA9PSBuZXdQcm9qZWN0Q2xvc2luZ0J1dHRvbikge1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3QuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0nKTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0YXNrRnVuY3Rpb25zKTtcblxuICAgIC8vIEFkZCBFdmVudCBMaXN0ZW5lcnMgZm9yIHRhc2sgZ3JvdXBzXG4gICAgY29uc3QgdGFza0dyb3VwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvL2dldCBzaWRlYmFyIHRhc2sgZ3JvdXBzXG5cbiAgICBjb25zdCB0YXNrR3JvdXBzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCAhPSB0YXNrR3JvdXBzKSB7XG4gICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cChjbGlja2VkT2JqZWN0LCB0b2Rvcyk7XG4gICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93LCB0b2RvcywgcHJvamVjdHNMaXN0LCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciBwcm9qZWN0c1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzJyk7XG4gICAgY29uc3QgY3JlYXRlUHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdF9fYWNjZXB0LXRpdGxlJyk7XG5cbiAgICBjb25zdCBwcm9qZWN0c0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBhZGRQcm9qZWN0QnV0dG9uID0gcHJvamVjdHMucXVlcnlTZWxlY3RvcignLnByb2plY3RzX19jcmVhdGUnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBhbGxQcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0cyB1bCBsaScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFkZFByb2plY3RCdXR0b24gJiYgYWRkUHJvamVjdEJ1dHRvbiA9PSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5wcm9qZWN0c19fY3JlYXRlJykpIHtcbiAgICAgICAgICAgIG5ld1Byb2plY3QuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnc2luZ2xlLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZE9iamVjdC5kYXRhc2V0LnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRQcm9qZWN0KGN1cnJlbnRQcm9qZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsLXRhc2tzJyk7IC8vIHRoZXNlIHRocmVlIGxpbmVzIG5lZWQgdG8gaGlnaGxpZ2h0IFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3NHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvLyBcImFsbCB0YXNrc1wiIGJ1dHRvbiBhZnRlclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwKHRhc2tzR3JvdXAsIGFsbFRhc2tzKTsgLy8gY3JlYXRpbmcgYSBuZXcgdGFza1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGN1cnJlbnRQcm9qZWN0LnRvZG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ2VkaXQtcHJvamVjdC1idXR0b24nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRQcm9qZWN0ID0gY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuc2luZ2xlLXByb2plY3QnKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RFZGl0TWVudSA9IGNsaWNrZWRPYmplY3QucXVlcnlTZWxlY3RvcignLmVkaXQtcHJvamVjdCcpO1xuICAgICAgICAgICAgcHJvamVjdEVkaXRNZW51LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZS1lZGl0LW1lbnUnKTtcblxuICAgICAgICAgICAgaWYgKHByb2plY3RzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UHJvamVjdC50aXRsZSA9PSBjbGlja2VkUHJvamVjdC5kYXRhc2V0LnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRQcm9qZWN0KGN1cnJlbnRQcm9qZWN0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdG9kb3MgPSBjdXJyZW50UHJvamVjdC50b2RvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLmFjdGl2ZS1lZGl0LW1lbnUnKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRQcm9qZWN0ID0gY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuc2luZ2xlLXByb2plY3QnKTtcblxuICAgICAgICAgICAgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnZGVsZXRlLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgICAgICBkZWxldGVQcm9qZWN0KGNsaWNrZWRQcm9qZWN0LCBwcm9qZWN0c0xpc3QpOyAvLyBDUkVBVEUgVEhJUyBGVU5DVElPTiEhISFcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZW5hbWUtcHJvamVjdCcpICkge1xuICAgICAgICAgICAgICAgIHJlbmFtZVByb2plY3QoY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCk7IC8vIENSRUFURSBUSElTIEZVTkNUSU9OISEhIVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByb2plY3RzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcHJvamVjdHNGdW5jdGlvbnMpO1xuXG5cbiAgICBjb25zdCBhZGRQcm9qZWN0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHByb2plY3RUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwcm9qZWN0LXRpdGxlJyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXByb2plY3QnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEZvcm0gPSBuZXdQcm9qZWN0LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICAgICAgY29uc3QgY3VycmVudEhpZ2hsaWdodGVkUHJvamVjdEluRE9NID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNob3Nlbi1wcm9qZWN0Jyk7XG4gICAgICAgIGNvbnN0IGNob3NlblByb2plY3QgPSBnZXRDaG9zZW5Qcm9qZWN0KGN1cnJlbnRIaWdobGlnaHRlZFByb2plY3RJbkRPTSwgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgXG5cbiAgICAgICAgaWYgKCBwcm9qZWN0VGl0bGUucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yLXBhcmFncmFwaC1wcm9qZWN0JykgKSB7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaChwcm9qZWN0VGl0bGUpO1xuICAgICAgICAgICAgcHJvamVjdFRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9qZWN0VGl0bGUudmFsdWUudHJpbSgpID09ICcnKSB7XG4gICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcm9qZWN0VGl0bGUpO1xuICAgICAgICAgICAgcHJvamVjdFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCBpc1RpdGxlVXNhYmxlKHByb2plY3RUaXRsZS52YWx1ZSwgcHJvamVjdHNMaXN0KSApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHByb2plY3RUaXRsZS52YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgdG9kb3M6IFtdLFxuICAgICAgICAgICAgICAgICAgICBub25yZW1vdmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBhZGRUb1Byb2plY3RzTGlzdChjdXJyZW50UHJvamVjdCwgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICBzYXZlSW5Mb2NhbFN0b3JhZ2UocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICBzaG93QWxsUHJvamVjdHMocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50SGlnaGxpZ2h0ZWRQcm9qZWN0SW5ET00pO1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QoY2hvc2VuUHJvamVjdCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICAgICAgcHJvamVjdFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgY3JlYXRlUHJvamVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFByb2plY3QpO1xuXG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==