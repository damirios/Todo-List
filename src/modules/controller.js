import {createTodoBlockInDOM, clearTodoContainer, showTodoGroupTitle, openEditForm, fillEditForm, closeEditForm, openDetailsWindow, addProjectDOM, clearProjectsMenu} from './domManipulations';
import {todoFactory, isTodoExpired, addExpirationStatus, deleteTodo, isFormValid, getChangedTodos, highlightProject} from './appLogic';
import { saveInLocalStorage } from './localStorage';

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

const showAllTodos = function(todosForShow, allTodos, projectsList, clickedObject) {
    clearTodoContainer(); // clears todo container of all tasks and then we will create it again with chosen parameters
    if (clickedObject) {
        showTodoGroupTitle(clickedObject);
    }

    if (todosForShow && todosForShow.length > 0) {
        addExpirationStatus(todosForShow);
        todosForShow.sort(compareFunction);
        
        for (let i = 0; i < todosForShow.length; i++) {
            const todo = todosForShow[i];
            if (todo) {
                createTodoBlockInDOM(todo, isTodoExpired(todo), projectsList, allTodos);
            }
        }
    }
}

const todoFunctions = function(todos, currentTodo, projectsList, e) {
    const clickedButton = e.target.closest('button'); // get clicked Button or null
    if (clickedButton) {
        if ( clickedButton.classList.contains('delete-todo') ) {
            deleteTodo(currentTodo, todos);
            saveInLocalStorage(projectsList);
            showAllTodos(todos, todos, projectsList);
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

                        todos = getChangedTodos(todo, todos, editForm);
                        this.removeListener();
                        closeEditForm();
                        saveInLocalStorage(projectsList);
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
            openDetailsWindow(currentTodo);
        }
        // return todos to index.js
    }
}

const addToProjectsList = function(project, projectsList) {
    projectsList.push(project);
}

const showAllProjects = function(projectsList) {

    if (projectsList.length > 0) {
        clearProjectsMenu();
        for (let i = 0; i < projectsList.length; i++) {
            const project = projectsList[i];
            addProjectDOM(project);
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
                    saveInLocalStorage(projectsList);
                    showAllProjects(projectsList);
                    highlightProject(projectsList[0]);
                    showAllTodos(projectsList[0].todos, projectsList[0].todos, projectsList);
                }
            }
        }
    }
}

export {addToTheTodoList, showAllTodos, todoFunctions, addToProjectsList, showAllProjects, renameProject, deleteProject};