import bcrypt from "bcrypt";
import User from "../models/User";

//root
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, name, password, password2 } = req.body;
  //같은 이메일 있는 유저 있으면 X
  const emailExist = await User.exists({ email });
  if (emailExist) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "이미 존재하는 email입니다.",
    });
  }
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "패스워드가 일치하지 않습니다",
    });
  }
  await User.create({
    email,
    name,
    password,
  });
  console.log(req.session);
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  //password맞는지 확인
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).render("login", {
      pageTitle: "Login",
      errorMessage: "존재하지 않는 이메일입니다.",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(404).render("login", {
      pageTitle: "Login",
      errorMessage: "패스워드가 틀립니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

//user

export const profile = (req, res) => {
  return res.render("user/profile", { pageTitle: "Profile" });
};

export const edit = (req, res) => {
  return res.render("user/edit", { pageTitle: "User Edit" });
};

export const changePassword = (req, res) => {
  return res.render("user/change-password", { pageTitle: "Change Password" });
};
