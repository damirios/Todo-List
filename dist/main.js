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
/* harmony export */   "highlightChosenTaskGroup": () => (/* binding */ highlightChosenTaskGroup),
/* harmony export */   "isFormValid": () => (/* binding */ isFormValid),
/* harmony export */   "isTodoExpired": () => (/* binding */ isTodoExpired),
/* harmony export */   "sortTasksAccordingToChosenTaskGroup": () => (/* binding */ sortTasksAccordingToChosenTaskGroup),
/* harmony export */   "todoFactory": () => (/* binding */ todoFactory)
/* harmony export */ });
/* harmony import */ var _domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulations */ "./src/modules/domManipulations.js");


// let currentTodos;

const todoFactory = function(form) {
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
    todoObject.check = false;
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
            const sortedTodo = sortCurrentTodo(clickedObject, todo);
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
    const newTodo = todoFactory(editForm);
    const todoIndexToReplace = todos.indexOf(todo);

    if (todoIndexToReplace != -1) {
        todos[todoIndexToReplace] = newTodo;
    }
    return todos;
}



/***/ }),

/***/ "./src/modules/controller.js":
/*!***********************************!*\
  !*** ./src/modules/controller.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addToTheTodoList": () => (/* binding */ addToTheTodoList),
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

const showAllTodos = function(todos, clickedObject) {
    ;(0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.clearTodoContainer)(); // clears todo container of all tasks and then we will create it again with chosen parameters
    if (clickedObject) {
        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.showTodoGroupTitle)(clickedObject);
    }

    if (todos && todos.length > 0) {
        (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.addExpirationStatus)(todos);
        todos.sort(compareFunction);
        
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            if (todo) {
                (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createTodoBlockInDOM)(todo, (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.isTodoExpired)(todo), todos);
            }
        }
    }
}

const todoFunctions = function(todos, currentTodo, e) {
    const clickedButton = e.target.closest('button'); // get clicked Button or null
    if (clickedButton) {
        if ( clickedButton.classList.contains('delete-todo') ) {
            (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.deleteTodo)(currentTodo, todos);
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
                        const newTodos = (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.getChangedTodos)(todo, todos, editForm);
                        this.removeListener();
                        (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.closeEditForm)();
                        showAllTodos(newTodos);
                        console.log(newTodos);
                    }
                }

                removeListener() {
                    acceptChangesButton.removeEventListener('click', this.boundEventHandler);
                    this.clickEventStatus = false;
                }
            }

            let button = new editButtonClass(currentTodo, todos, editForm);
        }
        // return todos to index.js
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
/* harmony export */   "clearTodoContainer": () => (/* binding */ clearTodoContainer),
/* harmony export */   "closeEditForm": () => (/* binding */ closeEditForm),
/* harmony export */   "createErrorParagraph": () => (/* binding */ createErrorParagraph),
/* harmony export */   "createTodoBlockInDOM": () => (/* binding */ createTodoBlockInDOM),
/* harmony export */   "deleteErrorParagraph": () => (/* binding */ deleteErrorParagraph),
/* harmony export */   "fillEditForm": () => (/* binding */ fillEditForm),
/* harmony export */   "hideNewTaskWindow": () => (/* binding */ hideNewTaskWindow),
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

