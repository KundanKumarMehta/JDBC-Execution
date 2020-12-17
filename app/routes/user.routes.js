const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const authcontroller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get("/api/test/resetpass", function (req, res) {
    res.sendFile('form.html', { root: __dirname });
  })

  app.get('/api/test/reset', function (req, res) {
    res.sendFile('resetform.html' , { root: __dirname });
  })

  app.post(
    "/api/test/resetpass",
    [authJwt.verifyToken],
    authcontroller.resetingPassword
  );
};

