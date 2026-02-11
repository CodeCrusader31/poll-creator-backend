

// const voterTracking = (req, res, next) => {
//   const ip =
//     req.headers["x-forwarded-for"] ||
//     req.socket.remoteAddress ||
//     req.connection.remoteAddress ||
//     "";

//   const userAgent = req.headers["user-agent"] || "";

//   const voterId = `${ip}_${userAgent}`;

//   req.voter = {
//     voterId,
//     name: req.body.name || null
//   };

//   next();
// };

// module.exports = voterTracking;


const voterTracking = (req, res, next) => {
  // Some requests (GET) have no body
  const body = req.body || {};

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "";

  const userAgent = req.headers["user-agent"] || "";

  const voterId = ip + "_" + userAgent;

  req.voter = {
    voterId,
    name: body.name || null
  };

  next();
};

module.exports = voterTracking;
