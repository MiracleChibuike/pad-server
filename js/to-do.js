

// Show task form
const buttonShowTodo = document.getElementById("displayTodo");
const cancelTask = document.getElementById("cancelTask");
let taskContainer = document.querySelector(".task-ContainerMain");
buttonShowTodo.addEventListener("click", () => {
    taskContainer.style.visibility = "visible";
});

//Hide the To-do
cancelTask.addEventListener("click", () => {
    taskContainer.style.visibility = "hidden"
});

