const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const secretKey = process.env.ACCESS_TOKEN;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no token, the user isn't authorized
  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, secretKey, (err, userPayload) => {
    // If the token is invalid (bad signature, expired), it's forbidden
    if (err) return res.sendStatus(403);

    // If the token is valid, we save the payload to the request object
    // so our route can know which user made the request
    req.user = userPayload;

    next();
  });
}

module.exports = authenticateToken; // Export the middleware
