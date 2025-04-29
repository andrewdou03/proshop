import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';


import { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createReview, getTopProducts } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/top').get(getTopProducts);


router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createReview);

export default router;