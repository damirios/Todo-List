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

const acceptProjectsNewName = function(previousTitle, clickedProject, projectsList, e) {
    e.preventDefault();

    const renameProjectBlock = document.querySelector('.rename-project-block');
    const renameProjectBlockForm = renameProjectBlock.querySelector('form');

    const renameInput = renameProjectBlock.querySelector('#rename-project-title-block');
    const newTitle = renameInput.value;

    if ( newTitle.trim() != '' ) {
        if (projectsList.length > 0) {
            for (let i = 0; i < projectsList.length; i++) {
                const currentProject = projectsList[i];
                if (currentProject.title == previousTitle) {
                    currentProject.title = newTitle;
                    (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
                    showAllProjects(projectsList);
                    (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.highlightProject)(projectsList[i]);
                    showAllTodos(projectsList[i].todos, projectsList[i].todos, projectsList);
                    renameProjectBlock.classList.add('hidden-rename');
                    renameProjectBlockForm.classList.add('hidden-form-rename');
                }
            }
        }
    } else {
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(renameInput);
        renameInput.classList.add('invalid');
    }
}

const renameProject = function(clickedProject, projectsList) {

    const renameProjectBlock = document.querySelector('.rename-project-block');
    const renameProjectBlockForm = renameProjectBlock.querySelector('form');
    renameProjectBlock.classList.remove('hidden-rename');
    renameProjectBlockForm.classList.remove('hidden-form-rename');

    const renameInput = renameProjectBlock.querySelector('#rename-project-title-block');
    renameInput.value = clickedProject.dataset.title;
    const previousTitle = clickedProject.dataset.title;

    const renameProjectButton = renameProjectBlock.querySelector('button.rename-project-block__accept-title');
    renameProjectButton.addEventListener('click', acceptProjectsNewName.bind(this, previousTitle, clickedProject, projectsList));
}

const deleteProject = function(clickedProject, projectsList) {
    if (projectsList.length > 0) {
        for (let i = 0; i < projectsList.length; i++) {
            const currentProject = projectsList[i];
            if (currentProject.title == clickedProject.dataset.title) {
                projectsList.splice(i, 1);
                (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
                showAllProjects(projectsList);
                (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.highlightProject)(projectsList[0]);
                showAllTodos(projectsList[0].todos, projectsList[0].todos, projectsList);
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
        const renameProjectBlock = document.querySelector('.rename-project-block');
        const renameProjectBlockForm = renameProjectBlock.querySelector('form');
        
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
            } else if ( clickedObject.closest('.rename-project-block__closing-button') || clickedObject.closest('.rename-project-block') && !clickedObject.closest('.rename-project-block__form')) {
                renameProjectBlock.classList.add('hidden-rename');
                renameProjectBlockForm.classList.add('hidden-form-rename');
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
        
        if ( addProjectButton && addProjectButton == clickedObject.closest('.projects__create') ) {
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
                (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.deleteProject)(clickedProject, projectsList);
            } else if ( clickedObject.classList.contains('rename-project') ) {
                (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.renameProject)(clickedProject, projectsList);
                clickedObject.closest('.active-edit-menu').classList.remove('active-edit-menu');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBZ0MseUJBQXlCO0FBQ3pEO0FBQ0E7QUFDQSx3QkFBd0IsbUVBQWdCOztBQUV4QztBQUNBLHdCQUF3QixpRUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQSxnQkFBZ0Isa0VBQWE7QUFDN0IsY0FBYztBQUNkLGdCQUFnQixrRUFBYTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUVBQWdCO0FBQzlDOztBQUVBO0FBQ0EsWUFBWSwrRUFBb0I7QUFDaEM7QUFDQTs7QUFFQTtBQUNBLFlBQVksK0VBQW9CO0FBQ2hDOztBQUVBLFVBQVU7QUFDVixpQkFBaUIsZ0VBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHVFQUFpQjtBQUNqQyxnQkFBZ0IseUVBQWtCO0FBQ2xDLGdCQUFnQixvRUFBZTtBQUMvQjtBQUNBLGdCQUFnQixtRUFBZ0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsZ0JBQWdCLCtFQUFvQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvYXBwTG9naWMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2xvY2FsU3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGh9IGZyb20gJy4vZG9tTWFuaXB1bGF0aW9ucyc7XG5cbmNvbnN0IHRvZG9GYWN0b3J5ID0gZnVuY3Rpb24oZm9ybSwgY2hlY2tTdGF0dXMpIHtcbiAgICBsZXQgdG9kb09iamVjdCA9IHt9OyAvLyBvYmplY3QgdGhhdCBjb2xsZWN0cyBpbmZvIGZyb20gbmV3IHRhc2sgZm9ybSFcbiAgICBjb25zdCBmb3JtRWxlbWVudHMgPSBmb3JtLmVsZW1lbnRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZm9ybUVsZW1lbnRzLmxlbmd0aCAtIDE7IGkrKykgeyAvLyBhbGwgZmllbGRzIGV4Y2VwdCBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBmb3JtRWxlbWVudHNbaV07XG4gICAgICAgIGlmIChlbGVtZW50Lm5hbWUgPT0gJ3RpdGxlJyB8fCBlbGVtZW50Lm5hbWUgPT0gJ2Rlc2NyaXB0aW9uJykge1xuICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ3ByaW9yaXR5JyAmJiBlbGVtZW50LmNoZWNrZWQpIHtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtbG93JykgeyAvL3RoZXNlIGNoZWNrcyBmb3IgZWRpdC0uLi4gbmVlZHMgdG8gc2hvdyBwcmlvcml0eSAtIGVkaXRGb3JtIHByaW9yaXR5IGJ1dHRvbnMgaWQncyBkaWZmZXIgbmV3VGFza0Zvcm0ncyAob2J2aW91c2x5KVxuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9ICdsb3cnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlkID09ICdlZGl0LW1lZGl1bScpIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnbWVkaXVtJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1oaWdoJykge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9ICdoaWdoJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC5pZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PSAnZHVlRGF0ZScpIHtcbiAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9kb09iamVjdC5jaGVjayA9IGNoZWNrU3RhdHVzO1xuICAgIHJldHVybiB0b2RvT2JqZWN0O1xufVxuXG5jb25zdCBpc0Zvcm1WYWxpZCA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICBjb25zdCB0aXRsZUlucHV0ID0gZm9ybS50aXRsZTtcbiAgICBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLmR1ZURhdGU7XG4gICAgY29uc3QgcHJpb3JpdHlJbnB1dHMgPSBmb3JtLnByaW9yaXR5OyBcbiAgICAvLyBjb25zdCB0aXRsZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dCN0aXRsZScpO1xuICAgIC8vIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjZHVlRGF0ZScpO1xuICAgIC8vIGNvbnN0IHByaW9yaXR5SW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtuYW1lPXByaW9yaXR5XScpO1xuICAgIGNvbnN0IHByaW9yaXR5QnV0dG9ucyA9IGZvcm0ucXVlcnlTZWxlY3RvcignLnByaW9yaXR5X19idXR0b25zLCAuZWRpdC1mb3JtLXByaW9yaXR5X19idXR0b25zJyk7XG5cbiAgICBsZXQgdmFsaWRQcmlvcml0eTtcbiAgICBsZXQgcHJpb3JpdHlDaGVjayA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJpb3JpdHlJbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3VycmVudFByaW9yaXR5SW5wdXQgPSBwcmlvcml0eUlucHV0c1tpXTtcbiAgICAgICAgaWYgKGN1cnJlbnRQcmlvcml0eUlucHV0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIHByaW9yaXR5Q2hlY2sgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXByaW9yaXR5Q2hlY2sgJiYgIXByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcbiAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgocHJpb3JpdHlJbnB1dHNbMF0pO1xuICAgICAgICB2YWxpZFByaW9yaXR5ID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChwcmlvcml0eUNoZWNrKSB7XG4gICAgICAgIHZhbGlkUHJpb3JpdHkgPSB0cnVlO1xuICAgICAgICBpZiAocHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZyAmJiBwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3ItcGFyYWdyYXBoJykpIHtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHByaW9yaXR5SW5wdXRzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB2YWxpZER1ZURhdGU7XG4gICAgaWYgKGR1ZURhdGVJbnB1dC52YWx1ZS50cmltKCkgPT0gJycpIHtcbiAgICAgICAgdmFsaWREdWVEYXRlID0gZmFsc2U7XG4gICAgICAgIGlmICghZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpO1xuICAgICAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChkdWVEYXRlSW5wdXQudmFsdWUudHJpbSgpICE9ICcnKSB7XG4gICAgICAgIHZhbGlkRHVlRGF0ZSA9IHRydWU7XG4gICAgICAgIGlmIChkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaChkdWVEYXRlSW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkVGl0bGU7XG4gICAgaWYgKHRpdGxlSW5wdXQudmFsdWUudHJpbSgpID09ICcnICYmICF0aXRsZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgIHRpdGxlSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpO1xuICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaCh0aXRsZUlucHV0KTtcbiAgICAgICAgdGl0bGVJbnB1dC5mb2N1cygpO1xuICAgICAgICB2YWxpZFRpdGxlID0gZmFsc2U7XG5cbiAgICB9IGVsc2UgaWYgKHRpdGxlSW5wdXQudmFsdWUudHJpbSgpICE9ICcnKSB7XG4gICAgICAgIHZhbGlkVGl0bGUgPSB0cnVlO1xuICAgICAgICBpZiAodGl0bGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgdGl0bGVJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaCh0aXRsZUlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkID0gdmFsaWRQcmlvcml0eSAmJiB2YWxpZER1ZURhdGUgJiYgdmFsaWRUaXRsZTtcbiAgICByZXR1cm4gdmFsaWQ7XG59XG5cbmNvbnN0IGhpZ2hsaWdodENob3NlblRhc2tHcm91cCA9IGZ1bmN0aW9uKHRhc2tHcm91cHMsIGNsaWNrZWRPYmplY3QpIHtcbiAgICBjb25zdCB0YXNrR3JvdXBzRWxlbWVudHMgPSB0YXNrR3JvdXBzLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrR3JvdXBzRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY3VycmVudFRhc2tHcm91cCA9IHRhc2tHcm91cHNFbGVtZW50c1tpXTtcbiAgICAgICAgaWYgKGN1cnJlbnRUYXNrR3JvdXAgPT0gY2xpY2tlZE9iamVjdCAmJiAhY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob3Nlbi10YXNrLWdyb3VwJykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmFkZCgnY2hvc2VuLXRhc2stZ3JvdXAnKTtcbiAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50VGFza0dyb3VwICE9IGNsaWNrZWRPYmplY3QgJiYgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob3Nlbi10YXNrLWdyb3VwJykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LnJlbW92ZSgnY2hvc2VuLXRhc2stZ3JvdXAnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3Qgc29ydEN1cnJlbnRUb2RvID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCwgdG9kbykge1xuICAgIGNvbnN0IGN1cnJlbnREYXRlQW5kVGltZSA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RnVsbFllYXIoKTtcbiAgICBjb25zdCBjdXJyZW50TW9udGggPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TW9udGgoKSArIDE7XG4gICAgY29uc3QgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRIb3VycyA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRIb3VycygpO1xuICAgIGNvbnN0IGN1cnJlbnRNaW51dGVzID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1pbnV0ZXMoKTtcbiAgICBjb25zdCBjdXJyZW50U2Vjb25kcyA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRTZWNvbmRzKCk7XG5cbiAgICBjb25zdCB0b2RvRnVsbERhdGUgPSB0b2RvLmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICBjb25zdCB0b2RvWWVhciA9IHRvZG9GdWxsRGF0ZVswXTtcbiAgICBjb25zdCB0b2RvTW9udGggPSB0b2RvRnVsbERhdGVbMV07XG4gICAgY29uc3QgdG9kb0RhdGUgPSB0b2RvRnVsbERhdGVbMl07XG4gICAgY29uc3QgdG9kb0RhdGVPYmogPSBuZXcgRGF0ZSh0b2RvWWVhciwgdG9kb01vbnRoIC0gMSwgdG9kb0RhdGUpOyAvL0RhdGUgT2JqIGZvciB0b2RvXG5cbiAgICBpZiAoY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZGF5JykpIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwidG9kYXlcIlxuICAgICAgICBpZiAoIGlzVG9kYXkodG9kb1llYXIsIHRvZG9Nb250aCwgdG9kb0RhdGUsIGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXRlKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnd2VlaycpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJ0aGlzIHdlZWtcIlxuICAgICAgICBpZiAoIGlzV2Vlayh0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnbW9udGgnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwibW9udGhcIlxuICAgICAgICBpZiAoIGlzTW9udGgodG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ2FsbC10YXNrcycpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJhbGwgdGFza3NcIlxuICAgICAgICByZXR1cm4gdG9kbztcbiAgICB9XG59XG5cbmNvbnN0IGlzVG9kYXkgPSBmdW5jdGlvbih0b2RvWWVhciwgdG9kb01vbnRoLCB0b2RvRGF0ZSwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgY3VycmVudERhdGUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgZXhwaXJlZCB0b2RheVxuICAgIGlmICggdG9kb1llYXIgPT0gY3VycmVudFllYXIgJiYgdG9kb01vbnRoID09IGN1cnJlbnRNb250aCAmJiB0b2RvRGF0ZSA9PSBjdXJyZW50RGF0ZSApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaXNXZWVrID0gZnVuY3Rpb24odG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBhbmQgY3VycmVudCBkYXRlIGRpZmZlcnMgYnkgbm8gbW9yZSB0aGFuIDEgd2Vla1xuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpO1xuICAgIGlmIChkaWZmZXJlbmNlSW5EYXlzIDw9IDcgJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAtMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBpc01vbnRoID0gZnVuY3Rpb24odG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBhbmQgY3VycmVudCBkYXRlIGRpZmZlcnMgYnkgbm8gbW9yZSB0aGFuIDEgbW9udGhcbiAgICBjb25zdCBkaWZmZXJlbmNlSW5EYXlzID0gKHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVBbmRUaW1lKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KSArIDE7XG4gICAgaWYgKCBkaWZmZXJlbmNlSW5EYXlzIDw9IDMyICYmIGRpZmZlcmVuY2VJbkRheXMgPj0gMCkge1xuICAgICAgICBjb25zdCBjdXJyZW50TW9udGggPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGVBbmRUaW1lLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGlmICggY3VycmVudE1vbnRoID09IDEgfHwgY3VycmVudE1vbnRoID09IDMgfHwgY3VycmVudE1vbnRoID09IDUgfHwgY3VycmVudE1vbnRoID09IDcgfHwgY3VycmVudE1vbnRoID09IDggfHwgY3VycmVudE1vbnRoID09IDEwIHx8IGN1cnJlbnRNb250aCA9PSAxMiApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCBkaWZmZXJlbmNlSW5EYXlzIDw9IDMxICYmIChjdXJyZW50TW9udGggPT0gNCB8fCBjdXJyZW50TW9udGggPT0gNiB8fCBjdXJyZW50TW9udGggPT0gOSB8fCBjdXJyZW50TW9udGggPT0gMTEpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoICBjdXJyZW50TW9udGggPT0gMiAmJiAoZGlmZmVyZW5jZUluRGF5cyA8PSAoMjkgKyBpc0xlYXBZZWFyKGN1cnJlbnRZZWFyKSkpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5jb25zdCBpc0xlYXBZZWFyID0gZnVuY3Rpb24oeWVhcikge1xuICAgIGlmICh5ZWFyICUgNCA9PSAwKSB7XG4gICAgICAgIGlmICh5ZWFyICUgMTAwID09IDApIHtcbiAgICAgICAgICAgIGlmICh5ZWFyICUgNDAwID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbn1cblxuY29uc3Qgc29ydFRhc2tzQWNjb3JkaW5nVG9DaG9zZW5UYXNrR3JvdXAgPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0LCB0b2Rvcykge1xuICAgIFxuICAgIGxldCB0b2RvTGlzdFRvU2hvdyA9IFtdOyAvL2N1cnJlbnQgdG9kb0xpc3QgdGhhdCB3ZSBnb2luZyB0byBzaG93LCB3ZSdsbCBmaWxsIGl0XG4gICAgaWYgKHRvZG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdG9kbyA9IHRvZG9zW2ldO1xuICAgICAgICAgICAgY29uc3Qgc29ydGVkVG9kbyA9IHNvcnRDdXJyZW50VG9kbyhjbGlja2VkT2JqZWN0LCB0b2RvKTsgLy9laXRoZXIgcmV0dXJuIHRvZG8gb3IgbnVsbFxuICAgICAgICAgICAgdG9kb0xpc3RUb1Nob3cucHVzaChzb3J0ZWRUb2RvKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9kb0xpc3RUb1Nob3c7XG59XG5cbmNvbnN0IGlzVG9kb0V4cGlyZWQgPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsICt0b2RvTW9udGggLSAxLCArdG9kb0RhdGUgKzEgKTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZU9iaiA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKCB0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlT2JqIDwgMCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgYWRkRXhwaXJhdGlvblN0YXR1cyA9IGZ1bmN0aW9uKHRvZG9zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgICAgICB0b2RvLmV4cGlyZWQgPSBpc1RvZG9FeHBpcmVkKHRvZG8pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBkZWxldGVUb2RvID0gZnVuY3Rpb24oY3VycmVudFRvZG8sIHRvZG9zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIHRvZG9zW2ldID09IGN1cnJlbnRUb2RvICkge1xuICAgICAgICAgICAgdG9kb3Muc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBnZXRDaGFuZ2VkVG9kb3MgPSBmdW5jdGlvbih0b2RvLCB0b2RvcywgZWRpdEZvcm0pIHtcbiAgICBjb25zb2xlLmxvZyh0b2RvKTtcbiAgICBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgY29uc29sZS5sb2coZWRpdEZvcm0pO1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShlZGl0Rm9ybSwgdG9kby5jaGVjayk7XG4gICAgY29uc3QgdG9kb0luZGV4VG9SZXBsYWNlID0gdG9kb3MuaW5kZXhPZih0b2RvKTtcblxuICAgIGlmICh0b2RvSW5kZXhUb1JlcGxhY2UgIT0gLTEpIHtcbiAgICAgICAgdG9kb3NbdG9kb0luZGV4VG9SZXBsYWNlXSA9IG5ld1RvZG87XG4gICAgfVxuICAgIHJldHVybiB0b2Rvcztcbn1cblxuY29uc3QgZ2V0Q3VycmVudFByb2plY3QgPSBmdW5jdGlvbihwcm9qZWN0c0xpc3QpIHtcbiAgICBjb25zdCBwcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtcHJvamVjdCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCBwcm9qZWN0c1tpXS5jbGFzc0xpc3QuY29udGFpbnMoJ2Nob3Nlbi1wcm9qZWN0JykgKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5jb25zdCBnZXRDaG9zZW5Qcm9qZWN0ID0gZnVuY3Rpb24oY3VycmVudENob3NlblByb2plY3RJbkRPTSwgcHJvamVjdHNMaXN0KSB7XG4gICAgaWYgKHByb2plY3RzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UHJvamVjdC50aXRsZSA9PSBjdXJyZW50Q2hvc2VuUHJvamVjdEluRE9NLmRhdGFzZXQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudFByb2plY3Q7XG4gICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBoaWdobGlnaHRQcm9qZWN0ID0gZnVuY3Rpb24ocHJvamVjdCkge1xuICAgIGNvbnN0IGFsbFByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpbmdsZS1wcm9qZWN0Jyk7XG4gICAgaWYgKGFsbFByb2plY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxQcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBhbGxQcm9qZWN0c1tpXTtcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2Nob3Nlbi1wcm9qZWN0Jyk7XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QuZGF0YXNldC50aXRsZSA9PSBwcm9qZWN0LnRpdGxlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFByb2plY3QuY2xhc3NMaXN0LmFkZCgnY2hvc2VuLXByb2plY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgaXNUaXRsZVVzYWJsZSA9IGZ1bmN0aW9uKHByb2plY3RUaXRsZSwgcHJvamVjdHNMaXN0KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgaWYgKHByb2plY3QudGl0bGUgPT0gcHJvamVjdFRpdGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5cblxuZXhwb3J0IHt0b2RvRmFjdG9yeSwgaXNGb3JtVmFsaWQsIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCwgc29ydFRhc2tzQWNjb3JkaW5nVG9DaG9zZW5UYXNrR3JvdXAsIGlzVG9kb0V4cGlyZWQsIGFkZEV4cGlyYXRpb25TdGF0dXMsIGRlbGV0ZVRvZG8sIFxuICAgIGdldENoYW5nZWRUb2RvcywgZ2V0Q3VycmVudFByb2plY3QsIGdldENob3NlblByb2plY3QsIGhpZ2hsaWdodFByb2plY3QsIGlzVGl0bGVVc2FibGV9IiwiaW1wb3J0IHtjcmVhdGVUb2RvQmxvY2tJbkRPTSwgY2xlYXJUb2RvQ29udGFpbmVyLCBzaG93VG9kb0dyb3VwVGl0bGUsIG9wZW5FZGl0Rm9ybSwgZmlsbEVkaXRGb3JtLCBjbG9zZUVkaXRGb3JtLCBvcGVuRGV0YWlsc1dpbmRvdywgYWRkUHJvamVjdERPTSwgY2xlYXJQcm9qZWN0c01lbnUsIGNyZWF0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHt0b2RvRmFjdG9yeSwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgaXNGb3JtVmFsaWQsIGdldENoYW5nZWRUb2RvcywgaGlnaGxpZ2h0UHJvamVjdH0gZnJvbSAnLi9hcHBMb2dpYyc7XG5pbXBvcnQgeyBzYXZlSW5Mb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IGFkZFRvVGhlVG9kb0xpc3QgPSBmdW5jdGlvbihmb3JtLCB0b2Rvcykge1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShmb3JtKTtcbiAgICB0b2Rvcy5wdXNoKG5ld1RvZG8pO1xufVxuXG5jb25zdCBjb21wYXJlRnVuY3Rpb24gPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7IC8vIHNvcnQgYnkgcHJpb3JpdHkgb2YgdG9kbyBhbmQgZXhwaXJlZCB0b2RvcyB3aWxsIGJlIGluIHRoZSBib3R0b20uIEFsc28gbW9zdCB1cmdlIHRvZG9zIHdpbGwgYmUgaW4gZmlyc3QgcGxhY2VcbiAgICBpZiAoZmlyc3QgJiYgc2Vjb25kKSB7XG5cbiAgICAgICAgY29uc3QgY29tcGFyZURhdGVzID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlID0gZmlyc3QuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZSA9IHNlY29uZC5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdERhdGVPYmogPSBuZXcgRGF0ZSggZmlyc3REYXRlWzBdLCBmaXJzdERhdGVbMV0sIGZpcnN0RGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZU9iaiA9IG5ldyBEYXRlKCBzZWNvbmREYXRlWzBdLCBzZWNvbmREYXRlWzFdLCBzZWNvbmREYXRlWzJdICk7XG4gICAgICAgICAgICBjb25zdCBkYXRlRGlmZmVyZW5jZSA9IGZpcnN0RGF0ZU9iaiAtIHNlY29uZERhdGVPYmo7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wYXJlUHJpb3JpdHkgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpcnN0LmV4cGlyZWQpIHtcbiAgICAgICAgICAgIGlmIChzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3Qgc2hvd0FsbFRvZG9zID0gZnVuY3Rpb24odG9kb3NGb3JTaG93LCBhbGxUb2RvcywgcHJvamVjdHNMaXN0LCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY2xlYXJUb2RvQ29udGFpbmVyKCk7IC8vIGNsZWFycyB0b2RvIGNvbnRhaW5lciBvZiBhbGwgdGFza3MgYW5kIHRoZW4gd2Ugd2lsbCBjcmVhdGUgaXQgYWdhaW4gd2l0aCBjaG9zZW4gcGFyYW1ldGVyc1xuICAgIGlmIChjbGlja2VkT2JqZWN0KSB7XG4gICAgICAgIHNob3dUb2RvR3JvdXBUaXRsZShjbGlja2VkT2JqZWN0KTtcbiAgICB9XG5cbiAgICBpZiAodG9kb3NGb3JTaG93ICYmIHRvZG9zRm9yU2hvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFkZEV4cGlyYXRpb25TdGF0dXModG9kb3NGb3JTaG93KTtcbiAgICAgICAgdG9kb3NGb3JTaG93LnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3NGb3JTaG93Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NGb3JTaG93W2ldO1xuICAgICAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVUb2RvQmxvY2tJbkRPTSh0b2RvLCBpc1RvZG9FeHBpcmVkKHRvZG8pLCBwcm9qZWN0c0xpc3QsIGFsbFRvZG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgdG9kb0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKHRvZG9zLCBjdXJyZW50VG9kbywgcHJvamVjdHNMaXN0LCBlKSB7XG4gICAgY29uc3QgY2xpY2tlZEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbicpOyAvLyBnZXQgY2xpY2tlZCBCdXR0b24gb3IgbnVsbFxuICAgIGlmIChjbGlja2VkQnV0dG9uKSB7XG4gICAgICAgIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RlbGV0ZS10b2RvJykgKSB7XG4gICAgICAgICAgICBkZWxldGVUb2RvKGN1cnJlbnRUb2RvLCB0b2Rvcyk7XG4gICAgICAgICAgICBzYXZlSW5Mb2NhbFN0b3JhZ2UocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGdldENoYW5nZWRUb2Rvcyh0b2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdENoYW5nZXNCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja0V2ZW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IGVkaXRCdXR0b25DbGFzcyhjdXJyZW50VG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtdG9kbycpICkge1xuICAgICAgICAgICAgb3BlbkRldGFpbHNXaW5kb3coY3VycmVudFRvZG8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0b2RvcyB0byBpbmRleC5qc1xuICAgIH1cbn1cblxuY29uc3QgYWRkVG9Qcm9qZWN0c0xpc3QgPSBmdW5jdGlvbihwcm9qZWN0LCBwcm9qZWN0c0xpc3QpIHtcbiAgICBwcm9qZWN0c0xpc3QucHVzaChwcm9qZWN0KTtcbn1cblxuY29uc3Qgc2hvd0FsbFByb2plY3RzID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG5cbiAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJQcm9qZWN0c01lbnUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBhZGRQcm9qZWN0RE9NKHByb2plY3QpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBhY2NlcHRQcm9qZWN0c05ld05hbWUgPSBmdW5jdGlvbihwcmV2aW91c1RpdGxlLCBjbGlja2VkUHJvamVjdCwgcHJvamVjdHNMaXN0LCBlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlbmFtZS1wcm9qZWN0LWJsb2NrJyk7XG4gICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrRm9ybSA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cbiAgICBjb25zdCByZW5hbWVJbnB1dCA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCcjcmVuYW1lLXByb2plY3QtdGl0bGUtYmxvY2snKTtcbiAgICBjb25zdCBuZXdUaXRsZSA9IHJlbmFtZUlucHV0LnZhbHVlO1xuXG4gICAgaWYgKCBuZXdUaXRsZS50cmltKCkgIT0gJycgKSB7XG4gICAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gcHJldmlvdXNUaXRsZSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50UHJvamVjdC50aXRsZSA9IG5ld1RpdGxlO1xuICAgICAgICAgICAgICAgICAgICBzYXZlSW5Mb2NhbFN0b3JhZ2UocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QocHJvamVjdHNMaXN0W2ldKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHByb2plY3RzTGlzdFtpXS50b2RvcywgcHJvamVjdHNMaXN0W2ldLnRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICByZW5hbWVQcm9qZWN0QmxvY2suY2xhc3NMaXN0LmFkZCgnaGlkZGVuLXJlbmFtZScpO1xuICAgICAgICAgICAgICAgICAgICByZW5hbWVQcm9qZWN0QmxvY2tGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtLXJlbmFtZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHJlbmFtZUlucHV0KTtcbiAgICAgICAgcmVuYW1lSW5wdXQuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpO1xuICAgIH1cbn1cblxuY29uc3QgcmVuYW1lUHJvamVjdCA9IGZ1bmN0aW9uKGNsaWNrZWRQcm9qZWN0LCBwcm9qZWN0c0xpc3QpIHtcblxuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZW5hbWUtcHJvamVjdC1ibG9jaycpO1xuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCbG9ja0Zvcm0gPSByZW5hbWVQcm9qZWN0QmxvY2sucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIHJlbmFtZVByb2plY3RCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tcmVuYW1lJyk7XG4gICAgcmVuYW1lUHJvamVjdEJsb2NrRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybS1yZW5hbWUnKTtcblxuICAgIGNvbnN0IHJlbmFtZUlucHV0ID0gcmVuYW1lUHJvamVjdEJsb2NrLnF1ZXJ5U2VsZWN0b3IoJyNyZW5hbWUtcHJvamVjdC10aXRsZS1ibG9jaycpO1xuICAgIHJlbmFtZUlucHV0LnZhbHVlID0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZTtcbiAgICBjb25zdCBwcmV2aW91c1RpdGxlID0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZTtcblxuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCdXR0b24gPSByZW5hbWVQcm9qZWN0QmxvY2sucXVlcnlTZWxlY3RvcignYnV0dG9uLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19hY2NlcHQtdGl0bGUnKTtcbiAgICByZW5hbWVQcm9qZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjZXB0UHJvamVjdHNOZXdOYW1lLmJpbmQodGhpcywgcHJldmlvdXNUaXRsZSwgY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCkpO1xufVxuXG5jb25zdCBkZWxldGVQcm9qZWN0ID0gZnVuY3Rpb24oY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCkge1xuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgIHByb2plY3RzTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0UHJvamVjdChwcm9qZWN0c0xpc3RbMF0pO1xuICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyhwcm9qZWN0c0xpc3RbMF0udG9kb3MsIHByb2plY3RzTGlzdFswXS50b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3MsIHRvZG9GdW5jdGlvbnMsIGFkZFRvUHJvamVjdHNMaXN0LCBzaG93QWxsUHJvamVjdHMsIHJlbmFtZVByb2plY3QsIGRlbGV0ZVByb2plY3R9OyIsImltcG9ydCB7IHRvZG9GdW5jdGlvbnMgfSBmcm9tIFwiLi9jb250cm9sbGVyXCI7XG5cbmNvbnN0IGNoYW5nZVRvZG9TdGF0dXMgPSBmdW5jdGlvbih0b2RvRGF0YSkge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgdG9kb0RhdGEuY2hlY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS10b2RvJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93TmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG59XG5cbmNvbnN0IGhpZGVOZXdUYXNrV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpO1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3dGb3JtID0gbmV3VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3QgY3JlYXRlVG9kb0Jsb2NrSW5ET00gPSBmdW5jdGlvbih0b2RvRGF0YSwgdG9kb0V4cGlyZWRTdGF0dXMsIHByb2plY3RzTGlzdCwgdG9kb3MpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgY29uc3QgdGFza3NDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGFza3MnKTtcblxuICAgIGNvbnN0IHRvZG9CbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKCdzaW5nbGUtdG9kbycpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKHRvZG9EYXRhLnByaW9yaXR5KTtcblxuICAgIGlmICh0b2RvRXhwaXJlZFN0YXR1cykge1xuICAgICAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnZXhwaXJlZCcpO1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX3RpdGxlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gdG9kb0RhdGEuZHVlRGF0ZTtcbiAgICBkdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2R1ZS1kYXRlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGR1ZURhdGUpO1xuXG5cbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9ucy5jbGFzc0xpc3QuYWRkKCd0b2RvX19idXR0b25zJyk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGV0YWlscy50ZXh0Q29udGVudCA9ICdkZXRhaWxzJztcbiAgICBkZXRhaWxzLmNsYXNzTGlzdC5hZGQoJ2RldGFpbHMtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG5cbiAgICBjb25zdCBlZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZWRpdEltYWdlLnNyYyA9ICcuL2ltYWdlcy9pY29ucy9lZGl0LnN2Zyc7XG4gICAgZWRpdC5hcHBlbmRDaGlsZChlZGl0SW1hZ2UpO1xuICAgIGVkaXQuY2xhc3NMaXN0LmFkZCgnZWRpdC10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChlZGl0KTtcblxuICAgIGNvbnN0IGRlbGV0ZVRvZG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUb2RvSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBkZWxldGVUb2RvSW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2RlbGV0ZS5zdmcnO1xuICAgIGRlbGV0ZVRvZG8uYXBwZW5kQ2hpbGQoZGVsZXRlVG9kb0ltYWdlKTtcbiAgICBkZWxldGVUb2RvLmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZS10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChkZWxldGVUb2RvKTtcbiAgICBidXR0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9kb0Z1bmN0aW9ucy5iaW5kKGJ1dHRvbnMsIHRvZG9zLCB0b2RvRGF0YSwgcHJvamVjdHNMaXN0KSk7XG5cbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XG5cblxuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2NoZWNrYm94Jyk7XG4gICAgaWYgKHRvZG9EYXRhLmNoZWNrID09IHRydWUpIHtcbiAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIGNoZWNrYm94LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH1cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VUb2RvU3RhdHVzLmJpbmQoY2hlY2tib3gsIHRvZG9EYXRhKSk7XG5cbiAgICB0b2RvQmxvY2suZGF0YXNldC50aXRsZSA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRhc2tzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRvZG9CbG9jayk7IC8vIGFkZGluZyBuZXcgdG9kb0Jsb2NrIGludG8gdGFza3MgY29udGFpbmVyXG59XG5cbmNvbnN0IGNsZWFyVG9kb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUb2RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtdG9kbycpO1xuICAgIGN1cnJlbnRUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICB0b2RvLnJlbW92ZSgpO1xuICAgIH0pO1xufVxuXG5jb25zdCBjcmVhdGVFcnJvclBhcmFncmFwaCA9IGZ1bmN0aW9uKGlucHV0RmllbGQsIHByb2plY3RPck5vdCkge1xuICAgIGNvbnN0IGVycm9yUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoX19zaGlmdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJpb3JpdHknKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXBhcmFncmFwaCcpO1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgcHJpb3JpdHkgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnQ2hvb3NlIGR1ZSBkYXRlIG9mIHRoZSB0YXNrJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIGZpbGxlZCc7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJvamVjdFRpdGxlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoLXByb2plY3QnKTtcbiAgICAgICAgaWYgKCBpbnB1dEZpZWxkLnZhbHVlLnRyaW0oKSA9PSAnJyApIHtcbiAgICAgICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJXcml0ZSBwcm9qZWN0J3MgbmFtZSFcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJQcm9qZWN0IHdpdGggdGhpcyBuYW1lIGFscmVhZHkgZXhpc3QhXCI7XG4gICAgICAgIH1cbiAgICB9XG4gXG4gICAgaW5wdXRGaWVsZC5iZWZvcmUoZXJyb3JQYXJhZ3JhcGgpO1xufVxuXG5jb25zdCBkZWxldGVFcnJvclBhcmFncmFwaCA9IGZ1bmN0aW9uKGlucHV0RmllbGQpIHtcbiAgICBpbnB1dEZpZWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XG59XG5cbmNvbnN0IHJlc2V0RXJyb3JzID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGNvbnN0IGVycm9ycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmVycm9yLXBhcmFncmFwaCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVycm9yc1tpXS5yZW1vdmUoKTtcbiAgICB9XG4gICAgY29uc3QgZXJyb3JCb3JkZXJzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuaW52YWxpZCcpOyAvL2dldCBpbnB1dHMgd2l0aCBcImludmFsaWRcIiBjbGFzc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JCb3JkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVycm9yQm9yZGVyc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93VG9kb0dyb3VwVGl0bGUgPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0KSB7XG4gICAgY29uc3QgY3VycmVudFRpdGxlID0gY2xpY2tlZE9iamVjdC50ZXh0Q29udGVudDtcbiAgICBjb25zdCB0aXRsZURPTUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGl0bGUnKTtcbiAgICB0aXRsZURPTUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50VGl0bGU7XG59XG5cbmNvbnN0IG9wZW5FZGl0Rm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93Rm9ybSA9IGVkaXRUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2tfX2Zvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBlZGl0VGFza1dpbmRvd0Zvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuLWZvcm0nKTtcblxuICAgIHJldHVybiBlZGl0VGFza1dpbmRvd0Zvcm07XG59XG5cbmNvbnN0IGZpbGxFZGl0Rm9ybSA9IGZ1bmN0aW9uKHRvZG8sIGZvcm0pIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0b2RvKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmb3JtKTtcbiAgICBmb3JtLnRpdGxlLnZhbHVlID0gdG9kby50aXRsZTtcbiAgICBmb3JtLmRlc2NyaXB0aW9uLnZhbHVlID0gdG9kby5kZXNjcmlwdGlvbjtcbiAgICBmb3JtLmR1ZURhdGUudmFsdWUgPSB0b2RvLmR1ZURhdGU7XG5cbiAgICBpZiAodG9kby5wcmlvcml0eSA9PSAnbG93Jykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LWxvdycpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PSAnbWVkaXVtJykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LW1lZGl1bScpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PSAnaGlnaCcpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1oaWdoJykuY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuXG59XG5cbmNvbnN0IGNsb3NlRWRpdEZvcm0gPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3dGb3JtID0gZWRpdFRhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xufVxuXG5jb25zdCBvcGVuRGV0YWlsc1dpbmRvdyA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCBkZXRhaWxzV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlscycpO1xuICAgIGRldGFpbHNXaW5kb3cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICBjb25zdCB0aXRsZSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fdGl0bGUnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGU7XG4gICAgXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX2Rlc2NyaXB0aW9uJyk7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSAnRGVzY3JpcHRpb246ICcgKyB0b2RvLmRlc2NyaXB0aW9uO1xuXG4gICAgY29uc3QgZHVlRGF0ZSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fZHVlRGF0ZScpO1xuICAgIGR1ZURhdGUudGV4dENvbnRlbnQgPSAnRHVlIGRhdGU6ICcgKyB0b2RvLmR1ZURhdGU7XG5cbiAgICBjb25zdCBwcmlvcml0eSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fcHJpb3JpdHknKTtcbiAgICBwcmlvcml0eS50ZXh0Q29udGVudCA9ICdQcmlvcml0eTogJyArIHRvZG8ucHJpb3JpdHk7XG4gICAgcHJpb3JpdHkuY2xhc3NMaXN0LmFkZCgnZGV0YWlscy1wcmlvcml0eV9fJyArIHRvZG8ucHJpb3JpdHkpO1xufVxuXG5jb25zdCBhZGRQcm9qZWN0RE9NID0gZnVuY3Rpb24ocHJvamVjdCkge1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzIHVsJyk7XG4gICAgY29uc3QgY3VycmVudFByb2plY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGN1cnJlbnRQcm9qZWN0LmNsYXNzTGlzdC5hZGQoJ3NpbmdsZS1wcm9qZWN0Jyk7XG4gICAgY3VycmVudFByb2plY3QudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICAgIGN1cnJlbnRQcm9qZWN0LmRhdGFzZXQudGl0bGUgPSBwcm9qZWN0LnRpdGxlO1xuICAgIFxuICAgIGlmICggIXByb2plY3Qubm9ucmVtb3ZhYmxlICkge1xuICAgICAgICBjb25zdCBlZGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVkaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnZWRpdC1wcm9qZWN0LWJ1dHRvbicpO1xuICAgICAgICBjb25zdCBlZGl0TWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlZGl0TWVudS5jbGFzc0xpc3QuYWRkKCdlZGl0LXByb2plY3QnKTtcbiAgICBcbiAgICAgICAgY29uc3QgcmVuYW1lUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgcmVuYW1lUHJvamVjdC5jbGFzc0xpc3QuYWRkKCdyZW5hbWUtcHJvamVjdCcpO1xuICAgICAgICByZW5hbWVQcm9qZWN0LnRleHRDb250ZW50ID0gJ1JlbmFtZSBwcm9qZWN0JztcbiAgICAgICAgY29uc3QgZGVsZXRlUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgZGVsZXRlUHJvamVjdC5jbGFzc0xpc3QuYWRkKCdkZWxldGUtcHJvamVjdCcpO1xuICAgICAgICBkZWxldGVQcm9qZWN0LnRleHRDb250ZW50ID0gJ0RlbGV0ZSBwcm9qZWN0JztcbiAgICBcbiAgICAgICAgZWRpdE1lbnUuYXBwZW5kQ2hpbGQocmVuYW1lUHJvamVjdCk7XG4gICAgICAgIGVkaXRNZW51LmFwcGVuZENoaWxkKGRlbGV0ZVByb2plY3QpO1xuICAgICAgICBlZGl0QnV0dG9uLmFwcGVuZENoaWxkKGVkaXRNZW51KTtcbiAgICAgICAgY3VycmVudFByb2plY3QuYXBwZW5kQ2hpbGQoZWRpdEJ1dHRvbik7XG4gICAgfVxuXG4gICAgcHJvamVjdHMuYXBwZW5kQ2hpbGQoY3VycmVudFByb2plY3QpOyBcbn1cblxuY29uc3QgY2xlYXJQcm9qZWN0c01lbnUgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMgdWwnKTtcbiAgICBjb25zdCBwcm9qZWN0cyA9IHByb2plY3RzTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGlmIChwcm9qZWN0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RUb1JlbW92ZSA9IHByb2plY3RzW2ldOyBcbiAgICAgICAgICAgIHByb2plY3RzTGlzdC5yZW1vdmVDaGlsZChwcm9qZWN0VG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge3Nob3dOZXdUYXNrV2luZG93LCBoaWRlTmV3VGFza1dpbmRvdywgY3JlYXRlVG9kb0Jsb2NrSW5ET00sIGNsZWFyVG9kb0NvbnRhaW5lciwgY3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBoLCByZXNldEVycm9ycyxcbnNob3dUb2RvR3JvdXBUaXRsZSwgb3BlbkVkaXRGb3JtLCBjbG9zZUVkaXRGb3JtLCBmaWxsRWRpdEZvcm0sIG9wZW5EZXRhaWxzV2luZG93LCBhZGRQcm9qZWN0RE9NLCBjbGVhclByb2plY3RzTWVudX07IiwiY29uc3Qgc2F2ZUluTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG4gICAgbGV0IHNlcmlhbFByb2plY3RzTGlzdCA9IEpTT04uc3RyaW5naWZ5KHByb2plY3RzTGlzdCk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzTGlzdCcsIHNlcmlhbFByb2plY3RzTGlzdCk7XG59XG5cbmNvbnN0IGdldEZyb21Mb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgcHJvamVjdHNMaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvamVjdHNMaXN0JykpO1xuICAgIFxuICAgIHJldHVybiBwcm9qZWN0c0xpc3Q7XG59XG5cbmV4cG9ydCB7c2F2ZUluTG9jYWxTdG9yYWdlLCBnZXRGcm9tTG9jYWxTdG9yYWdlfSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIHJlc2V0RXJyb3JzLCBjbG9zZUVkaXRGb3JtLCBjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGh9IGZyb20gJy4vbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zJztcbmltcG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zLCBhZGRUb1Byb2plY3RzTGlzdCwgc2hvd0FsbFByb2plY3RzLCByZW5hbWVQcm9qZWN0LCBkZWxldGVQcm9qZWN0fSBmcm9tICcuL21vZHVsZXMvY29udHJvbGxlcic7XG5pbXBvcnQge2lzRm9ybVZhbGlkLCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAsIHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwLCBnZXRDdXJyZW50UHJvamVjdCwgZ2V0Q2hvc2VuUHJvamVjdCwgaGlnaGxpZ2h0UHJvamVjdCwgaXNUaXRsZVVzYWJsZX0gZnJvbSAnLi9tb2R1bGVzL2FwcExvZ2ljJztcbmltcG9ydCB7c2F2ZUluTG9jYWxTdG9yYWdlLCBnZXRGcm9tTG9jYWxTdG9yYWdlfSBmcm9tICcuL21vZHVsZXMvbG9jYWxTdG9yYWdlJztcblxuKGZ1bmN0aW9uKCkge1xuICAgIGxldCB0b2RvcyA9IFtdO1xuICAgIGxldCBwcm9qZWN0c0xpc3QgPSBbXTtcbiAgICBcbiAgICAvLyBjcmVhdGluZyBleGFtcGxlIHRvZG9zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IGZpcnN0VG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDYWxsIHRvIElyaW5hJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGhhdmUgdG8gY2FsbCB0byBJcmluYSBhbmQga25vdyB3aGVyZSBzaGUgaXMuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTcnLFxuICAgICAgICBwcmlvcml0eTogJ2hpZ2gnLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlY29uZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQnV5IGEgcGl6emEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgbmVlZCB0byBidXkgdHdvIHBpenphcyBmb3IgbWUgYW5kIElyaW5hLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA4LTE5JyxcbiAgICAgICAgcHJpb3JpdHk6ICdtZWRpdW0nLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHRoaXJkVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdIbW1tbW1tbW0uJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTgnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICBjb25zdCBmb3VydGhUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0NoZWNrIFRvZG8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgYW0ganVzdCBjaGVja2luZy4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNy0xNScsXG4gICAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgICAgY2hlY2s6IHRydWUsXG4gICAgfTtcblxuICAgIHRvZG9zLnB1c2goZmlyc3RUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHNlY29uZFRvZG8pO1xuICAgIHRvZG9zLnB1c2godGhpcmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKGZvdXJ0aFRvZG8pO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgXG4gICAgLy8gbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgLy8gY29uc29sZS5sb2coIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VuZGVmaW5lZCcpKSApO1xuXG4gICAgaWYgKCAhSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvamVjdHNMaXN0JykpICkge1xuICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBmaXJzdCB0aW1lIGhlcmUuIE9yIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggTG9jYWwgU3RvcmFnZS4gU28gd2Ugc2hvdyBzdGFuZGFydCBwcm9qZWN0cy4gXFxcbiAgICAgICAgWW91IHNob3VsZCB3cml0ZSBtZSAoZGFtaXJpb3MpLiBTb3JyeSgnKTtcbiAgICAgICAgY29uc3QgbWFpblByb2plY3QgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ01haW4nLFxuICAgICAgICAgICAgdG9kb3M6IHRvZG9zLFxuICAgICAgICAgICAgbm9ucmVtb3ZhYmxlOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgICBhZGRUb1Byb2plY3RzTGlzdChtYWluUHJvamVjdCwgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgfSBlbHNlIHsgICAgXG4gICAgICAgIHByb2plY3RzTGlzdCA9IGdldEZyb21Mb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICBzaG93QWxsUHJvamVjdHMocHJvamVjdHNMaXN0KTtcbiAgICBoaWdobGlnaHRQcm9qZWN0KHByb2plY3RzTGlzdFswXSk7XG4gICAgdG9kb3MgPSBwcm9qZWN0c0xpc3RbMF0udG9kb3M7XG5cbiAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBwcm9qZWN0c0xpc3RbMF0udG9kb3M7XG4gICAgc2hvd0FsbFRvZG9zKHRvZG9zRm9yU2hvdywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciB0aGUgbmV3IHRhc2sgZm9ybSBhbmQgY2xvc2luZyBjb25kaXRpb25zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCB0YXNrRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCBhZGRUYXNrV2luZG93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10YXNrJyk7IC8vIGJ1dHRvbiB0aGF0IG9wZW5zIG5ldyB0YXNrIGZvcm1cbiAgICAgICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpOyAvLyBmb3JtJ3Mgb3V0ZXIgZGl2IGJsb2NrXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpOyAvLyBuZXcgdGFzayBmb3JtXG4gICAgICAgIGNvbnN0IGNsb3NlVGFza1dpbmRvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19jbG9zaW5nLWJ1dHRvbicpOyAvLyBjbG9zZSBmb3JtIGJ1dHRvblxuICAgICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VibWl0IGJ1dHRvbicpOyAvLyBmb3JtJ3Mgc3VibWl0IGJ1dHRvblxuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrVG9FZGl0ID0gY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKTsgLy8gdGhpcyBuZWVkIHRvIG9wZW4gZWRpdCB0b2RvIGZvcm1cbiAgICAgICAgY29uc3QgZWRpdEZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgICAgIGNvbnN0IGVkaXRGb3JtID0gZWRpdEZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBlZGl0Rm9ybUNsb3NlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fY2xvc2luZy1idXR0b24nKTtcbiAgICAgICAgY29uc3QgZGV0YWlsc1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHMnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Q2xvc2luZ0J1dHRvbiA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0X19jbG9zaW5nLWJ1dHRvbicpO1xuICAgICAgICBjb25zdCBhY3RpdmVFZGl0UHJvamVjdE1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWN0aXZlLWVkaXQtbWVudScpO1xuICAgICAgICBjb25zdCByZW5hbWVQcm9qZWN0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVuYW1lLXByb2plY3QtYmxvY2snKTtcbiAgICAgICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrRm9ybSA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IGdldEN1cnJlbnRQcm9qZWN0KHByb2plY3RzTGlzdCk7XG4gICAgICAgIHRvZG9zID0gY3VycmVudFByb2plY3QudG9kb3M7XG5cbiAgICAgICAgaWYgKCFuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykpIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBvcGVuXG4gICAgICAgICAgICBpZiAoIGNsaWNrZWRPYmplY3QgPT0gY2xvc2VUYXNrV2luZG93QnV0dG9uIHx8ICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5mb3JtJykgKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgdGhlIFwiY2xvc2UgZm9ybVwiIGJ1dHRvbiBvciBpcyBub3QgZm9ybSB3aW5kb3dcbiAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICByZXNldEVycm9ycyhmb3JtKTsgLy9yZXNldCBlcnJvciBwYXJhZ3JhcGhzIGlmIHRoZXkgYXJlIGV4aXN0XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWNrZWRPYmplY3QgPT0gc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZm9ybSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvVGhlVG9kb0xpc3QoZm9ybSwgdG9kb3MpOyAvLyBjcmVhdGVzIGFuZCBpbnNlcnQgbmV3IHRvZG8gaW4gRE9NXG4gICAgICAgICAgICAgICAgICAgIHNhdmVJbkxvY2FsU3RvcmFnZShwcm9qZWN0c0xpc3QpOyAvLyBzYXZlIG5ldyBUb2RvIHRocm91Z2ggcHJvamVjdHNMaXN0IGluIGxvY2FsU3RvcmFnZVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyBuZWVkIHRvIGhpZ2hsaWdodCBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3NHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvLyBcImFsbCB0YXNrc1wiIGJ1dHRvbiBhZnRlclxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvL2lmIHRoZSBuZXcgdGFzayBmb3JtIGlzIGNsb3NlZFxuXG4gICAgICAgICAgICBpZiAoIGFjdGl2ZUVkaXRQcm9qZWN0TWVudSAmJiBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5lZGl0LXByb2plY3QnKSAhPSBhY3RpdmVFZGl0UHJvamVjdE1lbnUgKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlRWRpdFByb2plY3RNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1lZGl0LW1lbnUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNsaWNrZWRPYmplY3QgPT0gYWRkVGFza1dpbmRvd0J1dHRvbikgeyAvL2NoZWNrIGlmIGNsaWNrZWQgT2JqZWN0IGlzIFwiYWRkIHRhc2tcIiBidXR0b25cbiAgICAgICAgICAgICAgICBzaG93TmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKGNsaWNrZWRPYmplY3QgPT0gZWRpdEZvcm1Db250YWluZXIgJiYgIWVkaXRGb3JtQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykgJiYgXG4gICAgICAgICAgICAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZWRpdC10YXNrX19mb3JtJykgKSB8fCBjbGlja2VkT2JqZWN0ID09IGVkaXRGb3JtQ2xvc2VCdXR0b24pIHsgLy8gaWYgZWRpdCBmb3JtIGlzIG9wZW4uIFRoZW4gY2xvc2UgYnV0dG9uIGNsaWNrZWRcbiAgICAgICAgICAgICAgICBjbG9zZUVkaXRGb3JtKCk7XG4gICAgICAgICAgICAgICAgZWRpdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbHNXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcudGFzay1kZXRhaWxzJykgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsc1ByaW9yaXR5ID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX19wcmlvcml0eScpO1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5jb250YWlucygnZGV0YWlscy1wcmlvcml0eV9fbG93JykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWxzLXByaW9yaXR5X19sb3cnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRhaWxzLXByaW9yaXR5X19tZWRpdW0nKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtcHJpb3JpdHlfX21lZGl1bScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtcHJpb3JpdHlfX2hpZ2gnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtcHJpb3JpdHlfX2hpZ2gnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGV0YWlsc1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcubmV3LXByb2plY3QnKSAmJiAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcubmV3LXByb2plY3QgZm9ybScpIHx8IGNsaWNrZWRPYmplY3QgPT0gbmV3UHJvamVjdENsb3NpbmdCdXR0b24pIHtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19jbG9zaW5nLWJ1dHRvbicpIHx8IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrJykgJiYgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19mb3JtJykpIHtcbiAgICAgICAgICAgICAgICByZW5hbWVQcm9qZWN0QmxvY2suY2xhc3NMaXN0LmFkZCgnaGlkZGVuLXJlbmFtZScpO1xuICAgICAgICAgICAgICAgIHJlbmFtZVByb2plY3RCbG9ja0Zvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0tcmVuYW1lJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRhc2tGdW5jdGlvbnMpO1xuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGFzayBncm91cHNcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vZ2V0IHNpZGViYXIgdGFzayBncm91cHNcblxuICAgIGNvbnN0IHRhc2tHcm91cHNGdW5jdGlvbnMgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIGlmIChjbGlja2VkT2JqZWN0ICE9IHRhc2tHcm91cHMpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCh0YXNrR3JvdXBzLCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgICAgIGNvbnN0IHRvZG9zRm9yU2hvdyA9IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwKGNsaWNrZWRPYmplY3QsIHRvZG9zKTtcbiAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2Rvc0ZvclNob3csIHRvZG9zLCBwcm9qZWN0c0xpc3QsIGNsaWNrZWRPYmplY3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRhc2tHcm91cHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0YXNrR3JvdXBzRnVuY3Rpb25zKTtcblxuICAgIC8vIEFkZCBFdmVudCBMaXN0ZW5lcnMgZm9yIHByb2plY3RzXG4gICAgY29uc3QgcHJvamVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMnKTtcbiAgICBjb25zdCBjcmVhdGVQcm9qZWN0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0X19hY2NlcHQtdGl0bGUnKTtcblxuICAgIGNvbnN0IHByb2plY3RzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGFkZFByb2plY3RCdXR0b24gPSBwcm9qZWN0cy5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHNfX2NyZWF0ZScpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0Jyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RGb3JtID0gbmV3UHJvamVjdC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIGNvbnN0IGFsbFByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2plY3RzIHVsIGxpJyk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIGFkZFByb2plY3RCdXR0b24gJiYgYWRkUHJvamVjdEJ1dHRvbiA9PSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5wcm9qZWN0c19fY3JlYXRlJykgKSB7XG4gICAgICAgICAgICBuZXdQcm9qZWN0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuLWZvcm0nKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3NpbmdsZS1wcm9qZWN0JykgKSB7XG4gICAgICAgICAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LnRpdGxlID09IGNsaWNrZWRPYmplY3QuZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0UHJvamVjdChjdXJyZW50UHJvamVjdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyBuZWVkIHRvIGhpZ2hsaWdodCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tzR3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFza3MgdWwnKTsgLy8gXCJhbGwgdGFza3NcIiBidXR0b24gYWZ0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCh0YXNrc0dyb3VwLCBhbGxUYXNrcyk7IC8vIGNyZWF0aW5nIGEgbmV3IHRhc2tcblxuICAgICAgICAgICAgICAgICAgICAgICAgdG9kb3MgPSBjdXJyZW50UHJvamVjdC50b2RvcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXByb2plY3QtYnV0dG9uJykgKSB7XG4gICAgICAgICAgICBjb25zdCBjbGlja2VkUHJvamVjdCA9IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnNpbmdsZS1wcm9qZWN0Jyk7XG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0RWRpdE1lbnUgPSBjbGlja2VkT2JqZWN0LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXByb2plY3QnKTtcbiAgICAgICAgICAgIHByb2plY3RFZGl0TWVudS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUtZWRpdC1tZW51Jyk7XG5cbiAgICAgICAgICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0UHJvamVjdChjdXJyZW50UHJvamVjdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZG9zID0gY3VycmVudFByb2plY3QudG9kb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5hY3RpdmUtZWRpdC1tZW51JykgKSB7XG4gICAgICAgICAgICBjb25zdCBjbGlja2VkUHJvamVjdCA9IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnNpbmdsZS1wcm9qZWN0Jyk7XG5cbiAgICAgICAgICAgIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ2RlbGV0ZS1wcm9qZWN0JykgKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlUHJvamVjdChjbGlja2VkUHJvamVjdCwgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZW5hbWUtcHJvamVjdCcpICkge1xuICAgICAgICAgICAgICAgIHJlbmFtZVByb2plY3QoY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuYWN0aXZlLWVkaXQtbWVudScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1lZGl0LW1lbnUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcm9qZWN0cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHByb2plY3RzRnVuY3Rpb25zKTtcblxuXG4gICAgY29uc3QgYWRkUHJvamVjdCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBwcm9qZWN0VGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcHJvamVjdC10aXRsZScpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0Jyk7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RGb3JtID0gbmV3UHJvamVjdC5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRIaWdobGlnaHRlZFByb2plY3RJbkRPTSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaG9zZW4tcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBjaG9zZW5Qcm9qZWN0ID0gZ2V0Q2hvc2VuUHJvamVjdChjdXJyZW50SGlnaGxpZ2h0ZWRQcm9qZWN0SW5ET00sIHByb2plY3RzTGlzdCk7XG4gICAgICAgIFxuXG4gICAgICAgIGlmICggcHJvamVjdFRpdGxlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvci1wYXJhZ3JhcGgtcHJvamVjdCcpICkge1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocHJvamVjdFRpdGxlKTtcbiAgICAgICAgICAgIHByb2plY3RUaXRsZS5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocHJvamVjdFRpdGxlLnZhbHVlLnRyaW0oKSA9PSAnJykge1xuICAgICAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgocHJvamVjdFRpdGxlKTtcbiAgICAgICAgICAgIHByb2plY3RUaXRsZS5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICggaXNUaXRsZVVzYWJsZShwcm9qZWN0VGl0bGUudmFsdWUsIHByb2plY3RzTGlzdCkgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBwcm9qZWN0VGl0bGUudmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHRvZG9zOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgbm9ucmVtb3ZhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgYWRkVG9Qcm9qZWN0c0xpc3QoY3VycmVudFByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY3VycmVudEhpZ2hsaWdodGVkUHJvamVjdEluRE9NKTtcbiAgICAgICAgICAgICAgICBoaWdobGlnaHRQcm9qZWN0KGNob3NlblByb2plY3QpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5ld1Byb2plY3QuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0nKTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcm9qZWN0VGl0bGUpO1xuICAgICAgICAgICAgICAgIHByb2plY3RUaXRsZS5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuICAgIGNyZWF0ZVByb2plY3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRQcm9qZWN0KTtcblxufSkoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=