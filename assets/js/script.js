// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    localStorage.setItem("nextId", nextId + 1);
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    var backgroundColor = '' 
    if (task.status === "to-do") {
        backgroundColor = 'red'
    } else if (task.status === "in-progress") {
        backgroundColor = 'orange'
    } else if (task.status === "done") {
        backgroundColor = 'green'
    }
    return `
    <div class="task-card ${backgroundColor}" data-id="${task.id}">
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Due: ${task.dueDate}</p>
        <button class="delete-task">Delete</button>
    </div>
`;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        if (task.status === "to-do") {
            $("#todo-cards").append(taskCard);
        } else if (task.status === "in-progress") {
            $("#in-progress-cards").append(taskCard);
        } else if (task.status === "done") {
            $("#done-cards").append(taskCard);
        }
    });
    $(".task-card").draggable({
        revert: "invalid"
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const title = $("#taskTitle").val();
    const description = $("#taskDescription").val();
    const dueDate = $("#taskDueDate").val();
    const newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status: "to-do"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $("#formModal").modal('hide');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest(".task-card").data("id");
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data("id");
    const newStatus = $(event.target).closest(".lane").attr("id");
    const task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#taskForm").on("submit", handleAddTask);
    $(".container").on("click", ".delete-task", handleDeleteTask);
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
});