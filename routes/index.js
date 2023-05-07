var express = require("express");
var router = express.Router();
const fs = require("fs");
const nodemailer = require("nodemailer");
const upload = require("../helpers/multer").single("avatar");
const User = require("../models/userModel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const excelJs = require("exceljs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Home",
    isloggedIn: req.user ? true : false,
    user: req.user,
  });
});

/* GET excel page. */
router.get("/export-users" ,async function (req, res, next) {
  
  const exportUsers = async (req, res) => {
    try {
      const workbook = new excelJs.workbook();
      const worksheet = workbook.addWorksheet("My users");

      worksheet.columns = [
        { header: "Sno.", key: "S_no" },
        { header: "Name", key: "username" },
        { header: "EmailID", key: "email" },
        { header: "Task", key: "task" },
      ];

      let counter = 1;
      const userData = await User.find({ username: 0 });
      userData.forEach((user) => {
        user.S_no = counter;
        worksheet.addRow(user);
        counter++;
      });

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      res.setHeader(
        "contact-type",
        "application/vnd.openxmlformat-officedocuments.spreadshethtml.sheet"
      );

      res.setHeader("content-Disposition", `attachment; filename=users.xlsx`);
      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  });

/* GET signin page. */
router.get("/signin", function (req, res, next) {
  res.render("signin", {
    title: "signin",
    isloggedIn: req.user ? true : false,
    user: req.user,
  });
});

/* GET signup page. */
router.get("/signup", function (req, res, next) {
  res.render("signup", {
    title: "signup",
    isloggedIn: req.user ? true : false,
    user: req.user,
  });
});

/* GET profile page. */
router.get("/profile", isloggedIn, function (req, res, next) {
  console.log(req.user);
  res.render("profile", {
    title: "profile",
    isloggedIn: req.user ? true : false,
    user: req.user,
  });
});

/* post signup  */
router.post("/signup", function (req, res, next) {
  const { username, email, password, contact,task,heading } = req.body;
  User.register({ username, email, contact,task ,heading}, password)
    .then((user) => {
      res.redirect("/profile");
    })
    .catch((err) => res.send(err));
});

/* post signin */
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
  }),
  function (req, res, next) {}
);

/* get signout */
router.get("/signout", isloggedIn, function (req, res, next) {
  req.logout(() => {
    res.redirect("/signin");
  });
});


function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/signin");
  }
}


  
  
module.exports = router;
