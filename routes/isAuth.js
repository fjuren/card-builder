// middleware to validate authentication, admin and membershipt statuses as backend security for different page access

// Access rules:
// 1. No login only gives you read-only access
// 2. Login account allows you to comment on cards, but that's it
// 3. login account AND membership role allows you to comment on cards, and create/edit/delete cards that only the logged in user has created
// 4. Login account AND admin role allows you to do everything the membership role allows, and you can delete any card even if you are a different logged in user

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: 'Sorry, you must be logged in to do this' });
  }
};

module.exports.isMember = (req, res, next) => {
  if (req.user.membershipstatus === true) {
    next();
  } else {
    res.status(403);
    url = req.url;
    res.render('403', {
      error: 'Oops! Sorry your ran into an error',
      msg: 'You must sign up for our membrship to access this page. Go to your settings page to become a member!',
    });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin === true) {
    next();
  } else {
    res.status(403);
    url = req.url;
    res.render('403', {
      error: 'Oops! Sorry your ran into an error',
      msg: 'You must have an admin account to complete this action',
    });
  }
};
