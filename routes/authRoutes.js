const express = require('express');
const { createUser, loginUserCtrl, getAllUsers, getuser, deluser, updateUser, block_user, unblock_user, handleRefreshToken, logout, updatePassword } = require('../controllers/userCtrl');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(express.json());

router.post('/register', createUser);
router.post('/login', loginUserCtrl);
router.put('/password',authMiddleware, updatePassword);
router.get('/logout', logout);
router.get('/refreshToken', handleRefreshToken);
router.get('/getAllUsers',authMiddleware,isAdmin, getAllUsers);
router.get('/:id',authMiddleware, getuser);
router.delete('/:id', deluser);
router.put('/:id',authMiddleware, updateUser);
router.put('/block_user/:id',authMiddleware, isAdmin, block_user);
router.put('/unblock_user/:id',authMiddleware, isAdmin, unblock_user);

module.exports = router