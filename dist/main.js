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
/* harmony export */   "highlightChosenTaskGroup": () => (/* binding */ highlightChosenTaskGroup),
/* harmony export */   "isFormValid": () => (/* binding */ isFormValid),
/* harmony export */   "isTodoExpired": () => (/* binding */ isTodoExpired),
/* harmony export */   "sortTasksAccordingToChosenTaskGroup": () => (/* binding */ sortTasksAccordingToChosenTaskGroup),
/* harmony export */   "todoFactory": () => (/* binding */ todoFactory)
/* harmony export */ });
/* harmony import */ var _domManipulations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./domManipulations */ "./src/modules/domManipulations.js");


const todoFactory = function(form) {
    let todoObject = {}; // object that collects info from new task form!
    const formElements = form.elements;
    for (let i = 0; i < formElements.length - 1; i++) { // all fields except submit button
        const element = formElements[i];
        if (element.name == 'title' || element.name == 'description') {
            todoObject[element.name] = element.value;
        } else if (element.name == 'priority' && element.checked) {
            todoObject[element.name] = element.id;
        } else if (element.name == 'dueDate') {
            todoObject[element.name] = element.value;
        }
    }
    todoObject.check = false;
    return todoObject;
}

const isFormValid = function(form) {
    const titleInput = form.querySelector('input#title');
    const dueDateInput = form.querySelector('input#dueDate');
    const priorityInputs = form.querySelectorAll('input[name=priority]');
    const priorityButtons = form.querySelector('.priority__buttons');
    
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
    if (differenceInDays <= 8 && differenceInDays >= 0) {
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



/***/ }),

/***/ "./src/modules/controller.js":
/*!***********************************!*\
  !*** ./src/modules/controller.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addToTheTodoList": () => (/* binding */ addToTheTodoList),
/* harmony export */   "showAllTodos": () => (/* binding */ showAllTodos)
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

