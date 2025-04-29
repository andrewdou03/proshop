import express from 'express';
const router = express.Router();
import { 
	authUser,
	registerUser,
	logOut,
	getUserProfile,
	updateUserProfile,
	getUsers,
	getUser,
	deleteUser,
	updateUser
 } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


router.route('/').get(protect, admin, getUsers).post(registerUser);

router.route('/logout').post(logOut);

router.route('/login').post(authUser);

router.route('/profile/').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/:id').get(protect, admin, getUser).delete(protect, admin, deleteUser).put(protect, admin,updateUser);

export default router;