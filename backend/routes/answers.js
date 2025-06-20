const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const getController = require('../controllers/answers/get');
const createController = require('../controllers/answers/create');
const deleteController = require('../controllers/answers/delete');
const actionsController = require('../controllers/answers/actions');

router.get('/question/:questionId', getController.getAnswersByQuestionId);
router.get('/flagged', auth, getController.getFlaggedAnswers);
router.get('/:id', getController.getAnswerById); // New route
router.post('/question/:questionId', auth, createController.createAnswer);
router.delete('/:id', auth, deleteController.deleteAnswer);
router.post('/:id/upvote', auth, actionsController.upvoteAnswer);
router.post('/:id/flag', auth, actionsController.flagAnswer);

module.exports = router;