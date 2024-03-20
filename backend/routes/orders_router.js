const router = require("express").Router();

//middleware
const auth_admin = require('../middlewares/auth_manager');
const auth_manager = auth_admin({ "permission": "manager" })
const auth_user = require('../middlewares/auth_user');

// controller
const orders = require('../controllers/orders_controller');
const paypal_controller = require("../controllers/paypal_controller");

// managers actions
router.get('/manage/', auth_manager, orders.managers.getAll)
router.put('/manage/:id/status', auth_manager, orders.managers.updateStatusByID)
router.get('/manage/:id', auth_manager, orders.managers.getByID)
// admin actions
router.delete('/manage/:id', auth_admin, orders.admins.deleteByID)



// user actions
router.get('/:id', auth_user, orders.users.getByID)
router.get("/", auth_user, orders.users.getAll)

router.post("/api/create", paypal_controller.createOrder)
router.post("/api/:orderID/cancel", paypal_controller.cancelOrder)
router.post("/api/:orderID/capture", paypal_controller.captureOrder)




// guests requests
router.get('/guest/:id', orders.guests.getByID)



module.exports = router;
