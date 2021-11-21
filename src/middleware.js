import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "ToDo";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const protectedMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/users/home");
  }
};

export const uploadFile = multer({ dest: "uploads/" });
