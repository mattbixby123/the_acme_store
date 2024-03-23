const router = require('express').Router();

const { fetchProducts } = require('../../db');

// GET /api/products - returns an array of products
router.get('/', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.status(200).send(products);
  } catch (error) {
    next(error)
  }
});

module.exports = router;