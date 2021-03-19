

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Πρεπει να συνδεθεις για να συνεχισεις')
        return res.redirect('/login')
    }
    next();
}