const showAllTodos = function(todos) {
    ;(0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.clearTodoContainer)(); // clears todo container of all tasks and then we will create it again with chosen parameters
    const allTasks = document.querySelector('.all-tasks'); // these three lines (12-14) need to highlight 
    const tasksGroup = document.querySelector('.tasks ul'); // "all tasks" button after
    (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.highlightChosenTaskGroup)(tasksGroup, allTasks); // creating a new task
    
    if (todos && todos.length > 0) {
        (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.addExpirationStatus)(todos);
        todos.sort(compareFunction);
        
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            if (todo) {
                (0,_domManipulations__WEBPACK_IMPORTED_MODULE_0__.createTodoBlockInDOM)(todo, (0,_appLogic__WEBPACK_IMPORTED_MODULE_1__.isTodoExpired)(todo));
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
/* harmony export */   "clearTodoContainer": () => (/* binding */ clearTodoContainer),
/* harmony export */   "createErrorParagraph": () => (/* binding */ createErrorParagraph),
/* harmony export */   "createTodoBlockInDOM": () => (/* binding */ createTodoBlockInDOM),
/* harmony export */   "deleteErrorParagraph": () => (/* binding */ deleteErrorParagraph),
/* harmony export */   "hideNewTaskWindow": () => (/* binding */ hideNewTaskWindow),
/* harmony export */   "resetErrors": () => (/* binding */ resetErrors),
/* harmony export */   "showNewTaskWindow": () => (/* binding */ showNewTaskWindow)
/* harmony export */ });

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

const createTodoBlockInDOM = function(todoData, todoExpiredStatus) {
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
    buttons.appendChild(details);

    const edit = document.createElement('button');
    const editImage = document.createElement('img');
    editImage.src = './images/icons/edit.svg';
    edit.appendChild(editImage);
    buttons.appendChild(edit);

    const deleteTodo = document.createElement('button');
    const deleteTodoImage = document.createElement('img');
    deleteTodoImage.src = './images/icons/delete.svg';
    deleteTodo.appendChild(deleteTodoImage);
    buttons.appendChild(deleteTodo);

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

    // Add Event Listeners for the form ===========================================
    const addNewTaskFunctions = function(e) {
        const addTaskWindowButton = document.querySelector('.add-task'); // button that opens new task form
        const newTaskWindow = document.querySelector('.new-task'); // form's outer div block
        const form = document.querySelector('.form'); // new task form
        const closeTaskWindowButton = document.querySelector('.form__closing-button'); // close form button
        const submitButton = document.querySelector('.form__submit button'); // form's submit button
        const clickedObject = e.target;

        if (!newTaskWindow.classList.contains('hidden')) { //if the new task form is open
            if (clickedObject == closeTaskWindowButton || !clickedObject.closest('.form')) { //check if clicked Object is the "close form" button or is not form window
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                form.reset();
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.resetErrors)(form); //reset error paragraphs if they are exist
            } else if (clickedObject == submitButton) {
                e.preventDefault();
                if ( (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.isFormValid)(form) ) {
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.addToTheTodoList)(form, todos); // creates and insert new todo in DOM
                    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos);
                    (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.hideNewTaskWindow)();
                    form.reset();
                }
            }
        } else { //if the new task form is closed
            if (clickedObject == addTaskWindowButton) { //check if clicked Object is "add task" button
                (0,_modules_domManipulations__WEBPACK_IMPORTED_MODULE_0__.showNewTaskWindow)();
            }
        }
    }
    window.addEventListener('click', addNewTaskFunctions);


    // Add Event Listeners for task groups
    const taskGroups = document.querySelector('.tasks ul'); //get sidebar task groups
    
    const taskGroupsFunctions = function(e) {
        const clickedObject = e.target;

        (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.highlightChosenTaskGroup)(taskGroups, clickedObject);

        const todosForShow = (0,_modules_appLogic__WEBPACK_IMPORTED_MODULE_2__.sortTasksAccordingToChosenTaskGroup)(clickedObject, todos);

        (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow);
    }

    taskGroups.addEventListener('click', taskGroupsFunctions);
})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cEI7O0FBRUE7QUFDQSxDQUFDLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHBMb2dpYy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9jb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnXG5cbmNvbnN0IHRvZG9GYWN0b3J5ID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGxldCB0b2RvT2JqZWN0ID0ge307IC8vIG9iamVjdCB0aGF0IGNvbGxlY3RzIGluZm8gZnJvbSBuZXcgdGFzayBmb3JtIVxuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IGZvcm0uZWxlbWVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtRWxlbWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7IC8vIGFsbCBmaWVsZHMgZXhjZXB0IHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1FbGVtZW50c1tpXTtcbiAgICAgICAgaWYgKGVsZW1lbnQubmFtZSA9PSAndGl0bGUnIHx8IGVsZW1lbnQubmFtZSA9PSAnZGVzY3JpcHRpb24nKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PSAncHJpb3JpdHknICYmIGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC5pZDtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZG9PYmplY3QuY2hlY2sgPSBmYWxzZTtcbiAgICByZXR1cm4gdG9kb09iamVjdDtcbn1cblxuY29uc3QgaXNGb3JtVmFsaWQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjdGl0bGUnKTtcbiAgICBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I2R1ZURhdGUnKTtcbiAgICBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1wcmlvcml0eV0nKTtcbiAgICBjb25zdCBwcmlvcml0eUJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eV9fYnV0dG9ucycpO1xuICAgIFxuICAgIGxldCB2YWxpZFByaW9yaXR5O1xuICAgIGxldCBwcmlvcml0eUNoZWNrID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmlvcml0eUlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJpb3JpdHlJbnB1dCA9IHByaW9yaXR5SW5wdXRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFByaW9yaXR5SW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgcHJpb3JpdHlDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHJpb3JpdHlDaGVjayAmJiAhcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIHZhbGlkUHJpb3JpdHkgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHByaW9yaXR5Q2hlY2spIHtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IHRydWU7XG4gICAgICAgIGlmIChwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvci1wYXJhZ3JhcGgnKSkge1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocHJpb3JpdHlJbnB1dHNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkRHVlRGF0ZTtcbiAgICBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGR1ZURhdGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWREdWVEYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWRUaXRsZTtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgPT0gJycgJiYgIXRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgdGl0bGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIHZhbGlkVGl0bGUgPSBmYWxzZTtcblxuICAgIH0gZWxzZSBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWRUaXRsZSA9IHRydWU7XG4gICAgICAgIGlmICh0aXRsZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWQgPSB2YWxpZFByaW9yaXR5ICYmIHZhbGlkRHVlRGF0ZSAmJiB2YWxpZFRpdGxlO1xuICAgIHJldHVybiB2YWxpZDtcbn1cblxuY29uc3QgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24odGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IHRhc2tHcm91cHNFbGVtZW50cyA9IHRhc2tHcm91cHMucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tHcm91cHNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza0dyb3VwID0gdGFza0dyb3Vwc0VsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFRhc2tHcm91cCA9PSBjbGlja2VkT2JqZWN0ICYmICFjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUYXNrR3JvdXAgIT0gY2xpY2tlZE9iamVjdCAmJiBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBzb3J0Q3VycmVudFRvZG8gPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0LCB0b2RvKSB7XG4gICAgY29uc3QgY3VycmVudERhdGVBbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXREYXRlKCk7XG4gICAgY29uc3QgY3VycmVudEhvdXJzID0gY3VycmVudERhdGVBbmRUaW1lLmdldEhvdXJzKCk7XG4gICAgY29uc3QgY3VycmVudE1pbnV0ZXMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TWludXRlcygpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWNvbmRzID0gY3VycmVudERhdGVBbmRUaW1lLmdldFNlY29uZHMoKTtcblxuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCB0b2RvTW9udGggLSAxLCB0b2RvRGF0ZSk7IC8vRGF0ZSBPYmogZm9yIHRvZG9cbiAgICBpZiAoY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ3RvZGF5JykpIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwidG9kYXlcIlxuICAgICAgICBpZiAoIGlzVG9kYXkodG9kb1llYXIsIHRvZG9Nb250aCwgdG9kb0RhdGUsIGN1cnJlbnRZZWFyLCBjdXJyZW50TW9udGgsIGN1cnJlbnREYXRlKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnd2VlaycpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJ0aGlzIHdlZWtcIlxuICAgICAgICBpZiAoIGlzV2Vlayh0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnbW9udGgnKSApIHsgLy8gY2hlY2tzIGlmIGNsaWNrZWQgb2JqZWN0IGlzIFwibW9udGhcIlxuICAgICAgICBpZiAoIGlzTW9udGgodG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9kbztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICggY2xpY2tlZE9iamVjdC5jbGFzc0xpc3QuY29udGFpbnMoJ2FsbC10YXNrcycpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJhbGwgdGFza3NcIlxuICAgICAgICByZXR1cm4gdG9kbztcbiAgICB9XG59XG5cbmNvbnN0IGlzVG9kYXkgPSBmdW5jdGlvbih0b2RvWWVhciwgdG9kb01vbnRoLCB0b2RvRGF0ZSwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgY3VycmVudERhdGUpIHsgLy9mdW5jdGlvbiBjaGVja3MgaWYgdG9kbydzIGRhdGUgZXhwaXJlZCB0b2RheVxuICAgIGlmICggdG9kb1llYXIgPT0gY3VycmVudFllYXIgJiYgdG9kb01vbnRoID09IGN1cnJlbnRNb250aCAmJiB0b2RvRGF0ZSA9PSBjdXJyZW50RGF0ZSApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgaXNXZWVrID0gZnVuY3Rpb24odG9kb0RhdGVPYmosIGN1cnJlbnREYXRlQW5kVGltZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBhbmQgY3VycmVudCBkYXRlIGRpZmZlcnMgYnkgbm8gbW9yZSB0aGFuIDEgd2Vla1xuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpO1xuICAgIGlmIChkaWZmZXJlbmNlSW5EYXlzIDw9IDggJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzTW9udGggPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSBtb250aFxuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpICsgMTtcbiAgICBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzIgJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKCBjdXJyZW50TW9udGggPT0gMSB8fCBjdXJyZW50TW9udGggPT0gMyB8fCBjdXJyZW50TW9udGggPT0gNSB8fCBjdXJyZW50TW9udGggPT0gNyB8fCBjdXJyZW50TW9udGggPT0gOCB8fCBjdXJyZW50TW9udGggPT0gMTAgfHwgY3VycmVudE1vbnRoID09IDEyICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzEgJiYgKGN1cnJlbnRNb250aCA9PSA0IHx8IGN1cnJlbnRNb250aCA9PSA2IHx8IGN1cnJlbnRNb250aCA9PSA5IHx8IGN1cnJlbnRNb250aCA9PSAxMSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggIGN1cnJlbnRNb250aCA9PSAyICYmIChkaWZmZXJlbmNlSW5EYXlzIDw9ICgyOSArIGlzTGVhcFllYXIoY3VycmVudFllYXIpKSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlzTGVhcFllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgaWYgKHllYXIgJSA0ID09IDApIHtcbiAgICAgICAgaWYgKHllYXIgJSAxMDAgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHllYXIgJSA0MDAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5jb25zdCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG9zKSB7XG4gICAgbGV0IHRvZG9MaXN0VG9TaG93ID0gW107IC8vY3VycmVudCB0b2RvTGlzdCB0aGF0IHdlIGdvaW5nIHRvIHNob3csIHdlJ2xsIGZpbGwgaXRcbiAgICBpZiAodG9kb3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRUb2RvID0gc29ydEN1cnJlbnRUb2RvKGNsaWNrZWRPYmplY3QsIHRvZG8pO1xuICAgICAgICAgICAgdG9kb0xpc3RUb1Nob3cucHVzaChzb3J0ZWRUb2RvKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9kb0xpc3RUb1Nob3c7XG59XG5cbmNvbnN0IGlzVG9kb0V4cGlyZWQgPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsICt0b2RvTW9udGggLSAxLCArdG9kb0RhdGUgKzEgKTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZU9iaiA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKCB0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlT2JqIDwgMCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgYWRkRXhwaXJhdGlvblN0YXR1cyA9IGZ1bmN0aW9uKHRvZG9zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgICAgICB0b2RvLmV4cGlyZWQgPSBpc1RvZG9FeHBpcmVkKHRvZG8pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge3RvZG9GYWN0b3J5LCBpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1c30iLCJpbXBvcnQge2NyZWF0ZVRvZG9CbG9ja0luRE9NfSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHt0b2RvRmFjdG9yeSwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwfSBmcm9tICcuL2FwcExvZ2ljJztcbmltcG9ydCB7Y2xlYXJUb2RvQ29udGFpbmVyfSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuXG5jb25zdCBhZGRUb1RoZVRvZG9MaXN0ID0gZnVuY3Rpb24oZm9ybSwgdG9kb3MpIHtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZm9ybSk7XG4gICAgdG9kb3MucHVzaChuZXdUb2RvKTtcbn1cblxuY29uc3QgY29tcGFyZUZ1bmN0aW9uID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkgeyAvLyBzb3J0IGJ5IHByaW9yaXR5IG9mIHRvZG8gYW5kIGV4cGlyZWQgdG9kb3Mgd2lsbCBiZSBpbiB0aGUgYm90dG9tLiBBbHNvIG1vc3QgdXJnZSB0b2RvcyB3aWxsIGJlIGluIGZpcnN0IHBsYWNlXG4gICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVEYXRlcyA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF0ZSA9IGZpcnN0LmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGUgPSBzZWNvbmQuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlT2JqID0gbmV3IERhdGUoIGZpcnN0RGF0ZVswXSwgZmlyc3REYXRlWzFdLCBmaXJzdERhdGVbMl0gKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGVPYmogPSBuZXcgRGF0ZSggc2Vjb25kRGF0ZVswXSwgc2Vjb25kRGF0ZVsxXSwgc2Vjb25kRGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBmaXJzdERhdGVPYmogLSBzZWNvbmREYXRlT2JqO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcGFyZVByaW9yaXR5ID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghZmlyc3QuZXhwaXJlZCkge1xuICAgICAgICAgICAgaWYgKHNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNob3dBbGxUb2RvcyA9IGZ1bmN0aW9uKHRvZG9zKSB7XG4gICAgY2xlYXJUb2RvQ29udGFpbmVyKCk7IC8vIGNsZWFycyB0b2RvIGNvbnRhaW5lciBvZiBhbGwgdGFza3MgYW5kIHRoZW4gd2Ugd2lsbCBjcmVhdGUgaXQgYWdhaW4gd2l0aCBjaG9zZW4gcGFyYW1ldGVyc1xuICAgIGNvbnN0IGFsbFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsbC10YXNrcycpOyAvLyB0aGVzZSB0aHJlZSBsaW5lcyAoMTItMTQpIG5lZWQgdG8gaGlnaGxpZ2h0IFxuICAgIGNvbnN0IHRhc2tzR3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFza3MgdWwnKTsgLy8gXCJhbGwgdGFza3NcIiBidXR0b24gYWZ0ZXJcbiAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza3NHcm91cCwgYWxsVGFza3MpOyAvLyBjcmVhdGluZyBhIG5ldyB0YXNrXG4gICAgXG4gICAgaWYgKHRvZG9zICYmIHRvZG9zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWRkRXhwaXJhdGlvblN0YXR1cyh0b2Rvcyk7XG4gICAgICAgIHRvZG9zLnNvcnQoY29tcGFyZUZ1bmN0aW9uKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9kb3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgICAgICAgICAgY3JlYXRlVG9kb0Jsb2NrSW5ET00odG9kbywgaXNUb2RvRXhwaXJlZCh0b2RvKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zfTsiLCJcbmNvbnN0IGNoYW5nZVRvZG9TdGF0dXMgPSBmdW5jdGlvbih0b2RvRGF0YSkge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgdG9kb0RhdGEuY2hlY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS10b2RvJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93TmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG59XG5cbmNvbnN0IGhpZGVOZXdUYXNrV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpO1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3dGb3JtID0gbmV3VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3QgY3JlYXRlVG9kb0Jsb2NrSW5ET00gPSBmdW5jdGlvbih0b2RvRGF0YSwgdG9kb0V4cGlyZWRTdGF0dXMpIHtcbiAgICBjb25zdCB0YXNrc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190YXNrcycpO1xuXG4gICAgY29uc3QgdG9kb0Jsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ3NpbmdsZS10b2RvJyk7XG4gICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQodG9kb0RhdGEucHJpb3JpdHkpO1xuICAgIGlmICh0b2RvRXhwaXJlZFN0YXR1cykge1xuICAgICAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnZXhwaXJlZCcpO1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5leHBpcmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLnRpdGxlO1xuICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX3RpdGxlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgIGNvbnN0IGR1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkdWVEYXRlLnRleHRDb250ZW50ID0gdG9kb0RhdGEuZHVlRGF0ZTtcbiAgICBkdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2R1ZS1kYXRlJyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGR1ZURhdGUpO1xuXG5cbiAgICBjb25zdCBidXR0b25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnV0dG9ucy5jbGFzc0xpc3QuYWRkKCd0b2RvX19idXR0b25zJyk7XG5cbiAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgZGV0YWlscy50ZXh0Q29udGVudCA9ICdkZXRhaWxzJztcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuXG4gICAgY29uc3QgZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVkaXRJbWFnZS5zcmMgPSAnLi9pbWFnZXMvaWNvbnMvZWRpdC5zdmcnO1xuICAgIGVkaXQuYXBwZW5kQ2hpbGQoZWRpdEltYWdlKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGVkaXQpO1xuXG4gICAgY29uc3QgZGVsZXRlVG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGRlbGV0ZVRvZG9JbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGRlbGV0ZVRvZG9JbWFnZS5zcmMgPSAnLi9pbWFnZXMvaWNvbnMvZGVsZXRlLnN2Zyc7XG4gICAgZGVsZXRlVG9kby5hcHBlbmRDaGlsZChkZWxldGVUb2RvSW1hZ2UpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGVsZXRlVG9kbyk7XG5cbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoYnV0dG9ucyk7XG5cblxuICAgIGNvbnN0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0b2RvQmxvY2suYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNsYXNzTGlzdC5hZGQoJ3RvZG9fX2NoZWNrYm94Jyk7XG4gICAgaWYgKHRvZG9EYXRhLmNoZWNrID09IHRydWUpIHtcbiAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIGNoZWNrYm94LmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH1cbiAgICBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBjaGFuZ2VUb2RvU3RhdHVzLmJpbmQoY2hlY2tib3gsIHRvZG9EYXRhKSk7XG5cbiAgICB0YXNrc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0b2RvQmxvY2spOyAvLyBhZGRpbmcgbmV3IHRvZG9CbG9jayBpbnRvIHRhc2tzIGNvbnRhaW5lclxufVxuXG5jb25zdCBjbGVhclRvZG9Db250YWluZXIgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjdXJyZW50VG9kb3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2luZ2xlLXRvZG8nKTtcbiAgICBjdXJyZW50VG9kb3MuZm9yRWFjaCh0b2RvID0+IHtcbiAgICAgICAgdG9kby5yZW1vdmUoKTtcbiAgICB9KTtcbn1cblxuY29uc3QgY3JlYXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkKSB7XG4gICAgY29uc3QgZXJyb3JQYXJhZ3JhcGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGgnKTtcbiAgICBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC5jbGFzc0xpc3QuYWRkKCdlcnJvci1wYXJhZ3JhcGhfX3NoaWZ0ZWQnKTtcbiAgICB9XG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAncHJpb3JpdHknKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ0Nob29zZSBwcmlvcml0eSBvZiB0aGUgdGFzayc7XG4gICAgfSBlbHNlIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ0Nob29zZSBkdWUgZGF0ZSBvZiB0aGUgdGFzayc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGgudGV4dENvbnRlbnQgPSAnVGhpcyBmaWVsZCBtdXN0IGJlIGZpbGxlZCc7XG4gICAgfVxuICAgIGlucHV0RmllbGQuYmVmb3JlKGVycm9yUGFyYWdyYXBoKTtcbn1cblxuY29uc3QgZGVsZXRlRXJyb3JQYXJhZ3JhcGggPSBmdW5jdGlvbihpbnB1dEZpZWxkKSB7XG4gICAgaW5wdXRGaWVsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnJlbW92ZSgpO1xufVxuXG5jb25zdCByZXNldEVycm9ycyA9IGZ1bmN0aW9uKGZvcm0pIHtcbiAgICBjb25zdCBlcnJvcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5lcnJvci1wYXJhZ3JhcGgnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvcnNbaV0ucmVtb3ZlKCk7XG4gICAgfVxuICAgIGNvbnN0IGVycm9yQm9yZGVycyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnLmludmFsaWQnKTsgLy9nZXQgaW5wdXRzIHdpdGggXCJpbnZhbGlkXCIgY2xhc3NcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVycm9yQm9yZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBlcnJvckJvcmRlcnNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnaW52YWxpZCcpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIGNyZWF0ZVRvZG9CbG9ja0luRE9NLCBjbGVhclRvZG9Db250YWluZXIsIGNyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaCwgcmVzZXRFcnJvcnN9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtzaG93TmV3VGFza1dpbmRvdywgaGlkZU5ld1Rhc2tXaW5kb3csIHJlc2V0RXJyb3JzfSBmcm9tICcuL21vZHVsZXMvZG9tTWFuaXB1bGF0aW9ucyc7XG5pbXBvcnQge2FkZFRvVGhlVG9kb0xpc3QsIHNob3dBbGxUb2Rvc30gZnJvbSAnLi9tb2R1bGVzL2NvbnRyb2xsZXInO1xuaW1wb3J0IHtpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cH0gZnJvbSAnLi9tb2R1bGVzL2FwcExvZ2ljJztcblxuKGZ1bmN0aW9uKCkge1xuICAgIGxldCB0b2RvcyA9IFtdO1xuICAgIFxuICAgIC8vIGNyZWF0aW5nIGV4YW1wbGUgdG9kb3MgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgZmlyc3RUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0NhbGwgdG8gSXJpbmEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgaGF2ZSB0byBjYWxsIHRvIElyaW5hIGFuZCBrbm93IHNoZSBpcy4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNi0xNycsXG4gICAgICAgIHByaW9yaXR5OiAnaGlnaCcsXG4gICAgICAgIGNoZWNrOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2Vjb25kVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdCdXkgYSBwaXp6YScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBuZWVkIHRvIGJ1eSB0d28gcGl6emFzIGZvciBtZSBhbmQgSXJpbmEuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDgtMTknLFxuICAgICAgICBwcmlvcml0eTogJ21lZGl1bScsXG4gICAgICAgIGNoZWNrOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgY29uc3QgdGhpcmRUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0htbW0nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0htbW1tbW1tbS4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNy0xOCcsXG4gICAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgICAgY2hlY2s6IHRydWUsXG4gICAgfTtcblxuICAgIGNvbnN0IGZvdXJ0aFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQ2hlY2sgVG9kbycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBhbSBqdXN0IGNoZWNraW5nLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA3LTE1JyxcbiAgICAgICAgcHJpb3JpdHk6ICdsb3cnLFxuICAgICAgICBjaGVjazogdHJ1ZSxcbiAgICB9O1xuXG4gICAgdG9kb3MucHVzaChmaXJzdFRvZG8pO1xuICAgIHRvZG9zLnB1c2goc2Vjb25kVG9kbyk7XG4gICAgdG9kb3MucHVzaCh0aGlyZFRvZG8pO1xuICAgIHRvZG9zLnB1c2goZm91cnRoVG9kbyk7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIHNob3dBbGxUb2Rvcyh0b2Rvcyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciB0aGUgZm9ybSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgYWRkTmV3VGFza0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgYWRkVGFza1dpbmRvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdGFzaycpOyAvLyBidXR0b24gdGhhdCBvcGVucyBuZXcgdGFzayBmb3JtXG4gICAgICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTsgLy8gZm9ybSdzIG91dGVyIGRpdiBibG9ja1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0nKTsgLy8gbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBjbG9zZVRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fY2xvc2luZy1idXR0b24nKTsgLy8gY2xvc2UgZm9ybSBidXR0b25cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCBidXR0b24nKTsgLy8gZm9ybSdzIHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIGlmICghbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZGRlbicpKSB7IC8vaWYgdGhlIG5ldyB0YXNrIGZvcm0gaXMgb3BlblxuICAgICAgICAgICAgaWYgKGNsaWNrZWRPYmplY3QgPT0gY2xvc2VUYXNrV2luZG93QnV0dG9uIHx8ICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5mb3JtJykpIHsgLy9jaGVjayBpZiBjbGlja2VkIE9iamVjdCBpcyB0aGUgXCJjbG9zZSBmb3JtXCIgYnV0dG9uIG9yIGlzIG5vdCBmb3JtIHdpbmRvd1xuICAgICAgICAgICAgICAgIGhpZGVOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHJlc2V0RXJyb3JzKGZvcm0pOyAvL3Jlc2V0IGVycm9yIHBhcmFncmFwaHMgaWYgdGhleSBhcmUgZXhpc3RcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoY2xpY2tlZE9iamVjdCA9PSBzdWJtaXRCdXR0b24pIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCBpc0Zvcm1WYWxpZChmb3JtKSApIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9UaGVUb2RvTGlzdChmb3JtLCB0b2Rvcyk7IC8vIGNyZWF0ZXMgYW5kIGluc2VydCBuZXcgdG9kbyBpbiBET01cbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zKTtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBjbG9zZWRcbiAgICAgICAgICAgIGlmIChjbGlja2VkT2JqZWN0ID09IGFkZFRhc2tXaW5kb3dCdXR0b24pIHsgLy9jaGVjayBpZiBjbGlja2VkIE9iamVjdCBpcyBcImFkZCB0YXNrXCIgYnV0dG9uXG4gICAgICAgICAgICAgICAgc2hvd05ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGROZXdUYXNrRnVuY3Rpb25zKTtcblxuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGFzayBncm91cHNcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vZ2V0IHNpZGViYXIgdGFzayBncm91cHNcbiAgICBcbiAgICBjb25zdCB0YXNrR3JvdXBzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwKHRhc2tHcm91cHMsIGNsaWNrZWRPYmplY3QpO1xuXG4gICAgICAgIGNvbnN0IHRvZG9zRm9yU2hvdyA9IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwKGNsaWNrZWRPYmplY3QsIHRvZG9zKTtcblxuICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93KTtcbiAgICB9XG5cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==