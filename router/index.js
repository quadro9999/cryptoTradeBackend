const Router = require("express").Router;
const userController = require("../controllers/user-controller");
const router = new Router();
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const authAdminMiddleware = require("../middlewares/admin-middleware");
const paymentController = require("../controllers/payment-controller");
const adminController = require("../controllers/admin-controller");

router.post(
  "/registration",
  //   body("username").isEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.post("/user/verify", authMiddleware, userController.verify);
// router.get("/refresh", userController.refresh);
router.post("/cancelregistration", userController.cancelregistration);
router.get("/users", authMiddleware, userController.getUsers);
router.get("/checkAuth", authMiddleware, userController.checkAuth);

// user functions
router.post("/depositrequest", authMiddleware, userController.depositRequest);

router.post(
  "/user/transfercoins",
  authMiddleware,
  userController.transferCoins
);

// admin
router.get(
  "/admin/getallusers",
  [authMiddleware, authAdminMiddleware],
  adminController.getAllUsers
);

router.get(
  "/admin/getalldepositrequest",
  [authMiddleware, authAdminMiddleware],
  adminController.getAllDepositRequest
);

router.post(
  "/admin/topupbalance",
  [authMiddleware, authAdminMiddleware],
  adminController.topUpBalance
);

router.post(
  "/admin/withdrawbalance",
  [authMiddleware, authAdminMiddleware],
  adminController.withdrawBalance
);

// currency

router.get("/getCurrency", paymentController.getCurrency);

module.exports = router;
