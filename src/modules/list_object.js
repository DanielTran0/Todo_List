import {projectHeadingsArray, projectListsArray, listIdCounter, mainPage} from '../index';
import projectGroupings from './project_groupings';

const listModule = (()=> {
    const _mainBarHeader = document.querySelector('.mainBarHeaderContent');
    const _formHeader = document.querySelector('.formHeader');
    const _formTitle = document.querySelector('#title');
    const _formDescription = document.querySelector('#description');
    const _formDueDate = document.querySelector('#dueDate');
    const _formPriority = document.querySelector('.prioritySelect');
    const _formProjectSelect = document.querySelector('.projectSelect');
    const _formProjectSelectNoneOption = document.querySelector('#none')
    const _formFooterButton = document.querySelector('.formButton');
    const _modalListTitle = document.querySelector('.listTitle');
    const _modalListProject = document.querySelector('.listProject');
    const _modalListDueDate = document.querySelector('.listDueDate');
    const _modalListDescription = document.querySelector('.listDescription');
    const _modalListPriority = document.querySelector('.listPriority');
    const _modalDeleteButton = document.querySelector('.deleteList');
    const _modalEditButton = document.querySelector('.editList');

    const createListObject = (id, title, description, date, priority, project, completed=false) => {
        return {
            id,
            title,
            description,
            date,
            priority,
            project,
            completed,
        }
    }

    const getDataAndMakeList = () => {
        const listObject = createListObject(listIdCounter, _formTitle.value, _formDescription.value, _formDueDate.value, _formPriority.value, _formProjectSelect.value);
        
        listIdCounter++;
        mainPage.saveLocalStorage();
        return listObject;
    }

    const clearFormField = () => {
        title.value = '';
        description.value = '';
        dueDate.value = '';
        _formProjectSelectNoneOption.selected = true;
    }

    const createListDom = (listObject) => {
        const listDiv = document.createElement('div');
        const checkBox = document.createElement('input');
        const priority = document.createElement('div');
        const title = document.createElement('div');
        const date = document.createElement('div');
    
        listDiv.classList.add('list');
        listDiv.id = listObject.title;
        checkBox.classList.add('listItem', 'checkBox');
        checkBox.type = 'checkbox';
        checkBox.id = `checkBox${listObject.title}`;
        priority.classList.add('listItem');
        priority.id = 'priority';
        title.classList.add('listItem', 'title');
        title.textContent = listObject.title;
        title.setAttribute('data-bs-toggle', 'modal');
        title.setAttribute('data-bs-target', '#fullList');
        title.addEventListener('click', () => _modalListContent(listObject));
        date.classList.add('listItem', 'date');
        date.textContent = listObject.date;
    
        if (listObject.completed) {
            listDiv.classList.add('strike');
            checkBox.checked = true;
        }
    
        if(listObject.priority === 'low') priority.classList.add('priority', 'priorityLow');
        else if(listObject.priority === 'medium') priority.classList.add('priority', 'priorityMedium');
        else if(listObject.priority === 'high') priority.classList.add('priority', 'priorityHigh');
        else priority.classList.remove('priority', 'priorityLow', 'priorityMedium', 'priorityHigh');
    
        listDiv.appendChild(checkBox);
        listDiv.appendChild(priority);
        listDiv.appendChild(title);
        listDiv.appendChild(date);
        return listDiv;
    }

    const addCheckBoxLogic = () => {
        const checkBoxes = Array.from(document.querySelectorAll('.checkBox'));
    
        checkBoxes.forEach(checkBox => {
            checkBox.addEventListener('change', () => {
                const id = checkBox.id.slice(8)
                const listDiv = document.querySelector(`#${id}`);
    
                if (checkBox.checked) {
                    listDiv.classList.add('strike');
    
                    projectListsArray.forEach(list => {
                        if (list.title === id) {
                            list.completed = true;
                            mainPage.saveLocalStorage();
                            return;
                        }
                    });
                } else {
                    listDiv.classList.remove('strike');
    
                    projectListsArray.forEach(list => {
                        if (list.title === id) {
                            list.completed = false;
                            mainPage.saveLocalStorage();
                            return;
                        }
                    });
                }
            })
        });
    }
    
    const modalProjectSelect = () => {
        _formProjectSelect.textContent = '';
        
        projectHeadingsArray.forEach(heading => {
            const optionDiv = document.createElement('option');
        
            optionDiv.value = heading;
            optionDiv.textContent = heading;
            _formProjectSelect.appendChild(optionDiv);
    
            if(heading === _mainBarHeader.textContent) optionDiv.selected = true;
        });
    }

    const _modalListContent = (listObject) => {    
        _modalListTitle.textContent = listObject.title;
        _modalListProject.textContent = listObject.project;
        _modalListDueDate.textContent = listObject.date === '' ? 'None' : listObject.date;
        _modalListDescription.textContent = listObject.description === '' ? 'None' : listObject.description;
        _modalListPriority.textContent = listObject.priority === '' ? 'None' : listObject.priority;
        _modalDeleteListButton(listObject);
        _modalEditListButton(listObject);
    }
    
    const _modalDeleteListButton = (listObject) => {    
        _modalDeleteButton.id = `list${listObject.id}`;
        
        _modalDeleteButton.addEventListener('click', () => {
            if (_modalDeleteButton.id !== `list${listObject.id}`) return;
    
            const deleteIdIndex = projectListsArray.findIndex(list => list.id === listObject.id);
    
            if (deleteIdIndex === -1) return
    
            projectListsArray.splice(deleteIdIndex, 1);
            _modalCloseShowList(listObject);
            mainPage.saveLocalStorage();
        });
    }
    
    const _modalEditListButton = (listObject) => {        
        _modalEditButton.addEventListener('click', () => {
            _formFooterButton.classList.add('saveChanges')
            _formFooterButton.classList.remove('createNewList');
            _formFooterButton.textContent = 'Save Changes';
            _formFooterButton.id = listObject.id;
            _formHeader.textContent = 'Edit Task';
            listModule.modalProjectSelect();

            _formTitle.value = listObject.title;
            _formDescription.value = listObject.description;
            _formDueDate.value = listObject.date;
            _formPriority.value = listObject.priority;
            _formProjectSelect.value = listObject.project;
        });
    }

    const modalSaveListEdit = (listObject) => {
        listObject.title = _formTitle.value;
        listObject.description = _formDescription.value;
        listObject.date = _formDueDate.value;
        listObject.priority = _formPriority.value;
        listObject.project = _formProjectSelect.value;
        _modalCloseShowList(listObject);
    }

    const _modalCloseShowList = (listObject) => {
        if (_mainBarHeader.textContent === 'All') projectGroupings.showAllLists();
        else if (_mainBarHeader.textContent === 'Today') projectGroupings.showTodayList();
        else if (_mainBarHeader.textContent === 'Week') projectGroupings.showWeekList();
        else projectGroupings.showProjectList(listObject.project);
        
    }

    return {
        createListObject,
        getDataAndMakeList,
        clearFormField,
        createListDom,
        addCheckBoxLogic,
        modalProjectSelect,
        modalSaveListEdit,
    }
})();

export default listModule
