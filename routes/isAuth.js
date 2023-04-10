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
    res.status(401).json({ msg: 'Sorry, you must log in to access this page' });
  }
};

module.exports.isMember = (req, res, next) => {
  if (req.user.membershipstatus === true) {
    next();
  } else {
    res.status(403).json({
      msg: 'Sorry, you must log in and sign up to be a member to access this page',
    });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.isAdmin === true) {
    next();
  } else {
    res.status(403).json({ msg: 'Sorry, you must be an admin to do this' });
  }
};
