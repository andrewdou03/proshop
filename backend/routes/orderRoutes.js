import express from 'express';
const router = express.Router();
import { 
	addOrderItems,
	getOrders,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders
 } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


router.route('/').get(protect, admin, getOrders).post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;