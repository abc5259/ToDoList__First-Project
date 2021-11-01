//root

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

//board

export const watch = (req, res) => {
  res.render("board/watch", { pageTitle: "Board Watch" });
};
