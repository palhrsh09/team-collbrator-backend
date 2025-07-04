const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller.js');
const team = require('../controllers/team.controller.js');


router.post('/signup', users.register);
router.post('/login', users.login);
router.get('/teams', team.getAll);

module.exports = router;
