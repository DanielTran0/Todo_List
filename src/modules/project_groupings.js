import listModule from './list_object';
import {projectHeadingsArray, projectListsArray, mainPage} from '../index';
const moment = require('moment');

const projectGroupings = (() => {
    const _mainBarHeader = document.querySelector('.mainBarHeaderContent');
    const _mainBarContent = document.querySelector('.mainBarContent');
    const _addListButton = document.querySelector('.addList');
    const _allProjectsDiv = document.querySelector('.allProjects');
    const _mainBarHeaderDiv = document.querySelector('.mainBarHeader');
    const _sideBar = document.querySelector('.sideBar');
    const _mobileButton = document.querySelector('.menuButton');

    const showProjectHeadings = () => {
        projectHeadingsArray.forEach(heading => {
            if(heading === 'General') return;

            const headingDisplay = document.createElement('a');
    
            headingDisplay.classList = 'listGroup';
            headingDisplay.href = '#';
            headingDisplay.id = heading;
            headingDisplay.textContent = heading;
            headingDisplay.addEventListener('click', () => showProjectList(heading));
    
            _allProjectsDiv.appendChild(headingDisplay);
        });
    }

    const showProjectList = (projectHeading) => {    
        _clearProjectList();
        _addListButton.classList.remove('hideButton');
        _mainBarHeader.textContent = projectHeading;
        _addListButton.value = projectHeading;
    
        projectListsArray.forEach(list => {
            if (list.project === projectHeading) _mainBarContent.appendChild(listModule.createListDom(list));
        });

        _clearProjectEditBar();
        listModule.addCheckBoxLogic()
    }

    const _clearProjectList = () => {
        _mainBarContent.textContent = '';
    }

    const _clearProjectHeadings = () => {
        _allProjectsDiv.textContent = '';
    }

    const showInstructions = () => {
        _clearProjectList();
        showProjectList('Instructions');
        const pTag = document.createElement('p');
        const pTag2 = document.createElement('p');
        const pTag3 = document.createElement('p');


        pTag.id = 'instructionsContent';
        pTag2.classList = 'warning';
        pTag3.classList = 'warning';
        pTag.textContent = `Welcome to Todo List! On the left are the groupings for all your lists. General will be your default project. Today and week will show your lists that fall within that time span. 
        All will show you every list that has been created. To create a new project, press the + next to projects*. Once on a project or overview tab, you can click the heading to change its name**, delete the entire project** or delete all the lists it contains. To create a new list, press the + underneath the title or content, as seen below. Click on the list  name to see their full details and be able to delete or edit the individually.`
        pTag2.textContent = '*Can’t use names in overview or duplicate project names, it is case sensitive so if you really wanted to just make it lowercase.';
        pTag3.textContent = '** Those options aren’t available to overview tabs.';

        _mainBarContent.appendChild(pTag);
        _mainBarContent.appendChild(pTag2);
        _mainBarContent.appendChild(pTag3);
    }

    const showGeneralList = () => {
        _clearProjectList();
        showProjectList('General');
    }

    const showTodayList = () => {
        _clearProjectList();
        _mainBarHeader.textContent = 'Today';
        _addListButton.classList.add('hideButton');
        const currentDate = moment().format('YYYY-MM-DD');

        projectListsArray.forEach(list => {
            if (currentDate !== list.date) return

            _mainBarContent.appendChild(listModule.createListDom(list));
        });

        _clearProjectEditBar();
        listModule.addCheckBoxLogic();
    }

    const showWeekList = () => {
        _clearProjectList();
        _mainBarHeader.textContent = 'Week';
        _addListButton.classList.add('hideButton');
        const currentDate = moment().format('YYYY-MM-DD');
        const weekDate = moment().add(7, 'd').format('YYYY-MM-DD');

        projectListsArray.forEach(list => {
            if (currentDate <= list.date && list.date < weekDate) _mainBarContent.appendChild(listModule.createListDom(list));
        });

        _clearProjectEditBar();
        listModule.addCheckBoxLogic();
    }

    const showAllLists = () => {
        _clearProjectList();
        _mainBarHeader.textContent = 'All';
        _addListButton.classList.add('hideButton');

        projectListsArray.forEach(list => {
            _mainBarContent.appendChild(listModule.createListDom(list));
        });

        _clearProjectEditBar();
        listModule.addCheckBoxLogic();
    }
    
    const createProjectListInput = () => {
        if (document.querySelector('.addProjectHeading')) return;
        
        const addProjectDiv = document.createElement('div');
        const projectInput = document.createElement('input');
        const buttonGroupDiv = document.createElement('div');
        const projectSubmit = document.createElement('button');
        const projectCancel = document.createElement('button');
    
        addProjectDiv.classList = 'addProjectHeading';
        projectInput.type = 'text';
        projectInput.id = 'newProjectInput';
        projectInput.placeholder = 'New Project Name';
        buttonGroupDiv.classList.add('btn-group');
        projectSubmit.textContent = 'Add';
        projectSubmit.id = 'submitNewProject';
        projectSubmit.classList.add('btn', 'btn-primary')
        projectCancel.textContent = 'Cancel';
        projectCancel.classList.add('btn', 'btn-secondary');

        projectSubmit.addEventListener('click', () => _addNewProjectHeading(projectInput));
        projectCancel.addEventListener('click', () => {
            _clearProjectHeadings();
            showProjectHeadings();
        });
    
        addProjectDiv.appendChild(projectInput);
        buttonGroupDiv.appendChild(projectSubmit);
        buttonGroupDiv.appendChild(projectCancel);
        addProjectDiv.appendChild(buttonGroupDiv);
        _allProjectsDiv.appendChild(addProjectDiv);
    }
    
    const _addNewProjectHeading = (projectInput) => {        
        if (projectInput.value === '') return;
        
        const duplicateHeading = projectHeadingsArray.indexOf(projectInput.value);

        if (duplicateHeading !== -1 || projectInput.value === 'General' || projectInput.value === 'Today' || 
        projectInput.value === 'Week' || projectInput.value === 'All' || projectInput.value === 'Instructions') return;

        projectHeadingsArray.push(projectInput.value);
        _clearProjectHeadings();
        showProjectHeadings();
        mainPage.saveLocalStorage();
    }

    const changeProjectHeading = () => {
        const projectHeadingText = document.querySelector('.mainBarHeaderContent').textContent;

        if(document.querySelector('.changeProjectHeading')) return;
        if (projectHeadingText === 'Instructions') return;

        const changeProjectHeadingDiv = document.createElement('div');
        const projectInput = document.createElement('input');
        const buttonGroupDiv = document.createElement('div');
        const projectChangeName = document.createElement('button');
        const projectDeleteList = document.createElement('button');
        const projectDeleteProject = document.createElement('button');
        const projectCancel = document.createElement('button');

        changeProjectHeadingDiv.classList.add('changeProjectHeading', 'text-center');
        buttonGroupDiv.classList.add('btn-group');
        projectDeleteList.textContent = 'Delete Lists';
        projectDeleteList.classList.add('btn', 'btn-warning');
        projectCancel.textContent = 'Cancel';
        projectCancel.classList.add('btn', 'btn-secondary');

        if (projectHeadingText !== 'General' && projectHeadingText != 'Today' && projectHeadingText !='Week' && projectHeadingText != 'All') {
            projectInput.type = 'text';
            projectInput.id = 'changeProjectInput';
            projectInput.placeholder = 'Change Project Name';
            projectChangeName.textContent = 'Edit Name';
            projectChangeName.id = 'EditNameProject';
            projectChangeName.classList.add('btn', 'btn-primary');
            projectDeleteProject.textContent = 'Delete Project';
            projectDeleteProject.classList.add('btn', 'btn-danger');
            projectDeleteProject.addEventListener('click', () => {
                const listIndexes = [];

                projectListsArray.forEach((list, index) => {
                    if (list.project !== _mainBarHeader.textContent) return;
                    listIndexes.push(index);
                });

                for (let i = listIndexes.length - 1; i >= 0; i--) {
                    projectListsArray.splice(listIndexes[i], 1);
                }

                const headingIndex = projectHeadingsArray.indexOf(_mainBarHeader.textContent);
                projectHeadingsArray.splice(headingIndex, 1);
                _clearProjectHeadings();
                showProjectHeadings();
                showGeneralList();
                mainPage.saveLocalStorage();
            });
        }

        projectChangeName.addEventListener('click', () => {
            const duplicateHeadingIndex = projectHeadingsArray.indexOf(projectInput.value);
            
            if (duplicateHeadingIndex !== -1 || projectInput.value === 'General' || projectInput.value === 'Today' || 
            projectInput.value === 'Week' || projectInput.value === 'All' || projectInput.value === '') return;

            const headingIndex = projectHeadingsArray.indexOf(_mainBarHeader.textContent);
            projectHeadingsArray[headingIndex] = projectInput.value;
            projectListsArray.forEach(list => {
                if (list.project !== _mainBarHeader.textContent) return;

                list.project = projectInput.value;
            });

            _clearProjectHeadings();
            showProjectHeadings();
            showProjectList(projectInput.value);
            mainPage.saveLocalStorage();
        });
        projectDeleteList.addEventListener('click', () => {
            _deleteListLogic()
        });
        projectCancel.addEventListener('click', () => {
            _mainBarHeaderDiv.removeChild(changeProjectHeadingDiv);
        });

        if (projectHeadingText !== 'General' && projectHeadingText != 'Today' && projectHeadingText !='Week' && projectHeadingText != 'All') {
            changeProjectHeadingDiv.appendChild(projectInput);
            buttonGroupDiv.appendChild(projectChangeName);
            buttonGroupDiv.appendChild(projectDeleteProject);
        }

        buttonGroupDiv.appendChild(projectDeleteList);
        buttonGroupDiv.appendChild(projectCancel);
        changeProjectHeadingDiv.appendChild(buttonGroupDiv);
        _mainBarHeaderDiv.appendChild(changeProjectHeadingDiv);
    }

    const _clearProjectEditBar = () => {
        if (document.querySelector('.changeProjectHeading')) _mainBarHeaderDiv.removeChild(document.querySelector('.changeProjectHeading'));
    }

    const _deleteListLogic = () => {
        if (_mainBarHeader.textContent === 'General') {
            const listIndexes = [];

            projectListsArray.forEach((list, index) => {
                if (list.project !== _mainBarHeader.textContent) return;
                
                listIndexes.push(index);
            });

            for (let i = listIndexes.length - 1; i >= 0; i--) {
                projectListsArray.splice(listIndexes[i], 1);
            }

            showGeneralList();
        } else if (_mainBarHeader.textContent === 'Today') {
            const listIndexes = [];
            const currentDate = moment().format('YYYY-MM-DD');

            projectListsArray.forEach((list, index) => {
                if (currentDate !== list.date) return
    
                listIndexes.push(index);
            });

            for (let i = listIndexes.length - 1; i >= 0; i--) {
                projectListsArray.splice(listIndexes[i], 1);
            }

            showTodayList();
        } else if (_mainBarHeader.textContent === 'Week') {
            const listIndexes = [];
            const currentDate = moment().format('YYYY-MM-DD');
            const weekDate = moment().add(7, 'd').format('YYYY-MM-DD');
    
            projectListsArray.forEach((list, index) => {
                if (currentDate <= list.date && list.date < weekDate) {
                    listIndexes.push(index);
                }
            });
    

            for (let i = listIndexes.length - 1; i >= 0; i--) {
                projectListsArray.splice(listIndexes[i], 1);
            }

            showWeekList();
        }
        else if (_mainBarHeader.textContent === 'All') {
            projectListsArray.length = 0
            showAllLists();
        } else {
            const listIndexes = [];

            projectListsArray.forEach((list, index) => {
                if (list.project !== _mainBarHeader.textContent) return;
                
                listIndexes.push(index);
            });

            for (let i = listIndexes.length - 1; i >= 0; i--) {
                projectListsArray.splice(listIndexes[i], 1);
            }

            showProjectList(_mainBarHeader.textContent);
        }
        mainPage.saveLocalStorage();
    }

    const toggleMenuButton = () => {
        _mobileButton.addEventListener('click', () => {
            if (_sideBar.style.display === 'none') {
                _sideBar.style.display = 'inline-block'
            } else _sideBar.style.display = 'none'
        })
    }

    return {
        showProjectHeadings,
        showProjectList,
        showInstructions,
        showGeneralList,
        showTodayList,
        showWeekList,
        showAllLists,
        createProjectListInput,
        changeProjectHeading,
        toggleMenuButton,
    }
})();

export default projectGroupings
