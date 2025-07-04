const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller.js');

router.get('/', users.getAllusers);
router.get('/:id', users.getusersById);


module.exports = router;
