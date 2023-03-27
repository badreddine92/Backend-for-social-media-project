const jwt = require("jsonwebtoken");

const config = process.env;

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
