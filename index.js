"use strict";

// Variables
const STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const replaceTaskInLocalStorage = (editedTask) => {
  const tasks = getTasksFromLocalStorage();
  tasks.splice(editedTask, 0, isEdited);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

const removeTaskFromLocalStorage = (deletedTask) => {
  const tasks = getTasksFromLocalStorage();

  // other variant .filter
  tasks.splice(deletedTask, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task;

    const taskText = document.createElement("span");
    taskText.className = "delete-item";
    taskText.innerHTML = ` X `;
    li.append(taskText);

    const taskEdit = document.createElement("span");
    taskEdit.className = "edit-item";
    taskEdit.innerHTML = `<i class="fas fa-edit"></i>`;
    li.append(taskEdit);
    
    // Append li to ul
    taskList.append(li);
  });
};

const addTask = (event) => {
  event.preventDefault();

  // Пусте значення або пробіли
  if (taskInput.value.trim() === "") {
    return;
  }

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; // значення яке ввів користувач

  const taskText = document.createElement("span");
  taskText.className = "delete-item";
  taskText.innerHTML = ` X `;
  li.append(taskText);

  const taskEdit = document.createElement("span");
  taskEdit.className = "edit-item";
  taskEdit.innerHTML = `<i class="fas fa-edit"></i>`;
  li.append(taskEdit);

  taskList.append(li);

  // Save to storage
  storeTaskInLocalStorage(taskInput.value);

  // Clear input value
  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("delete-item");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      // remove from DOM
      // console.log(event.target.parentElement.parentElement);
      const deletedLi = event.target.closest("li");
      deletedLi.remove();
      let tasksArray = Array.from(taskList.children)
      let totallyDeleted = tasksArray.indexOf(deletedLi);

      removeTaskFromLocalStorage(totallyDeleted);
    }
  }
};

const editTask = (event) => {
  let isEditIcon = event.target.classList.contains("edit-item");
  
  if (isEditIcon) {
    const isEdited = prompt("Введіть нову задачу");
    
    if (isEdited) {
      const prevLi = event.target.closest("li");
      prevLi.replaceWith(isEdited);
      let tasksArray = Array.from(taskList.children)
      let editedTask = tasksArray.indexOf(prevLi);

      replaceTaskInLocalStorage(editedTask);
    } 
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      // task.style.display = "block"; // task.hidden = true
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

// init
getTasks();

// Event listeners

// document.addEventListener("DOMContentLoaded", () => {
//   getTasks();
// });

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

taskList.addEventListener("click", editTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);

console.log(taskList)