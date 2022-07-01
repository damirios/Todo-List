const saveInLocalStorage = function(projectsList) {
    let serialProjectsList = JSON.stringify(projectsList);
    localStorage.setItem('projectsList', serialProjectsList);
}

const getFromLocalStorage = function() {
    let projectsList = JSON.parse(localStorage.getItem('projectsList'));
    
    return projectsList;
}

export {saveInLocalStorage, getFromLocalStorage}