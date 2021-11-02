const createBoardElem = document.querySelector(".boards__create");
const modal = document.querySelector(".modal");
const deleteBtn = document.querySelector(".modal__delete");
const backgroundColorlists = document.querySelector(
  ".boards__create-backgroundColors"
);
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

createBoardElem.addEventListener("click", clickCreateBoard);
modal.addEventListener("click", handleModalClick);
deleteBtn.addEventListener("click", handleDeleteBtn);
backgroundColorlists.addEventListener("click", selectColor);
