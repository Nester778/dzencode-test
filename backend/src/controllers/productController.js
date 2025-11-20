import { Product } from '../models/Order.js';

export const getProducts = async (req, res) => {
    try {
        const { type } = req.query;
        let filter = {};

        if (type && type !== 'all') {
            filter.type = type;
        }

        const products = await Product.find(filter)
            .populate('order', 'title')
            .sort({ date: -1 });

        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('order', 'title');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            order: req.body.orderId // assuming we pass orderId in request
        };

        const product = new Product(productData);
        await product.save();

        // Populate order data for response
        await product.populate('order', 'title');

        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};