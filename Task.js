// app.js

const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.innerHTML = ''; // Clear the current task list
    tasks.forEach((task, index) => {
        createTaskElement(task, index);
    });
}

// Create a task element
function createTaskElement(taskText, index) {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-index', index);
    li.textContent = taskText;

    // Create edit and delete buttons
    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    const editButton = document.createElement('button');
    editButton.classList.add('edit-btn');
    editButton.textContent = 'Edit';
    editButton.onclick = () => editTask(index);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(index);

    taskButtons.appendChild(editButton);
    taskButtons.appendChild(deleteButton);
    li.appendChild(taskButtons);

    // Add drag-and-drop event listeners
    li.addEventListener('dragstart', (e) => handleDragStart(e));
    li.addEventListener('dragover', (e) => handleDragOver(e));
    li.addEventListener('drop', (e) => handleDrop(e));

    taskList.appendChild(li);
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
        taskInput.value = ''; // Clear input
    }
}

// Edit a task
function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTaskText = prompt('Edit your task:', tasks[index]);
    if (newTaskText !== null && newTaskText.trim() !== '') {
        tasks[index] = newTaskText.trim();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

// Delete a task
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.splice(index, 1); // Remove the task
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Handle drag start
let draggedItem = null;
function handleDragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = 'move';
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    if (draggedItem !== e.target) {
        const allTasks = [...taskList.children];
        const draggedIndex = Array.from(taskList.children).indexOf(draggedItem);
        const targetIndex = allTasks.indexOf(e.target);

        if (draggedIndex < targetIndex) {
            taskList.insertBefore(draggedItem, e.target.nextSibling);
        } else {
            taskList.insertBefore(draggedItem, e.target);
        }

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(targetIndex, 0, tasks.splice(draggedIndex, 1)[0]);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    draggedItem = null;
}

// Event listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial load
loadTasks();
