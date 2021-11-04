let currentdrag;
let target;

export const drogandDrop = () => {
  const lists = document.querySelectorAll(".board-list");
  const ul = document.querySelector(".board-lists");
  lists.forEach(list => {
    console.log(list);
    registerEventsOnList(list);
    list.addEventListener("dragover", e => {
      e.preventDefault();
      let draggingCard = document.querySelector(".dragging");
      ul.childNodes.forEach((lists, i) => {
        if (lists === draggingCard) {
          currentdrag = i;
        }
        if (lists === list) {
          target = i;
        }
      });
      console.log(currentdrag, target);
      if (currentdrag > target) {
        ul.insertBefore(draggingCard, list);
      } else {
        ul.insertBefore(list, draggingCard);
      }
    });
  });
};

function registerEventsOnList(list) {
  list.addEventListener("dragstart", e => {
    console.log("dragstart");
    list.classList.add("dragging");
  });

  list.addEventListener("dragend", e => {
    console.log("dragend");
    list.classList.remove("dragging");
  });
}

drogandDrop();
