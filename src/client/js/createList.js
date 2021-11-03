const board = document.querySelector("#board");
const addListForm = document.querySelector(".board__addList-form");
const addListInput = addListForm.querySelector("input");
const boardLists = document.querySelector(".board-lists");

const addListFront = value => {
  const li = document.createElement("li");
  li.className = "board-list ";
  li.innerHTML = `
    <div class="board-list__title">  
      <h3>${addListInput.value}</h3>
      <i class="fas fa-ellipsis-h"></i>
    </div>
    <form class="board-list__form" method="POST">
      <input type="text" name="title" placeholder="카드의 제목 입력..." />
      <button>Add</button>
    </form>
  `;
  boardLists.appendChild(li);
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

addListForm.addEventListener("submit", handleSubmit);
