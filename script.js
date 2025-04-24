const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
let currentDay = "";

const weekTasks = {
  Sunday: [], Monday: [], Tuesday: [], Wednesday: [],
  Thursday: [], Friday: [], Saturday: []
};

function showTasks(day) {
  currentDay = day;
  document.getElementById("day-title").textContent = `${day}'s Tasks`;
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  weekTasks[currentDay].forEach((task, index) => {
    const li = document.createElement("li");
    li.draggable = true;
    if (task.completed) li.classList.add("completed");

    li.ondragstart = () => {
      li.classList.add("dragging");
      li.dataset.index = index;
    };

    li.ondragend = () => li.classList.remove("dragging");

    li.ondragover = (e) => e.preventDefault();

    li.ondrop = () => {
      const fromIndex = +document.querySelector(".dragging").dataset.index;
      const toIndex = index;
      const movedItem = weekTasks[currentDay].splice(fromIndex, 1)[0];
      weekTasks[currentDay].splice(toIndex, 0, movedItem);
      renderTasks();
    };

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onclick = () => {
      task.completed = !task.completed;
      renderTasks();
    };

    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.marginRight = "auto";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => {
      const newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim()) {
        task.text = newText;
        renderTasks();
      }
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete";
    delBtn.onclick = () => {
      const confirmDelete = confirm("Are you sure you want to delete this task?");
      if (confirmDelete) {
        weekTasks[currentDay].splice(index, 1);
        renderTasks();
      }
    };

    const controls = document.createElement("div");
    controls.className = "task-controls";
    controls.appendChild(editBtn);
    controls.appendChild(delBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(controls);

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (text && currentDay) {
    weekTasks[currentDay].push({ text, completed: false });
    taskInput.value = "";
    renderTasks();
  }
}