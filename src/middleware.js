export const localsMiddleware = (req, res, next) => {
  const { loggedIn, user } = req.session;
  res.locals.siteName = "ToDo";
  res.locals.loggedIn = loggedIn;
  res.locals.loggedInUser = user;
  next();
};
