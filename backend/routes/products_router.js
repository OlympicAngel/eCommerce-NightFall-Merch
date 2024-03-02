
const router = require("express").Router();

//middlewares
const auth_manager = require('../middlewares/auth_manager')({ "permission": "manager" });
const upload = require('../middlewares/upload');


//controller
const products = require('../controllers/products_controller');

//Guests GET
router.get('/', products.getAll);
router.get('/:id', products.getById);
router.get("/c/:category", products.getByCategory)


//Managers CRUD
router.post('/',
    auth_manager,
    upload.single('image'),
    products.managers.addProduct);

router.put('/:id',
    auth_manager,
    upload.single('image'),
    products.managers.updateById);

router.delete('/:id',
    auth_manager,
    products.managers.deleteById);

module.exports = router;
