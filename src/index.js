import {showNewTaskWindow, hideNewTaskWindow, resetErrors, closeEditForm} from './modules/domManipulations';
import {addToTheTodoList, showAllTodos} from './modules/controller';
import {isFormValid, highlightChosenTaskGroup, sortTasksAccordingToChosenTaskGroup} from './modules/appLogic';

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

    showAllTodos(todos, todos);

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
                hideNewTaskWindow();
                form.reset();
                resetErrors(form); //reset error paragraphs if they are exist
            } else if (clickedObject == submitButton) {
                e.preventDefault();
                if ( isFormValid(form) ) {
                    addToTheTodoList(form, todos); // creates and insert new todo in DOM

                    const allTasks = document.querySelector('.all-tasks'); // these three lines need to highlight 
                    const tasksGroup = document.querySelector('.tasks ul'); // "all tasks" button after
                    highlightChosenTaskGroup(tasksGroup, allTasks); // creating a new task
                    
                    showAllTodos(todos);
                    hideNewTaskWindow();
                    form.reset();
                }
            }
        } else { //if the new task form is closed
            if (clickedObject == addTaskWindowButton) { //check if clicked Object is "add task" button
                showNewTaskWindow();
            } else if ( (clickedObject == editFormContainer && !editFormContainer.classList.contains('hidden') && 
            !clickedObject.closest('.edit-task__form') ) || clickedObject == editFormCloseButton) { // if edit form is open. Then close button clicked
                closeEditForm();
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
            highlightChosenTaskGroup(taskGroups, clickedObject);
            const todosForShow = sortTasksAccordingToChosenTaskGroup(clickedObject, todos);
            showAllTodos(todosForShow, todos, clickedObject);
        }
    }

    taskGroups.addEventListener('click', taskGroupsFunctions);

})();