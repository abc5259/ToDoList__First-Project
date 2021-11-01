//root

export const join = (req, res) => {
  res.render("join", { pageTitle: "join" });
};

export const login = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const logout = (req, res) => {
  res.send("logout");
};

//user

export const profile = (req, res) => {
  res.render("user/profile", { pageTitle: "Profile" });
};

export const edit = (req, res) => {
  res.render("user/edit", { pageTitle: "User Edit" });
};

export const changePassword = (req, res) => {
  res.render("user/change-password", { pageTitle: "Change Password" });
};
