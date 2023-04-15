function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  console.log('req.headers: ' + req.headers);
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // split at the space
    const bearer = bearerHeader.split(' ');
    // get the token from the array
    const bearerToken = bearer[1];
    // set token
    console.log('req.token: ' + req.token);
    req.token = bearerToken;
    // next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
