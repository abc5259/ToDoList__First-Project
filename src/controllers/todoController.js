export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const watch = (req, res) => {
  res.send("watch");
};
