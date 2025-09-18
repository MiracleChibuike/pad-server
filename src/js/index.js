
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


// Create a function to POST a to-do to the server
let formTodo = document.getElementById("todoForm");// Store the Form Element
const createTodo = async () => {
    try {
        // store the form inputs using the form Object
        let todoData = new FormData(formTodo);
        // Create an object to store the values
        let todoObject =Object.fromEntries(todoData);
        console.log(todoObject);
        // Make a POST request to send the todo to the server
        let response = await fetch("http://localhost:3000/todos", {
            method: "POST", 
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todoObject)
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`)
        };
        // Variable to retrieve success call
        let result = await response.json(); // Convert reult to json ()
        console.log(result);
        alert('Task created succesfully')
        formTodo.reset(); // refresh the form
    } catch (err) {
          let tableBody = document.getElementById("table_Body");
          tableBody.innerHTML = `
           <tr>
           <td colspan="7">${err}</td>
           </tr>
           `;
           alert(err)
        console.error(err)
    }
};

formTodo.addEventListener("submit", (ev) => {
    ev.preventDefault();
    createTodo();
});

// Fetch all tasks
const fetchAllTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      if (!response.ok) {
        throw new Error(
          `Server Error: ${response.status} - ${response.statusText}`
        );
      }
      const result = await response.json();
      console.log(result);
      displayTasks(result)
    } catch (error) {
        
    }
};

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchAllTasks);

// Display Tasks
const displayTasks = async (result) => {
    try {
        result.forEach((task, index) => {
            let tableBody = document.getElementById("table_Body"); // store tbody
            tableBody.innerHTML += `
                <tr>
                                <td>${index + 1}</td>
                                <td>${task.Task_Title}</td>
                                <td>${task.Task_Note}</td>
                                <td>${task.Date}</td>
                                <td>${task.priority}</td>
                                <td><button id="bgstatus" class=" badge bg-success shadow">${
                                  task.Status
                                }</button></td>
                                <td><button title="View Task" onclick="viewTask('${
                                  task.id
                                }')">👁️</button>
                                    <button title="Edit Task" onclick="openUpdateModal('${task.id}')">✏️</button>
                                    <button title="Delete Task" onclick="deleteTask('${
                                      task.id
                                    }')">🗑️</button>
                                </td>
                            </tr>
            `;
            const statusBtn = tableBody.querySelectorAll("#bgstatus")[index];
            if (task.Status === "Pending") {
                statusBtn.classList.remove("bg-success");
                statusBtn.classList.add("bg-warning");
                statusBtn.style.color = "#303030";
            } else if (task.Status === "Completed") {
                statusBtn.classList.remove("bg-warning");
                statusBtn.classList.add("bg-secondary");
                statusBtn.style.color = "#fff";
            } else {
                statusBtn.classList.remove("bg-success", "bg-warning");
                statusBtn.classList.add("bg-primary");
                statusBtn.style.color = "#fff";
            }
        });
    } catch (err) {
           let tableBody = document.getElementById("table_Body");
           tableBody.innerHTML = `
           <tr>
           <td colspan="7">${err}</td>
           </tr>
           `
    }
};

// Create a function to View the To-do
const viewTask = async (task_id) => {
    // alert(task_id)
    console.log(task_id);
    try {
        const response = await fetch(`http://localhost:3000/todos/${task_id}`);
        if (!response) {
            throw new Error("Error");
        }
        // Convert response to Json
        const data = await response.json();
        // Define the conainer to view the form
        let containerView = document.querySelector(".viewTask");
        containerView.style.visibility = "visible";
        containerView.scrollIntoView({behavior: "smooth"});
        // Define inputs of the form to view
        let taskID = document.getElementById("task_ID");
        let taskTitle = document.getElementById("taskTitle");
        let taskNote = document.getElementById("task");
        let dateTask = document.getElementById("date_task");
        let priority = document.getElementById("priority");
        let status = document.getElementById("Status");
        // Prefill the inputs with the data being fetched
        taskID.value = data.id;
        taskTitle.value = data.Task_Title;
        taskNote.value = data.Task_Note;
        dateTask.value = data.Date;
        priority.value = data.priority;
        status.value = data.Status;
    } catch (err) {
        console.error(err)
    }
};

// Close View Modal
let closeTask = () => {
    document.querySelector(".viewTask").style.visibility = "hidden";
};

// Function to DELETE a task

const deleteTask = async (task_id) => {

    
   try {
      
        const confirmTask = confirm(
          "Are you sure you want to delete this task?"
        );
        if (!confirmTask) {
          alert("Operation cancelled. User changed his mind");
        } else {
          const response = await fetch(
            `http://localhost:3000/todos/${task_id}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error(
              `Unable to delete task: ${(response.status, response.statusText)}`
            );
          }

          const result = await response.json();
          alert("Task deleted succesfully");
        }
   } catch (err) {
    alert(err)
   }
};

//Prepare task for updating
const openUpdateModal = async (task_id) => {
  let updateContainer = document.querySelector(".updateTask");
  let updateID = document.getElementById("task_ID_Update");
  let titleUpdate = document.getElementById("taskTitle_Update");
  let taskNoteUpdate = document.getElementById("task_Update");
  let dateUpdate = document.getElementById("date_task_update");
  let priorityUpdate = document.getElementById("priority_update");
  let statusUpdate = document.getElementById("Status_update");

  updateContainer.style.visibility = "visible";

  document.getElementById("updateTask").addEventListener("click", () => {
    updateTask(task_id)
  });

  try {
    const API_URL = `http://localhost:3000/todos/${task_id}`;

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
    };

    const result = await response.json();
    updateID.value = result.id;
    titleUpdate.value = result.Task_Title;
    taskNoteUpdate.value = result.Task_Note;
    dateUpdate.value = result.Date;
    priorityUpdate.value = result.priority;
    statusUpdate.value = result.Status
  } catch (err) {
    alert(err)
  }
}




const updateTask = async (task_id) => {
  let updateContainer = document.querySelector(".updateTask");
  let updateID = document.getElementById("task_ID_Update");
  let titleUpdate = document.getElementById("taskTitle_Update");
  let taskNoteUpdate = document.getElementById("task_Update");
  let dateUpdate = document.getElementById("date_task_update");
  let priorityUpdate = document.getElementById("priority_update");
  let statusUpdate = document.getElementById("Status_update");
  let taskBody = {
    Task_Title: titleUpdate.value,
    Task_Note: taskNoteUpdate.value,
    Date: dateUpdate.value,
    priority: priorityUpdate.value,
    Status: statusUpdate.value
  };
  try {
    const API_URL = `http://localhost:3000/todos/${task_id}`;
    const updateResponse = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskBody)
    });

    if (!updateResponse.ok) {
      throw new Error(`Error: ${updateResponse.status}`);
    }

    const data = updateResponse.json();

    if (data) {
      alert("Updated successfully")
    }
  } catch (err) {
    alert(err)
  }
}