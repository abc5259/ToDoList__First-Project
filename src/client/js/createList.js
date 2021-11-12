const board = document.querySelector("#board");
const addListForm = document.querySelector(".board__addList-form");
const addListInput = addListForm.querySelector("input");
const boardLists = document.querySelector(".board-lists");
let lists;
let moreLists;
let taskForms;
const tasks = document.querySelectorAll(".board-list__task");
if (boardLists.childNodes) {
  lists = document.querySelectorAll(".board-list");
  moreLists = document.querySelectorAll(".moreList");
  taskForms = document.querySelectorAll(".board-list__form");
}
let draggingList = null;
let currentdrag;
let target;

const updateList = async () => {
  const listTitle = draggingList.querySelector("h3").innerText;
  let currentIndex;
  boardLists.childNodes.forEach((lists, i) => {
    if (lists === draggingList) {
      return (currentIndex = i);
    }
  });
  await fetch(`/api/board/${board.dataset.id}/list/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listTitle,
      currentIndex,
    }),
  });
};

const handleDragOver = list => {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    draggingList = document.querySelector(".dragging");
    if (!draggingList) {
      return;
    }
    boardLists.childNodes.forEach((lists, i) => {
      if (lists === draggingList) {
        currentdrag = i;
      }
      if (lists === list) {
        target = i;
      }
    });
    if (currentdrag > target) {
      boardLists.insertBefore(draggingList, list);
    } else {
      boardLists.insertBefore(list, draggingList);
    }
  });
};

const registerEventsOnList = list => {
  list.addEventListener("dragstart", e => {
    //drag하는게 list가 아닌경우 리턴
    if (e.target !== e.currentTarget) {
      return;
    }
    list.classList.add("dragging");
  });
  list.addEventListener("dragend", e => {
    //drag하는게 list가 아닌경우 리턴
    if (e.target !== e.currentTarget) {
      return;
    }
    updateList();
    draggingList = null;
    list.classList.remove("dragging");
  });
};

const addListFront = (value, id) => {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.className = "board-list";
  li.draggable = true;
  li.innerHTML = `
    <div class="board-list__title"> 
      <input value=${value} class="hidden editInput" />
      <button class="hidden editBtn">edit</button> 
      <h3>${value}</h3>
      <i class="fas fa-ellipsis-h moreList"></i>
      <div class="pop__over">
          <div class="pop__over__header">
            <span>List actions</span>
            <i class="fas fa-times"></i>
          </div>
          <div class="pop__over__main">
              <div class="deleteList">
                <span>Delete List</span>
              </div>
              <div class="editList">
                <span>Edit List Title</span>
              </div>
          </div>
      </div>
    </div>
    <form class="board-list__form" method="POST">
      <input type="text" name="title" placeholder="카드의 제목 입력..." />
      <button>Add</button>
    </form>
    <div class="board-list__tasks">
    </div>
  `;
  boardLists.appendChild(li);
  //li에 drag and drop event 등록
  registerEventsOnList(li);
  handleDragOver(li);
  //form에 submit event 등록
  const taskForm = li.querySelector(".board-list__form");
  registerEventsOnTaskForm(taskForm);
  const moreList = li.querySelector(".moreList");
  registerEventsOnMoreList(moreList);
};

const handleSubmit = async e => {
  e.preventDefault();
  const id = board.dataset.id;
  const response = await fetch(`/api/board/${id}/list/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: addListInput.value,
    }),
  });
  const json = await response.json();
  if (response.status === 201) {
    addListFront(addListInput.value, json.listId);
    addListInput.value = "";
  }
};

const paintTask = async (taskTitle, form) => {
  if (taskTitle === "") {
    return;
  }
  const list = form.parentNode;
  const { id } = list.dataset;
  await fetch(`/api/list/${id}/task/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: taskTitle,
    }),
  });
  const task = document.createElement("div");
  task.className = "board-list__task";
  task.draggable = true;
  task.innerHTML = `
      <h6>${taskTitle}</h6>
      <i class="fas fa-edit"></i>
  `;
  list.children[2].appendChild(task);
};

const handleSubmitTask = e => {
  e.preventDefault();
  const input = e.currentTarget.querySelector("input");
  paintTask(input.value, e.currentTarget);
  input.value = "";
};

const registerEventsOnTaskForm = taskForm => {
  taskForm.addEventListener("submit", handleSubmitTask);
};

const handleCloseList = popOver => {
  popOver.classList.remove("isShow");
};

const handleDeleteList = async list => {
  const id = board.dataset.id;
  await fetch(`/api/board/${id}/list/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      listId: list.dataset.id,
    }),
  });
  list.remove();
};

const handlEditBtn = async (input, btn, h3) => {
  const { value: title } = input;
  const list = input.parentNode.parentNode;
  const { id } = list.dataset;
  console.log(id);
  const response = await fetch(`/api/list/${id}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.value,
    }),
  });
  if (response.status === 201) {
    input.classList.add("hidden");
    btn.classList.add("hidden");
    h3.innerText = title;
    h3.classList.remove("hidden");
  }
};

const handleEditList = list => {
  const { children } = list;
  const input = children[0];
  const btn = children[1];
  const h3 = children[2];
  const popOver = children[4];
  input.classList.remove("hidden");
  btn.classList.remove("hidden");
  h3.classList.add("hidden");
  popOver.classList.remove("isShow");
  btn.addEventListener("click", e => handlEditBtn(input, btn, h3));
};

const handleMoreList = e => {
  const popOver = e.currentTarget.nextElementSibling;
  popOver.classList.add("isShow");
  // close btn event
  const closeBtn = popOver.querySelector(".fas.fa-times");
  closeBtn.addEventListener("click", e => handleCloseList(popOver));
  // delete list event
  const deleteList = popOver.querySelector(".deleteList");
  deleteList.addEventListener("click", e =>
    handleDeleteList(popOver.parentNode.parentNode)
  );
  // edit list event
  const editList = popOver.querySelector(".editList");
  editList.addEventListener("click", e => handleEditList(popOver.parentNode));
};

const registerEventsOnMoreList = moreList => {
  moreList.addEventListener("click", handleMoreList);
};

const handleClickTask = e => {
  const task = e.currentTarget;
  const title = task.children[0].innerText;
  const taskModal = document.querySelector(".task__modal");
  const taskTitle = taskModal.querySelector(".task__modal__header-title h4");
  taskTitle.innerText = title;
  taskModal.parentNode.classList.add("show");
};

const registerEventsOnTask = task => {
  task.addEventListener("click", handleClickTask);
};

lists.forEach(list => {
  registerEventsOnList(list);
  handleDragOver(list);
});

moreLists.forEach(moreList => {
  registerEventsOnMoreList(moreList);
});

taskForms.forEach(taskForm => {
  registerEventsOnTaskForm(taskForm);
});

tasks.forEach(task => {
  registerEventsOnTask(task);
});

addListForm.addEventListener("submit", handleSubmit);
