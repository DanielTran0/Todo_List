import listModule from './modules/list_object';
import projectGroupings from './modules/project_groupings';

let projectHeadingsArray = ['General'];
let projectListsArray = [];
let listIdCounter = 0;

const mainPage = (() => {
    const _taskForm = document.querySelector('#taskForm');
    const _addProjectButton = document.querySelector('.addProject');
    const _addListButton = document.querySelector('.addList');
    const _projectHeadingInstructions = document.querySelector('#instructions');
    const _projectHeadingGeneral = document.querySelector('#general');
    const _projectHeadingToday = document.querySelector('#today');
    const _projectHeadingWeek = document.querySelector('#week');
    const _projectHeadingAll = document.querySelector('#all');
    const _formHeader = document.querySelector('.formHeader');
    const _formFooterButton = document.querySelector('.formButton');
    const _mainBarHeader = document.querySelector('.mainBarHeaderContent');
  
    const addNewList = () => {        
        _taskForm.addEventListener('submit', (e) => {
            if (document.querySelector('.createNewList')) {
                e.preventDefault();
                const newList = listModule.getDataAndMakeList();
                projectListsArray.push(newList);
                listModule.addCheckBoxLogic();
                projectGroupings.showProjectList(newList.project);
                listModule.clearFormField();
                saveLocalStorage();
            } else if (document.querySelector('.saveChanges')) {
                const listIdIndex = projectListsArray.findIndex(list => list.id === +_formFooterButton.id);
                
                if (listIdIndex === -1) return;

                const listObject = projectListsArray[listIdIndex];
                listModule.modalSaveListEdit(listObject);
                saveLocalStorage();
            }
        });
    }

    const displayDefaultListsAndButton = () => {
        _addProjectButton.addEventListener('click', () => projectGroupings.createProjectListInput());
        _addListButton.addEventListener('click', () => {
            _formFooterButton.classList.add('createNewList');
            _formFooterButton.classList.remove('saveChanges');
            _formFooterButton.textContent = 'Create New List';
            _formFooterButton.id = '';
            _formHeader.textContent = 'New Task';
            listModule.modalProjectSelect();
            listModule.clearFormField();
        });
        _projectHeadingInstructions.addEventListener('click', () => projectGroupings.showInstructions());
        _projectHeadingGeneral.addEventListener('click', () => projectGroupings.showGeneralList());
        _projectHeadingToday.addEventListener('click', () => projectGroupings.showTodayList());
        _projectHeadingWeek.addEventListener('click', () => projectGroupings.showWeekList());
        _projectHeadingAll.addEventListener('click', () => projectGroupings.showAllLists());
        _mainBarHeader.addEventListener('click', () => projectGroupings.changeProjectHeading());
    } 

    const saveLocalStorage = () => {
        localStorage.setItem('projectHeadingsArray', JSON.stringify(projectHeadingsArray));
        localStorage.setItem('projectListsArray', JSON.stringify(projectListsArray));
        localStorage.setItem('listIdCounter', JSON.stringify(listIdCounter));

    }

    const getLocalStorage = () => {
        projectHeadingsArray = JSON.parse(localStorage.getItem('projectHeadingsArray'));
        projectListsArray = JSON.parse(localStorage.getItem('projectListsArray'));
        listIdCounter = JSON.parse(localStorage.getItem('listIdCounter'));

        if(projectHeadingsArray === null) projectHeadingsArray = ['General'];
        if(projectListsArray === null) projectListsArray = [];
        if(listIdCounter === null) listIdCounter = 0;

        projectGroupings.showGeneralList();
    }

    return {
        addNewList,
        displayDefaultListsAndButton,
        saveLocalStorage,
        getLocalStorage,
    }
})();

mainPage.getLocalStorage();
mainPage.addNewList();
mainPage.displayDefaultListsAndButton();
projectGroupings.showProjectHeadings();

export {
    projectHeadingsArray,
    projectListsArray,
    listIdCounter,
    mainPage,
}

