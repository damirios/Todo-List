import {showNewTaskWindow, hideNewTaskWindow, resetErrors} from './modules/domManipulations';
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

    showAllTodos(todos);

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
                hideNewTaskWindow();
                form.reset();
                resetErrors(form); //reset error paragraphs if they are exist
            } else if (clickedObject == submitButton) {
                e.preventDefault();
                if ( isFormValid(form) ) {
                    addToTheTodoList(form, todos); // creates and insert new todo in DOM

                    const allTasks = document.querySelector('.all-tasks'); // these three lines (68-70) need to highlight 
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
            }
        }
    }
    window.addEventListener('click', addNewTaskFunctions);


    // Add Event Listeners for task groups
    const taskGroups = document.querySelector('.tasks ul'); //get sidebar task groups
    
    const taskGroupsFunctions = function(e) {
        const clickedObject = e.target;

        highlightChosenTaskGroup(taskGroups, clickedObject);

        const todosForShow = sortTasksAccordingToChosenTaskGroup(clickedObject, todos);

        showAllTodos(todosForShow);
    }

    taskGroups.addEventListener('click', taskGroupsFunctions);
})();