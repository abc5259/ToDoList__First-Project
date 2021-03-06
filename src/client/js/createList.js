const board = document.querySelector("#board");
const addListForm = document.querySelector(".board__addList-form");
const addListInput = addListForm.querySelector("input");
const boardLists = document.querySelector(".board-lists");
let lists;
let moreLists;
let taskForms;
let tasksWrappers;
let tasks;
if (boardLists.childNodes) {
  lists = document.querySelectorAll(".board-list");
  moreLists = document.querySelectorAll(".moreList");
  taskForms = document.querySelectorAll(".board-list__form");
  tasksWrappers = document.querySelectorAll(".board-list__tasks");
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
  // taskWrapper에 dragover event 등록
  const taskWrapper = li.querySelector(".board-list__tasks");
  taskWrapper.addEventListener("dragover", handleTaskDragOver);
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
  const response = await fetch(`/api/list/${id}/task/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: taskTitle,
    }),
  });
  const json = await response.json();
  if (response.status === 201) {
    const { taskId } = json;
    const task = document.createElement("div");
    task.dataset.id = taskId;
    task.className = "board-list__task";
    task.draggable = true;
    task.innerHTML = `
      <div class="labels hidden"></div>
      <h6>${taskTitle}</h6>
      <i class="fas fa-edit"></i>
    `;
    list.children[2].appendChild(task);
    registerEventsOnTask(task);
  }
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

const handleTaskModal = e => {
  if (e.target.classList.contains("show")) {
    const modal = e.target;
    modal.dataset.id = "";
    e.target.classList.remove("show");
  }
};

const closeTaskModal = modal => {
  modal.dataset.id = "";
  modal.classList.remove("show");
};

const handleDeleteTask = async (listId, taskId, modal) => {
  const task = document.querySelector(`.board-list__task[data-id="${taskId}"]`);
  await fetch(`/api/list/${listId}/task/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      taskId,
    }),
  });
  task.remove();
  closeTaskModal(modal);
};

const handleShowTitle = (e, title) => {
  e.currentTarget.classList.add("hidden");
  title.classList.remove("hidden");
};

const handleEnterKey = async e => {
  if (e.keyCode === 13) {
    const input = e.currentTarget;
    if (input.value === "") {
      return;
    }
    const modal = document.querySelector(".modal");
    const { value: inputValue } = input;
    const { id } = modal.dataset;
    const response = await fetch(`/api/task/${id}/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputValue,
      }),
    });
    const title = document.querySelector(".task__modal__header-title h4");
    const task = document.querySelector(
      `.board-list__task[data-id="${id}"] h6`
    );
    task.innerText = inputValue;
    title.innerText = inputValue;
    title.classList.remove("hidden");
    input.classList.add("hidden");
  }
};

const clickTaskHeader = (e, taskId) => {
  const [i, title, input] = e.currentTarget.children;
  input.value = title.innerText;
  title.classList.add("hidden");
  input.classList.remove("hidden");
  input.focus();
  input.addEventListener("blur", e => handleShowTitle(e, title));
  input.addEventListener("keyup", handleEnterKey);
};

const descriptionBtnClick = async e => {
  const modal = document.querySelector(".modal");
  const textarea = document.querySelector(
    ".task__modal__description__content textarea"
  );
  const description = textarea.value;
  // if (description === "") return;
  await fetch(`/api/task/${modal.dataset.id}/edit-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
    }),
  });
};

const clickLabelBtn = async e => {
  const labelWrapper = e.currentTarget.parentElement;
  const { id: taskId } =
    labelWrapper.parentElement.parentElement.parentElement.dataset;
  const [chooseLabel, currentLabel] = labelWrapper.children;
  const input = chooseLabel.querySelector("input");
  let labelColor = input.value;
  // 백엔드로 task label craete하기
  const response = await fetch(`/api/task/${taskId}/edit-label`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      labelColor,
    }),
  });
  currentLabel.children[1].style.backgroundColor = labelColor;
  currentLabel.classList.remove("hidden");

  const currentTask = document.querySelector(
    `.board-list__task[data-id="${taskId}"] .labels`
  );
  currentTask.style.backgroundColor = labelColor;
  currentTask.classList.remove("hidden");
};

