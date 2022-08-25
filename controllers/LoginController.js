const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alguien142015@gmail.com",
    pass: "snmtwirkzjcebobq",
  },
});

exports.GetLogin = (req, res, next) => {
  res.render("login_int/login", {
    pageTitle: "Login",
    loginActive: true,
  });
};

exports.PostLogin = (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;

  User.findOne({ where: { user: user } })
    .then((user) => {
      if (!user) {
        req.flash("errors", "El Usuario es incorrecto.");
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
          req.flash("errors", "La contraseña es incorrecta.");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          req.flash(
            "errors",
            "Ha ocurrido un error, porfavor vuelva a intentarlo y verifique que los campos esten correctos."
          );
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
  const imageProfileUrl = req.file;
  const email = req.body.email;
  const user = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const token = req.params.token;

  if (password !== confirmPassword) {
    req.flash("errors", "Las contraseñas no son similares");
    return res.redirect("/login_up");
  }

  User.findOne({ where: { email: email } })
    .then((result) => {
      if (result) {
        req.flash("errors", "Ya existe un usuario con este correo.");
        return res.redirect("/login_up");
      }

      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({
            name: name,
            lastName: lastName,
            phone: phone,
            imageProfile: '/' + imageProfileUrl.path,
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
            })
            .then((result) => {
              let urlRedirect = "/login";
              const userEmail = result.dataValues.email;
        
              if (result) {
                urlRedirect = "/login";
        
                transporter.sendMail({
                  from: "alguien142015@gmail.com",
                  to: userEmail,
                  subject: `Password reset`, 
                  isActive: true,
                  html: `<h3>Solicitud acualizacion de contraseña</h3>
                     
                <p> Haga click en el siguente enlace para activar su Usuario <a href="http://localhost:5000/reset/${token}">ACTIVAR</a></p>`,
                });
              }
        
              res.redirect(urlRedirect);
            })
        
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

exports.GetReset = (req, res, next) => {
  res.render("login_int/reset", {
    pageTitle: "Recupera tu contraseña",
    loginActive: true,
  });
};

exports.PostReset = (req, res, next) => {
  const user = req.body.user;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      req.flash(
        "errors",
        "Error interno, porfavor ponerse en contacto con un administrador."
      );

      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ where: { user: user } })
      .then((user) => {
        if (!user) {
          req.flash("errors", "No existe una cuenta con este nombre de usuario.");
          return null;
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;

        return user.save();
      })
      .then((result) => {
        let urlRedirect = "/reset";
        const userEmail = result.dataValues.email;

        if (result) {
          urlRedirect = "/login";

          transporter.sendMail({
            from: "alguien142015@gmail.com",
            to: userEmail,
            subject: `Password reset`,
            html: `<h3>Ha solicitado una actualizacion de contraseña</h3>
               
          <p> Haga click en este <a href="http://localhost:5000/reset/${token}"> enlace </a> para actualizar su contraseña </p>`,
          });
        }

        res.redirect(urlRedirect);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.GetNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  })
    .then((user) => {
      if (!user) {
        req.flash("errors", "Token invalido");
        return res.redirect("/reset");
      }

      res.render("login_int/new-password", {
        pageTitle: "Nueva contraseña",
        loginActive: true,
        passwordToken: token,
        userId: user.id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.PostNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  if (newPassword !== confirmPassword) {
    req.flash("errors", "Las contraseñas no son similares");
    return res.redirect("/reset");
  }

  User.findOne({
    where: {
      resetToken: passwordToken,
      id: userId,
      resetTokenExpiration: { [Op.gte]: Date.now() },
    },
  }).then((user)=>{

    if(!user){
      req.flash("errors", "No se pudo validar correctamente, vuelva a intentarlo");
      return res.redirect("/reset");
    }

    bcrypt.hash(newPassword,12)
    .then((hashedPassword)=>{
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;
      return user.save();
    })
    .catch((err) => {
      console.log(err);
    })

    res.redirect("/login");

  })
  .catch((err) => {
    console.log(err);
  });
};

