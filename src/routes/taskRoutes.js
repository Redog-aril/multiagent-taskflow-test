const { Router } = require('express');
const taskController = require('../controllers/taskController');
const { validateTaskPayload } = require('../middleware/validateTask');

const router = Router();

router.get('/', taskController.list);
router.get('/:id', taskController.getById);
router.post('/', validateTaskPayload, taskController.create);
router.put('/:id', validateTaskPayload, taskController.update);
router.delete('/:id', taskController.delete);

module.exports = router;
