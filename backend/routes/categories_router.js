const router = require("express").Router();
const auth_manager = require('../middlewares/auth_manager');

// controller
const categories = require('../controllers/categories_controller');



// managers requests
router.post('/', auth_manager, categories.managers.add)
router.delete('/:id', auth_manager, categories.managers.deleteById)
router.put('/:id', auth_manager, categories.managers.updateById)



// all
router.get('/', categories.getAll)


module.exports = router;
