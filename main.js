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

                    const allTasks = document.querySelector('.all-tasks'); // these three lines (68-70) need to highlight 
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aUVBQVk7QUFDcEI7O0FBRUE7QUFDQSxDQUFDLEkiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9hcHBMb2dpYy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9jb250cm9sbGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRXJyb3JQYXJhZ3JhcGgsIGRlbGV0ZUVycm9yUGFyYWdyYXBofSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnXG5cbmNvbnN0IHRvZG9GYWN0b3J5ID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGxldCB0b2RvT2JqZWN0ID0ge307IC8vIG9iamVjdCB0aGF0IGNvbGxlY3RzIGluZm8gZnJvbSBuZXcgdGFzayBmb3JtIVxuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IGZvcm0uZWxlbWVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtRWxlbWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7IC8vIGFsbCBmaWVsZHMgZXhjZXB0IHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1FbGVtZW50c1tpXTtcbiAgICAgICAgaWYgKGVsZW1lbnQubmFtZSA9PSAndGl0bGUnIHx8IGVsZW1lbnQubmFtZSA9PSAnZGVzY3JpcHRpb24nKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PSAncHJpb3JpdHknICYmIGVsZW1lbnQuY2hlY2tlZCkge1xuICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC5pZDtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lm5hbWUgPT0gJ2R1ZURhdGUnKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvZG9PYmplY3QuY2hlY2sgPSBmYWxzZTtcbiAgICByZXR1cm4gdG9kb09iamVjdDtcbn1cblxuY29uc3QgaXNGb3JtVmFsaWQgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgdGl0bGVJbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXQjdGl0bGUnKTtcbiAgICBjb25zdCBkdWVEYXRlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I2R1ZURhdGUnKTtcbiAgICBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbbmFtZT1wcmlvcml0eV0nKTtcbiAgICBjb25zdCBwcmlvcml0eUJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJy5wcmlvcml0eV9fYnV0dG9ucycpO1xuICAgIFxuICAgIGxldCB2YWxpZFByaW9yaXR5O1xuICAgIGxldCBwcmlvcml0eUNoZWNrID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmlvcml0eUlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJpb3JpdHlJbnB1dCA9IHByaW9yaXR5SW5wdXRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFByaW9yaXR5SW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgcHJpb3JpdHlDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHJpb3JpdHlDaGVjayAmJiAhcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIHZhbGlkUHJpb3JpdHkgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHByaW9yaXR5Q2hlY2spIHtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IHRydWU7XG4gICAgICAgIGlmIChwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvci1wYXJhZ3JhcGgnKSkge1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocHJpb3JpdHlJbnB1dHNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkRHVlRGF0ZTtcbiAgICBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGR1ZURhdGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWREdWVEYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWRUaXRsZTtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgPT0gJycgJiYgIXRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgdGl0bGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIHZhbGlkVGl0bGUgPSBmYWxzZTtcblxuICAgIH0gZWxzZSBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWRUaXRsZSA9IHRydWU7XG4gICAgICAgIGlmICh0aXRsZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWQgPSB2YWxpZFByaW9yaXR5ICYmIHZhbGlkRHVlRGF0ZSAmJiB2YWxpZFRpdGxlO1xuICAgIHJldHVybiB2YWxpZDtcbn1cblxuY29uc3QgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24odGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IHRhc2tHcm91cHNFbGVtZW50cyA9IHRhc2tHcm91cHMucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tHcm91cHNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza0dyb3VwID0gdGFza0dyb3Vwc0VsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFRhc2tHcm91cCA9PSBjbGlja2VkT2JqZWN0ICYmICFjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUYXNrR3JvdXAgIT0gY2xpY2tlZE9iamVjdCAmJiBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBzb3J0Q3VycmVudFRvZG8gPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0LCB0b2RvKSB7XG4gICAgY29uc3QgY3VycmVudERhdGVBbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXREYXRlKCk7XG4gICAgY29uc3QgY3VycmVudEhvdXJzID0gY3VycmVudERhdGVBbmRUaW1lLmdldEhvdXJzKCk7XG4gICAgY29uc3QgY3VycmVudE1pbnV0ZXMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TWludXRlcygpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWNvbmRzID0gY3VycmVudERhdGVBbmRUaW1lLmdldFNlY29uZHMoKTtcblxuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCB0b2RvTW9udGggLSAxLCB0b2RvRGF0ZSk7IC8vRGF0ZSBPYmogZm9yIHRvZG9cblxuICAgIGlmIChjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygndG9kYXknKSkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJ0b2RheVwiXG4gICAgICAgIGlmICggaXNUb2RheSh0b2RvWWVhciwgdG9kb01vbnRoLCB0b2RvRGF0ZSwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgY3VycmVudERhdGUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWVrJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRoaXMgd2Vla1wiXG4gICAgICAgIGlmICggaXNXZWVrKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJtb250aFwiXG4gICAgICAgIGlmICggaXNNb250aCh0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnYWxsLXRhc2tzJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcImFsbCB0YXNrc1wiXG4gICAgICAgIHJldHVybiB0b2RvO1xuICAgIH1cbn1cblxuY29uc3QgaXNUb2RheSA9IGZ1bmN0aW9uKHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBleHBpcmVkIHRvZGF5XG4gICAgaWYgKCB0b2RvWWVhciA9PSBjdXJyZW50WWVhciAmJiB0b2RvTW9udGggPT0gY3VycmVudE1vbnRoICYmIHRvZG9EYXRlID09IGN1cnJlbnREYXRlICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBpc1dlZWsgPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSB3ZWVrXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgaWYgKGRpZmZlcmVuY2VJbkRheXMgPD0gNyAmJiBkaWZmZXJlbmNlSW5EYXlzID49IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzTW9udGggPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSBtb250aFxuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpICsgMTtcbiAgICBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzIgJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKCBjdXJyZW50TW9udGggPT0gMSB8fCBjdXJyZW50TW9udGggPT0gMyB8fCBjdXJyZW50TW9udGggPT0gNSB8fCBjdXJyZW50TW9udGggPT0gNyB8fCBjdXJyZW50TW9udGggPT0gOCB8fCBjdXJyZW50TW9udGggPT0gMTAgfHwgY3VycmVudE1vbnRoID09IDEyICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzEgJiYgKGN1cnJlbnRNb250aCA9PSA0IHx8IGN1cnJlbnRNb250aCA9PSA2IHx8IGN1cnJlbnRNb250aCA9PSA5IHx8IGN1cnJlbnRNb250aCA9PSAxMSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggIGN1cnJlbnRNb250aCA9PSAyICYmIChkaWZmZXJlbmNlSW5EYXlzIDw9ICgyOSArIGlzTGVhcFllYXIoY3VycmVudFllYXIpKSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlzTGVhcFllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgaWYgKHllYXIgJSA0ID09IDApIHtcbiAgICAgICAgaWYgKHllYXIgJSAxMDAgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHllYXIgJSA0MDAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5jb25zdCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG9zKSB7XG4gICAgbGV0IHRvZG9MaXN0VG9TaG93ID0gW107IC8vY3VycmVudCB0b2RvTGlzdCB0aGF0IHdlIGdvaW5nIHRvIHNob3csIHdlJ2xsIGZpbGwgaXRcbiAgICBpZiAodG9kb3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRUb2RvID0gc29ydEN1cnJlbnRUb2RvKGNsaWNrZWRPYmplY3QsIHRvZG8pO1xuICAgICAgICAgICAgdG9kb0xpc3RUb1Nob3cucHVzaChzb3J0ZWRUb2RvKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG9kb0xpc3RUb1Nob3c7XG59XG5cbmNvbnN0IGlzVG9kb0V4cGlyZWQgPSBmdW5jdGlvbih0b2RvKSB7XG4gICAgY29uc3QgdG9kb0Z1bGxEYXRlID0gdG9kby5kdWVEYXRlLnNwbGl0KCctJyk7XG4gICAgY29uc3QgdG9kb1llYXIgPSB0b2RvRnVsbERhdGVbMF07XG4gICAgY29uc3QgdG9kb01vbnRoID0gdG9kb0Z1bGxEYXRlWzFdO1xuICAgIGNvbnN0IHRvZG9EYXRlID0gdG9kb0Z1bGxEYXRlWzJdO1xuICAgIGNvbnN0IHRvZG9EYXRlT2JqID0gbmV3IERhdGUodG9kb1llYXIsICt0b2RvTW9udGggLSAxLCArdG9kb0RhdGUgKzEgKTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZU9iaiA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKCB0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlT2JqIDwgMCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuY29uc3QgYWRkRXhwaXJhdGlvblN0YXR1cyA9IGZ1bmN0aW9uKHRvZG9zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgIGlmICh0b2RvKSB7XG4gICAgICAgICAgICB0b2RvLmV4cGlyZWQgPSBpc1RvZG9FeHBpcmVkKHRvZG8pO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge3RvZG9GYWN0b3J5LCBpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1c30iLCJpbXBvcnQge2NyZWF0ZVRvZG9CbG9ja0luRE9NfSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHt0b2RvRmFjdG9yeSwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwfSBmcm9tICcuL2FwcExvZ2ljJztcbmltcG9ydCB7Y2xlYXJUb2RvQ29udGFpbmVyfSBmcm9tICcuL2RvbU1hbmlwdWxhdGlvbnMnO1xuXG5jb25zdCBhZGRUb1RoZVRvZG9MaXN0ID0gZnVuY3Rpb24oZm9ybSwgdG9kb3MpIHtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZm9ybSk7XG4gICAgdG9kb3MucHVzaChuZXdUb2RvKTtcbn1cblxuY29uc3QgY29tcGFyZUZ1bmN0aW9uID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkgeyAvLyBzb3J0IGJ5IHByaW9yaXR5IG9mIHRvZG8gYW5kIGV4cGlyZWQgdG9kb3Mgd2lsbCBiZSBpbiB0aGUgYm90dG9tLiBBbHNvIG1vc3QgdXJnZSB0b2RvcyB3aWxsIGJlIGluIGZpcnN0IHBsYWNlXG4gICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVEYXRlcyA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF0ZSA9IGZpcnN0LmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGUgPSBzZWNvbmQuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlT2JqID0gbmV3IERhdGUoIGZpcnN0RGF0ZVswXSwgZmlyc3REYXRlWzFdLCBmaXJzdERhdGVbMl0gKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGVPYmogPSBuZXcgRGF0ZSggc2Vjb25kRGF0ZVswXSwgc2Vjb25kRGF0ZVsxXSwgc2Vjb25kRGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBmaXJzdERhdGVPYmogLSBzZWNvbmREYXRlT2JqO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcGFyZVByaW9yaXR5ID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghZmlyc3QuZXhwaXJlZCkge1xuICAgICAgICAgICAgaWYgKHNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNob3dBbGxUb2RvcyA9IGZ1bmN0aW9uKHRvZG9zKSB7XG4gICAgY2xlYXJUb2RvQ29udGFpbmVyKCk7IC8vIGNsZWFycyB0b2RvIGNvbnRhaW5lciBvZiBhbGwgdGFza3MgYW5kIHRoZW4gd2Ugd2lsbCBjcmVhdGUgaXQgYWdhaW4gd2l0aCBjaG9zZW4gcGFyYW1ldGVyc1xuICAgIFxuICAgIGlmICh0b2RvcyAmJiB0b2Rvcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFkZEV4cGlyYXRpb25TdGF0dXModG9kb3MpO1xuICAgICAgICB0b2Rvcy5zb3J0KGNvbXBhcmVGdW5jdGlvbik7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgICAgICBpZiAodG9kbykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRvZG9CbG9ja0luRE9NKHRvZG8sIGlzVG9kb0V4cGlyZWQodG9kbykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQge2FkZFRvVGhlVG9kb0xpc3QsIHNob3dBbGxUb2Rvc307IiwiXG5jb25zdCBjaGFuZ2VUb2RvU3RhdHVzID0gZnVuY3Rpb24odG9kb0RhdGEpIHtcbiAgICBpZiAodGhpcy5jaGVja2VkKSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0b2RvRGF0YS5jaGVjayA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUtdG9kbycpO1xuICAgIH1cbn1cblxuY29uc3Qgc2hvd05ld1Rhc2tXaW5kb3cgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvd0Zvcm0gPSBuZXdUYXNrV2luZG93LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xufVxuXG5jb25zdCBoaWRlTmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4tZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmNvbnN0IGNyZWF0ZVRvZG9CbG9ja0luRE9NID0gZnVuY3Rpb24odG9kb0RhdGEsIHRvZG9FeHBpcmVkU3RhdHVzKSB7XG4gICAgY29uc3QgdGFza3NDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudF9fdGFza3MnKTtcblxuICAgIGNvbnN0IHRvZG9CbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKCdzaW5nbGUtdG9kbycpO1xuICAgIHRvZG9CbG9jay5jbGFzc0xpc3QuYWRkKHRvZG9EYXRhLnByaW9yaXR5KTtcbiAgICBpZiAodG9kb0V4cGlyZWRTdGF0dXMpIHtcbiAgICAgICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ2V4cGlyZWQnKTtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0b2RvRGF0YS50aXRsZTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0b2RvX190aXRsZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICBjb25zdCBkdWVEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZHVlRGF0ZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLmR1ZURhdGU7XG4gICAgZHVlRGF0ZS5jbGFzc0xpc3QuYWRkKCd0b2RvX19kdWUtZGF0ZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZChkdWVEYXRlKTtcblxuXG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgndG9kb19fYnV0dG9ucycpO1xuXG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRldGFpbHMudGV4dENvbnRlbnQgPSAnZGV0YWlscyc7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChkZXRhaWxzKTtcblxuICAgIGNvbnN0IGVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBlZGl0SW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBlZGl0SW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2VkaXQuc3ZnJztcbiAgICBlZGl0LmFwcGVuZENoaWxkKGVkaXRJbWFnZSk7XG4gICAgYnV0dG9ucy5hcHBlbmRDaGlsZChlZGl0KTtcblxuICAgIGNvbnN0IGRlbGV0ZVRvZG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBjb25zdCBkZWxldGVUb2RvSW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBkZWxldGVUb2RvSW1hZ2Uuc3JjID0gJy4vaW1hZ2VzL2ljb25zL2RlbGV0ZS5zdmcnO1xuICAgIGRlbGV0ZVRvZG8uYXBwZW5kQ2hpbGQoZGVsZXRlVG9kb0ltYWdlKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGRlbGV0ZVRvZG8pO1xuXG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGJ1dHRvbnMpO1xuXG5cbiAgICBjb25zdCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdG9kb0Jsb2NrLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcbiAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBjaGVja2JveC5jbGFzc0xpc3QuYWRkKCd0b2RvX19jaGVja2JveCcpO1xuICAgIGlmICh0b2RvRGF0YS5jaGVjayA9PSB0cnVlKSB7XG4gICAgICAgIGNoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICBjaGVja2JveC5jbG9zZXN0KCcuc2luZ2xlLXRvZG8nKS5jbGFzc0xpc3QuYWRkKCdoaWRlLXRvZG8nKTtcbiAgICB9XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgY2hhbmdlVG9kb1N0YXR1cy5iaW5kKGNoZWNrYm94LCB0b2RvRGF0YSkpO1xuXG4gICAgdGFza3NDb250YWluZXIuYXBwZW5kQ2hpbGQodG9kb0Jsb2NrKTsgLy8gYWRkaW5nIG5ldyB0b2RvQmxvY2sgaW50byB0YXNrcyBjb250YWluZXJcbn1cblxuY29uc3QgY2xlYXJUb2RvQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VycmVudFRvZG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpbmdsZS10b2RvJyk7XG4gICAgY3VycmVudFRvZG9zLmZvckVhY2godG9kbyA9PiB7XG4gICAgICAgIHRvZG8ucmVtb3ZlKCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IGNyZWF0ZUVycm9yUGFyYWdyYXBoID0gZnVuY3Rpb24oaW5wdXRGaWVsZCkge1xuICAgIGNvbnN0IGVycm9yUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAnZHVlRGF0ZScpIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoX19zaGlmdGVkJyk7XG4gICAgfVxuICAgIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ3ByaW9yaXR5Jykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgcHJpb3JpdHkgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgZHVlIGRhdGUgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ1RoaXMgZmllbGQgbXVzdCBiZSBmaWxsZWQnO1xuICAgIH1cbiAgICBpbnB1dEZpZWxkLmJlZm9yZShlcnJvclBhcmFncmFwaCk7XG59XG5cbmNvbnN0IGRlbGV0ZUVycm9yUGFyYWdyYXBoID0gZnVuY3Rpb24oaW5wdXRGaWVsZCkge1xuICAgIGlucHV0RmllbGQucHJldmlvdXNFbGVtZW50U2libGluZy5yZW1vdmUoKTtcbn1cblxuY29uc3QgcmVzZXRFcnJvcnMgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgZXJyb3JzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JzW2ldLnJlbW92ZSgpO1xuICAgIH1cbiAgICBjb25zdCBlcnJvckJvcmRlcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnZhbGlkJyk7IC8vZ2V0IGlucHV0cyB3aXRoIFwiaW52YWxpZFwiIGNsYXNzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckJvcmRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JCb3JkZXJzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCBjcmVhdGVUb2RvQmxvY2tJbkRPTSwgY2xlYXJUb2RvQ29udGFpbmVyLCBjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGgsIHJlc2V0RXJyb3JzfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCByZXNldEVycm9yc30gZnJvbSAnLi9tb2R1bGVzL2RvbU1hbmlwdWxhdGlvbnMnO1xuaW1wb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3N9IGZyb20gJy4vbW9kdWxlcy9jb250cm9sbGVyJztcbmltcG9ydCB7aXNGb3JtVmFsaWQsIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCwgc29ydFRhc2tzQWNjb3JkaW5nVG9DaG9zZW5UYXNrR3JvdXB9IGZyb20gJy4vbW9kdWxlcy9hcHBMb2dpYyc7XG5cbihmdW5jdGlvbigpIHtcbiAgICBsZXQgdG9kb3MgPSBbXTtcbiAgICBcbiAgICAvLyBjcmVhdGluZyBleGFtcGxlIHRvZG9zID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IGZpcnN0VG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDYWxsIHRvIElyaW5hJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGhhdmUgdG8gY2FsbCB0byBJcmluYSBhbmQga25vdyBzaGUgaXMuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDYtMTcnLFxuICAgICAgICBwcmlvcml0eTogJ2hpZ2gnLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlY29uZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQnV5IGEgcGl6emEnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgbmVlZCB0byBidXkgdHdvIHBpenphcyBmb3IgbWUgYW5kIElyaW5hLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA4LTE5JyxcbiAgICAgICAgcHJpb3JpdHk6ICdtZWRpdW0nLFxuICAgICAgICBjaGVjazogZmFsc2UsXG4gICAgfTtcblxuICAgIGNvbnN0IHRoaXJkVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdIbW1tJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdIbW1tbW1tbW0uJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTgnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICBjb25zdCBmb3VydGhUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0NoZWNrIFRvZG8nLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgYW0ganVzdCBjaGVja2luZy4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wNy0xNScsXG4gICAgICAgIHByaW9yaXR5OiAnbG93JyxcbiAgICAgICAgY2hlY2s6IHRydWUsXG4gICAgfTtcblxuICAgIHRvZG9zLnB1c2goZmlyc3RUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHNlY29uZFRvZG8pO1xuICAgIHRvZG9zLnB1c2godGhpcmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKGZvdXJ0aFRvZG8pO1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICBzaG93QWxsVG9kb3ModG9kb3MpO1xuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGhlIGZvcm0gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IGFkZE5ld1Rhc2tGdW5jdGlvbnMgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnN0IGFkZFRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWRkLXRhc2snKTsgLy8gYnV0dG9uIHRoYXQgb3BlbnMgbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBuZXdUYXNrV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ldy10YXNrJyk7IC8vIGZvcm0ncyBvdXRlciBkaXYgYmxvY2tcbiAgICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtJyk7IC8vIG5ldyB0YXNrIGZvcm1cbiAgICAgICAgY29uc3QgY2xvc2VUYXNrV2luZG93QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX2Nsb3NpbmctYnV0dG9uJyk7IC8vIGNsb3NlIGZvcm0gYnV0dG9uXG4gICAgICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JtX19zdWJtaXQgYnV0dG9uJyk7IC8vIGZvcm0ncyBzdWJtaXQgYnV0dG9uXG4gICAgICAgIGNvbnN0IGNsaWNrZWRPYmplY3QgPSBlLnRhcmdldDtcblxuICAgICAgICBpZiAoIW5ld1Rhc2tXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkgeyAvL2lmIHRoZSBuZXcgdGFzayBmb3JtIGlzIG9wZW5cbiAgICAgICAgICAgIGlmIChjbGlja2VkT2JqZWN0ID09IGNsb3NlVGFza1dpbmRvd0J1dHRvbiB8fCAhY2xpY2tlZE9iamVjdC5jbG9zZXN0KCcuZm9ybScpKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgdGhlIFwiY2xvc2UgZm9ybVwiIGJ1dHRvbiBvciBpcyBub3QgZm9ybSB3aW5kb3dcbiAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICByZXNldEVycm9ycyhmb3JtKTsgLy9yZXNldCBlcnJvciBwYXJhZ3JhcGhzIGlmIHRoZXkgYXJlIGV4aXN0XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWNrZWRPYmplY3QgPT0gc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZm9ybSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvVGhlVG9kb0xpc3QoZm9ybSwgdG9kb3MpOyAvLyBjcmVhdGVzIGFuZCBpbnNlcnQgbmV3IHRvZG8gaW4gRE9NXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsLXRhc2tzJyk7IC8vIHRoZXNlIHRocmVlIGxpbmVzICg2OC03MCkgbmVlZCB0byBoaWdobGlnaHQgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tzR3JvdXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGFza3MgdWwnKTsgLy8gXCJhbGwgdGFza3NcIiBidXR0b24gYWZ0ZXJcbiAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwKHRhc2tzR3JvdXAsIGFsbFRhc2tzKTsgLy8gY3JlYXRpbmcgYSBuZXcgdGFza1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zKTtcbiAgICAgICAgICAgICAgICAgICAgaGlkZU5ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgICAgICAgICAgZm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBjbG9zZWRcbiAgICAgICAgICAgIGlmIChjbGlja2VkT2JqZWN0ID09IGFkZFRhc2tXaW5kb3dCdXR0b24pIHsgLy9jaGVjayBpZiBjbGlja2VkIE9iamVjdCBpcyBcImFkZCB0YXNrXCIgYnV0dG9uXG4gICAgICAgICAgICAgICAgc2hvd05ld1Rhc2tXaW5kb3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGROZXdUYXNrRnVuY3Rpb25zKTtcblxuXG4gICAgLy8gQWRkIEV2ZW50IExpc3RlbmVycyBmb3IgdGFzayBncm91cHNcbiAgICBjb25zdCB0YXNrR3JvdXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vZ2V0IHNpZGViYXIgdGFzayBncm91cHNcbiAgICBcbiAgICBjb25zdCB0YXNrR3JvdXBzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBjb25zdCBjbGlja2VkT2JqZWN0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwKHRhc2tHcm91cHMsIGNsaWNrZWRPYmplY3QpO1xuXG4gICAgICAgIGNvbnN0IHRvZG9zRm9yU2hvdyA9IHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwKGNsaWNrZWRPYmplY3QsIHRvZG9zKTtcblxuICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93KTtcbiAgICB9XG5cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG59KSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==