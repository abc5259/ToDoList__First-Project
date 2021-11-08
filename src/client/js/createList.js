const board = document.querySelector("#board");
const addListForm = document.querySelector(".board__addList-form");
const addListInput = addListForm.querySelector("input");
const boardLists = document.querySelector(".board-lists");
let lists;
let moreLists;
let cardForms;
let cards;
if (boardLists.childNodes) {
  lists = document.querySelectorAll(".board-list");
  moreLists = document.querySelectorAll(".moreList");
  cardForms = document.querySelectorAll(".board-list__form");
}
if (boardLists.childNodes.length > 2) {
  cards = document.querySelectorAll(".board-list__tasks");
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

const addListFront = value => {
  const li = document.createElement("li");
  li.className = "board-list";
  li.draggable = true;
  li.innerHTML = `
    <div class="board-list__title">  
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
  `;
  boardLists.appendChild(li);
  //li에 drag and drop event 등록
  registerEventsOnList(li);
  handleDragOver(li);
  //form에 submit event 등록
  const cardForm = li.querySelector(".board-list__form");
  registerEventsOnCard(cardForm);
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
  if (response.status === 201) {
    addListFront(addListInput.value);
    addListInput.value = "";
  }
};

const paintCard = (cardTitle, form) => {
  const card = document.createElement("div");
  card.className = "board-list__task";
  card.draggable = true;
  card.innerHTML = `
      <h6>${cardTitle}</h6>
      <i class="fas fa-edit"></i>
  `;
  form.parentNode.childNodes[2].appendChild(card);
};

const handleSubmitCard = e => {
  e.preventDefault();
  const cardInput = e.currentTarget.querySelector("input");
  paintCard(cardInput.value, e.currentTarget);
  cardInput.value = "";
};

const registerEventsOnCard = cardForm => {
  cardForm.addEventListener("submit", handleSubmitCard);
};

const handleCloseList = e => {
  e.currentTarget.parentNode.parentNode.classList.remove("isShow");
};

const handleDeleteList = async e => {
  const list = e.currentTarget.parentNode.parentNode.parentNode.parentNode;
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

const handleMoreList = e => {
  const popOver = e.currentTarget.nextElementSibling;
  popOver.classList.add("isShow");
  const closeBtn = popOver.querySelector(".fas.fa-times");
  closeBtn.addEventListener("click", handleCloseList);
  const deleteList = popOver.querySelector(".deleteList");
  deleteList.addEventListener("click", handleDeleteList);
};

const registerEventsOnMoreList = moreList => {
  moreList.addEventListener("click", handleMoreList);
};

lists.forEach(list => {
  registerEventsOnList(list);
  handleDragOver(list);
});

moreLists.forEach(moreList => {
  registerEventsOnMoreList(moreList);
});

cardForms.forEach(cardForm => {
  registerEventsOnCard(cardForm);
});

// cards.forEach(card => {});

addListForm.addEventListener("submit", handleSubmit);
