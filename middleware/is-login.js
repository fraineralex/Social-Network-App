module.exports = (req, res, next) => {
  if(!req.session.newSession){
    req.flash("errors", "Debe iniciar sesion para ingresar.");
    return res.redirect("/login")
  }
  next();
}; 