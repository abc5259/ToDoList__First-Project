const createBoardElem = document.querySelector(".boards__create");
const modal = document.querySelector(".modal");
const deleteBtn = document.querySelector(".modal__delete");
const backgroundColorlists = document.querySelector(
  ".boards__create-backgroundColors"
);
const formElem = document.querySelector(".boards__create-modal");
const inputElem = formElem.querySelector("input");

let currentColorElem = document.querySelector("li[data-color='#0079bf']");
const clickCreateBoard = e => {
  modal.classList.add("show");
};

const handleModalClick = e => {
  const { target } = e;
  if (target.classList.contains("show")) {
    modal.classList.remove("show");
  }
};

const handleDeleteBtn = () => {
  modal.classList.remove("show");
};

const selectColor = e => {
  const modalHeader = document.querySelector(".boards__create-modal__header");
  const { target } = e;
  if (target.classList.contains("boards__create-backgroundColor")) {
    if (currentColorElem.innerHTML) {
      currentColorElem.innerHTML = "";
    }
    currentColorElem = target;
    const {
      dataset: { color },
    } = target;
    target.innerHTML = `
      <i class="fas fa-check"></i>
    `;
    modalHeader.style.backgroundColor = `${color}`;
  }
};

const handleCreateBoard = async e => {
  e.preventDefault();
  const backgroundColor = currentColorElem.dataset.color;
  const title = inputElem.value;
  console.log(backgroundColor, title);
  const response = await fetch("/api/board/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      backgroundColor,
      title,
    }),
  });
  const json = await response.json();
  console.log(json);
  if (response.status === 201) {
    console.log("ds");
    const a = document.createElement("a");
    a.href = `/boards/${json.board._id}`;
    a.click();
  }
};

createBoardElem.addEventListener("click", clickCreateBoard);
modal.addEventListener("click", handleModalClick);
deleteBtn.addEventListener("click", handleDeleteBtn);
backgroundColorlists.addEventListener("click", selectColor);
formElem.addEventListener("submit", handleCreateBoard);
