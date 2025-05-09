import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 4;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword ? {
		name: { $regex: req.query.keyword, $options: 'i' }
	} : {};

	const count = await Product.countDocuments({...keyword});
	const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));


	res.json({products, page, pages: Math.ceil(count/pageSize), count});
});

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		name: 'Sample name',
		price: 0,
		user: req.user._id,
		image: '/images/sample.jpg',
		brand: 'Sample brand',
		category: 'Sample category',
		countInStock: 0,
		numReviews: 0,
		description: 'Sample description',
	});
	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product){
	await Product.deleteOne({_id: req.params.id});
	res.status(200).json({ message: 'Product removed'});
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

const updateProduct = asyncHandler(async (req, res) => {
	const {name, price, description, image, brand, category, countInStock} = req.body;
	const product = await Product.findById(req.params.id);
	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;
		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});
const createReview = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product){
	await product.reviews.push({
		name: req.user.name,
		rating: Number(req.body.rating),
		comment: req.body.comment,
		user: req.user._id
	});
	product.numReviews = product.reviews.length;
	product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
	await product.save();
	res.status(200).json({ message: 'Review created'});
	} else {
		res.status(404);
		throw new Error('Error creating review');
	}
});

const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	if (products) {
		res.status(200).json(products);
	}
});

export { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createReview, getTopProducts };