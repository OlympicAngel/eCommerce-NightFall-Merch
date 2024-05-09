const router = require("express").Router();

//auth middlewares
const auth_admin = require('../middlewares/auth_manager');
const auth_manager = auth_admin({ "permission": "manager" })
const auth_user = require('../middlewares/auth_user');

//controllers
const users = require('../controllers/users_controller');
const managers = require('../controllers/managers_controller');
const limiter = require("../middlewares/rateLimit");

//managers login
router.post('/managers/login', limiter, managers.login);
router.get('/managers/logout', auth_manager, managers.logout);
router.get('/managers/auth', auth_manager, managers.authManagerToken);
router.post("/managers/resetpassword", limiter, managers.reqResetPassword)
router.post("/managers/resetpassword/verify", limiter, managers.useResetPin)
//managers actions - control users
router.get('/manage', auth_manager, users.manage.getAll);
router.get('/manage/:id', auth_manager, users.manage.getById);
router.put('/manage/:id', auth_manager, users.manage.updateById);
//managers actions - control managers
router.get('/managers/', auth_manager, managers.getAll)
router.put('/managers/', auth_manager, managers.updateSelf)

//admins actions - control managers
router.post('/managers/', auth_admin, managers.addManagerForAdmins);
router.post('/managers/initialize', managers.isMangersNotInitializedYet, managers.addManagerForAdmins); //allow creating manager if non exists
router.get('/managers/initialize/check', managers.isMangersNotInitializedYet, (req, res) => { res.json({ success: true, message: "לא קיים עדיין מנהל, צור את המנהל הראשי" }) }); //allow creating manager if non exists
router.put('/managers/:id', auth_admin, managers.updateById)
router.delete('/managers/:id', auth_admin, managers.deleteById);
//admins actions - control users
router.delete('/manage/:id', auth_admin, users.manage.deleteById);

//users login
router.post("/", users.create);
router.post('/login', limiter, users.login);
router.get('/logout', auth_user, users.logout);
router.get('/auth', users.authUserToken);
router.post("/resetpassword", limiter, users.reqResetPassword)
router.post("/resetpassword/verify", limiter, users.useResetPin)
//users actions
router.delete('/', auth_user, users.delete);
router.put('/', auth_user, users.update);

//export
module.exports = router;