const createErrorParagraph = function(inputField) {
    const errorParagraph = document.createElement('div');
    errorParagraph.classList.add('error-paragraph');
    if (inputField.name == 'dueDate') {
        errorParagraph.classList.add('error-paragraph__shifted');
    }
    if (inputField.name == 'priority') {
        errorParagraph.textContent = 'Choose priority of the task';
    } else if (inputField.name == 'dueDate') {
        errorParagraph.textContent = 'Choose due date of the task';
    } else {
        errorParagraph.textContent = 'This field must be filled';
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
    
    // creating example todos ===================================================
    const firstTodo = {
        title: 'Call to Irina',
        description: 'I have to call to Irina and know she is.',
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

    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos);

    // Add Event Listeners for the new task form ===========================================
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
                    
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos);
                    (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                    form.reset();
                }
            }
        } else { //if the new task form is closed
            if (clickedObject == addTaskWindowButton) { //check if clicked Object is "add task" button
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.showNewTaskWindow)();
            } else if ( (clickedObject == editFormContainer && !editFormContainer.classList.contains('hidden') && 
            !clickedObject.closest('.edit-task__form') ) || clickedObject == editFormCloseButton) { // if edit form is open. Then we close button clicked
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.closeEditForm)();
                editForm.reset();
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
            (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, clickedObject);
        }
    }

    taskGroups.addEventListener('click', taskGroupsFunctions);

})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQzBDOztBQUU5RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSSxpRUFBWTs7QUFFaEI7QUFDQTtBQUNBLHlFQUF5RTtBQUN6RSxtRUFBbUU7QUFDbkUsc0RBQXNEO0FBQ3RELHVGQUF1RjtBQUN2Riw2RUFBNkU7QUFDN0U7QUFDQSx5RUFBeUU7QUFDekU7QUFDQTtBQUNBOztBQUVBLDJEQUEyRDtBQUMzRCwrRkFBK0Y7QUFDL0YsZ0JBQWdCLDRFQUFpQjtBQUNqQztBQUNBLGdCQUFnQixzRUFBVyxRQUFRO0FBQ25DLGNBQWM7QUFDZDtBQUNBLHFCQUFxQiw4REFBVztBQUNoQyxvQkFBb0IscUVBQWdCLGVBQWU7O0FBRW5ELDJFQUEyRTtBQUMzRSw0RUFBNEU7QUFDNUUsb0JBQW9CLDJFQUF3Qix3QkFBd0I7QUFDcEU7QUFDQSxvQkFBb0IsaUVBQVk7QUFDaEMsb0JBQW9CLDRFQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQSxVQUFVLE9BQU87QUFDakIsd0RBQXdEO0FBQ3hELGdCQUFnQiw0RUFBaUI7QUFDakMsY0FBYztBQUNkLG9HQUFvRztBQUNwRyxnQkFBZ0Isd0VBQWE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDREQUE0RDs7QUFFNUQ7QUFDQTtBQUNBO0FBQ0EsWUFBWSwyRUFBd0I7QUFDcEMsaUNBQWlDLHNGQUFtQztBQUNwRSxZQUFZLGlFQUFZO0FBQ3hCO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvYXBwTG9naWMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaH0gZnJvbSAnLi9kb21NYW5pcHVsYXRpb25zJztcblxuLy8gbGV0IGN1cnJlbnRUb2RvcztcblxuY29uc3QgdG9kb0ZhY3RvcnkgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgbGV0IHRvZG9PYmplY3QgPSB7fTsgLy8gb2JqZWN0IHRoYXQgY29sbGVjdHMgaW5mbyBmcm9tIG5ldyB0YXNrIGZvcm0hXG4gICAgY29uc3QgZm9ybUVsZW1lbnRzID0gZm9ybS5lbGVtZW50cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvcm1FbGVtZW50cy5sZW5ndGggLSAxOyBpKyspIHsgLy8gYWxsIGZpZWxkcyBleGNlcHQgc3VibWl0IGJ1dHRvblxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZm9ybUVsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoZWxlbWVudC5uYW1lID09ICd0aXRsZScgfHwgZWxlbWVudC5uYW1lID09ICdkZXNjcmlwdGlvbicpIHtcbiAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQudmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09ICdwcmlvcml0eScgJiYgZWxlbWVudC5jaGVja2VkKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LmlkID09ICdlZGl0LWxvdycpIHsgLy90aGVzZSBjaGVja3MgZm9yIGVkaXQtLi4uIG5lZWRzIHRvIHNob3cgcHJpb3JpdHkgLSBlZGl0Rm9ybSBwcmlvcml0eSBidXR0b25zIGlkJ3MgZGlmZmVyIG5ld1Rhc2tGb3JtJ3MgKG9idmlvdXNseSlcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnbG93JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1tZWRpdW0nKSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ21lZGl1bSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtaGlnaCcpIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSAnaGlnaCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9IGVsZW1lbnQuaWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZG9PYmplY3QuY2hlY2sgPSBmYWxzZTtcbiAgICByZXR1cm4gdG9kb09iamVjdDtcbn1cblxuY29uc3QgaXNGb3JtVmFsaWQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0udGl0bGU7XG4gICAgY29uc3QgZHVlRGF0ZUlucHV0ID0gZm9ybS5kdWVEYXRlO1xuICAgIGNvbnN0IHByaW9yaXR5SW5wdXRzID0gZm9ybS5wcmlvcml0eTsgXG4gICAgLy8gY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjdGl0bGUnKTtcbiAgICAvLyBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I2R1ZURhdGUnKTtcbiAgICAvLyBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1wcmlvcml0eV0nKTtcbiAgICBjb25zdCBwcmlvcml0eUJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eV9fYnV0dG9ucywgLmVkaXQtZm9ybS1wcmlvcml0eV9fYnV0dG9ucycpO1xuXG4gICAgbGV0IHZhbGlkUHJpb3JpdHk7XG4gICAgbGV0IHByaW9yaXR5Q2hlY2sgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByaW9yaXR5SW5wdXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQcmlvcml0eUlucHV0ID0gcHJpb3JpdHlJbnB1dHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50UHJpb3JpdHlJbnB1dC5jaGVja2VkKSB7XG4gICAgICAgICAgICBwcmlvcml0eUNoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFwcmlvcml0eUNoZWNrICYmICFwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nKSB7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHByaW9yaXR5SW5wdXRzWzBdKTtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAocHJpb3JpdHlDaGVjaykge1xuICAgICAgICB2YWxpZFByaW9yaXR5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgJiYgcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZy5jbGFzc0xpc3QuY29udGFpbnMoJ2Vycm9yLXBhcmFncmFwaCcpKSB7XG4gICAgICAgICAgICBkZWxldGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWREdWVEYXRlO1xuICAgIGlmIChkdWVEYXRlSW5wdXQudmFsdWUudHJpbSgpID09ICcnKSB7XG4gICAgICAgIHZhbGlkRHVlRGF0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSB0cnVlO1xuICAgICAgICBpZiAoZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICBkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB2YWxpZFRpdGxlO1xuICAgIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJyAmJiAhdGl0bGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5hZGQoJ2ludmFsaWQnKTtcbiAgICAgICAgY3JlYXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIHRpdGxlSW5wdXQuZm9jdXMoKTtcbiAgICAgICAgdmFsaWRUaXRsZSA9IGZhbHNlO1xuXG4gICAgfSBlbHNlIGlmICh0aXRsZUlucHV0LnZhbHVlLnRyaW0oKSAhPSAnJykge1xuICAgICAgICB2YWxpZFRpdGxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIHRpdGxlSW5wdXQuY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgodGl0bGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YWxpZCA9IHZhbGlkUHJpb3JpdHkgJiYgdmFsaWREdWVEYXRlICYmIHZhbGlkVGl0bGU7XG4gICAgcmV0dXJuIHZhbGlkO1xufVxuXG5jb25zdCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAgPSBmdW5jdGlvbih0YXNrR3JvdXBzLCBjbGlja2VkT2JqZWN0KSB7XG4gICAgY29uc3QgdGFza0dyb3Vwc0VsZW1lbnRzID0gdGFza0dyb3Vwcy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza0dyb3Vwc0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYXNrR3JvdXAgPSB0YXNrR3JvdXBzRWxlbWVudHNbaV07XG4gICAgICAgIGlmIChjdXJyZW50VGFza0dyb3VwID09IGNsaWNrZWRPYmplY3QgJiYgIWN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFRhc2tHcm91cCAhPSBjbGlja2VkT2JqZWN0ICYmIGN1cnJlbnRUYXNrR3JvdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdjaG9zZW4tdGFzay1ncm91cCcpKSB7XG4gICAgICAgICAgICBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5yZW1vdmUoJ2Nob3Nlbi10YXNrLWdyb3VwJyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNvcnRDdXJyZW50VG9kbyA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG8pIHtcbiAgICBjb25zdCBjdXJyZW50RGF0ZUFuZFRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY3VycmVudERhdGVBbmRUaW1lLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBbmRUaW1lLmdldERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50SG91cnMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0SG91cnMoKTtcbiAgICBjb25zdCBjdXJyZW50TWludXRlcyA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNaW51dGVzKCk7XG4gICAgY29uc3QgY3VycmVudFNlY29uZHMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0U2Vjb25kcygpO1xuXG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsIHRvZG9Nb250aCAtIDEsIHRvZG9EYXRlKTsgLy9EYXRlIE9iaiBmb3IgdG9kb1xuXG4gICAgaWYgKGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b2RheScpKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRvZGF5XCJcbiAgICAgICAgaWYgKCBpc1RvZGF5KHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3dlZWsnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwidGhpcyB3ZWVrXCJcbiAgICAgICAgaWYgKCBpc1dlZWsodG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ21vbnRoJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcIm1vbnRoXCJcbiAgICAgICAgaWYgKCBpc01vbnRoKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdhbGwtdGFza3MnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwiYWxsIHRhc2tzXCJcbiAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgfVxufVxuXG5jb25zdCBpc1RvZGF5ID0gZnVuY3Rpb24odG9kb1llYXIsIHRvZG9Nb250aCwgdG9kb0RhdGUsIGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXRlKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGV4cGlyZWQgdG9kYXlcbiAgICBpZiAoIHRvZG9ZZWFyID09IGN1cnJlbnRZZWFyICYmIHRvZG9Nb250aCA9PSBjdXJyZW50TW9udGggJiYgdG9kb0RhdGUgPT0gY3VycmVudERhdGUgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzV2VlayA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIHdlZWtcbiAgICBjb25zdCBkaWZmZXJlbmNlSW5EYXlzID0gKHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVBbmRUaW1lKSAvICgxMDAwICogNjAgKiA2MCAqIDI0KTtcbiAgICBpZiAoZGlmZmVyZW5jZUluRGF5cyA8PSA3ICYmIGRpZmZlcmVuY2VJbkRheXMgPj0gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaXNNb250aCA9IGZ1bmN0aW9uKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgYW5kIGN1cnJlbnQgZGF0ZSBkaWZmZXJzIGJ5IG5vIG1vcmUgdGhhbiAxIG1vbnRoXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkgKyAxO1xuICAgIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMiAmJiBkaWZmZXJlbmNlSW5EYXlzID49IDApIHtcbiAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gY3VycmVudERhdGVBbmRUaW1lLmdldE1vbnRoKCkgKyAxO1xuICAgICAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgICAgICBpZiAoIGN1cnJlbnRNb250aCA9PSAxIHx8IGN1cnJlbnRNb250aCA9PSAzIHx8IGN1cnJlbnRNb250aCA9PSA1IHx8IGN1cnJlbnRNb250aCA9PSA3IHx8IGN1cnJlbnRNb250aCA9PSA4IHx8IGN1cnJlbnRNb250aCA9PSAxMCB8fCBjdXJyZW50TW9udGggPT0gMTIgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggZGlmZmVyZW5jZUluRGF5cyA8PSAzMSAmJiAoY3VycmVudE1vbnRoID09IDQgfHwgY3VycmVudE1vbnRoID09IDYgfHwgY3VycmVudE1vbnRoID09IDkgfHwgY3VycmVudE1vbnRoID09IDExKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCAgY3VycmVudE1vbnRoID09IDIgJiYgKGRpZmZlcmVuY2VJbkRheXMgPD0gKDI5ICsgaXNMZWFwWWVhcihjdXJyZW50WWVhcikpKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgaXNMZWFwWWVhciA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICBpZiAoeWVhciAlIDQgPT0gMCkge1xuICAgICAgICBpZiAoeWVhciAlIDEwMCA9PSAwKSB7XG4gICAgICAgICAgICBpZiAoeWVhciAlIDQwMCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG59XG5cbmNvbnN0IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCwgdG9kb3MpIHtcbiAgICBsZXQgdG9kb0xpc3RUb1Nob3cgPSBbXTsgLy9jdXJyZW50IHRvZG9MaXN0IHRoYXQgd2UgZ29pbmcgdG8gc2hvdywgd2UnbGwgZmlsbCBpdFxuICAgIGlmICh0b2Rvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlZFRvZG8gPSBzb3J0Q3VycmVudFRvZG8oY2xpY2tlZE9iamVjdCwgdG9kbyk7XG4gICAgICAgICAgICB0b2RvTGlzdFRvU2hvdy5wdXNoKHNvcnRlZFRvZG8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2RvTGlzdFRvU2hvdztcbn1cblxuY29uc3QgaXNUb2RvRXhwaXJlZCA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCB0b2RvRnVsbERhdGUgPSB0b2RvLmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICBjb25zdCB0b2RvWWVhciA9IHRvZG9GdWxsRGF0ZVswXTtcbiAgICBjb25zdCB0b2RvTW9udGggPSB0b2RvRnVsbERhdGVbMV07XG4gICAgY29uc3QgdG9kb0RhdGUgPSB0b2RvRnVsbERhdGVbMl07XG4gICAgY29uc3QgdG9kb0RhdGVPYmogPSBuZXcgRGF0ZSh0b2RvWWVhciwgK3RvZG9Nb250aCAtIDEsICt0b2RvRGF0ZSArMSApO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlT2JqID0gbmV3IERhdGUoKTtcbiAgICBpZiAoIHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVPYmogPCAwICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBhZGRFeHBpcmF0aW9uU3RhdHVzID0gZnVuY3Rpb24odG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgIHRvZG8uZXhwaXJlZCA9IGlzVG9kb0V4cGlyZWQodG9kbyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGRlbGV0ZVRvZG8gPSBmdW5jdGlvbihjdXJyZW50VG9kbywgdG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICggdG9kb3NbaV0gPT0gY3VycmVudFRvZG8gKSB7XG4gICAgICAgICAgICB0b2Rvcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGdldENoYW5nZWRUb2RvcyA9IGZ1bmN0aW9uKHRvZG8sIHRvZG9zLCBlZGl0Rm9ybSkge1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShlZGl0Rm9ybSk7XG4gICAgY29uc3QgdG9kb0luZGV4VG9SZXBsYWNlID0gdG9kb3MuaW5kZXhPZih0b2RvKTtcblxuICAgIGlmICh0b2RvSW5kZXhUb1JlcGxhY2UgIT0gLTEpIHtcbiAgICAgICAgdG9kb3NbdG9kb0luZGV4VG9SZXBsYWNlXSA9IG5ld1RvZG87XG4gICAgfVxuICAgIHJldHVybiB0b2Rvcztcbn1cblxuZXhwb3J0IHt0b2RvRmFjdG9yeSwgaXNGb3JtVmFsaWQsIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCwgc29ydFRhc2tzQWNjb3JkaW5nVG9DaG9zZW5UYXNrR3JvdXAsIGlzVG9kb0V4cGlyZWQsIGFkZEV4cGlyYXRpb25TdGF0dXMsIGRlbGV0ZVRvZG8sIGdldENoYW5nZWRUb2Rvc30iLCJpbXBvcnQge2NyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIHNob3dUb2RvR3JvdXBUaXRsZSwgb3BlbkVkaXRGb3JtLCBmaWxsRWRpdEZvcm0sIGNsb3NlRWRpdEZvcm19IGZyb20gJy4vZG9tTWFuaXB1bGF0aW9ucyc7XG5pbXBvcnQge3RvZG9GYWN0b3J5LCBpc1RvZG9FeHBpcmVkLCBhZGRFeHBpcmF0aW9uU3RhdHVzLCBkZWxldGVUb2RvLCBpc0Zvcm1WYWxpZCwgZ2V0Q2hhbmdlZFRvZG9zfSBmcm9tICcuL2FwcExvZ2ljJztcblxuY29uc3QgYWRkVG9UaGVUb2RvTGlzdCA9IGZ1bmN0aW9uKGZvcm0sIHRvZG9zKSB7XG4gICAgY29uc3QgbmV3VG9kbyA9IHRvZG9GYWN0b3J5KGZvcm0pO1xuICAgIHRvZG9zLnB1c2gobmV3VG9kbyk7XG59XG5cbmNvbnN0IGNvbXBhcmVGdW5jdGlvbiA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHsgLy8gc29ydCBieSBwcmlvcml0eSBvZiB0b2RvIGFuZCBleHBpcmVkIHRvZG9zIHdpbGwgYmUgaW4gdGhlIGJvdHRvbS4gQWxzbyBtb3N0IHVyZ2UgdG9kb3Mgd2lsbCBiZSBpbiBmaXJzdCBwbGFjZVxuICAgIGlmIChmaXJzdCAmJiBzZWNvbmQpIHtcblxuICAgICAgICBjb25zdCBjb21wYXJlRGF0ZXMgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdERhdGUgPSBmaXJzdC5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBjb25zdCBzZWNvbmREYXRlID0gc2Vjb25kLmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF0ZU9iaiA9IG5ldyBEYXRlKCBmaXJzdERhdGVbMF0sIGZpcnN0RGF0ZVsxXSwgZmlyc3REYXRlWzJdICk7XG4gICAgICAgICAgICBjb25zdCBzZWNvbmREYXRlT2JqID0gbmV3IERhdGUoIHNlY29uZERhdGVbMF0sIHNlY29uZERhdGVbMV0sIHNlY29uZERhdGVbMl0gKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gZmlyc3REYXRlT2JqIC0gc2Vjb25kRGF0ZU9iajtcbiAgICAgICAgICAgIHJldHVybiBkYXRlRGlmZmVyZW5jZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVQcmlvcml0eSA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdoaWdoJyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIGZpcnN0LnByaW9yaXR5ID09ICdtZWRpdW0nICkge1xuICAgICAgICAgICAgICAgIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdtZWRpdW0nICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKzE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2Vjb25kLnByaW9yaXR5ID09ICdsb3cnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlyc3QuZXhwaXJlZCkge1xuICAgICAgICAgICAgaWYgKHNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpb3JpdHlEaWZmZXJlbmNlID0gY29tcGFyZVByaW9yaXR5KGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgIGlmIChwcmlvcml0eURpZmZlcmVuY2UgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlRGlmZmVyZW5jZSA9IGNvbXBhcmVEYXRlcyhmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmlvcml0eURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKzE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWZpcnN0LmV4cGlyZWQpIHtcbiAgICAgICAgICAgIGlmIChzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpb3JpdHlEaWZmZXJlbmNlID0gY29tcGFyZVByaW9yaXR5KGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgIGlmIChwcmlvcml0eURpZmZlcmVuY2UgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRlRGlmZmVyZW5jZSA9IGNvbXBhcmVEYXRlcyhmaXJzdCwgc2Vjb25kKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmlvcml0eURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBzaG93QWxsVG9kb3MgPSBmdW5jdGlvbih0b2RvcywgY2xpY2tlZE9iamVjdCkge1xuICAgIGNsZWFyVG9kb0NvbnRhaW5lcigpOyAvLyBjbGVhcnMgdG9kbyBjb250YWluZXIgb2YgYWxsIHRhc2tzIGFuZCB0aGVuIHdlIHdpbGwgY3JlYXRlIGl0IGFnYWluIHdpdGggY2hvc2VuIHBhcmFtZXRlcnNcbiAgICBpZiAoY2xpY2tlZE9iamVjdCkge1xuICAgICAgICBzaG93VG9kb0dyb3VwVGl0bGUoY2xpY2tlZE9iamVjdCk7XG4gICAgfVxuXG4gICAgaWYgKHRvZG9zICYmIHRvZG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWRkRXhwaXJhdGlvblN0YXR1cyh0b2Rvcyk7XG4gICAgICAgIHRvZG9zLnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlVG9kb0Jsb2NrSW5ET00odG9kbywgaXNUb2RvRXhwaXJlZCh0b2RvKSwgdG9kb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCB0b2RvRnVuY3Rpb25zID0gZnVuY3Rpb24odG9kb3MsIGN1cnJlbnRUb2RvLCBlKSB7XG4gICAgY29uc3QgY2xpY2tlZEJ1dHRvbiA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2J1dHRvbicpOyAvLyBnZXQgY2xpY2tlZCBCdXR0b24gb3IgbnVsbFxuICAgIGlmIChjbGlja2VkQnV0dG9uKSB7XG4gICAgICAgIGlmICggY2xpY2tlZEJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2RlbGV0ZS10b2RvJykgKSB7XG4gICAgICAgICAgICBkZWxldGVUb2RvKGN1cnJlbnRUb2RvLCB0b2Rvcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VG9kb3MgPSBnZXRDaGFuZ2VkVG9kb3ModG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb3NlRWRpdEZvcm0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2RvcyhuZXdUb2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuZXdUb2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrRXZlbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgZWRpdEJ1dHRvbkNsYXNzKGN1cnJlbnRUb2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0b2RvcyB0byBpbmRleC5qc1xuICAgIH1cbn1cblxuZXhwb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3MsIHRvZG9GdW5jdGlvbnN9OyIsImltcG9ydCB7IHRvZG9GdW5jdGlvbnMgfSBmcm9tIFwiLi9jb250cm9sbGVyXCI7XG5cbmNvbnN0IGNoYW5nZVRvZG9TdGF0dXMgPSBmdW5jdGlvbih0b2RvRGF0YSkge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgdG9kb0RhdGEuY2hlY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS10b2RvJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93TmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG59XG5cbmNvbnN0IGhpZGVOZXdUYXNrV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpO1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3dGb3JtID0gbmV3VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3QgY3JlYXRlVG9kb0Jsb2NrSW5ET00gPSBmdW5jdGlvbih0b2RvRGF0YSwgdG9kb0V4cGlyZWRTdGF0dXMsIHRvZG9zKSB7XG4gICAgY29uc3QgdGFza3NDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGFza3MnKTtcblxuICAgIGNvbnN0IHRvZG9CbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKCdzaW5nbGUtdG9kbycpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKHRvZG9EYXRhLnByaW9yaXR5KTtcblxuICAgIGlmICh0b2RvRXhwaXJlZFN0YXR1cykge1xuICAgICAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnZXhwaXJlZCcpO1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX3RpdGxlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gdG9kb0RhdGEuZHVlRGF0ZTtcbiAgICBkdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2R1ZS1kYXRlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGR1ZURhdGUpO1xuXG5cbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9ucy5jbGFzc0xpc3QuYWRkKCd0b2RvX19idXR0b25zJyk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGV0YWlscy50ZXh0Q29udGVudCA9ICdkZXRhaWxzJztcbiAgICBkZXRhaWxzLmNsYXNzTGlzdC5hZGQoJ2RldGFpbHMtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGV0YWlscyk7XG5cbiAgICBjb25zdCBlZGl0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZWRpdEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZWRpdEltYWdlLnNyYyA9ICcuL2ltYWdlcy9pY29ucy9lZGl0LnN2Zyc7XG4gICAgZWRpdC5hcHBlbmRDaGlsZChlZGl0SW1hZ2UpO1xuICAgIGVkaXQuY2xhc3NMaXN0LmFkZCgnZWRpdC10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChlZGl0KTtcblxuICAgIGNvbnN0IGRlbGV0ZVRvZG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUb2RvSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBkZWxldGVUb2RvSW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2RlbGV0ZS5zdmcnO1xuICAgIGRlbGV0ZVRvZG8uYXBwZW5kQ2hpbGQoZGVsZXRlVG9kb0ltYWdlKTtcbiAgICBkZWxldGVUb2RvLmNsYXNzTGlzdC5hZGQoJ2RlbGV0ZS10b2RvJyk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChkZWxldGVUb2RvKTtcbiAgICBidXR0b25zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9kb0Z1bmN0aW9ucy5iaW5kKGJ1dHRvbnMsIHRvZG9zLCB0b2RvRGF0YSkpO1xuXG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGJ1dHRvbnMpO1xuXG5cbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcbiAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBjaGVja2JveC5jbGFzc0xpc3QuYWRkKCd0b2RvX19jaGVja2JveCcpO1xuICAgIGlmICh0b2RvRGF0YS5jaGVjayA9PSB0cnVlKSB7XG4gICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICBjaGVja2JveC5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlVG9kb1N0YXR1cy5iaW5kKGNoZWNrYm94LCB0b2RvRGF0YSkpO1xuXG4gICAgdG9kb0Jsb2NrLmRhdGFzZXQudGl0bGUgPSB0b2RvRGF0YS50aXRsZTtcbiAgICB0YXNrc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2RvQmxvY2spOyAvLyBhZGRpbmcgbmV3IHRvZG9CbG9jayBpbnRvIHRhc2tzIGNvbnRhaW5lclxufVxuXG5jb25zdCBjbGVhclRvZG9Db250YWluZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjdXJyZW50VG9kb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXRvZG8nKTtcbiAgICBjdXJyZW50VG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgdG9kby5yZW1vdmUoKTtcbiAgICB9KTtcbn1cblxuY29uc3QgY3JlYXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkKSB7XG4gICAgY29uc3QgZXJyb3JQYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGhfX3NoaWZ0ZWQnKTtcbiAgICB9XG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJpb3JpdHknKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ0Nob29zZSBwcmlvcml0eSBvZiB0aGUgdGFzayc7XG4gICAgfSBlbHNlIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ0Nob29zZSBkdWUgZGF0ZSBvZiB0aGUgdGFzayc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIGZpbGxlZCc7XG4gICAgfVxuICAgIGlucHV0RmllbGQuYmVmb3JlKGVycm9yUGFyYWdyYXBoKTtcbn1cblxuY29uc3QgZGVsZXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkKSB7XG4gICAgaW5wdXRGaWVsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xufVxuXG5jb25zdCByZXNldEVycm9ycyA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICBjb25zdCBlcnJvcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5lcnJvci1wYXJhZ3JhcGgnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvcnNbaV0ucmVtb3ZlKCk7XG4gICAgfVxuICAgIGNvbnN0IGVycm9yQm9yZGVycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmludmFsaWQnKTsgLy9nZXQgaW5wdXRzIHdpdGggXCJpbnZhbGlkXCIgY2xhc3NcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yQm9yZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvckJvcmRlcnNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hvd1RvZG9Hcm91cFRpdGxlID0gZnVuY3Rpb24oY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IGN1cnJlbnRUaXRsZSA9IGNsaWNrZWRPYmplY3QudGV4dENvbnRlbnQ7XG4gICAgY29uc3QgdGl0bGVET01FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3RpdGxlJyk7XG4gICAgdGl0bGVET01FbGVtZW50LnRleHRDb250ZW50ID0gY3VycmVudFRpdGxlO1xufVxuXG5jb25zdCBvcGVuRWRpdEZvcm0gPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvd0Zvcm0gPSBlZGl0VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrX19mb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgZWRpdFRhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG5cbiAgICByZXR1cm4gZWRpdFRhc2tXaW5kb3dGb3JtO1xufVxuXG5jb25zdCBmaWxsRWRpdEZvcm0gPSBmdW5jdGlvbih0b2RvLCBmb3JtKSB7XG4gICAgLy8gY29uc29sZS5sb2codG9kbyk7XG4gICAgLy8gY29uc29sZS5sb2coZm9ybSk7XG4gICAgZm9ybS50aXRsZS52YWx1ZSA9IHRvZG8udGl0bGU7XG4gICAgZm9ybS5kZXNjcmlwdGlvbi52YWx1ZSA9IHRvZG8uZGVzY3JpcHRpb247XG4gICAgZm9ybS5kdWVEYXRlLnZhbHVlID0gdG9kby5kdWVEYXRlO1xuXG4gICAgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ2xvdycpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1sb3cnKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ21lZGl1bScpIHtcbiAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yKCcjZWRpdC1tZWRpdW0nKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRvZG8ucHJpb3JpdHkgPT0gJ2hpZ2gnKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtaGlnaCcpLmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cblxufVxuXG5jb25zdCBjbG9zZUVkaXRGb3JtID0gZnVuY3Rpb24odG9kbykge1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgIGNvbnN0IGVkaXRUYXNrV2luZG93Rm9ybSA9IGVkaXRUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvd0Zvcm0uY2xhc3NMaXN0LmFkZCgnaGlkZGVuLWZvcm0nKTtcbiAgICBlZGl0VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuZXhwb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIGNyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIGNyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaCwgcmVzZXRFcnJvcnMsXG5zaG93VG9kb0dyb3VwVGl0bGUsIG9wZW5FZGl0Rm9ybSwgY2xvc2VFZGl0Rm9ybSwgZmlsbEVkaXRGb3JtfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCByZXNldEVycm9ycywgY2xvc2VFZGl0Rm9ybX0gZnJvbSAnLi9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3N9IGZyb20gJy4vbW9kdWxlcy9jb250cm9sbGVyJztcbmltcG9ydCB7aXNGb3JtVmFsaWQsIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCwgc29ydFRhc2tzQWNjb3JkaW5nVG9DaG9zZW5UYXNrR3JvdXB9IGZyb20gJy4vbW9kdWxlcy9hcHBMb2dpYyc7XG5cbihmdW5jdGlvbigpIHtcbiAgICBsZXQgdG9kb3MgPSBbXTtcbiAgICBcbiAgICAvLyBjcmVhdGluZyBleGFtcGxlIHRvZG9zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IGZpcnN0VG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDYWxsIHRvIElyaW5hJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGhhdmUgdG8gY2FsbCB0byBJcmluYSBhbmQga25vdyBzaGUgaXMuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDYtMTcnLFxuICAgICAgICBwcmlvcml0eTogJ2hpZ2gnLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlY29uZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQnV5IGEgcGl6emEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgbmVlZCB0byBidXkgdHdvIHBpenphcyBmb3IgbWUgYW5kIElyaW5hLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA4LTE5JyxcbiAgICAgICAgcHJpb3JpdHk6ICdtZWRpdW0nLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHRoaXJkVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdIbW1tbW1tbW0uJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTgnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICBjb25zdCBmb3VydGhUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0NoZWNrIFRvZG8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgYW0ganVzdCBjaGVja2luZy4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNy0xNScsXG4gICAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgICAgY2hlY2s6IHRydWUsXG4gICAgfTtcblxuICAgIHRvZG9zLnB1c2goZmlyc3RUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHNlY29uZFRvZG8pO1xuICAgIHRvZG9zLnB1c2godGhpcmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKGZvdXJ0aFRvZG8pO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBzaG93QWxsVG9kb3ModG9kb3MpO1xuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGhlIG5ldyB0YXNrIGZvcm0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHRhc2tGdW5jdGlvbnMgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnN0IGFkZFRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRhc2snKTsgLy8gYnV0dG9uIHRoYXQgb3BlbnMgbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7IC8vIGZvcm0ncyBvdXRlciBkaXYgYmxvY2tcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7IC8vIG5ldyB0YXNrIGZvcm1cbiAgICAgICAgY29uc3QgY2xvc2VUYXNrV2luZG93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2Nsb3NpbmctYnV0dG9uJyk7IC8vIGNsb3NlIGZvcm0gYnV0dG9uXG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWJtaXQgYnV0dG9uJyk7IC8vIGZvcm0ncyBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGNvbnN0IGNsaWNrZWRPYmplY3QgPSBlLnRhcmdldDtcbiAgICAgICAgY29uc3QgY3VycmVudFRhc2tUb0VkaXQgPSBjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpOyAvLyB0aGlzIG5lZWQgdG8gb3BlbiBlZGl0IHRvZG8gZm9ybVxuICAgICAgICBjb25zdCBlZGl0Rm9ybUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICAgICAgY29uc3QgZWRpdEZvcm0gPSBlZGl0Rm9ybUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgICAgIGNvbnN0IGVkaXRGb3JtQ2xvc2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1mb3JtX19jbG9zaW5nLWJ1dHRvbicpO1xuXG4gICAgICAgIGlmICghbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7IC8vaWYgdGhlIG5ldyB0YXNrIGZvcm0gaXMgb3BlblxuICAgICAgICAgICAgaWYgKCBjbGlja2VkT2JqZWN0ID09IGNsb3NlVGFza1dpbmRvd0J1dHRvbiB8fCAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZm9ybScpICkgeyAvL2NoZWNrIGlmIGNsaWNrZWQgT2JqZWN0IGlzIHRoZSBcImNsb3NlIGZvcm1cIiBidXR0b24gb3IgaXMgbm90IGZvcm0gd2luZG93XG4gICAgICAgICAgICAgICAgaGlkZU5ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcmVzZXRFcnJvcnMoZm9ybSk7IC8vcmVzZXQgZXJyb3IgcGFyYWdyYXBocyBpZiB0aGV5IGFyZSBleGlzdFxuICAgICAgICAgICAgfSBlbHNlIGlmIChjbGlja2VkT2JqZWN0ID09IHN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIGlzRm9ybVZhbGlkKGZvcm0pICkge1xuICAgICAgICAgICAgICAgICAgICBhZGRUb1RoZVRvZG9MaXN0KGZvcm0sIHRvZG9zKTsgLy8gY3JlYXRlcyBhbmQgaW5zZXJ0IG5ldyB0b2RvIGluIERPTVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyBuZWVkIHRvIGhpZ2hsaWdodCBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza3NHcm91cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvLyBcImFsbCB0YXNrc1wiIGJ1dHRvbiBhZnRlclxuICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3MpO1xuICAgICAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgICAgICBmb3JtLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvL2lmIHRoZSBuZXcgdGFzayBmb3JtIGlzIGNsb3NlZFxuICAgICAgICAgICAgaWYgKGNsaWNrZWRPYmplY3QgPT0gYWRkVGFza1dpbmRvd0J1dHRvbikgeyAvL2NoZWNrIGlmIGNsaWNrZWQgT2JqZWN0IGlzIFwiYWRkIHRhc2tcIiBidXR0b25cbiAgICAgICAgICAgICAgICBzaG93TmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggKGNsaWNrZWRPYmplY3QgPT0gZWRpdEZvcm1Db250YWluZXIgJiYgIWVkaXRGb3JtQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykgJiYgXG4gICAgICAgICAgICAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZWRpdC10YXNrX19mb3JtJykgKSB8fCBjbGlja2VkT2JqZWN0ID09IGVkaXRGb3JtQ2xvc2VCdXR0b24pIHsgLy8gaWYgZWRpdCBmb3JtIGlzIG9wZW4uIFRoZW4gd2UgY2xvc2UgYnV0dG9uIGNsaWNrZWRcbiAgICAgICAgICAgICAgICBjbG9zZUVkaXRGb3JtKCk7XG4gICAgICAgICAgICAgICAgZWRpdEZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGFza0Z1bmN0aW9ucyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciB0YXNrIGdyb3Vwc1xuICAgIGNvbnN0IHRhc2tHcm91cHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFza3MgdWwnKTsgLy9nZXQgc2lkZWJhciB0YXNrIGdyb3Vwc1xuXG4gICAgY29uc3QgdGFza0dyb3Vwc0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCAhPSB0YXNrR3JvdXBzKSB7XG4gICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cChjbGlja2VkT2JqZWN0LCB0b2Rvcyk7XG4gICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93LCBjbGlja2VkT2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRhc2tHcm91cHMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0YXNrR3JvdXBzRnVuY3Rpb25zKTtcblxufSkoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=