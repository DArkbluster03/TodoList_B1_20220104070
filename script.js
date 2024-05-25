const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter != todo.status) {
    return '';
  }
  let checked = todo.status == "completed" ? "checked" : "";
  return /* html */ `
    <li class="todo" draggable="true" data-index="${index}" ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)" ondragend="dragEnd(event)">
      <label for="${index}">
        <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="edit-button" onclick="toggleDropdown(${index})"><i class="fas fa-ellipsis-h"></i></button>
      <div id="dropdown-${index}" class="dropdown">
        <a href="#" onclick="editTask(${index})"><i class="fas fa-pencil-alt"></i></a>
        <a href="#" onclick="remove(${index})"><i class="fas fa-trash-alt"></i></a>
      </div>
    </li>
  `; 
}

function showTodos() {
  if (todosJson.length == 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", e => {
  let todo = input.value.trim();
  if (!todo || e.key != "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

function updateStatus(todo) {
  let todoName = todo.parentElement.lastElementChild;
  if (todo.checked) {
    todoName.classList.add("checked");
    todosJson[todo.id].status = "completed";
  } else {
    todoName.classList.remove("checked");
    todosJson[todo.id].status = "pending";
  }
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function remove(index) {
  todosJson.splice(index, 1);
  showTodos();
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

function editTask(index) {
  const newTask = prompt("Edit your task:", todosJson[index].name);
  if (newTask !== null && newTask.trim() !== "") {
    todosJson[index].name = newTask.trim();
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
  }
}

function toggleDropdown(index) {
  const dropdown = document.getElementById(`dropdown-${index}`);
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

filters.forEach(function (el) {
  el.addEventListener("click", (e) => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      filter = '';
    } else {
      filters.forEach(tag => tag.classList.remove('active'));
      el.classList.add('active');
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

// Drag and Drop Functions
let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  event.dataTransfer.setData('text/html', draggedItem.innerHTML);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  if (event.target.className === "todo") {
    draggedItem.innerHTML = event.target.innerHTML;
    event.target.innerHTML = event.dataTransfer.getData('text/html');
    updateTodosOrder();
  }
}

function dragEnd(event) {
  draggedItem = null;
}

function updateTodosOrder() {
  const todos = Array.from(document.querySelectorAll(".todo"));
  const newTodosJson = todos.map(todo => {
    const index = parseInt(todo.getAttribute("data-index"));
    return todosJson[index];
  });
  todosJson = newTodosJson;
  localStorage.setItem("todos", JSON.stringify(todosJson));
}
