const board = document.querySelector("#board");
const addListForm = document.querySelector(".board__addList-form");
const addListInput = addListForm.querySelector("input");
const boardLists = document.querySelector(".board-lists");
let lists;
if (boardLists.childNodes) {
  lists = document.querySelectorAll(".board-list");
}

let draggingCard = null;
let currentdrag;
let target;

const handleDragOver = list => {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    boardLists.childNodes.forEach((lists, i) => {
      if (lists === draggingCard) {
        currentdrag = i;
      }
      if (lists === list) {
        target = i;
      }
    });
    console.log(currentdrag, target);
    if (currentdrag > target) {
      boardLists.insertBefore(draggingCard, list);
    } else {
      boardLists.insertBefore(list, draggingCard);
    }
  });
};

const registerEventsOnList = list => {
  list.addEventListener("dragstart", e => {
    draggingCard = e.currentTarget;
    list.classList.add("dragging");
  });

  list.addEventListener("dragend", e => {
    draggingCard = null;
    list.classList.remove("dragging");
  });
};

const addListFront = value => {
  const li = document.createElement("li");
  li.className = "board-list ";
  li.draggable = true;
  li.innerHTML = `
    <div class="board-list__title">  
      <h3>${value}</h3>
      <i class="fas fa-ellipsis-h"></i>
    </div>
    <form class="board-list__form" method="POST">
      <input type="text" name="title" placeholder="카드의 제목 입력..." />
      <button>Add</button>
    </form>
  `;
  boardLists.appendChild(li);
  registerEventsOnList(li);
  handleDragOver(li);
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
  if (response.status === 201) {
    addListFront(addListInput.value);
    addListInput.value = "";
  }
};

lists.forEach(list => {
  registerEventsOnList(list);
  handleDragOver(list);
});

addListForm.addEventListener("submit", handleSubmit);
