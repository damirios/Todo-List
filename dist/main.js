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
    const newTodo = todoFactory(editForm, todo.check);
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

    (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todos, todos);

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
            !clickedObject.closest('.edit-task__form') ) || clickedObject == editFormCloseButton) { // if edit form is open. Then close button clicked
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
            (0,_modules_controller__WEBPACK_IMPORTED_MODULE_1__.showAllTodos)(todosForShow, todos, clickedObject);
        }
    }

    taskGroups.addEventListener('click', taskGroupsFunctions);

})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Oi8vdG9kby1saXN0Ly4vc3JjL21vZHVsZXMvY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2NyZWF0ZUVycm9yUGFyYWdyYXBoLCBkZWxldGVFcnJvclBhcmFncmFwaH0gZnJvbSAnLi9kb21NYW5pcHVsYXRpb25zJztcblxuY29uc3QgdG9kb0ZhY3RvcnkgPSBmdW5jdGlvbihmb3JtLCBjaGVja1N0YXR1cykge1xuICAgIGxldCB0b2RvT2JqZWN0ID0ge307IC8vIG9iamVjdCB0aGF0IGNvbGxlY3RzIGluZm8gZnJvbSBuZXcgdGFzayBmb3JtIVxuICAgIGNvbnN0IGZvcm1FbGVtZW50cyA9IGZvcm0uZWxlbWVudHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb3JtRWxlbWVudHMubGVuZ3RoIC0gMTsgaSsrKSB7IC8vIGFsbCBmaWVsZHMgZXhjZXB0IHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1FbGVtZW50c1tpXTtcbiAgICAgICAgaWYgKGVsZW1lbnQubmFtZSA9PSAndGl0bGUnIHx8IGVsZW1lbnQubmFtZSA9PSAnZGVzY3JpcHRpb24nKSB7XG4gICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LnZhbHVlO1xuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQubmFtZSA9PSAncHJpb3JpdHknICYmIGVsZW1lbnQuY2hlY2tlZCkge1xuXG4gICAgICAgICAgICBpZiAoZWxlbWVudC5pZCA9PSAnZWRpdC1sb3cnKSB7IC8vdGhlc2UgY2hlY2tzIGZvciBlZGl0LS4uLiBuZWVkcyB0byBzaG93IHByaW9yaXR5IC0gZWRpdEZvcm0gcHJpb3JpdHkgYnV0dG9ucyBpZCdzIGRpZmZlciBuZXdUYXNrRm9ybSdzIChvYnZpb3VzbHkpXG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ2xvdyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQuaWQgPT0gJ2VkaXQtbWVkaXVtJykge1xuICAgICAgICAgICAgICAgIHRvZG9PYmplY3RbZWxlbWVudC5uYW1lXSA9ICdtZWRpdW0nO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LmlkID09ICdlZGl0LWhpZ2gnKSB7XG4gICAgICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gJ2hpZ2gnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b2RvT2JqZWN0W2VsZW1lbnQubmFtZV0gPSBlbGVtZW50LmlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICAgICAgdG9kb09iamVjdFtlbGVtZW50Lm5hbWVdID0gZWxlbWVudC52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0b2RvT2JqZWN0LmNoZWNrID0gY2hlY2tTdGF0dXM7XG4gICAgcmV0dXJuIHRvZG9PYmplY3Q7XG59XG5cbmNvbnN0IGlzRm9ybVZhbGlkID0gZnVuY3Rpb24oZm9ybSkge1xuICAgIGNvbnN0IHRpdGxlSW5wdXQgPSBmb3JtLnRpdGxlO1xuICAgIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGZvcm0uZHVlRGF0ZTtcbiAgICBjb25zdCBwcmlvcml0eUlucHV0cyA9IGZvcm0ucHJpb3JpdHk7IFxuICAgIC8vIGNvbnN0IHRpdGxlSW5wdXQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0I3RpdGxlJyk7XG4gICAgLy8gY29uc3QgZHVlRGF0ZUlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKCdpbnB1dCNkdWVEYXRlJyk7XG4gICAgLy8gY29uc3QgcHJpb3JpdHlJbnB1dHMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W25hbWU9cHJpb3JpdHldJyk7XG4gICAgY29uc3QgcHJpb3JpdHlCdXR0b25zID0gZm9ybS5xdWVyeVNlbGVjdG9yKCcucHJpb3JpdHlfX2J1dHRvbnMsIC5lZGl0LWZvcm0tcHJpb3JpdHlfX2J1dHRvbnMnKTtcblxuICAgIGxldCB2YWxpZFByaW9yaXR5O1xuICAgIGxldCBwcmlvcml0eUNoZWNrID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmlvcml0eUlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50UHJpb3JpdHlJbnB1dCA9IHByaW9yaXR5SW5wdXRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFByaW9yaXR5SW5wdXQuY2hlY2tlZCkge1xuICAgICAgICAgICAgcHJpb3JpdHlDaGVjayA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcHJpb3JpdHlDaGVjayAmJiAhcHJpb3JpdHlJbnB1dHNbMF0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xuICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChwcmlvcml0eUlucHV0c1swXSk7XG4gICAgICAgIHZhbGlkUHJpb3JpdHkgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHByaW9yaXR5Q2hlY2spIHtcbiAgICAgICAgdmFsaWRQcmlvcml0eSA9IHRydWU7XG4gICAgICAgIGlmIChwcmlvcml0eUlucHV0c1swXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIHByaW9yaXR5SW5wdXRzWzBdLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmNvbnRhaW5zKCdlcnJvci1wYXJhZ3JhcGgnKSkge1xuICAgICAgICAgICAgZGVsZXRlRXJyb3JQYXJhZ3JhcGgocHJpb3JpdHlJbnB1dHNbMF0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHZhbGlkRHVlRGF0ZTtcbiAgICBpZiAoZHVlRGF0ZUlucHV0LnZhbHVlLnRyaW0oKSA9PSAnJykge1xuICAgICAgICB2YWxpZER1ZURhdGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKCFkdWVEYXRlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgICAgICBjcmVhdGVFcnJvclBhcmFncmFwaChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGR1ZURhdGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWREdWVEYXRlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGR1ZURhdGVJbnB1dC5jbGFzc0xpc3QuY29udGFpbnMoJ2ludmFsaWQnKSkge1xuICAgICAgICAgICAgZHVlRGF0ZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdmFsaWRUaXRsZTtcbiAgICBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgPT0gJycgJiYgIXRpdGxlSW5wdXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnZhbGlkJykpIHtcbiAgICAgICAgdGl0bGVJbnB1dC5jbGFzc0xpc3QuYWRkKCdpbnZhbGlkJyk7XG4gICAgICAgIGNyZWF0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB0aXRsZUlucHV0LmZvY3VzKCk7XG4gICAgICAgIHZhbGlkVGl0bGUgPSBmYWxzZTtcblxuICAgIH0gZWxzZSBpZiAodGl0bGVJbnB1dC52YWx1ZS50cmltKCkgIT0gJycpIHtcbiAgICAgICAgdmFsaWRUaXRsZSA9IHRydWU7XG4gICAgICAgIGlmICh0aXRsZUlucHV0LmNsYXNzTGlzdC5jb250YWlucygnaW52YWxpZCcpKSB7XG4gICAgICAgICAgICB0aXRsZUlucHV0LmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICAgICAgICAgIGRlbGV0ZUVycm9yUGFyYWdyYXBoKHRpdGxlSW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgdmFsaWQgPSB2YWxpZFByaW9yaXR5ICYmIHZhbGlkRHVlRGF0ZSAmJiB2YWxpZFRpdGxlO1xuICAgIHJldHVybiB2YWxpZDtcbn1cblxuY29uc3QgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwID0gZnVuY3Rpb24odGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCkge1xuICAgIGNvbnN0IHRhc2tHcm91cHNFbGVtZW50cyA9IHRhc2tHcm91cHMucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tHcm91cHNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza0dyb3VwID0gdGFza0dyb3Vwc0VsZW1lbnRzW2ldO1xuICAgICAgICBpZiAoY3VycmVudFRhc2tHcm91cCA9PSBjbGlja2VkT2JqZWN0ICYmICFjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QuYWRkKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRUYXNrR3JvdXAgIT0gY2xpY2tlZE9iamVjdCAmJiBjdXJyZW50VGFza0dyb3VwLmNsYXNzTGlzdC5jb250YWlucygnY2hvc2VuLXRhc2stZ3JvdXAnKSkge1xuICAgICAgICAgICAgY3VycmVudFRhc2tHcm91cC5jbGFzc0xpc3QucmVtb3ZlKCdjaG9zZW4tdGFzay1ncm91cCcpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jb25zdCBzb3J0Q3VycmVudFRvZG8gPSBmdW5jdGlvbihjbGlja2VkT2JqZWN0LCB0b2RvKSB7XG4gICAgY29uc3QgY3VycmVudERhdGVBbmRUaW1lID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBjdXJyZW50WWVhciA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRGdWxsWWVhcigpO1xuICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICBjb25zdCBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXREYXRlKCk7XG4gICAgY29uc3QgY3VycmVudEhvdXJzID0gY3VycmVudERhdGVBbmRUaW1lLmdldEhvdXJzKCk7XG4gICAgY29uc3QgY3VycmVudE1pbnV0ZXMgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0TWludXRlcygpO1xuICAgIGNvbnN0IGN1cnJlbnRTZWNvbmRzID0gY3VycmVudERhdGVBbmRUaW1lLmdldFNlY29uZHMoKTtcblxuICAgIGNvbnN0IHRvZG9GdWxsRGF0ZSA9IHRvZG8uZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgIGNvbnN0IHRvZG9ZZWFyID0gdG9kb0Z1bGxEYXRlWzBdO1xuICAgIGNvbnN0IHRvZG9Nb250aCA9IHRvZG9GdWxsRGF0ZVsxXTtcbiAgICBjb25zdCB0b2RvRGF0ZSA9IHRvZG9GdWxsRGF0ZVsyXTtcbiAgICBjb25zdCB0b2RvRGF0ZU9iaiA9IG5ldyBEYXRlKHRvZG9ZZWFyLCB0b2RvTW9udGggLSAxLCB0b2RvRGF0ZSk7IC8vRGF0ZSBPYmogZm9yIHRvZG9cblxuICAgIGlmIChjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygndG9kYXknKSkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJ0b2RheVwiXG4gICAgICAgIGlmICggaXNUb2RheSh0b2RvWWVhciwgdG9kb01vbnRoLCB0b2RvRGF0ZSwgY3VycmVudFllYXIsIGN1cnJlbnRNb250aCwgY3VycmVudERhdGUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCd3ZWVrJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcInRoaXMgd2Vla1wiXG4gICAgICAgIGlmICggaXNXZWVrKHRvZG9EYXRlT2JqLCBjdXJyZW50RGF0ZUFuZFRpbWUpICkge1xuICAgICAgICAgICAgcmV0dXJuIHRvZG87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRPYmplY3QuY2xhc3NMaXN0LmNvbnRhaW5zKCdtb250aCcpICkgeyAvLyBjaGVja3MgaWYgY2xpY2tlZCBvYmplY3QgaXMgXCJtb250aFwiXG4gICAgICAgIGlmICggaXNNb250aCh0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSApIHtcbiAgICAgICAgICAgIHJldHVybiB0b2RvO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCBjbGlja2VkT2JqZWN0LmNsYXNzTGlzdC5jb250YWlucygnYWxsLXRhc2tzJykgKSB7IC8vIGNoZWNrcyBpZiBjbGlja2VkIG9iamVjdCBpcyBcImFsbCB0YXNrc1wiXG4gICAgICAgIHJldHVybiB0b2RvO1xuICAgIH1cbn1cblxuY29uc3QgaXNUb2RheSA9IGZ1bmN0aW9uKHRvZG9ZZWFyLCB0b2RvTW9udGgsIHRvZG9EYXRlLCBjdXJyZW50WWVhciwgY3VycmVudE1vbnRoLCBjdXJyZW50RGF0ZSkgeyAvL2Z1bmN0aW9uIGNoZWNrcyBpZiB0b2RvJ3MgZGF0ZSBleHBpcmVkIHRvZGF5XG4gICAgaWYgKCB0b2RvWWVhciA9PSBjdXJyZW50WWVhciAmJiB0b2RvTW9udGggPT0gY3VycmVudE1vbnRoICYmIHRvZG9EYXRlID09IGN1cnJlbnREYXRlICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBpc1dlZWsgPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSB3ZWVrXG4gICAgY29uc3QgZGlmZmVyZW5jZUluRGF5cyA9ICh0b2RvRGF0ZU9iaiAtIGN1cnJlbnREYXRlQW5kVGltZSkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCk7XG4gICAgaWYgKGRpZmZlcmVuY2VJbkRheXMgPD0gNyAmJiBkaWZmZXJlbmNlSW5EYXlzID49IC0xKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbmNvbnN0IGlzTW9udGggPSBmdW5jdGlvbih0b2RvRGF0ZU9iaiwgY3VycmVudERhdGVBbmRUaW1lKSB7IC8vZnVuY3Rpb24gY2hlY2tzIGlmIHRvZG8ncyBkYXRlIGFuZCBjdXJyZW50IGRhdGUgZGlmZmVycyBieSBubyBtb3JlIHRoYW4gMSBtb250aFxuICAgIGNvbnN0IGRpZmZlcmVuY2VJbkRheXMgPSAodG9kb0RhdGVPYmogLSBjdXJyZW50RGF0ZUFuZFRpbWUpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpICsgMTtcbiAgICBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzIgJiYgZGlmZmVyZW5jZUluRGF5cyA+PSAwKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGN1cnJlbnREYXRlQW5kVGltZS5nZXRNb250aCgpICsgMTtcbiAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBjdXJyZW50RGF0ZUFuZFRpbWUuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgaWYgKCBjdXJyZW50TW9udGggPT0gMSB8fCBjdXJyZW50TW9udGggPT0gMyB8fCBjdXJyZW50TW9udGggPT0gNSB8fCBjdXJyZW50TW9udGggPT0gNyB8fCBjdXJyZW50TW9udGggPT0gOCB8fCBjdXJyZW50TW9udGggPT0gMTAgfHwgY3VycmVudE1vbnRoID09IDEyICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoIGRpZmZlcmVuY2VJbkRheXMgPD0gMzEgJiYgKGN1cnJlbnRNb250aCA9PSA0IHx8IGN1cnJlbnRNb250aCA9PSA2IHx8IGN1cnJlbnRNb250aCA9PSA5IHx8IGN1cnJlbnRNb250aCA9PSAxMSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICggIGN1cnJlbnRNb250aCA9PSAyICYmIChkaWZmZXJlbmNlSW5EYXlzIDw9ICgyOSArIGlzTGVhcFllYXIoY3VycmVudFllYXIpKSkgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmNvbnN0IGlzTGVhcFllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgaWYgKHllYXIgJSA0ID09IDApIHtcbiAgICAgICAgaWYgKHllYXIgJSAxMDAgPT0gMCkge1xuICAgICAgICAgICAgaWYgKHllYXIgJSA0MDAgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxufVxuXG5jb25zdCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QsIHRvZG9zKSB7XG4gICAgXG4gICAgbGV0IHRvZG9MaXN0VG9TaG93ID0gW107IC8vY3VycmVudCB0b2RvTGlzdCB0aGF0IHdlIGdvaW5nIHRvIHNob3csIHdlJ2xsIGZpbGwgaXRcbiAgICBpZiAodG9kb3MubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0b2RvID0gdG9kb3NbaV07XG4gICAgICAgICAgICBjb25zdCBzb3J0ZWRUb2RvID0gc29ydEN1cnJlbnRUb2RvKGNsaWNrZWRPYmplY3QsIHRvZG8pOyAvL2VpdGhlciByZXR1cm4gdG9kbyBvciBudWxsXG4gICAgICAgICAgICB0b2RvTGlzdFRvU2hvdy5wdXNoKHNvcnRlZFRvZG8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0b2RvTGlzdFRvU2hvdztcbn1cblxuY29uc3QgaXNUb2RvRXhwaXJlZCA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCB0b2RvRnVsbERhdGUgPSB0b2RvLmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICBjb25zdCB0b2RvWWVhciA9IHRvZG9GdWxsRGF0ZVswXTtcbiAgICBjb25zdCB0b2RvTW9udGggPSB0b2RvRnVsbERhdGVbMV07XG4gICAgY29uc3QgdG9kb0RhdGUgPSB0b2RvRnVsbERhdGVbMl07XG4gICAgY29uc3QgdG9kb0RhdGVPYmogPSBuZXcgRGF0ZSh0b2RvWWVhciwgK3RvZG9Nb250aCAtIDEsICt0b2RvRGF0ZSArMSApO1xuICAgIGNvbnN0IGN1cnJlbnREYXRlT2JqID0gbmV3IERhdGUoKTtcbiAgICBpZiAoIHRvZG9EYXRlT2JqIC0gY3VycmVudERhdGVPYmogPCAwICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5jb25zdCBhZGRFeHBpcmF0aW9uU3RhdHVzID0gZnVuY3Rpb24odG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc1tpXTtcbiAgICAgICAgaWYgKHRvZG8pIHtcbiAgICAgICAgICAgIHRvZG8uZXhwaXJlZCA9IGlzVG9kb0V4cGlyZWQodG9kbyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGRlbGV0ZVRvZG8gPSBmdW5jdGlvbihjdXJyZW50VG9kbywgdG9kb3MpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvZG9zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICggdG9kb3NbaV0gPT0gY3VycmVudFRvZG8gKSB7XG4gICAgICAgICAgICB0b2Rvcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IGdldENoYW5nZWRUb2RvcyA9IGZ1bmN0aW9uKHRvZG8sIHRvZG9zLCBlZGl0Rm9ybSkge1xuICAgIGNvbnN0IG5ld1RvZG8gPSB0b2RvRmFjdG9yeShlZGl0Rm9ybSwgdG9kby5jaGVjayk7XG4gICAgY29uc3QgdG9kb0luZGV4VG9SZXBsYWNlID0gdG9kb3MuaW5kZXhPZih0b2RvKTtcblxuICAgIGlmICh0b2RvSW5kZXhUb1JlcGxhY2UgIT0gLTEpIHtcbiAgICAgICAgdG9kb3NbdG9kb0luZGV4VG9SZXBsYWNlXSA9IG5ld1RvZG87XG4gICAgfVxuICAgIHJldHVybiB0b2Rvcztcbn1cblxuXG5leHBvcnQge3RvZG9GYWN0b3J5LCBpc0Zvcm1WYWxpZCwgaGlnaGxpZ2h0Q2hvc2VuVGFza0dyb3VwLCBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cCwgaXNUb2RvRXhwaXJlZCwgYWRkRXhwaXJhdGlvblN0YXR1cywgZGVsZXRlVG9kbywgZ2V0Q2hhbmdlZFRvZG9zfSIsImltcG9ydCB7Y3JlYXRlVG9kb0Jsb2NrSW5ET00sIGNsZWFyVG9kb0NvbnRhaW5lciwgc2hvd1RvZG9Hcm91cFRpdGxlLCBvcGVuRWRpdEZvcm0sIGZpbGxFZGl0Rm9ybSwgY2xvc2VFZGl0Rm9ybX0gZnJvbSAnLi9kb21NYW5pcHVsYXRpb25zJztcbmltcG9ydCB7dG9kb0ZhY3RvcnksIGlzVG9kb0V4cGlyZWQsIGFkZEV4cGlyYXRpb25TdGF0dXMsIGRlbGV0ZVRvZG8sIGlzRm9ybVZhbGlkLCBnZXRDaGFuZ2VkVG9kb3N9IGZyb20gJy4vYXBwTG9naWMnO1xuXG5jb25zdCBhZGRUb1RoZVRvZG9MaXN0ID0gZnVuY3Rpb24oZm9ybSwgdG9kb3MpIHtcbiAgICBjb25zdCBuZXdUb2RvID0gdG9kb0ZhY3RvcnkoZm9ybSk7XG4gICAgdG9kb3MucHVzaChuZXdUb2RvKTtcbn1cblxuY29uc3QgY29tcGFyZUZ1bmN0aW9uID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkgeyAvLyBzb3J0IGJ5IHByaW9yaXR5IG9mIHRvZG8gYW5kIGV4cGlyZWQgdG9kb3Mgd2lsbCBiZSBpbiB0aGUgYm90dG9tLiBBbHNvIG1vc3QgdXJnZSB0b2RvcyB3aWxsIGJlIGluIGZpcnN0IHBsYWNlXG4gICAgaWYgKGZpcnN0ICYmIHNlY29uZCkge1xuXG4gICAgICAgIGNvbnN0IGNvbXBhcmVEYXRlcyA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpcnN0RGF0ZSA9IGZpcnN0LmR1ZURhdGUuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGUgPSBzZWNvbmQuZHVlRGF0ZS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3REYXRlT2JqID0gbmV3IERhdGUoIGZpcnN0RGF0ZVswXSwgZmlyc3REYXRlWzFdLCBmaXJzdERhdGVbMl0gKTtcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZERhdGVPYmogPSBuZXcgRGF0ZSggc2Vjb25kRGF0ZVswXSwgc2Vjb25kRGF0ZVsxXSwgc2Vjb25kRGF0ZVsyXSApO1xuICAgICAgICAgICAgY29uc3QgZGF0ZURpZmZlcmVuY2UgPSBmaXJzdERhdGVPYmogLSBzZWNvbmREYXRlT2JqO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGVEaWZmZXJlbmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcGFyZVByaW9yaXR5ID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICAgICAgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2hpZ2gnICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgfSBlbHNlIGlmICggZmlyc3QucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ21lZGl1bScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnaGlnaCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWNvbmQucHJpb3JpdHkgPT0gJ2xvdycgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBmaXJzdC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHNlY29uZC5wcmlvcml0eSA9PSAnbG93JyApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICsxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXJzdC5leHBpcmVkKSB7XG4gICAgICAgICAgICBpZiAoc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFzZWNvbmQuZXhwaXJlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiArMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghZmlyc3QuZXhwaXJlZCkge1xuICAgICAgICAgICAgaWYgKHNlY29uZC5leHBpcmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghc2Vjb25kLmV4cGlyZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eURpZmZlcmVuY2UgPSBjb21wYXJlUHJpb3JpdHkoZmlyc3QsIHNlY29uZCk7XG4gICAgICAgICAgICAgICAgaWYgKHByaW9yaXR5RGlmZmVyZW5jZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGVEaWZmZXJlbmNlID0gY29tcGFyZURhdGVzKGZpcnN0LCBzZWNvbmQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZURpZmZlcmVuY2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByaW9yaXR5RGlmZmVyZW5jZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHNob3dBbGxUb2RvcyA9IGZ1bmN0aW9uKHRvZG9zRm9yU2hvdywgYWxsVG9kb3MsIGNsaWNrZWRPYmplY3QpIHtcbiAgICBjbGVhclRvZG9Db250YWluZXIoKTsgLy8gY2xlYXJzIHRvZG8gY29udGFpbmVyIG9mIGFsbCB0YXNrcyBhbmQgdGhlbiB3ZSB3aWxsIGNyZWF0ZSBpdCBhZ2FpbiB3aXRoIGNob3NlbiBwYXJhbWV0ZXJzXG4gICAgaWYgKGNsaWNrZWRPYmplY3QpIHtcbiAgICAgICAgc2hvd1RvZG9Hcm91cFRpdGxlKGNsaWNrZWRPYmplY3QpO1xuICAgIH1cblxuICAgIGlmICh0b2Rvc0ZvclNob3cgJiYgdG9kb3NGb3JTaG93Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgYWRkRXhwaXJhdGlvblN0YXR1cyh0b2Rvc0ZvclNob3cpO1xuICAgICAgICB0b2Rvc0ZvclNob3cuc29ydChjb21wYXJlRnVuY3Rpb24pO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2Rvc0ZvclNob3cubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG8gPSB0b2Rvc0ZvclNob3dbaV07XG4gICAgICAgICAgICBpZiAodG9kbykge1xuICAgICAgICAgICAgICAgIGNyZWF0ZVRvZG9CbG9ja0luRE9NKHRvZG8sIGlzVG9kb0V4cGlyZWQodG9kbyksIGFsbFRvZG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY29uc3QgdG9kb0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKHRvZG9zLCBjdXJyZW50VG9kbywgZSkge1xuICAgIGNvbnN0IGNsaWNrZWRCdXR0b24gPSBlLnRhcmdldC5jbG9zZXN0KCdidXR0b24nKTsgLy8gZ2V0IGNsaWNrZWQgQnV0dG9uIG9yIG51bGxcbiAgICBpZiAoY2xpY2tlZEJ1dHRvbikge1xuICAgICAgICBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdkZWxldGUtdG9kbycpICkge1xuICAgICAgICAgICAgZGVsZXRlVG9kbyhjdXJyZW50VG9kbywgdG9kb3MpO1xuICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0b2Rvcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoIGNsaWNrZWRCdXR0b24uY2xhc3NMaXN0LmNvbnRhaW5zKCdlZGl0LXRvZG8nKSApIHtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gb3BlbkVkaXRGb3JtKCk7IC8vIG9wZW5zIGVkaXQgZm9ybSBhbmQgcmV0dXJucyBpdFxuICAgICAgICAgICAgZmlsbEVkaXRGb3JtKGN1cnJlbnRUb2RvLCBlZGl0Rm9ybSk7XG4gICAgICAgICAgICBjb25zdCBhY2NlcHRDaGFuZ2VzQnV0dG9uID0gZWRpdEZvcm0ucXVlcnlTZWxlY3RvcignLmVkaXQtZm9ybV9fc3VibWl0IGJ1dHRvbicpO1xuXG4gICAgICAgICAgICBjbGFzcyBlZGl0QnV0dG9uQ2xhc3Mge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKHRvZG8pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuZEV2ZW50SGFuZGxlciA9IHRoaXMuZXZlbnRIYW5kbGVyLmJpbmQodGhpcywgdG9kbywgdG9kb3MsIGVkaXRGb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlcih0b2RvLCB0b2RvcywgZWRpdEZvcm0sIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZWRpdEZvcm0pICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2RvcyA9IGdldENoYW5nZWRUb2Rvcyh0b2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VFZGl0Rm9ybSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjZXB0Q2hhbmdlc0J1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuYm91bmRFdmVudEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsaWNrRXZlbnRTdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgZWRpdEJ1dHRvbkNsYXNzKGN1cnJlbnRUb2RvLCB0b2RvcywgZWRpdEZvcm0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybiB0b2RvcyB0byBpbmRleC5qc1xuICAgIH1cbn1cblxuZXhwb3J0IHthZGRUb1RoZVRvZG9MaXN0LCBzaG93QWxsVG9kb3MsIHRvZG9GdW5jdGlvbnN9OyIsImltcG9ydCB7IHRvZG9GdW5jdGlvbnMgfSBmcm9tIFwiLi9jb250cm9sbGVyXCI7XG5cbmNvbnN0IGNoYW5nZVRvZG9TdGF0dXMgPSBmdW5jdGlvbih0b2RvRGF0YSkge1xuICAgIGlmICh0aGlzLmNoZWNrZWQpIHtcbiAgICAgICAgdG9kb0RhdGEuY2hlY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3Nlc3QoJy5zaW5nbGUtdG9kbycpLmNsYXNzTGlzdC5hZGQoJ2hpZGUtdG9kbycpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRvZG9EYXRhLmNoZWNrID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS10b2RvJyk7XG4gICAgfVxufVxuXG5jb25zdCBzaG93TmV3VGFza1dpbmRvdyA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTtcbiAgICBjb25zdCBuZXdUYXNrV2luZG93Rm9ybSA9IG5ld1Rhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmZvcm0nKTtcbiAgICBuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbi1mb3JtJyk7XG59XG5cbmNvbnN0IGhpZGVOZXdUYXNrV2luZG93ID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbmV3VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXctdGFzaycpO1xuICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3dGb3JtID0gbmV3VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcuZm9ybScpO1xuICAgIG5ld1Rhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgbmV3VGFza1dpbmRvdy5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbn1cblxuY29uc3QgY3JlYXRlVG9kb0Jsb2NrSW5ET00gPSBmdW5jdGlvbih0b2RvRGF0YSwgdG9kb0V4cGlyZWRTdGF0dXMsIHRvZG9zKSB7XG4gICAgLy8gY29uc29sZS5sb2codG9kb3MpO1xuICAgIGNvbnN0IHRhc2tzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnRfX3Rhc2tzJyk7XG5cbiAgICBjb25zdCB0b2RvQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCgnc2luZ2xlLXRvZG8nKTtcbiAgICB0b2RvQmxvY2suY2xhc3NMaXN0LmFkZCh0b2RvRGF0YS5wcmlvcml0eSk7XG5cbiAgICBpZiAodG9kb0V4cGlyZWRTdGF0dXMpIHtcbiAgICAgICAgdG9kb0Jsb2NrLmNsYXNzTGlzdC5hZGQoJ2V4cGlyZWQnKTtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdG9kb0RhdGEuZXhwaXJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGl0bGUudGV4dENvbnRlbnQgPSB0b2RvRGF0YS50aXRsZTtcbiAgICB0aXRsZS5jbGFzc0xpc3QuYWRkKCd0b2RvX190aXRsZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICBjb25zdCBkdWVEYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZHVlRGF0ZS50ZXh0Q29udGVudCA9IHRvZG9EYXRhLmR1ZURhdGU7XG4gICAgZHVlRGF0ZS5jbGFzc0xpc3QuYWRkKCd0b2RvX19kdWUtZGF0ZScpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZChkdWVEYXRlKTtcblxuXG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1dHRvbnMuY2xhc3NMaXN0LmFkZCgndG9kb19fYnV0dG9ucycpO1xuXG4gICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGRldGFpbHMudGV4dENvbnRlbnQgPSAnZGV0YWlscyc7XG4gICAgZGV0YWlscy5jbGFzc0xpc3QuYWRkKCdkZXRhaWxzLXRvZG8nKTtcbiAgICBidXR0b25zLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuXG4gICAgY29uc3QgZWRpdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGNvbnN0IGVkaXRJbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGVkaXRJbWFnZS5zcmMgPSAnLi9pbWFnZXMvaWNvbnMvZWRpdC5zdmcnO1xuICAgIGVkaXQuYXBwZW5kQ2hpbGQoZWRpdEltYWdlKTtcbiAgICBlZGl0LmNsYXNzTGlzdC5hZGQoJ2VkaXQtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZWRpdCk7XG5cbiAgICBjb25zdCBkZWxldGVUb2RvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgY29uc3QgZGVsZXRlVG9kb0ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgZGVsZXRlVG9kb0ltYWdlLnNyYyA9ICcuL2ltYWdlcy9pY29ucy9kZWxldGUuc3ZnJztcbiAgICBkZWxldGVUb2RvLmFwcGVuZENoaWxkKGRlbGV0ZVRvZG9JbWFnZSk7XG4gICAgZGVsZXRlVG9kby5jbGFzc0xpc3QuYWRkKCdkZWxldGUtdG9kbycpO1xuICAgIGJ1dHRvbnMuYXBwZW5kQ2hpbGQoZGVsZXRlVG9kbyk7XG4gICAgYnV0dG9ucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZG9GdW5jdGlvbnMuYmluZChidXR0b25zLCB0b2RvcywgdG9kb0RhdGEpKTtcblxuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZChidXR0b25zKTtcblxuXG4gICAgY29uc3QgY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRvZG9CbG9jay5hcHBlbmRDaGlsZChjaGVja2JveCk7XG4gICAgY2hlY2tib3gudHlwZSA9ICdjaGVja2JveCc7XG4gICAgY2hlY2tib3guY2xhc3NMaXN0LmFkZCgndG9kb19fY2hlY2tib3gnKTtcbiAgICBpZiAodG9kb0RhdGEuY2hlY2sgPT0gdHJ1ZSkge1xuICAgICAgICBjaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgY2hlY2tib3guY2xvc2VzdCgnLnNpbmdsZS10b2RvJykuY2xhc3NMaXN0LmFkZCgnaGlkZS10b2RvJyk7XG4gICAgfVxuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGNoYW5nZVRvZG9TdGF0dXMuYmluZChjaGVja2JveCwgdG9kb0RhdGEpKTtcblxuICAgIHRvZG9CbG9jay5kYXRhc2V0LnRpdGxlID0gdG9kb0RhdGEudGl0bGU7XG4gICAgdGFza3NDb250YWluZXIuYXBwZW5kQ2hpbGQodG9kb0Jsb2NrKTsgLy8gYWRkaW5nIG5ldyB0b2RvQmxvY2sgaW50byB0YXNrcyBjb250YWluZXJcbn1cblxuY29uc3QgY2xlYXJUb2RvQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY3VycmVudFRvZG9zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnNpbmdsZS10b2RvJyk7XG4gICAgY3VycmVudFRvZG9zLmZvckVhY2godG9kbyA9PiB7XG4gICAgICAgIHRvZG8ucmVtb3ZlKCk7XG4gICAgfSk7XG59XG5cbmNvbnN0IGNyZWF0ZUVycm9yUGFyYWdyYXBoID0gZnVuY3Rpb24oaW5wdXRGaWVsZCkge1xuICAgIGNvbnN0IGVycm9yUGFyYWdyYXBoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgaWYgKGlucHV0RmllbGQubmFtZSA9PSAnZHVlRGF0ZScpIHtcbiAgICAgICAgZXJyb3JQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZCgnZXJyb3ItcGFyYWdyYXBoX19zaGlmdGVkJyk7XG4gICAgfVxuICAgIGlmIChpbnB1dEZpZWxkLm5hbWUgPT0gJ3ByaW9yaXR5Jykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgcHJpb3JpdHkgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSBpZiAoaW5wdXRGaWVsZC5uYW1lID09ICdkdWVEYXRlJykge1xuICAgICAgICBlcnJvclBhcmFncmFwaC50ZXh0Q29udGVudCA9ICdDaG9vc2UgZHVlIGRhdGUgb2YgdGhlIHRhc2snO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUGFyYWdyYXBoLnRleHRDb250ZW50ID0gJ1RoaXMgZmllbGQgbXVzdCBiZSBmaWxsZWQnO1xuICAgIH1cbiAgICBpbnB1dEZpZWxkLmJlZm9yZShlcnJvclBhcmFncmFwaCk7XG59XG5cbmNvbnN0IGRlbGV0ZUVycm9yUGFyYWdyYXBoID0gZnVuY3Rpb24oaW5wdXRGaWVsZCkge1xuICAgIGlucHV0RmllbGQucHJldmlvdXNFbGVtZW50U2libGluZy5yZW1vdmUoKTtcbn1cblxuY29uc3QgcmVzZXRFcnJvcnMgPSBmdW5jdGlvbihmb3JtKSB7XG4gICAgY29uc3QgZXJyb3JzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZXJyb3ItcGFyYWdyYXBoJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JzW2ldLnJlbW92ZSgpO1xuICAgIH1cbiAgICBjb25zdCBlcnJvckJvcmRlcnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnZhbGlkJyk7IC8vZ2V0IGlucHV0cyB3aXRoIFwiaW52YWxpZFwiIGNsYXNzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlcnJvckJvcmRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZXJyb3JCb3JkZXJzW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmFsaWQnKTtcbiAgICB9XG59XG5cbmNvbnN0IHNob3dUb2RvR3JvdXBUaXRsZSA9IGZ1bmN0aW9uKGNsaWNrZWRPYmplY3QpIHtcbiAgICBjb25zdCBjdXJyZW50VGl0bGUgPSBjbGlja2VkT2JqZWN0LnRleHRDb250ZW50O1xuICAgIGNvbnN0IHRpdGxlRE9NRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50X190aXRsZScpO1xuICAgIHRpdGxlRE9NRWxlbWVudC50ZXh0Q29udGVudCA9IGN1cnJlbnRUaXRsZTtcbn1cblxuY29uc3Qgb3BlbkVkaXRGb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC10YXNrJyk7XG4gICAgY29uc3QgZWRpdFRhc2tXaW5kb3dGb3JtID0gZWRpdFRhc2tXaW5kb3cucXVlcnlTZWxlY3RvcignLmVkaXQtdGFza19fZm9ybScpO1xuICAgIGVkaXRUYXNrV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIGVkaXRUYXNrV2luZG93Rm9ybS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tZm9ybScpO1xuXG4gICAgcmV0dXJuIGVkaXRUYXNrV2luZG93Rm9ybTtcbn1cblxuY29uc3QgZmlsbEVkaXRGb3JtID0gZnVuY3Rpb24odG9kbywgZm9ybSkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRvZG8pO1xuICAgIC8vIGNvbnNvbGUubG9nKGZvcm0pO1xuICAgIGZvcm0udGl0bGUudmFsdWUgPSB0b2RvLnRpdGxlO1xuICAgIGZvcm0uZGVzY3JpcHRpb24udmFsdWUgPSB0b2RvLmRlc2NyaXB0aW9uO1xuICAgIGZvcm0uZHVlRGF0ZS52YWx1ZSA9IHRvZG8uZHVlRGF0ZTtcblxuICAgIGlmICh0b2RvLnByaW9yaXR5ID09ICdsb3cnKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtbG93JykuY2hlY2tlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09ICdtZWRpdW0nKSB7XG4gICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvcignI2VkaXQtbWVkaXVtJykuY2hlY2tlZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0b2RvLnByaW9yaXR5ID09ICdoaWdoJykge1xuICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3IoJyNlZGl0LWhpZ2gnKS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG5cbn1cblxuY29uc3QgY2xvc2VFZGl0Rm9ybSA9IGZ1bmN0aW9uKHRvZG8pIHtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LXRhc2snKTtcbiAgICBjb25zdCBlZGl0VGFza1dpbmRvd0Zvcm0gPSBlZGl0VGFza1dpbmRvdy5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3dGb3JtLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1mb3JtJyk7XG4gICAgZWRpdFRhc2tXaW5kb3cuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG59XG5cbmV4cG9ydCB7c2hvd05ld1Rhc2tXaW5kb3csIGhpZGVOZXdUYXNrV2luZG93LCBjcmVhdGVUb2RvQmxvY2tJbkRPTSwgY2xlYXJUb2RvQ29udGFpbmVyLCBjcmVhdGVFcnJvclBhcmFncmFwaCwgZGVsZXRlRXJyb3JQYXJhZ3JhcGgsIHJlc2V0RXJyb3JzLFxuc2hvd1RvZG9Hcm91cFRpdGxlLCBvcGVuRWRpdEZvcm0sIGNsb3NlRWRpdEZvcm0sIGZpbGxFZGl0Rm9ybX07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge3Nob3dOZXdUYXNrV2luZG93LCBoaWRlTmV3VGFza1dpbmRvdywgcmVzZXRFcnJvcnMsIGNsb3NlRWRpdEZvcm19IGZyb20gJy4vbW9kdWxlcy9kb21NYW5pcHVsYXRpb25zJztcbmltcG9ydCB7YWRkVG9UaGVUb2RvTGlzdCwgc2hvd0FsbFRvZG9zfSBmcm9tICcuL21vZHVsZXMvY29udHJvbGxlcic7XG5pbXBvcnQge2lzRm9ybVZhbGlkLCBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAsIHNvcnRUYXNrc0FjY29yZGluZ1RvQ2hvc2VuVGFza0dyb3VwfSBmcm9tICcuL21vZHVsZXMvYXBwTG9naWMnO1xuXG4oZnVuY3Rpb24oKSB7XG4gICAgbGV0IHRvZG9zID0gW107XG4gICAgXG4gICAgLy8gY3JlYXRpbmcgZXhhbXBsZSB0b2RvcyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCBmaXJzdFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnQ2FsbCB0byBJcmluYScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBoYXZlIHRvIGNhbGwgdG8gSXJpbmEgYW5kIGtub3cgc2hlIGlzLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA2LTE3JyxcbiAgICAgICAgcHJpb3JpdHk6ICdoaWdoJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBzZWNvbmRUb2RvID0ge1xuICAgICAgICB0aXRsZTogJ0J1eSBhIHBpenphJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIG5lZWQgdG8gYnV5IHR3byBwaXp6YXMgZm9yIG1lIGFuZCBJcmluYS4nLFxuICAgICAgICBkdWVEYXRlOiAnMjAyMi0wOC0xOScsXG4gICAgICAgIHByaW9yaXR5OiAnbWVkaXVtJyxcbiAgICAgICAgY2hlY2s6IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCB0aGlyZFRvZG8gPSB7XG4gICAgICAgIHRpdGxlOiAnSG1tbScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSG1tbW1tbW1tLicsXG4gICAgICAgIGR1ZURhdGU6ICcyMDIyLTA3LTE4JyxcbiAgICAgICAgcHJpb3JpdHk6ICdsb3cnLFxuICAgICAgICBjaGVjazogdHJ1ZSxcbiAgICB9O1xuXG4gICAgY29uc3QgZm91cnRoVG9kbyA9IHtcbiAgICAgICAgdGl0bGU6ICdDaGVjayBUb2RvJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIGFtIGp1c3QgY2hlY2tpbmcuJyxcbiAgICAgICAgZHVlRGF0ZTogJzIwMjItMDctMTUnLFxuICAgICAgICBwcmlvcml0eTogJ2xvdycsXG4gICAgICAgIGNoZWNrOiB0cnVlLFxuICAgIH07XG5cbiAgICB0b2Rvcy5wdXNoKGZpcnN0VG9kbyk7XG4gICAgdG9kb3MucHVzaChzZWNvbmRUb2RvKTtcbiAgICB0b2Rvcy5wdXNoKHRoaXJkVG9kbyk7XG4gICAgdG9kb3MucHVzaChmb3VydGhUb2RvKTtcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgc2hvd0FsbFRvZG9zKHRvZG9zLCB0b2Rvcyk7XG5cbiAgICAvLyBBZGQgRXZlbnQgTGlzdGVuZXJzIGZvciB0aGUgbmV3IHRhc2sgZm9ybSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgdGFza0Z1bmN0aW9ucyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgYWRkVGFza1dpbmRvd0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hZGQtdGFzaycpOyAvLyBidXR0b24gdGhhdCBvcGVucyBuZXcgdGFzayBmb3JtXG4gICAgICAgIGNvbnN0IG5ld1Rhc2tXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3LXRhc2snKTsgLy8gZm9ybSdzIG91dGVyIGRpdiBibG9ja1xuICAgICAgICBjb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm0nKTsgLy8gbmV3IHRhc2sgZm9ybVxuICAgICAgICBjb25zdCBjbG9zZVRhc2tXaW5kb3dCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9ybV9fY2xvc2luZy1idXR0b24nKTsgLy8gY2xvc2UgZm9ybSBidXR0b25cbiAgICAgICAgY29uc3Qgc3VibWl0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcm1fX3N1Ym1pdCBidXR0b24nKTsgLy8gZm9ybSdzIHN1Ym1pdCBidXR0b25cbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBjb25zdCBjdXJyZW50VGFza1RvRWRpdCA9IGNsaWNrZWRPYmplY3QuY2xvc2VzdCgnLnNpbmdsZS10b2RvJyk7IC8vIHRoaXMgbmVlZCB0byBvcGVuIGVkaXQgdG9kbyBmb3JtXG4gICAgICAgIGNvbnN0IGVkaXRGb3JtQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVkaXQtdGFzaycpO1xuICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IGVkaXRGb3JtQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICAgICAgY29uc3QgZWRpdEZvcm1DbG9zZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZGl0LWZvcm1fX2Nsb3NpbmctYnV0dG9uJyk7XG5cbiAgICAgICAgaWYgKCFuZXdUYXNrV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnaGlkZGVuJykpIHsgLy9pZiB0aGUgbmV3IHRhc2sgZm9ybSBpcyBvcGVuXG4gICAgICAgICAgICBpZiAoIGNsaWNrZWRPYmplY3QgPT0gY2xvc2VUYXNrV2luZG93QnV0dG9uIHx8ICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5mb3JtJykgKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgdGhlIFwiY2xvc2UgZm9ybVwiIGJ1dHRvbiBvciBpcyBub3QgZm9ybSB3aW5kb3dcbiAgICAgICAgICAgICAgICBoaWRlTmV3VGFza1dpbmRvdygpO1xuICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICByZXNldEVycm9ycyhmb3JtKTsgLy9yZXNldCBlcnJvciBwYXJhZ3JhcGhzIGlmIHRoZXkgYXJlIGV4aXN0XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNsaWNrZWRPYmplY3QgPT0gc3VibWl0QnV0dG9uKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICggaXNGb3JtVmFsaWQoZm9ybSkgKSB7XG4gICAgICAgICAgICAgICAgICAgIGFkZFRvVGhlVG9kb0xpc3QoZm9ybSwgdG9kb3MpOyAvLyBjcmVhdGVzIGFuZCBpbnNlcnQgbmV3IHRvZG8gaW4gRE9NXG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWxsVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYWxsLXRhc2tzJyk7IC8vIHRoZXNlIHRocmVlIGxpbmVzIG5lZWQgdG8gaGlnaGxpZ2h0IFxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrc0dyb3VwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRhc2tzIHVsJyk7IC8vIFwiYWxsIHRhc2tzXCIgYnV0dG9uIGFmdGVyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodENob3NlblRhc2tHcm91cCh0YXNrc0dyb3VwLCBhbGxUYXNrcyk7IC8vIGNyZWF0aW5nIGEgbmV3IHRhc2tcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNob3dBbGxUb2Rvcyh0b2Rvcyk7XG4gICAgICAgICAgICAgICAgICAgIGhpZGVOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcm0ucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vaWYgdGhlIG5ldyB0YXNrIGZvcm0gaXMgY2xvc2VkXG4gICAgICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCA9PSBhZGRUYXNrV2luZG93QnV0dG9uKSB7IC8vY2hlY2sgaWYgY2xpY2tlZCBPYmplY3QgaXMgXCJhZGQgdGFza1wiIGJ1dHRvblxuICAgICAgICAgICAgICAgIHNob3dOZXdUYXNrV2luZG93KCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAoY2xpY2tlZE9iamVjdCA9PSBlZGl0Rm9ybUNvbnRhaW5lciAmJiAhZWRpdEZvcm1Db250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSAmJiBcbiAgICAgICAgICAgICFjbGlja2VkT2JqZWN0LmNsb3Nlc3QoJy5lZGl0LXRhc2tfX2Zvcm0nKSApIHx8IGNsaWNrZWRPYmplY3QgPT0gZWRpdEZvcm1DbG9zZUJ1dHRvbikgeyAvLyBpZiBlZGl0IGZvcm0gaXMgb3Blbi4gVGhlbiBjbG9zZSBidXR0b24gY2xpY2tlZFxuICAgICAgICAgICAgICAgIGNsb3NlRWRpdEZvcm0oKTtcbiAgICAgICAgICAgICAgICBlZGl0Rm9ybS5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0YXNrRnVuY3Rpb25zKTtcblxuICAgIC8vIEFkZCBFdmVudCBMaXN0ZW5lcnMgZm9yIHRhc2sgZ3JvdXBzXG4gICAgY29uc3QgdGFza0dyb3VwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrcyB1bCcpOyAvL2dldCBzaWRlYmFyIHRhc2sgZ3JvdXBzXG5cbiAgICBjb25zdCB0YXNrR3JvdXBzRnVuY3Rpb25zID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBcbiAgICAgICAgY29uc3QgY2xpY2tlZE9iamVjdCA9IGUudGFyZ2V0O1xuICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCAhPSB0YXNrR3JvdXBzKSB7XG4gICAgICAgICAgICBoaWdobGlnaHRDaG9zZW5UYXNrR3JvdXAodGFza0dyb3VwcywgY2xpY2tlZE9iamVjdCk7XG4gICAgICAgICAgICBjb25zdCB0b2Rvc0ZvclNob3cgPSBzb3J0VGFza3NBY2NvcmRpbmdUb0Nob3NlblRhc2tHcm91cChjbGlja2VkT2JqZWN0LCB0b2Rvcyk7XG4gICAgICAgICAgICBzaG93QWxsVG9kb3ModG9kb3NGb3JTaG93LCB0b2RvcywgY2xpY2tlZE9iamVjdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0YXNrR3JvdXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFza0dyb3Vwc0Z1bmN0aW9ucyk7XG5cbn0pKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9