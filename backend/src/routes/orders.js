import express from 'express';
import {
    getOrders,
    getOrderById,
    createOrder,
    deleteOrder
} from '../controllers/orderController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(auth);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;