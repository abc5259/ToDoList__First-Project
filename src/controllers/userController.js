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
    req.flash("error", "이미 존재하는 email입니다.");
    return res.status(400).render("join", {
      pageTitle: "Join",
    });
  }
  //패스워드 틀리면 에러 메세지
  if (password !== password2) {
    req.flash("error", "패스워드가 일치하지 않습니다");
    return res.status(400).render("join", {
      pageTitle: "Join",
    });
  }
  await User.create({
    email,
    name,
    password,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  //password맞는지 확인
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "존재하지 않는 이메일입니다.");
    return res.status(404).render("login", {
      pageTitle: "Login",
    });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    req.flash("error", "패스워드가 틀립니다.");
    return res.status(404).render("login", {
      pageTitle: "Login",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/users/home");
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

//user

export const userHome = async (req, res) => {
  const { user: sessionUser } = req.session;
  const pageTitle = "Home";
  const user = await User.findById(sessionUser._id).populate("boards");
  if (!user) {
    req.flash("error", "User not found");
    return res.status(404).render("userHome", { pageTitle });
  }
  return res
    .status(200)
    .render("user/userHome", { pageTitle: "userHome", user });
};

export const getEditProfile = (req, res) => {
  return res.render("user/edit-profile", { pageTitle: "Edit Profile" });
};

export const profile = (req, res) => {
  return res.render("user/profile", { pageTitle: "Profile" });
};

export const postEditProfile = async (req, res) => {
  const pageTitle = "Edit Profile";
  const { email, name } = req.body;
  const { file } = req;
  const { _id, avatarUrl } = req.session.user;
  if (req.session.user.email !== email) {
    const match = await User.exists({ email });
    if (match) {
      req.flash("error", "이미 존재하는 이메일 입니다.");
      return res.status(404).render("user/edit-profile", {
        pageTitle,
      });
    }
  }
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      email: email ? email : req.session.user.email,
      name: name ? name : req.session.user.name,
      avatarUrl: file ? file.path : avatarUrl,
    },
    { new: true }
  );
  req.session.user = updateUser;
  return res.redirect("/users/edit-profile");
};

export const getChangePassword = (req, res) => {
  return res.render("user/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const { password, confirmNewPassword, newPassword } = req.body;
  const { user: sessionUser } = req.session;
  console.log(user);
  const match = await bcrypt.compare(password, sessionUser.password);
  if (!match) {
    req.flash("error", "현재 비밀번호가 일치하지 않습니다.");
    return res.render("user/change-password", { pageTitle: "Change Password" });
  }
  if (newPassword !== confirmNewPassword) {
    req.flash("error", "새로운 비밀번호가 일치하지 않습니다.");
    return res.render("user/change-password", { pageTitle: "Change Password" });
  }
  const user = await User.findById(sessionUser._id);
  console.log(user);
  user.password = newPassword;
  await user.save();
  req.flash("info", "비밀번호 변경이 완료 되었습니다!");
  req.session.user.password = user.password;
  return res.redirect("/users/home");
};
