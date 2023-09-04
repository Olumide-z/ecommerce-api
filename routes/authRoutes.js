const express =  require('express');
const router = express.Router();

const { login, register, logout } =  require('../controllers/authController')

router.route('/register').post(register);
router.route('/login').post(login);
router.get('/logout', logout)

module.exports = router;