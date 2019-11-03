// Data repository

let tasks = [];
let taskIdSelectedTask = -1;
let freeTaskId = 0;
let filter = {
    title: undefined,
    priority: undefined,
    status: undefined
};

addTask(createTask('1', 'descr 1', 'low'));
addTask(createTask('2', 'descr 2', 'normal'));
addTask(createTask('3', 'descr 3', 'high'));
addTask(createTask('4', 'descr 4', 'low'));
addTask(createTask('5', 'descr 5', 'normal'));
addTask(createTask('6', 'descr 6', 'high'));

rebuildAllTaskListItems();

// Function for data repository

function createTask(aTitle, aDescription, aPriority) {
    return {
        id: getFreeTaskId(),
        title: aTitle,
        description: aDescription,
        priority: aPriority,
        status: 'open'
    };
}

function addTask(task) {
    tasks.push(task);
}

function getTask(taskId) {
    return tasks[getIndexOf(taskId)];
}

function getFreeTaskId() {
    return ++freeTaskId;
    // return tasks.length;
}

function getIndexOf(taskId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskId) {
            return i;
        }
    }
    return undefined;
}

function updateTask(taskId, task) {
    let index = getIndexOf(taskId);
    let id = tasks[index].id;
    tasks[index] = task;
    tasks[index] = id;
}

function updateTaskStatus(taskId, status) {
    tasks[getIndexOf(taskId)].status = status;
}

function deleteTask(taskId) {
    tasks.splice(getIndexOf(taskId), 1)
}

function validateTask(task) {
    return !(
        task.title === undefined || task.title == null || task.title === '' ||
        task.description === undefined || task.description === '' ||
        task.priority === undefined || task.priority === ''
    );
}

function forEachTask(func) {
    let i = 0;
    while (i < tasks.length) {
        if (passedFilter(tasks[i])) {
            let l = tasks.length;
            func(tasks[i].id, tasks[i]);
            if (tasks.length >= l) {
                i++;
            }
        } else {
            i++;
        }
    }
}

function setFilter(aTitle, aStatus, aPriority) {
    filter.title = (aTitle === '') ? undefined : aTitle;
    filter.status = (aStatus === 'all') ? undefined : aStatus;
    filter.priority = (aPriority === 'all') ? undefined : aPriority;
}

function passedFilter(task) {
    return ((filter.title === undefined) || (task.title.indexOf(filter.title) >= 0 )) &&
        ((filter.priority === undefined) || (filter.priority === task.priority)) &&
        ((filter.status === undefined) || (filter.status === task.status));
}


// Functions for Filter Conditional

function filterChanged() {
    deleteAllTaskListItems();
    setFilter(
        document.getElementById('filter-conditional-title').value,
        document.getElementById('filter-conditional-status').value,
        document.getElementById('filter-conditional-priority').value
    );
    rebuildAllTaskListItems();
}

function clickCreateTask() {
    setVisibleEditTaskItem(true);
}


// Functions for Edit Task Item

function updateEditTaskItem(task) {
    document.getElementById('edit-task-item-title').value = task.title;
    document.getElementById('edit-task-item-description').value = task.description;
    document.getElementById('edit-task-item-priority').value = task.priority;
}

function setVisibleEditTaskItem(isVisible) {
    if (isVisible) {
        document.getElementById('edit-task-item').style.display = 'flex';
    } else {
        document.getElementById('edit-task-item').style.display = 'none';
    }
}

function saveEditTaskItem() {
    let task = createTask(
        document.getElementById('edit-task-item-title').value,
        document.getElementById('edit-task-item-description').value,
        document.getElementById('edit-task-item-priority').value
    );
    console.log('edit 1 task = ' + task);
    if (validateTask(task)) {
        console.log('edit 2 task = ' + task);
        console.log('edit 2 tasks = ' + tasks);
        if (taskIdSelectedTask >= 0) {
            updateTask(taskIdSelectedTask, task);
            updateTaskListItem(taskIdSelectedTask, task);
        } else {
            addTask(task);
            addTaskListItem(task.id);
            updateTaskListItem(task.id, task);
        }
        console.log('edit 3 tasks = ' + tasks);
        setVisibleEditTaskItem(false);
        taskIdSelectedTask = -1;
    } else {
        alert('Заполнить все поля!');
    }
}

function clickSaveEditTaskItem() {
    saveEditTaskItem();
}

function clickCancelEditTaskItem() {
    setVisibleEditTaskItem(false);
}


// Functions for Task List Item

function appendTaskIdToElementId(element, taskId) {
    element.id = element.id + taskId;
}

function getChildById(element, id) {
    let elements = element.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].id === id) {
            return elements[i];
        }
    }
    return undefined;
}

function addTaskListItem(taskId) {
    let taskList = document.getElementById('task-list');
    let taskListItemTemplate = document.getElementById('task-list-item-template');
    let taskListItem = taskListItemTemplate.cloneNode(true);
    appendTaskIdToElementId(getChildById(taskListItem, 'task-list-item-title-'), taskId);
    appendTaskIdToElementId(getChildById(taskListItem, 'task-list-item-description-'), taskId);
    appendTaskIdToElementId(getChildById(taskListItem, 'task-list-item-priority-'), taskId);
    appendTaskIdToElementId(getChildById(taskListItem, 'task-list-item-options-'), taskId);
    taskListItem.id = 'task-list-item-' + taskId;
    taskListItem.style.display = 'flex';
    taskList.append(taskListItem);
}

function deleteTaskListItem(taskId) {
    let taskListItem = document.getElementById('task-list-item-' + taskId);
    if (taskListItem) taskListItem.remove();
}

function updateTaskListItem(taskId, task) {
    document.getElementById('task-list-item-title-' + taskId).textContent = task.title;
    document.getElementById('task-list-item-description-' + taskId).textContent = task.description;
    document.getElementById('task-list-item-priority-' + taskId).textContent = task.priority;
}

function deleteAllTaskListItems() {
    forEachTask((taskId, task) => {
        deleteTaskListItem(taskId);
    });
}

function rebuildAllTaskListItems() {
    forEachTask((taskId, task) => {
        addTaskListItem(taskId);
        updateTaskListItem(taskId, task)
    });
}

// Functions for Options

function getOffset(element) {
    let x = 0;
    let y = 0;
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
    taskIdSelectedTask = +element.id.slice('task-list-item-options-'.length);
}

function hideOptions(canClearTaskId) {
    document.getElementById('options').style.display = 'none';
    if (canClearTaskId) {
        taskIdSelectedTask = -1;
    }
}

function clickDoneTask() {
    updateTaskStatus(taskIdSelectedTask, 'done');
    hideOptions(true);
}

function clickDeleteTask() {
    if (taskIdSelectedTask < 0) return;
    deleteTaskListItem(taskIdSelectedTask);
    deleteTask(taskIdSelectedTask);
    hideOptions(true);
}

function clickEditTask() {
    if (taskIdSelectedTask < 0) return;
    setVisibleEditTaskItem(true);
    updateEditTaskItem(getTask(taskIdSelectedTask));
    hideOptions(false);
}

