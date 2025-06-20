const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const getController = require('../controllers/questions/get');
const createController = require('../controllers/questions/create');
const deleteController = require('../controllers/questions/delete');
const actionsController = require('../controllers/questions/actions');

router.get('/search', auth, getController.searchQuestions); // Ensure this line is correct
router.get('/', getController.getAllQuestions);
router.get('/:id', getController.getQuestionById);
router.post('/', auth, createController.createQuestion);
router.delete('/:id', auth, deleteController.deleteQuestion);
router.post('/:id/upvote', auth, actionsController.upvoteQuestion);
router.post('/:id/flag', auth, actionsController.flagQuestion);
module.exports = router;