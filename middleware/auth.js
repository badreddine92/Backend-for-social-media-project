const jwt = require("jsonwebtoken");

const config = process.env;

// function verifyToken(req, res, next) {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// }




module.exports = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).send('Unauthorized')
    }
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
      if (err) {
        return next(res.status(401).send('Unauthorized'))
      }
      req.user = decoded
      next()
    })
  }
};
