const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You need to be logged in");
    return res.redirect('/'); // ✅ Add return here to prevent further execution
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect('/');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    req.flash("error", "Something went wrong");
    return res.redirect('/'); // ✅ Also return here
  }
};
