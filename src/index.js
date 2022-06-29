import {showNewTaskWindow, hideNewTaskWindow, resetErrors, closeEditForm, createErrorParagraph, deleteErrorParagraph} from './modules/domManipulations';
import {addToTheTodoList, showAllTodos, addToProjectsList, showAllProjects} from './modules/controller';
import {isFormValid, highlightChosenTaskGroup, sortTasksAccordingToChosenTaskGroup, getCurrentProject, getChosenProject, highlightProject} from './modules/appLogic';

(function() {
    let todos = [];
    let projectsList = [];
    
    // creating example todos ===================================================
    const firstTodo = {
        title: 'Call to Irina',
        description: 'I have to call to Irina and know where she is.',
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

    const mainProject = {
        title: 'Main',
        todos: todos,
    };

    addToProjectsList(mainProject, projectsList);
    showAllProjects(projectsList);
    highlightProject(mainProject);

    const todosForShow = mainProject.todos;
    showAllTodos(todosForShow, todos);

    

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
        
        const currentProject = getCurrentProject(projectsList); 
        todos = currentProject.todos;

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
                    
                    showAllTodos(todos, todos);
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

    // Add Event Listeners for projects
    const projects = document.querySelector('.projects');
    const createProjectButton = document.querySelector('.new-project__accept-title');

    const projectsFunctions = function(e) {
        const clickedObject = e.target;
        const addProjectButton = projects.querySelector('.projects__create');
        const newProject = document.querySelector('.new-project');
        const newProjectForm = newProject.querySelector('form');
        const allProjects = document.querySelectorAll('.projects ul li');
        
        if (addProjectButton && addProjectButton == clickedObject.closest('.projects__create')) {
            newProject.classList.remove('hidden');
            newProjectForm.classList.remove('hidden-form');
        } else if ( clickedObject.classList.contains('single-project') ) {
            if (projectsList.length > 0) {
                for (let i = 0; i < projectsList.length; i++) {
                    const currentProject = projectsList[i];
                    if (currentProject.title == clickedObject.textContent) {
                        highlightProject(currentProject);
                        todos = currentProject.todos;
                        showAllTodos(todos, todos);
                    }
                }
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
        const chosenProject = getChosenProject(currentHighlightedProjectInDOM, projectsList);
        

        if ( projectTitle.previousElementSibling.classList.contains('error-paragraph-project') ) {
            deleteErrorParagraph(projectTitle);
            projectTitle.classList.remove('invalid');
        }

        if (projectTitle.value.trim() == '') {
            createErrorParagraph(projectTitle);
            projectTitle.classList.add('invalid');

        } else {
            const currentProject = {
                title: projectTitle.value,
                todos: [],
            }

            addToProjectsList(currentProject, projectsList);
            showAllProjects(projectsList);
            highlightProject(chosenProject);
            
            newProject.classList.add('hidden');
            newProjectForm.classList.add('hidden-form');
            newProjectForm.reset();
        }
        
    }
    createProjectButton.addEventListener('click', addProject);

})();