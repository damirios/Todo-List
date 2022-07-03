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

    let allowToRename = true;
    if ( newTitle.trim() != '' ) {
        
        if ( renameInput.classList.contains('invalid') ) {
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(renameInput);
            renameInput.classList.remove('invalid');
        }

        for (let i = 0; i < projectsList.length; i++) {
            const currentProject = projectsList[i];
            if (currentProject.title == newTitle) {
                if ( !renameInput.classList.contains('invalid') ) {
                    (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(renameInput);
                    renameInput.classList.add('invalid');
                }
                allowToRename = false;
            }
        }

        if (allowToRename) {
            for (let j = 0; j < projectsList.length; j++) {
                const currentProject = projectsList[j];
                
                if (currentProject.title == previousTitle) {
                    currentProject.title = newTitle;
                    (0,_localStorage__WEBPACK_IMPORTED_MODULE_2__.saveInLocalStorage)(projectsList);
                    showAllProjects(projectsList);
                    (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.highlightProject)(projectsList[j]);
                    showAllTodos(projectsList[j].todos, projectsList[j].todos, projectsList);
                    renameProjectBlock.classList.add('hidden-rename');
                    renameProjectBlockForm.classList.add('hidden-form-rename');
                }
            }
        }
    } else {
        if ( !renameInput.classList.contains('invalid') ) {
            (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createErrorParagraph)(renameInput);
            renameInput.classList.add('invalid');
        }
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
                const renameInput = renameProjectBlockForm.querySelector('#rename-project-title-block');
                
                renameInput.value = '';
                if ( renameInput.classList.contains('invalid') ) {
                    (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.deleteErrorParagraph)(renameInput);
                    renameInput.classList.remove('invalid');
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxnQ0FBZ0MseUJBQXlCO0FBQ3pEO0FBQ0E7QUFDQSx3QkFBd0IsbUVBQWdCOztBQUV4QywrRUFBK0U7QUFDL0UsZ0ZBQWdGO0FBQ2hGLHdCQUF3QiwyRUFBd0Isd0JBQXdCOztBQUV4RTtBQUNBLHdCQUF3QixpRUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0NBQWdDLHlCQUF5QjtBQUN6RDtBQUNBO0FBQ0Esd0JBQXdCLG1FQUFnQjs7QUFFeEM7QUFDQSx3QkFBd0IsaUVBQVk7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBO0FBQ0EsZ0JBQWdCLGtFQUFhO0FBQzdCLGNBQWM7QUFDZCxnQkFBZ0Isa0VBQWE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLG1FQUFnQjtBQUM5Qzs7QUFFQTtBQUNBLFlBQVksK0VBQW9CO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLCtFQUFvQjtBQUNoQzs7QUFFQSxVQUFVO0FBQ1YsaUJBQWlCLGdFQUFhO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQix1RUFBaUI7QUFDakMsZ0JBQWdCLHlFQUFrQjtBQUNsQyxnQkFBZ0Isb0VBQWU7QUFDL0IsZ0JBQWdCLG1FQUFnQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxnQkFBZ0IsK0VBQW9CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHBMb2dpYy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9jb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvbG9jYWxTdG9yYWdlLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaH0gZnJvbSAnLi9kb21NYW5pcHVsYXRpb25zJztcblxuY29uc3QgdG9kb0ZhY3RvcnkgPSBmdW5jdGlvbihmb3JtLCBjaGVja1N0YXR1cykge1xuICAgIGxldCB0b2RvT2JqZWN0ID0ge307IC8vIG9iamVjdCB0aGF0IGNvbGxlY3RzIGluZm8gZnJvbSBuZXcgdGFzayBmb3JtIVxuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IGZvcm0uZWxlbWVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtRWxlbWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7IC8vIGFsbCBmaWVsZHMgZXhjZXB0IHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1FbGVtZW50c1tpXTtcbiAgICAgICAgaWYgKGVsZW1lbnQubmFtZSA9PSAndGl0bGUnIHx8IGVsZW1lbnQubmFtZSA9PSAnZGVzY3JpcHRpb24nKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PSAncHJpb3JpdHknICYmIGVsZW1lbnQuY2hlY2tlZCkge1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1sb3cnKSB7IC8vdGhlc2UgY2hlY2tzIGZvciBlZGl0LS4uLiBuZWVkcyB0byBzaG93IHByaW9yaXR5IC0gZWRpdEZvcm0gcHJpb3JpdHkgYnV0dG9ucyBpZCdzIGRpZmZlciBuZXdUYXNrRm9ybSdzIChvYnZpb3VzbHkpXG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ2xvdyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9ICdtZWRpdW0nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlkID09ICdlZGl0LWhpZ2gnKSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ2hpZ2gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LmlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2RvT2JqZWN0LmNoZWNrID0gY2hlY2tTdGF0dXM7XG4gICAgcmV0dXJuIHRvZG9PYmplY3Q7XG59XG5cbmNvbnN0IGlzRm9ybVZhbGlkID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBmb3JtLnRpdGxlO1xuICAgIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGZvcm0uZHVlRGF0ZTtcbiAgICBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucHJpb3JpdHk7IFxuICAgIC8vIGNvbnN0IHRpdGxlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I3RpdGxlJyk7XG4gICAgLy8gY29uc3QgZHVlRGF0ZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dCNkdWVEYXRlJyk7XG4gICAgLy8gY29uc3QgcHJpb3JpdHlJbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9cHJpb3JpdHldJyk7XG4gICAgY29uc3QgcHJpb3JpdHlCdXR0b25zID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucHJpb3JpdHlfX2J1dHRvbnMsIC5lZGl0LWZvcm0tcHJpb3JpdHlfX2J1dHRvbnMnKTtcblxuICAgIGxldCB2YWxpZFByaW9yaXR5O1xuICAgIGxldCBwcmlvcml0eUNoZWNrID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmlvcml0eUlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJpb3JpdHlJbnB1dCA9IHByaW9yaXR5SW5wdXRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFByaW9yaXR5SW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgcHJpb3JpdHlDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHJpb3JpdHlDaGVjayAmJiAhcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIHZhbGlkUHJpb3JpdHkgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHByaW9yaXR5Q2hlY2spIHtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IHRydWU7XG4gICAgICAgIGlmIChwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvci1wYXJhZ3JhcGgnKSkge1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocHJpb3JpdHlJbnB1dHNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkRHVlRGF0ZTtcbiAgICBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGR1ZURhdGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWREdWVEYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWRUaXRsZTtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgPT0gJycgJiYgIXRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgdGl0bGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIHZhbGlkVGl0bGUgPSBmYWxzZTtcblxuICAgIH0gZWxzZSBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWRUaXRsZSA9IHRydWU7XG4gICAgICAgIGlmICh0aXRsZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWQgPSB2YWxpZFByaW9yaXR5ICYmIHZhbGlkRHVlRGF0ZSAmJiB2YWxpZFRpdGxlO1xuICAgIHJldHVybiB2YWxpZDtcbn1cblxuY29uc3QgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24odGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IHRhc2tHcm91cHNFbGVtZW50cyA9IHRhc2tHcm91cHMucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tHcm91cHNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza0dyb3VwID0gdGFza0dyb3Vwc0VsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFRhc2tHcm91cCA9PSBjbGlja2VkT2JqZWN0ICYmICFjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUYXNrR3JvdXAgIT0gY2xpY2tlZE9iamVjdCAmJiBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBzb3J0Q3VycmVudFRvZG8gPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0LCB0b2RvKSB7XG4gICAgY29uc3QgY3VycmVudERhdGVBbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXREYXRlKCk7XG4gICAgY29uc3QgY3VycmVudEhvdXJzID0gY3VycmVudERhdGVBbmRUaW1lLmdldEhvdXJzKCk7XG4gICAgY29uc3QgY3VycmVudE1pbnV0ZXMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TWludXRlcygpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWNvbmRzID0gY3VycmVudERhdGVBbmRUaW1lLmdldFNlY29uZHMoKTtcblxuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCB0b2RvTW9udGggLSAxLCB0b2RvRGF0ZSk7IC8vRGF0ZSBPYmogZm9yIHRvZG9cblxuICAgIGlmIChjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygndG9kYXknKSkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJ0b2RheVwiXG4gICAgICAgIGlmICggaXNUb2RheSh0b2RvWWVhciwgdG9kb01vbnRoLCB0b2RvRGF0ZSwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgY3VycmVudERhdGUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWVrJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRoaXMgd2Vla1wiXG4gICAgICAgIGlmICggaXNXZWVrKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJtb250aFwiXG4gICAgICAgIGlmICggaXNNb250aCh0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnYWxsLXRhc2tzJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcImFsbCB0YXNrc1wiXG4gICAgICAgIHJldHVybiB0b2RvO1xuICAgIH1cbn1cblxuY29uc3QgaXNUb2RheSA9IGZ1bmN0aW9uKHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBleHBpcmVkIHRvZGF5XG4gICAgaWYgKCB0b2RvWWVhciA9PSBjdXJyZW50WWVhciAmJiB0b2RvTW9udGggPT0gY3VycmVudE1vbnRoICYmIHRvZG9EYXRlID09IGN1cnJlbnREYXRlICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBpc1dlZWsgPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSB3ZWVrXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgaWYgKGRpZmZlcmVuY2VJbkRheXMgPD0gNyAmJiBkaWZmZXJlbmNlSW5EYXlzID49IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzTW9udGggPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSBtb250aFxuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpICsgMTtcbiAgICBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzIgJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKCBjdXJyZW50TW9udGggPT0gMSB8fCBjdXJyZW50TW9udGggPT0gMyB8fCBjdXJyZW50TW9udGggPT0gNSB8fCBjdXJyZW50TW9udGggPT0gNyB8fCBjdXJyZW50TW9udGggPT0gOCB8fCBjdXJyZW50TW9udGggPT0gMTAgfHwgY3VycmVudE1vbnRoID09IDEyICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzEgJiYgKGN1cnJlbnRNb250aCA9PSA0IHx8IGN1cnJlbnRNb250aCA9PSA2IHx8IGN1cnJlbnRNb250aCA9PSA5IHx8IGN1cnJlbnRNb250aCA9PSAxMSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggIGN1cnJlbnRNb250aCA9PSAyICYmIChkaWZmZXJlbmNlSW5EYXlzIDw9ICgyOSArIGlzTGVhcFllYXIoY3VycmVudFllYXIpKSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlzTGVhcFllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgaWYgKHllYXIgJSA0ID09IDApIHtcbiAgICAgICAgaWYgKHllYXIgJSAxMDAgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHllYXIgJSA0MDAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5jb25zdCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG9zKSB7XG4gICAgXG4gICAgbGV0IHRvZG9MaXN0VG9TaG93ID0gW107IC8vY3VycmVudCB0b2RvTGlzdCB0aGF0IHdlIGdvaW5nIHRvIHNob3csIHdlJ2xsIGZpbGwgaXRcbiAgICBpZiAodG9kb3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRUb2RvID0gc29ydEN1cnJlbnRUb2RvKGNsaWNrZWRPYmplY3QsIHRvZG8pOyAvL2VpdGhlciByZXR1cm4gdG9kbyBvciBudWxsXG4gICAgICAgICAgICB0b2RvTGlzdFRvU2hvdy5wdXNoKHNvcnRlZFRvZG8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2RvTGlzdFRvU2hvdztcbn1cblxuY29uc3QgaXNUb2RvRXhwaXJlZCA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCB0b2RvRnVsbERhdGUgPSB0b2RvLmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICBjb25zdCB0b2RvWWVhciA9IHRvZG9GdWxsRGF0ZVswXTtcbiAgICBjb25zdCB0b2RvTW9udGggPSB0b2RvRnVsbERhdGVbMV07XG4gICAgY29uc3QgdG9kb0RhdGUgPSB0b2RvRnVsbERhdGVbMl07XG4gICAgY29uc3QgdG9kb0RhdGVPYmogPSBuZXcgRGF0ZSh0b2RvWWVhciwgK3RvZG9Nb250aCAtIDEsICt0b2RvRGF0ZSArMSApO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlT2JqID0gbmV3IERhdGUoKTtcbiAgICBpZiAoIHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVPYmogPCAwICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBhZGRFeHBpcmF0aW9uU3RhdHVzID0gZnVuY3Rpb24odG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgIHRvZG8uZXhwaXJlZCA9IGlzVG9kb0V4cGlyZWQodG9kbyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGRlbGV0ZVRvZG8gPSBmdW5jdGlvbihjdXJyZW50VG9kbywgdG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICggdG9kb3NbaV0gPT0gY3VycmVudFRvZG8gKSB7XG4gICAgICAgICAgICB0b2Rvcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGdldENoYW5nZWRUb2RvcyA9IGZ1bmN0aW9uKHRvZG8sIHRvZG9zLCBlZGl0Rm9ybSkge1xuICAgIGNvbnNvbGUubG9nKHRvZG8pO1xuICAgIGNvbnNvbGUubG9nKHRvZG9zKTtcbiAgICBjb25zb2xlLmxvZyhlZGl0Rm9ybSk7XG4gICAgY29uc3QgbmV3VG9kbyA9IHRvZG9GYWN0b3J5KGVkaXRGb3JtLCB0b2RvLmNoZWNrKTtcbiAgICBjb25zdCB0b2RvSW5kZXhUb1JlcGxhY2UgPSB0b2Rvcy5pbmRleE9mKHRvZG8pO1xuXG4gICAgaWYgKHRvZG9JbmRleFRvUmVwbGFjZSAhPSAtMSkge1xuICAgICAgICB0b2Rvc1t0b2RvSW5kZXhUb1JlcGxhY2VdID0gbmV3VG9kbztcbiAgICB9XG4gICAgcmV0dXJuIHRvZG9zO1xufVxuXG5jb25zdCBnZXRDdXJyZW50UHJvamVjdCA9IGZ1bmN0aW9uKHByb2plY3RzTGlzdCkge1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpbmdsZS1wcm9qZWN0Jyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIHByb2plY3RzW2ldLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IGdldENob3NlblByb2plY3QgPSBmdW5jdGlvbihjdXJyZW50Q2hvc2VuUHJvamVjdEluRE9NLCBwcm9qZWN0c0xpc3QpIHtcbiAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LnRpdGxlID09IGN1cnJlbnRDaG9zZW5Qcm9qZWN0SW5ET00uZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50UHJvamVjdDtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGhpZ2hsaWdodFByb2plY3QgPSBmdW5jdGlvbihwcm9qZWN0KSB7XG4gICAgY29uc3QgYWxsUHJvamVjdHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXByb2plY3QnKTtcbiAgICBpZiAoYWxsUHJvamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbFByb2plY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IGFsbFByb2plY3RzW2ldO1xuICAgICAgICAgICAgY3VycmVudFByb2plY3QuY2xhc3NMaXN0LnJlbW92ZSgnY2hvc2VuLXByb2plY3QnKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UHJvamVjdC5kYXRhc2V0LnRpdGxlID09IHByb2plY3QudGl0bGUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tcHJvamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBpc1RpdGxlVXNhYmxlID0gZnVuY3Rpb24ocHJvamVjdFRpdGxlLCBwcm9qZWN0c0xpc3QpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdHNMaXN0W2ldO1xuICAgICAgICBpZiAocHJvamVjdC50aXRsZSA9PSBwcm9qZWN0VGl0bGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuXG5leHBvcnQge3RvZG9GYWN0b3J5LCBpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgXG4gICAgZ2V0Q2hhbmdlZFRvZG9zLCBnZXRDdXJyZW50UHJvamVjdCwgZ2V0Q2hvc2VuUHJvamVjdCwgaGlnaGxpZ2h0UHJvamVjdCwgaXNUaXRsZVVzYWJsZX0iLCJpbXBvcnQge2NyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIHNob3dUb2RvR3JvdXBUaXRsZSwgb3BlbkVkaXRGb3JtLCBmaWxsRWRpdEZvcm0sIGNsb3NlRWRpdEZvcm0sIG9wZW5EZXRhaWxzV2luZG93LCBhZGRQcm9qZWN0RE9NLCBjbGVhclByb2plY3RzTWVudSwgY3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHt0b2RvRmFjdG9yeSwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgaXNGb3JtVmFsaWQsIGdldENoYW5nZWRUb2RvcywgaGlnaGxpZ2h0UHJvamVjdH0gZnJvbSAnLi9hcHBMb2dpYyc7XG5pbXBvcnQgeyBzYXZlSW5Mb2NhbFN0b3JhZ2UgfSBmcm9tICcuL2xvY2FsU3RvcmFnZSc7XG5cbmNvbnN0IGFkZFRvVGhlVG9kb0xpc3QgPSBmdW5jdGlvbihmb3JtLCB0b2Rvcykge1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShmb3JtKTtcbiAgICB0b2Rvcy5wdXNoKG5ld1RvZG8pO1xufVxuXG5jb25zdCBjb21wYXJlRnVuY3Rpb24gPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7IC8vIHNvcnQgYnkgcHJpb3JpdHkgb2YgdG9kbyBhbmQgZXhwaXJlZCB0b2RvcyB3aWxsIGJlIGluIHRoZSBib3R0b20uIEFsc28gbW9zdCB1cmdlIHRvZG9zIHdpbGwgYmUgaW4gZmlyc3QgcGxhY2VcbiAgICBpZiAoZmlyc3QgJiYgc2Vjb25kKSB7XG5cbiAgICAgICAgY29uc3QgY29tcGFyZURhdGVzID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlID0gZmlyc3QuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZSA9IHNlY29uZC5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBjb25zdCBmaXJzdERhdGVPYmogPSBuZXcgRGF0ZSggZmlyc3REYXRlWzBdLCBmaXJzdERhdGVbMV0sIGZpcnN0RGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3Qgc2Vjb25kRGF0ZU9iaiA9IG5ldyBEYXRlKCBzZWNvbmREYXRlWzBdLCBzZWNvbmREYXRlWzFdLCBzZWNvbmREYXRlWzJdICk7XG4gICAgICAgICAgICBjb25zdCBkYXRlRGlmZmVyZW5jZSA9IGZpcnN0RGF0ZU9iaiAtIHNlY29uZERhdGVPYmo7XG4gICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wYXJlUHJpb3JpdHkgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbWVkaXVtJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKzE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpcnN0LmV4cGlyZWQpIHtcbiAgICAgICAgICAgIGlmIChzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5RGlmZmVyZW5jZSA9IGNvbXBhcmVQcmlvcml0eShmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpb3JpdHlEaWZmZXJlbmNlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBjb21wYXJlRGF0ZXMoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJpb3JpdHlEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3Qgc2hvd0FsbFRvZG9zID0gZnVuY3Rpb24odG9kb3NGb3JTaG93LCBhbGxUb2RvcywgcHJvamVjdHNMaXN0LCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY2xlYXJUb2RvQ29udGFpbmVyKCk7IC8vIGNsZWFycyB0b2RvIGNvbnRhaW5lciBvZiBhbGwgdGFza3MgYW5kIHRoZW4gd2Ugd2lsbCBjcmVhdGUgaXQgYWdhaW4gd2l0aCBjaG9zZW4gcGFyYW1ldGVyc1xuICAgIGlmIChjbGlja2VkT2JqZWN0KSB7XG4gICAgICAgIHNob3dUb2RvR3JvdXBUaXRsZShjbGlja2VkT2JqZWN0KTtcbiAgICB9XG5cbiAgICBpZiAodG9kb3NGb3JTaG93ICYmIHRvZG9zRm9yU2hvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFkZEV4cGlyYXRpb25TdGF0dXModG9kb3NGb3JTaG93KTtcbiAgICAgICAgdG9kb3NGb3JTaG93LnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3NGb3JTaG93Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NGb3JTaG93W2ldO1xuICAgICAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgICAgICBjcmVhdGVUb2RvQmxvY2tJbkRPTSh0b2RvLCBpc1RvZG9FeHBpcmVkKHRvZG8pLCBwcm9qZWN0c0xpc3QsIGFsbFRvZG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgdG9kb0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKHRvZG9zLCBjdXJyZW50VG9kbywgcHJvamVjdHNMaXN0LCBlKSB7XG4gICAgY29uc3QgY2xpY2tlZEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbicpOyAvLyBnZXQgY2xpY2tlZCBCdXR0b24gb3IgbnVsbFxuICAgIGlmIChjbGlja2VkQnV0dG9uKSB7XG4gICAgICAgIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RlbGV0ZS10b2RvJykgKSB7XG4gICAgICAgICAgICBkZWxldGVUb2RvKGN1cnJlbnRUb2RvLCB0b2Rvcyk7XG4gICAgICAgICAgICBzYXZlSW5Mb2NhbFN0b3JhZ2UocHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2RvcywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGdldENoYW5nZWRUb2Rvcyh0b2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjY2VwdENoYW5nZXNCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmJvdW5kRXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGlja0V2ZW50U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IGVkaXRCdXR0b25DbGFzcyhjdXJyZW50VG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtdG9kbycpICkge1xuICAgICAgICAgICAgb3BlbkRldGFpbHNXaW5kb3coY3VycmVudFRvZG8pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0b2RvcyB0byBpbmRleC5qc1xuICAgIH1cbn1cblxuY29uc3QgYWRkVG9Qcm9qZWN0c0xpc3QgPSBmdW5jdGlvbihwcm9qZWN0LCBwcm9qZWN0c0xpc3QpIHtcbiAgICBwcm9qZWN0c0xpc3QucHVzaChwcm9qZWN0KTtcbn1cblxuY29uc3Qgc2hvd0FsbFByb2plY3RzID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG5cbiAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJQcm9qZWN0c01lbnUoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBhZGRQcm9qZWN0RE9NKHByb2plY3QpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBhY2NlcHRQcm9qZWN0c05ld05hbWUgPSBmdW5jdGlvbihwcmV2aW91c1RpdGxlLCBjbGlja2VkUHJvamVjdCwgcHJvamVjdHNMaXN0LCBlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlbmFtZS1wcm9qZWN0LWJsb2NrJyk7XG4gICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrRm9ybSA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5cbiAgICBjb25zdCByZW5hbWVJbnB1dCA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCcjcmVuYW1lLXByb2plY3QtdGl0bGUtYmxvY2snKTtcbiAgICBjb25zdCBuZXdUaXRsZSA9IHJlbmFtZUlucHV0LnZhbHVlO1xuXG4gICAgbGV0IGFsbG93VG9SZW5hbWUgPSB0cnVlO1xuICAgIGlmICggbmV3VGl0bGUudHJpbSgpICE9ICcnICkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCByZW5hbWVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSApIHtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHJlbmFtZUlucHV0KTtcbiAgICAgICAgICAgIHJlbmFtZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UHJvamVjdC50aXRsZSA9PSBuZXdUaXRsZSkge1xuICAgICAgICAgICAgICAgIGlmICggIXJlbmFtZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpICkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChyZW5hbWVJbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIHJlbmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWxsb3dUb1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFsbG93VG9SZW5hbWUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvamVjdHNMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3Rbal07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LnRpdGxlID09IHByZXZpb3VzVGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFByb2plY3QudGl0bGUgPSBuZXdUaXRsZTtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxQcm9qZWN0cyhwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRQcm9qZWN0KHByb2plY3RzTGlzdFtqXSk7XG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyhwcm9qZWN0c0xpc3Rbal0udG9kb3MsIHByb2plY3RzTGlzdFtqXS50b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVuYW1lUHJvamVjdEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1yZW5hbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgcmVuYW1lUHJvamVjdEJsb2NrRm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybS1yZW5hbWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoICFyZW5hbWVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSApIHtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHJlbmFtZUlucHV0KTtcbiAgICAgICAgICAgIHJlbmFtZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgcmVuYW1lUHJvamVjdCA9IGZ1bmN0aW9uKGNsaWNrZWRQcm9qZWN0LCBwcm9qZWN0c0xpc3QpIHtcblxuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZW5hbWUtcHJvamVjdC1ibG9jaycpO1xuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCbG9ja0Zvcm0gPSByZW5hbWVQcm9qZWN0QmxvY2sucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIHJlbmFtZVByb2plY3RCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tcmVuYW1lJyk7XG4gICAgcmVuYW1lUHJvamVjdEJsb2NrRm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybS1yZW5hbWUnKTtcblxuICAgIGNvbnN0IHJlbmFtZUlucHV0ID0gcmVuYW1lUHJvamVjdEJsb2NrLnF1ZXJ5U2VsZWN0b3IoJyNyZW5hbWUtcHJvamVjdC10aXRsZS1ibG9jaycpO1xuICAgIHJlbmFtZUlucHV0LnZhbHVlID0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZTtcbiAgICBjb25zdCBwcmV2aW91c1RpdGxlID0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZTtcblxuICAgIGNvbnN0IHJlbmFtZVByb2plY3RCdXR0b24gPSByZW5hbWVQcm9qZWN0QmxvY2sucXVlcnlTZWxlY3RvcignYnV0dG9uLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19hY2NlcHQtdGl0bGUnKTtcbiAgICByZW5hbWVQcm9qZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWNjZXB0UHJvamVjdHNOZXdOYW1lLmJpbmQodGhpcywgcHJldmlvdXNUaXRsZSwgY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCkpO1xufVxuXG5jb25zdCBkZWxldGVQcm9qZWN0ID0gZnVuY3Rpb24oY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCkge1xuICAgIGlmIChwcm9qZWN0c0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudFByb2plY3QudGl0bGUgPT0gY2xpY2tlZFByb2plY3QuZGF0YXNldC50aXRsZSkge1xuICAgICAgICAgICAgICAgIHByb2plY3RzTGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgc2hvd0FsbFByb2plY3RzKHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICAgICAgaGlnaGxpZ2h0UHJvamVjdChwcm9qZWN0c0xpc3RbMF0pO1xuICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyhwcm9qZWN0c0xpc3RbMF0udG9kb3MsIHByb2plY3RzTGlzdFswXS50b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3MsIHRvZG9GdW5jdGlvbnMsIGFkZFRvUHJvamVjdHNMaXN0LCBzaG93QWxsUHJvamVjdHMsIHJlbmFtZVByb2plY3QsIGRlbGV0ZVByb2plY3R9OyIsImltcG9ydCB7IHRvZG9GdW5jdGlvbnMgfSBmcm9tIFwiLi9jb250cm9sbGVyXCI7XG5cbmNvbnN0IGNoYW5nZVRvZG9TdGF0dXMgPSBmdW5jdGlvbih0b2RvRGF0YSkge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgdG9kb0RhdGEuY2hlY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS10b2RvJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93TmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG59XG5cbmNvbnN0IGhpZGVOZXdUYXNrV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpO1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3dGb3JtID0gbmV3VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3QgY3JlYXRlVG9kb0Jsb2NrSW5ET00gPSBmdW5jdGlvbih0b2RvRGF0YSwgdG9kb0V4cGlyZWRTdGF0dXMsIHByb2plY3RzTGlzdCwgdG9kb3MpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgY29uc3QgdGFza3NDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGFza3MnKTtcblxuICAgIGNvbnN0IHRvZG9CbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKCdzaW5nbGUtdG9kbycpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKHRvZG9EYXRhLnByaW9yaXR5KTtcblxuICAgIGlmICh0b2RvRXhwaXJlZFN0YXR1cykge1xuICAgICAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnZXhwaXJlZCcpO1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX3RpdGxlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gdG9kb0RhdGEuZHVlRGF0ZTtcbiAgICBkdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2R1ZS1kYXRlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGR1ZURhdGUpO1xuXG5cbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9ucy5jbGFzc0xpc3QuYWRkKCd0b2RvX19idXR0b25zJyk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGV0YWlscy50ZXh0Q29udGVudCA9ICdkZXRhaWxzJztcbiAgICBkZXRhaWxzLmNsYXNzTGlzdC5hZGQoJ2RldGFpbHMtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG5cbiAgICBjb25zdCBlZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZWRpdEltYWdlLnNyYyA9ICcuL2ltYWdlcy9pY29ucy9lZGl0LnN2Zyc7XG4gICAgZWRpdC5hcHBlbmRDaGlsZChlZGl0SW1hZ2UpO1xuICAgIGVkaXQuY2xhc3NMaXN0LmFkZCgnZWRpdC10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChlZGl0KTtcblxuICAgIGNvbnN0IGRlbGV0ZVRvZG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUb2RvSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBkZWxldGVUb2RvSW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2RlbGV0ZS5zdmcnO1xuICAgIGRlbGV0ZVRvZG8uYXBwZW5kQ2hpbGQoZGVsZXRlVG9kb0ltYWdlKTtcbiAgICBkZWxldGVUb2RvLmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZS10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChkZWxldGVUb2RvKTtcbiAgICBidXR0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9kb0Z1bmN0aW9ucy5iaW5kKGJ1dHRvbnMsIHRvZG9zLCB0b2RvRGF0YSwgcHJvamVjdHNMaXN0KSk7XG5cbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XG5cblxuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2NoZWNrYm94Jyk7XG4gICAgaWYgKHRvZG9EYXRhLmNoZWNrID09IHRydWUpIHtcbiAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIGNoZWNrYm94LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH1cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VUb2RvU3RhdHVzLmJpbmQoY2hlY2tib3gsIHRvZG9EYXRhKSk7XG5cbiAgICB0b2RvQmxvY2suZGF0YXNldC50aXRsZSA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRhc2tzQ29udGFpbmVyLmFwcGVuZENoaWxkKHRvZG9CbG9jayk7IC8vIGFkZGluZyBuZXcgdG9kb0Jsb2NrIGludG8gdGFza3MgY29udGFpbmVyXG59XG5cbmNvbnN0IGNsZWFyVG9kb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGN1cnJlbnRUb2RvcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaW5nbGUtdG9kbycpO1xuICAgIGN1cnJlbnRUb2Rvcy5mb3JFYWNoKHRvZG8gPT4ge1xuICAgICAgICB0b2RvLnJlbW92ZSgpO1xuICAgIH0pO1xufVxuXG5jb25zdCBjcmVhdGVFcnJvclBhcmFncmFwaCA9IGZ1bmN0aW9uKGlucHV0RmllbGQsIHByb2plY3RPck5vdCkge1xuICAgIGNvbnN0IGVycm9yUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoX19zaGlmdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJpb3JpdHknKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoJ2Vycm9yLXBhcmFncmFwaCcpO1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgcHJpb3JpdHkgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnQ2hvb3NlIGR1ZSBkYXRlIG9mIHRoZSB0YXNrJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIGZpbGxlZCc7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJvamVjdFRpdGxlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QucmVtb3ZlKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoLXByb2plY3QnKTtcbiAgICAgICAgaWYgKCBpbnB1dEZpZWxkLnZhbHVlLnRyaW0oKSA9PSAnJyApIHtcbiAgICAgICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJXcml0ZSBwcm9qZWN0J3MgbmFtZSFcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gXCJQcm9qZWN0IHdpdGggdGhpcyBuYW1lIGFscmVhZHkgZXhpc3QhXCI7XG4gICAgICAgIH1cbiAgICB9XG4gXG4gICAgaW5wdXRGaWVsZC5iZWZvcmUoZXJyb3JQYXJhZ3JhcGgpO1xufVxuXG5jb25zdCBkZWxldGVFcnJvclBhcmFncmFwaCA9IGZ1bmN0aW9uKGlucHV0RmllbGQpIHtcbiAgICBpbnB1dEZpZWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcucmVtb3ZlKCk7XG59XG5cbmNvbnN0IHJlc2V0RXJyb3JzID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGNvbnN0IGVycm9ycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmVycm9yLXBhcmFncmFwaCcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVycm9yc1tpXS5yZW1vdmUoKTtcbiAgICB9XG4gICAgY29uc3QgZXJyb3JCb3JkZXJzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuaW52YWxpZCcpOyAvL2dldCBpbnB1dHMgd2l0aCBcImludmFsaWRcIiBjbGFzc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JCb3JkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVycm9yQm9yZGVyc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93VG9kb0dyb3VwVGl0bGUgPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0KSB7XG4gICAgY29uc3QgY3VycmVudFRpdGxlID0gY2xpY2tlZE9iamVjdC50ZXh0Q29udGVudDtcbiAgICBjb25zdCB0aXRsZURPTUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGl0bGUnKTtcbiAgICB0aXRsZURPTUVsZW1lbnQudGV4dENvbnRlbnQgPSBjdXJyZW50VGl0bGU7XG59XG5cbmNvbnN0IG9wZW5FZGl0Rm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93Rm9ybSA9IGVkaXRUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2tfX2Zvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBlZGl0VGFza1dpbmRvd0Zvcm0uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuLWZvcm0nKTtcblxuICAgIHJldHVybiBlZGl0VGFza1dpbmRvd0Zvcm07XG59XG5cbmNvbnN0IGZpbGxFZGl0Rm9ybSA9IGZ1bmN0aW9uKHRvZG8sIGZvcm0pIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0b2RvKTtcbiAgICAvLyBjb25zb2xlLmxvZyhmb3JtKTtcbiAgICBmb3JtLnRpdGxlLnZhbHVlID0gdG9kby50aXRsZTtcbiAgICBmb3JtLmRlc2NyaXB0aW9uLnZhbHVlID0gdG9kby5kZXNjcmlwdGlvbjtcbiAgICBmb3JtLmR1ZURhdGUudmFsdWUgPSB0b2RvLmR1ZURhdGU7XG5cbiAgICBpZiAodG9kby5wcmlvcml0eSA9PSAnbG93Jykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LWxvdycpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PSAnbWVkaXVtJykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LW1lZGl1bScpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAodG9kby5wcmlvcml0eSA9PSAnaGlnaCcpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1oaWdoJykuY2hlY2tlZCA9IHRydWU7XG4gICAgfVxuXG59XG5cbmNvbnN0IGNsb3NlRWRpdEZvcm0gPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3dGb3JtID0gZWRpdFRhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xufVxuXG5jb25zdCBvcGVuRGV0YWlsc1dpbmRvdyA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCBkZXRhaWxzV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlscycpO1xuICAgIGRldGFpbHNXaW5kb3cuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG5cbiAgICBjb25zdCB0aXRsZSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fdGl0bGUnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGU7XG4gICAgXG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSBkZXRhaWxzV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHNfX2Rlc2NyaXB0aW9uJyk7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSAnRGVzY3JpcHRpb246ICcgKyB0b2RvLmRlc2NyaXB0aW9uO1xuXG4gICAgY29uc3QgZHVlRGF0ZSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fZHVlRGF0ZScpO1xuICAgIGR1ZURhdGUudGV4dENvbnRlbnQgPSAnRHVlIGRhdGU6ICcgKyB0b2RvLmR1ZURhdGU7XG5cbiAgICBjb25zdCBwcmlvcml0eSA9IGRldGFpbHNXaW5kb3cucXVlcnlTZWxlY3RvcignLnRhc2stZGV0YWlsc19fcHJpb3JpdHknKTtcbiAgICBwcmlvcml0eS50ZXh0Q29udGVudCA9ICdQcmlvcml0eTogJyArIHRvZG8ucHJpb3JpdHk7XG4gICAgcHJpb3JpdHkuY2xhc3NMaXN0LmFkZCgnZGV0YWlscy1wcmlvcml0eV9fJyArIHRvZG8ucHJpb3JpdHkpO1xufVxuXG5jb25zdCBhZGRQcm9qZWN0RE9NID0gZnVuY3Rpb24ocHJvamVjdCkge1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzIHVsJyk7XG4gICAgY29uc3QgY3VycmVudFByb2plY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGN1cnJlbnRQcm9qZWN0LmNsYXNzTGlzdC5hZGQoJ3NpbmdsZS1wcm9qZWN0Jyk7XG4gICAgY3VycmVudFByb2plY3QudGV4dENvbnRlbnQgPSBwcm9qZWN0LnRpdGxlO1xuICAgIGN1cnJlbnRQcm9qZWN0LmRhdGFzZXQudGl0bGUgPSBwcm9qZWN0LnRpdGxlO1xuICAgIFxuICAgIGlmICggIXByb2plY3Qubm9ucmVtb3ZhYmxlICkge1xuICAgICAgICBjb25zdCBlZGl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGVkaXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnZWRpdC1wcm9qZWN0LWJ1dHRvbicpO1xuICAgICAgICBjb25zdCBlZGl0TWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlZGl0TWVudS5jbGFzc0xpc3QuYWRkKCdlZGl0LXByb2plY3QnKTtcbiAgICBcbiAgICAgICAgY29uc3QgcmVuYW1lUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgcmVuYW1lUHJvamVjdC5jbGFzc0xpc3QuYWRkKCdyZW5hbWUtcHJvamVjdCcpO1xuICAgICAgICByZW5hbWVQcm9qZWN0LnRleHRDb250ZW50ID0gJ1JlbmFtZSBwcm9qZWN0JztcbiAgICAgICAgY29uc3QgZGVsZXRlUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgICAgZGVsZXRlUHJvamVjdC5jbGFzc0xpc3QuYWRkKCdkZWxldGUtcHJvamVjdCcpO1xuICAgICAgICBkZWxldGVQcm9qZWN0LnRleHRDb250ZW50ID0gJ0RlbGV0ZSBwcm9qZWN0JztcbiAgICBcbiAgICAgICAgZWRpdE1lbnUuYXBwZW5kQ2hpbGQocmVuYW1lUHJvamVjdCk7XG4gICAgICAgIGVkaXRNZW51LmFwcGVuZENoaWxkKGRlbGV0ZVByb2plY3QpO1xuICAgICAgICBlZGl0QnV0dG9uLmFwcGVuZENoaWxkKGVkaXRNZW51KTtcbiAgICAgICAgY3VycmVudFByb2plY3QuYXBwZW5kQ2hpbGQoZWRpdEJ1dHRvbik7XG4gICAgfVxuXG4gICAgcHJvamVjdHMuYXBwZW5kQ2hpbGQoY3VycmVudFByb2plY3QpOyBcbn1cblxuY29uc3QgY2xlYXJQcm9qZWN0c01lbnUgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwcm9qZWN0c0xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdHMgdWwnKTtcbiAgICBjb25zdCBwcm9qZWN0cyA9IHByb2plY3RzTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGlmIChwcm9qZWN0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHJvamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3RUb1JlbW92ZSA9IHByb2plY3RzW2ldOyBcbiAgICAgICAgICAgIHByb2plY3RzTGlzdC5yZW1vdmVDaGlsZChwcm9qZWN0VG9SZW1vdmUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge3Nob3dOZXdUYXNrV2luZG93LCBoaWRlTmV3VGFza1dpbmRvdywgY3JlYXRlVG9kb0Jsb2NrSW5ET00sIGNsZWFyVG9kb0NvbnRhaW5lciwgY3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBoLCByZXNldEVycm9ycyxcbnNob3dUb2RvR3JvdXBUaXRsZSwgb3BlbkVkaXRGb3JtLCBjbG9zZUVkaXRGb3JtLCBmaWxsRWRpdEZvcm0sIG9wZW5EZXRhaWxzV2luZG93LCBhZGRQcm9qZWN0RE9NLCBjbGVhclByb2plY3RzTWVudX07IiwiY29uc3Qgc2F2ZUluTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24ocHJvamVjdHNMaXN0KSB7XG4gICAgbGV0IHNlcmlhbFByb2plY3RzTGlzdCA9IEpTT04uc3RyaW5naWZ5KHByb2plY3RzTGlzdCk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Byb2plY3RzTGlzdCcsIHNlcmlhbFByb2plY3RzTGlzdCk7XG59XG5cbmNvbnN0IGdldEZyb21Mb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgcHJvamVjdHNMaXN0ID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvamVjdHNMaXN0JykpO1xuICAgIFxuICAgIHJldHVybiBwcm9qZWN0c0xpc3Q7XG59XG5cbmV4cG9ydCB7c2F2ZUluTG9jYWxTdG9yYWdlLCBnZXRGcm9tTG9jYWxTdG9yYWdlfSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIHJlc2V0RXJyb3JzLCBjbG9zZUVkaXRGb3JtLCBjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGh9IGZyb20gJy4vbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zJztcbmltcG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zLCBhZGRUb1Byb2plY3RzTGlzdCwgc2hvd0FsbFByb2plY3RzLCByZW5hbWVQcm9qZWN0LCBkZWxldGVQcm9qZWN0fSBmcm9tICcuL21vZHVsZXMvY29udHJvbGxlcic7XG5pbXBvcnQge2lzRm9ybVZhbGlkLCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAsIHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwLCBnZXRDdXJyZW50UHJvamVjdCwgZ2V0Q2hvc2VuUHJvamVjdCwgaGlnaGxpZ2h0UHJvamVjdCwgaXNUaXRsZVVzYWJsZX0gZnJvbSAnLi9tb2R1bGVzL2FwcExvZ2ljJztcbmltcG9ydCB7c2F2ZUluTG9jYWxTdG9yYWdlLCBnZXRGcm9tTG9jYWxTdG9yYWdlfSBmcm9tICcuL21vZHVsZXMvbG9jYWxTdG9yYWdlJztcblxuKGZ1bmN0aW9uKCkge1xuICAgIGxldCB0b2RvcyA9IFtdO1xuICAgIGxldCBwcm9qZWN0c0xpc3QgPSBbXTtcbiAgICBcbiAgICAvLyBjcmVhdGluZyBleGFtcGxlIHRvZG9zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IGZpcnN0VG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDYWxsIHRvIElyaW5hJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGhhdmUgdG8gY2FsbCB0byBJcmluYSBhbmQga25vdyB3aGVyZSBzaGUgaXMuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTcnLFxuICAgICAgICBwcmlvcml0eTogJ2hpZ2gnLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlY29uZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQnV5IGEgcGl6emEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgbmVlZCB0byBidXkgdHdvIHBpenphcyBmb3IgbWUgYW5kIElyaW5hLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA4LTE5JyxcbiAgICAgICAgcHJpb3JpdHk6ICdtZWRpdW0nLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHRoaXJkVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdIbW1tbW1tbW0uJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTgnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICBjb25zdCBmb3VydGhUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0NoZWNrIFRvZG8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgYW0ganVzdCBjaGVja2luZy4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNy0xNScsXG4gICAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgICAgY2hlY2s6IHRydWUsXG4gICAgfTtcblxuICAgIHRvZG9zLnB1c2goZmlyc3RUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHNlY29uZFRvZG8pO1xuICAgIHRvZG9zLnB1c2godGhpcmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKGZvdXJ0aFRvZG8pO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgXG4gICAgLy8gbG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgLy8gY29uc29sZS5sb2coIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VuZGVmaW5lZCcpKSApO1xuXG4gICAgaWYgKCAhSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncHJvamVjdHNMaXN0JykpICkge1xuICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBmaXJzdCB0aW1lIGhlcmUuIE9yIHNvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggTG9jYWwgU3RvcmFnZS4gU28gd2Ugc2hvdyBzdGFuZGFydCBwcm9qZWN0cy4gXFxcbiAgICAgICAgWW91IHNob3VsZCB3cml0ZSBtZSAoZGFtaXJpb3MpLiBTb3JyeSgnKTtcbiAgICAgICAgY29uc3QgbWFpblByb2plY3QgPSB7XG4gICAgICAgICAgICB0aXRsZTogJ01haW4nLFxuICAgICAgICAgICAgdG9kb3M6IHRvZG9zLFxuICAgICAgICAgICAgbm9ucmVtb3ZhYmxlOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgICBhZGRUb1Byb2plY3RzTGlzdChtYWluUHJvamVjdCwgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgc2F2ZUluTG9jYWxTdG9yYWdlKHByb2plY3RzTGlzdCk7XG4gICAgfSBlbHNlIHsgICAgXG4gICAgICAgIHByb2plY3RzTGlzdCA9IGdldEZyb21Mb2NhbFN0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICBzaG93QWxsUHJvamVjdHMocHJvamVjdHNMaXN0KTtcbiAgICBoaWdobGlnaHRQcm9qZWN0KHByb2plY3RzTGlzdFswXSk7XG4gICAgdG9kb3MgPSBwcm9qZWN0c0xpc3RbMF0udG9kb3M7XG5cbiAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBwcm9qZWN0c0xpc3RbMF0udG9kb3M7XG4gICAgc2hvd0FsbFRvZG9zKHRvZG9zRm9yU2hvdywgdG9kb3MsIHByb2plY3RzTGlzdCk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciB0aGUgbmV3IHRhc2sgZm9ybSBhbmQgY2xvc2luZyBjb25kaXRpb25zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCB0YXNrRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCBhZGRUYXNrV2luZG93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFkZC10YXNrJyk7IC8vIGJ1dHRvbiB0aGF0IG9wZW5zIG5ldyB0YXNrIGZvcm1cbiAgICAgICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpOyAvLyBmb3JtJ3Mgb3V0ZXIgZGl2IGJsb2NrXG4gICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybScpOyAvLyBuZXcgdGFzayBmb3JtXG4gICAgICAgIGNvbnN0IGNsb3NlVGFza1dpbmRvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19jbG9zaW5nLWJ1dHRvbicpOyAvLyBjbG9zZSBmb3JtIGJ1dHRvblxuICAgICAgICBjb25zdCBzdWJtaXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fc3VibWl0IGJ1dHRvbicpOyAvLyBmb3JtJ3Mgc3VibWl0IGJ1dHRvblxuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrVG9FZGl0ID0gY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKTsgLy8gdGhpcyBuZWVkIHRvIG9wZW4gZWRpdCB0b2RvIGZvcm1cbiAgICAgICAgY29uc3QgZWRpdEZvcm1Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgICAgIGNvbnN0IGVkaXRGb3JtID0gZWRpdEZvcm1Db250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBlZGl0Rm9ybUNsb3NlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fY2xvc2luZy1idXR0b24nKTtcbiAgICAgICAgY29uc3QgZGV0YWlsc1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrLWRldGFpbHMnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Q2xvc2luZ0J1dHRvbiA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignLm5ldy1wcm9qZWN0X19jbG9zaW5nLWJ1dHRvbicpO1xuICAgICAgICBjb25zdCBhY3RpdmVFZGl0UHJvamVjdE1lbnUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWN0aXZlLWVkaXQtbWVudScpO1xuICAgICAgICBjb25zdCByZW5hbWVQcm9qZWN0QmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVuYW1lLXByb2plY3QtYmxvY2snKTtcbiAgICAgICAgY29uc3QgcmVuYW1lUHJvamVjdEJsb2NrRm9ybSA9IHJlbmFtZVByb2plY3RCbG9jay5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IGdldEN1cnJlbnRQcm9qZWN0KHByb2plY3RzTGlzdCk7XG4gICAgICAgIHRvZG9zID0gY3VycmVudFByb2plY3QudG9kb3M7XG5cbiAgICAgICAgaWYgKCFuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykpIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBvcGVuXG4gICAgICAgICAgICBpZiAoIGNsaWNrZWRPYmplY3QgPT0gY2xvc2VUYXNrV2luZG93QnV0dG9uIHx8ICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5mb3JtJykgKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgdGhlIFwiY2xvc2UgZm9ybVwiIGJ1dHRvbiBvciBpcyBub3QgZm9ybSB3aW5kb3dcbiAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICByZXNldEVycm9ycyhmb3JtKTsgLy9yZXNldCBlcnJvciBwYXJhZ3JhcGhzIGlmIHRoZXkgYXJlIGV4aXN0XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWNrZWRPYmplY3QgPT0gc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZm9ybSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvVGhlVG9kb0xpc3QoZm9ybSwgdG9kb3MpOyAvLyBjcmVhdGVzIGFuZCBpbnNlcnQgbmV3IHRvZG8gaW4gRE9NXG4gICAgICAgICAgICAgICAgICAgIHNhdmVJbkxvY2FsU3RvcmFnZShwcm9qZWN0c0xpc3QpOyAvLyBzYXZlIG5ldyBUb2RvIHRocm91Z2ggcHJvamVjdHNMaXN0IGluIGxvY2FsU3RvcmFnZVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyBuZWVkIHRvIGhpZ2hsaWdodCBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3NHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvLyBcImFsbCB0YXNrc1wiIGJ1dHRvbiBhZnRlclxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvL2lmIHRoZSBuZXcgdGFzayBmb3JtIGlzIGNsb3NlZFxuXG4gICAgICAgICAgICBpZiAoIGFjdGl2ZUVkaXRQcm9qZWN0TWVudSAmJiBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5lZGl0LXByb2plY3QnKSAhPSBhY3RpdmVFZGl0UHJvamVjdE1lbnUgKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlRWRpdFByb2plY3RNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZS1lZGl0LW1lbnUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNsaWNrZWRPYmplY3QgPT0gYWRkVGFza1dpbmRvd0J1dHRvbikgeyAvL2NoZWNrIGlmIGNsaWNrZWQgT2JqZWN0IGlzIFwiYWRkIHRhc2tcIiBidXR0b25cbiAgICAgICAgICAgICAgICBzaG93TmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKGNsaWNrZWRPYmplY3QgPT0gZWRpdEZvcm1Db250YWluZXIgJiYgIWVkaXRGb3JtQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykgJiYgXG4gICAgICAgICAgICAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZWRpdC10YXNrX19mb3JtJykgKSB8fCBjbGlja2VkT2JqZWN0ID09IGVkaXRGb3JtQ2xvc2VCdXR0b24pIHsgLy8gaWYgZWRpdCBmb3JtIGlzIG9wZW4uIFRoZW4gY2xvc2UgYnV0dG9uIGNsaWNrZWRcbiAgICAgICAgICAgICAgICBjbG9zZUVkaXRGb3JtKCk7XG4gICAgICAgICAgICAgICAgZWRpdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbHNXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSAmJiAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcudGFzay1kZXRhaWxzJykgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsc1ByaW9yaXR5ID0gZGV0YWlsc1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcudGFzay1kZXRhaWxzX19wcmlvcml0eScpO1xuICAgICAgICAgICAgICAgIGlmICggZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5jb250YWlucygnZGV0YWlscy1wcmlvcml0eV9fbG93JykgKSB7XG4gICAgICAgICAgICAgICAgICAgIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWxzLXByaW9yaXR5X19sb3cnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBkZXRhaWxzUHJpb3JpdHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZXRhaWxzLXByaW9yaXR5X19tZWRpdW0nKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtcHJpb3JpdHlfX21lZGl1bScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGRldGFpbHNQcmlvcml0eS5jbGFzc0xpc3QuY29udGFpbnMoJ2RldGFpbHMtcHJpb3JpdHlfX2hpZ2gnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsc1ByaW9yaXR5LmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbHMtcHJpb3JpdHlfX2hpZ2gnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGV0YWlsc1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcubmV3LXByb2plY3QnKSAmJiAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcubmV3LXByb2plY3QgZm9ybScpIHx8IGNsaWNrZWRPYmplY3QgPT0gbmV3UHJvamVjdENsb3NpbmdCdXR0b24pIHtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19jbG9zaW5nLWJ1dHRvbicpIHx8IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrJykgJiYgIWNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnJlbmFtZS1wcm9qZWN0LWJsb2NrX19mb3JtJykpIHtcbiAgICAgICAgICAgICAgICByZW5hbWVQcm9qZWN0QmxvY2suY2xhc3NMaXN0LmFkZCgnaGlkZGVuLXJlbmFtZScpO1xuICAgICAgICAgICAgICAgIHJlbmFtZVByb2plY3RCbG9ja0Zvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0tcmVuYW1lJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVuYW1lSW5wdXQgPSByZW5hbWVQcm9qZWN0QmxvY2tGb3JtLnF1ZXJ5U2VsZWN0b3IoJyNyZW5hbWUtcHJvamVjdC10aXRsZS1ibG9jaycpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJlbmFtZUlucHV0LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKCByZW5hbWVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocmVuYW1lSW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICByZW5hbWVJbnB1dC5jbGFzc0xpc3QucmVtb3ZlKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0YXNrRnVuY3Rpb25zKTtcblxuICAgIC8vIEFkZCBFdmVudCBMaXN0ZW5lcnMgZm9yIHRhc2sgZ3JvdXBzXG4gICAgY29uc3QgdGFza0dyb3VwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvL2dldCBzaWRlYmFyIHRhc2sgZ3JvdXBzXG5cbiAgICBjb25zdCB0YXNrR3JvdXBzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCAhPSB0YXNrR3JvdXBzKSB7XG4gICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cChjbGlja2VkT2JqZWN0LCB0b2Rvcyk7XG4gICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93LCB0b2RvcywgcHJvamVjdHNMaXN0LCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciBwcm9qZWN0c1xuICAgIGNvbnN0IHByb2plY3RzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzJyk7XG4gICAgY29uc3QgY3JlYXRlUHJvamVjdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdF9fYWNjZXB0LXRpdGxlJyk7XG5cbiAgICBjb25zdCBwcm9qZWN0c0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBhZGRQcm9qZWN0QnV0dG9uID0gcHJvamVjdHMucXVlcnlTZWxlY3RvcignLnByb2plY3RzX19jcmVhdGUnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBhbGxQcm9qZWN0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9qZWN0cyB1bCBsaScpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBhZGRQcm9qZWN0QnV0dG9uICYmIGFkZFByb2plY3RCdXR0b24gPT0gY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcucHJvamVjdHNfX2NyZWF0ZScpICkge1xuICAgICAgICAgICAgbmV3UHJvamVjdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaW5nbGUtcHJvamVjdCcpICkge1xuICAgICAgICAgICAgaWYgKHByb2plY3RzTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9qZWN0c0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFByb2plY3QgPSBwcm9qZWN0c0xpc3RbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UHJvamVjdC50aXRsZSA9PSBjbGlja2VkT2JqZWN0LmRhdGFzZXQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QoY3VycmVudFByb2plY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhbGxUYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbGwtdGFza3MnKTsgLy8gdGhlc2UgdGhyZWUgbGluZXMgbmVlZCB0byBoaWdobGlnaHQgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrc0dyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vIFwiYWxsIHRhc2tzXCIgYnV0dG9uIGFmdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZG9zID0gY3VycmVudFByb2plY3QudG9kb3M7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MsIHRvZG9zLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnZWRpdC1wcm9qZWN0LWJ1dHRvbicpICkge1xuICAgICAgICAgICAgY29uc3QgY2xpY2tlZFByb2plY3QgPSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5zaW5nbGUtcHJvamVjdCcpO1xuICAgICAgICAgICAgY29uc3QgcHJvamVjdEVkaXRNZW51ID0gY2xpY2tlZE9iamVjdC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1wcm9qZWN0Jyk7XG4gICAgICAgICAgICBwcm9qZWN0RWRpdE1lbnUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlLWVkaXQtbWVudScpO1xuXG4gICAgICAgICAgICBpZiAocHJvamVjdHNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2plY3RzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UHJvamVjdCA9IHByb2plY3RzTGlzdFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQcm9qZWN0LnRpdGxlID09IGNsaWNrZWRQcm9qZWN0LmRhdGFzZXQudGl0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QoY3VycmVudFByb2plY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGN1cnJlbnRQcm9qZWN0LnRvZG9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2RvcywgcHJvamVjdHNMaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuYWN0aXZlLWVkaXQtbWVudScpICkge1xuICAgICAgICAgICAgY29uc3QgY2xpY2tlZFByb2plY3QgPSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5zaW5nbGUtcHJvamVjdCcpO1xuXG4gICAgICAgICAgICBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdkZWxldGUtcHJvamVjdCcpICkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZVByb2plY3QoY2xpY2tlZFByb2plY3QsIHByb2plY3RzTGlzdCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygncmVuYW1lLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgICAgICByZW5hbWVQcm9qZWN0KGNsaWNrZWRQcm9qZWN0LCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgIGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLmFjdGl2ZS1lZGl0LW1lbnUnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUtZWRpdC1tZW51Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJvamVjdHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBwcm9qZWN0c0Z1bmN0aW9ucyk7XG5cblxuICAgIGNvbnN0IGFkZFByb2plY3QgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgcHJvamVjdFRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Byb2plY3QtdGl0bGUnKTtcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctcHJvamVjdCcpO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IG5ld1Byb2plY3QucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgICAgICBjb25zdCBjdXJyZW50SGlnaGxpZ2h0ZWRQcm9qZWN0SW5ET00gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvc2VuLXByb2plY3QnKTtcbiAgICAgICAgY29uc3QgY2hvc2VuUHJvamVjdCA9IGdldENob3NlblByb2plY3QoY3VycmVudEhpZ2hsaWdodGVkUHJvamVjdEluRE9NLCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICBcblxuICAgICAgICBpZiAoIHByb2plY3RUaXRsZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5jb250YWlucygnZXJyb3ItcGFyYWdyYXBoLXByb2plY3QnKSApIHtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByb2plY3RUaXRsZS52YWx1ZS50cmltKCkgPT0gJycpIHtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICBwcm9qZWN0VGl0bGUuY2xhc3NMaXN0LmFkZCgnaW52YWxpZCcpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIGlzVGl0bGVVc2FibGUocHJvamVjdFRpdGxlLnZhbHVlLCBwcm9qZWN0c0xpc3QpICkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQcm9qZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogcHJvamVjdFRpdGxlLnZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB0b2RvczogW10sXG4gICAgICAgICAgICAgICAgICAgIG5vbnJlbW92YWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgICAgIGFkZFRvUHJvamVjdHNMaXN0KGN1cnJlbnRQcm9qZWN0LCBwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgIHNhdmVJbkxvY2FsU3RvcmFnZShwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgIHNob3dBbGxQcm9qZWN0cyhwcm9qZWN0c0xpc3QpO1xuICAgICAgICAgICAgICAgIGhpZ2hsaWdodFByb2plY3QoY2hvc2VuUHJvamVjdCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmV3UHJvamVjdC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICBuZXdQcm9qZWN0Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgICAgICAgICAgICAgIG5ld1Byb2plY3RGb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByb2plY3RUaXRsZSk7XG4gICAgICAgICAgICAgICAgcHJvamVjdFRpdGxlLmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG4gICAgY3JlYXRlUHJvamVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZFByb2plY3QpO1xuXG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==