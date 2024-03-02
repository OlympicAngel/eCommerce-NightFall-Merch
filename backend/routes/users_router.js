const router = require("express").Router();

//auth middlewares
const auth_admin = require('../middlewares/auth_manager');
const auth_manager = auth_admin({ "permission": "manager" })
const auth_user = require('../middlewares/auth_user');


//controllers
const users = require('../controllers/users_controller');
const managers = require('../controllers/managers_controller');

//managers login
router.post('/managers/login', managers.login);
router.get('/managers/logout', auth_manager, managers.logout);
router.get('/managers/auth', auth_manager, managers.authManagerToken);
//managers actions
router.get('manage/', auth_manager, users.manage.getAll);
router.get('manage/:id', auth_manager, users.manage.getById);
router.delete('manage/:id', auth_manager, users.manage.deleteById);
router.put('manage/:id', auth_manager, users.manage.updateById);



//admins actions
router.post('/admins/add-manager', auth_admin, managers.addManagerForAdmins);



//users login
router.post("/", users.create);
router.post('/login', users.login);
router.get('/logout', auth_user, users.logout);
router.get('/auth', auth_user, users.authUserToken);
//users actions
router.delete('/', auth_user, users.delete);
router.put('/', auth_user, users.update);



//export
module.exports = router;