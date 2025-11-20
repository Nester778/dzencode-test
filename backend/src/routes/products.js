import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct
} from '../controllers/productController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);

export default router;