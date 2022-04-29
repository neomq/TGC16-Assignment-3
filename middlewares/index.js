const checkIfAuthenticated = function(req,res,next) {
    if (req.session.user) {
        next();
    } else {
        req.flash("error_messages", "Unable to comply. Please login to your account.");
        res.redirect('/users/login');
    }


}

module.exports = { checkIfAuthenticated };