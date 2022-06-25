import {createTodoBlockInDOM, clearTodoContainer, showTodoGroupTitle, openEditForm, fillEditForm, closeEditForm} from './domManipulations';
import {todoFactory, isTodoExpired, addExpirationStatus, deleteTodo, isFormValid, getChangedTodos} from './appLogic';

const addToTheTodoList = function(form, todos) {
    const newTodo = todoFactory(form);
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
    clearTodoContainer(); // clears todo container of all tasks and then we will create it again with chosen parameters
    if (clickedObject) {
        showTodoGroupTitle(clickedObject);
    }

    if (todos && todos.length > 0) {
        addExpirationStatus(todos);
        todos.sort(compareFunction);
        
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            if (todo) {
                createTodoBlockInDOM(todo, isTodoExpired(todo), todos);
            }
        }
    }
}

const todoFunctions = function(todos, currentTodo, e) {
    const clickedButton = e.target.closest('button'); // get clicked Button or null
    if (clickedButton) {
        if ( clickedButton.classList.contains('delete-todo') ) {
            deleteTodo(currentTodo, todos);
        } else if ( clickedButton.classList.contains('edit-todo') ) {
            const editForm = openEditForm(); // opens edit form and returns it
            fillEditForm(currentTodo, editForm);
            const acceptChangesButton = editForm.querySelector('.edit-form__submit button');

            class editButtonClass {
                constructor(todo) {
                    this.boundEventHandler = this.eventHandler.bind(this, todo, todos, editForm);
                    acceptChangesButton.addEventListener('click', this.boundEventHandler);
                }

                eventHandler(todo, todos, editForm, e) {
                    e.preventDefault();

                    if ( isFormValid(editForm) ) {
                        const newTodos = getChangedTodos(todo, todos, editForm);
                        this.removeListener();
                        closeEditForm();
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

export {addToTheTodoList, showAllTodos, todoFunctions};