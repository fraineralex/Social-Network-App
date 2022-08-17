const User = require("../models/Users");
const bcrypt = require("bcryptjs");

exports.GetLogin = (req, res, next) => {

  res.render("login_int/login", {
    pageTitle: "Login",
    loginActive: true,
  });
};

exports.PostLogin = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("errors","El Email es incorrecto.");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((result) => {
          console.log(result);
          if (result) {
            req.session.newSession = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("errors","La contraseña es incorrecta.");
          res.redirect("/login");
          
        }) 
        .catch((err) => {
          console.log(err);
          req.flash("errors","Ha ocurrido un error, porfavor vuelva a intentarlo y verifique que los campos esten correctos.");
          return res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login");
    });
};

exports.PostLogout = (req, res, next) => {  
  
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
}; 

exports.GetLogin_up = (req, res, next) => {
  res.render("login_int/login_up", {
    pageTitle: "Login_up",
    loginActive: true,
  });
};

exports.PostLogin_up = (req, res, next) => {
  const name = req.body.name;
  const lastName = req.body.lastname;
  const phone = req.body.number;
  const imageProfile = req.body.image;
  const email = req.body.email;
  const user = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    req.flash("errors","Las contraseñas no son similares");
    return res.redirect("/login_up");
  }

  User.findOne({ where: { email: email } })
    .then((result) => {
      if (result) {
        req.flash("errors","Ya existe un usuario con este correo.");
        return res.redirect("/login_up");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({
            name: name,
            lastName: lastName,
            phone: phone,
            imageProfile: imageProfile,
            email: email,
            user: user,
            password: hashedPassword,
          })
            .then((result) => {
              res.redirect("/login");
            })
            .catch((err) => {
              console.log(err);
              return res.redirect("/login_up");
            });
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/login_up");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/login_up");
    });
};
