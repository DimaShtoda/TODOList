let tasks = new Array();
let indexActiveTask = -1;

tasks[0] = {
    title: '1',
    description: 'a',
    priority: 'high'
};
tasks[1] = {
    title: '2',
    description: 'b',
    priority: 'normal'
};
tasks[2] = {
    title: '3',
    description: 'c',
    priority: 'low'
};

updateTasksList(tasks);

function createTask(aTitle, aDescription, aPriority) {
    let task = {
        title: aTitle,
        description: aDescription,
        priority: aPriority,
        status: 'open'
    };
    return task;
}

function addTask(task) {
    tasks.push(task);
}

function updateTask(index, task) {
    tasks[index] = task;
}

function removeTask(index) {
    console.log(index);
    console.log(tasks);
    tasks.splice(index, 1)
    console.log(tasks);
}

function visibleFormNewTask(isVisible) {
    if (isVisible) {
        document.getElementById('form-new-task').style.display = 'flex';
        if (indexActiveTask >= 0) {
            document.getElementById('form_title').value = tasks[indexActiveTask].title;
            document.getElementById('description').value = tasks[indexActiveTask].description;
            document.getElementById('priority').value = tasks[indexActiveTask].priority;
        }
    } else {
        document.getElementById('form-new-task').style.display = 'none';
    }
}

function visibleListItem(count) {
    document.getElementById('task-list-item-third').style.display = (count > 2) ? 'flex' : 'none';
    document.getElementById('task-list-item-second').style.display = (count > 1) ? 'flex' : 'none';
    document.getElementById('task-list-item-first').style.display = (count > 0) ? 'flex' : 'none';
}

function createForm() {
    visibleFormNewTask(true);
}

function validateTask(task) {
    if (task.title == undefined || task.title == null || task.title == '' ||
        task.description == undefined || task.description == null || task.description == '' ||
        task.priority == undefined || task.priority == null || task.priority == '') {
        return false;
    }
    return true;
}

function saveCreatedTask() {
    let task;
    if (indexActiveTask >= 0) {
        task = tasks[indexActiveTask];
    } else {
        task = createTask(document.getElementById('form_title').value, document.getElementById('description').value, document.getElementById('priority').value);
    }
    if (validateTask(task) == true) {
        if (indexActiveTask >= 0) {
            updateTask(indexActiveTask, task);
        } else {
            addTask(task);
        }
        visibleFormNewTask(false);
        updateTasksList(tasks);
        indexActiveTask = -1;
    } else {
        alert('Заполнить все поля!');
    }
}

function updateTaskItem(indexOfListItem, task) {
    let sufix = ['first', 'second', 'third'];
    document.getElementById('paragraph-title-' + sufix[indexOfListItem]).textContent = task.title;
    document.getElementById('paragraph-description-' + sufix[indexOfListItem]).textContent = task.description;
    document.getElementById('priority-' + sufix[indexOfListItem]).textContent = task.priority;
}

function updateTasksList(tasks) {
    if (tasks.length > 0) {
        updateTaskItem(0, tasks[0]);
    }
    if (tasks.length > 1) {
        updateTaskItem(1, tasks[1]);
    }
    if (tasks.length > 2) {
        updateTaskItem(2, tasks[2]);
    }
    visibleListItem(tasks.length);
}

function cancelCreatedTask() {
    visibleFormNewTask(false);
}


function getOffset(element) {
    var x = 0;
    var y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        x += element.offsetLeft - element.scrollLeft;
        y += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
    }
    return {
        top: y,
        left: x
    };
}

function showOptions(element) {
    document.getElementById('options').style.display = 'flex';
    let offset = getOffset(element);
    let optionElement = document.getElementById('options');
    optionElement.style.left = element.getBoundingClientRect().width + offset.left - optionElement.getBoundingClientRect().width + 'px';
    optionElement.style.top = element.offsetHeight + offset.top + 8 + 'px';
    if (element.id == 'options-first') {
        indexActiveTask = 0;
    } else if (element.id == 'options-second') {
        indexActiveTask = 1;
    } else {
        indexActiveTask = 2;
    }
}

function hideOptions(canClearIndex) {
    document.getElementById('options').style.display = 'none';
    if (canClearIndex) {
        indexActiveTask = -1;
    }
}

function doneTask() {
    tasks[indexActiveTask].status = 'done';
    hideOptions(true);
}

function deleteTask() {
    removeTask(indexActiveTask);
    updateTasksList(tasks);
    hideOptions(true);
}

function editTask() {
    visibleFormNewTask(true);
    hideOptions(false);
}