const handleClickTask = async e => {
  console.log("click");
  const task = e.currentTarget;
  const { id } = task.dataset;
  const response = await fetch(`/api/task/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (response.status === 201) {
    const {
      title,
      description,
      list: listId,
      _id: taskId,
      labelColor,
    } = json.task;
    const taskModal = document.querySelector(".task__modal");
    const modal = taskModal.parentNode;
    const taskTitle = taskModal.querySelector(".task__modal__header-title h4");
    const taskDescription = taskModal.querySelector(
      ".task__modal__description__content textarea"
    );
    const currentLabel = taskModal.querySelector(".task__modal__label-current");
    const taskLabel = task.children[0];
    if (labelColor) {
      currentLabel.classList.remove("hidden");
      currentLabel.children[1].style.backgroundColor = labelColor;
    } else {
      if (taskLabel.classList.contains("hidden")) {
        currentLabel.classList.add("hidden");
      } else {
        currentLabel.classList.remove("hidden");
        currentLabel.children[1].style.backgroundColor =
          taskLabel.style.backgroundColor;
      }
    }
    taskTitle.innerText = title;
    taskDescription.value = description;
    modal.dataset.id = taskId;
    // Open Task Modal
    modal.classList.add("show");

    // close Task Modal
    modal.addEventListener("click", handleTaskModal);
    const modalCloseBtn = taskModal.querySelector(".task__modal__close");
    modalCloseBtn.addEventListener("click", e => closeTaskModal(modal));

    // Edit Task Title
    const taskHeader = document.querySelector(".task__modal__header-title");
    taskHeader.addEventListener("click", e => clickTaskHeader(e, taskId));

    //Edit labelColor
    const labelBtn = taskModal.querySelector(".task__modal__label button");
    labelBtn.addEventListener("click", clickLabelBtn);

    // Edit Task Description
    const descriptionBtn = document.querySelector(
      ".task__modal__description__button button"
    );
    descriptionBtn.addEventListener("click", descriptionBtnClick);

    // Delete Task
    const deleteTask = taskModal.querySelector(".deleteTask");
    deleteTask.addEventListener(
      "click",
      e => handleDeleteTask(listId, taskId, modal),
      { once: true }
    );
  }
};

const registerEventsOnTask = task => {
  task.addEventListener("click", handleClickTask);
  task.addEventListener("dragstart", e => {
    task.classList.add("draggingTask");
  });
  task.addEventListener("dragend", async e => {
    const currentList = task.parentNode.parentNode;
    const { id } = currentList.dataset;
    const taskIndex = [...task.parentNode.children].indexOf(task);
    const response = await fetch(`/api/list/${id}/task/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: task.dataset.id,
        taskIndex,
      }),
    });
    if (response.status === 201) {
      task.classList.remove("draggingTask");
    }
  });
};

const getTaskAfterDraggingTask = (tasksWrapper, yDraggingTask) => {
  let notDraggingTasks = [
    ...tasksWrapper.querySelectorAll(".board-list__task:not(.draggingTask)"),
  ];
  return notDraggingTasks.reduce(
    (closestTask, nextTask) => {
      let nextTaskRect = nextTask.getBoundingClientRect();
      let offset = yDraggingTask - nextTaskRect.top - nextTaskRect.height / 2;

      if (offset < 0 && offset > closestTask.offset) {
        return { offset, element: nextTask };
      } else {
        return closestTask;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
};

const handleTaskDragOver = e => {
  e.preventDefault();
  let draggingTask = document.querySelector(".draggingTask");
  if (!draggingTask) {
    return;
  }
  let taskAfterDraggingTask = getTaskAfterDraggingTask(
    e.currentTarget,
    e.clientY
  );
  if (taskAfterDraggingTask) {
    taskAfterDraggingTask.parentNode.insertBefore(
      draggingTask,
      taskAfterDraggingTask
    );
  } else {
    e.currentTarget.appendChild(draggingTask);
  }
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

tasksWrappers.forEach(tasksWrapper => {
  if (tasksWrapper.childNodes) {
    tasks = tasksWrapper.querySelectorAll(".board-list__task");
    tasks.forEach(task => {
      registerEventsOnTask(task);
    });
  }
  tasksWrapper.addEventListener("dragover", handleTaskDragOver);
});

addListForm.addEventListener("submit", handleSubmit);
