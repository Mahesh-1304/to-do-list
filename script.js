let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text) return showToast("Task cannot be empty!");

  tasks.push({ text, completed: false, dueDate });
  taskInput.value = "";
  dueDateInput.value = "";
  saveAndRender();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveAndRender();
  }
}

function deleteTask(index) {
  if (confirm("Are you sure to delete this task?")) {
    tasks.splice(index, 1);
    saveAndRender();
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function filterTasks() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("filterStatus").value;
  const filtered = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search);
    const matchesStatus =
      status === "all" ||
      (status === "active" && !task.completed) ||
      (status === "completed" && task.completed);
    return matchesSearch && matchesStatus;
  });
  renderTasks(filtered);
}

function renderTasks(list = tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  list.forEach((task, index) => {
    const li = document.createElement("li");
    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(index);

    const span = document.createElement("span");
    span.textContent = task.text + (task.dueDate ? ` (Due: ${task.dueDate})` : "");

    taskInfo.appendChild(checkbox);
    taskInfo.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(index);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(taskInfo);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  document.getElementById("progressBar").value = percent;
  document.getElementById("progressText").textContent = `${percent}% Completed`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => (toast.className = "toast"), 3000);
}

document.getElementById("darkModeToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("dark", e.target.checked);
});

renderTasks();
