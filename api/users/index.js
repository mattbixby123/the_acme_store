const router = require('express').Router();

const { fetchUsers, fetchFavorites, createFavorite, destoryFavorite, destroyFavorite } = require('../../db');
// GET /api/users - returns array of users
router.get('/', async (req,res, next) => {
  try {
    const users =  await fetchUsers();
    res.status(200).send(users);
  } catch (error) {
    next(error)
  }
});

// GET /api/users/:id/favorites - returns an array of favorites for a user
router.get('/:user_id/favorites', async (req,res, next) => {
  try {
    const favorites =  await fetchFavorites();
    res.status(200).send(favorites);
  } catch (error) {
    next(error)
  }
});

// POST /api/users/:id/favorites - payload: a product_id
//  returns the created favorite with a status code of 201
router.get('/:user_id/favorites', async (req,res, next) => {
  try {
    const { product_id } = req.body; // req.body.product_id
    res.status(201).send(await createFavorite({
      user_id: req.params.user_id,
      product_id: product_id
    }));
  } catch (error) {
    next(error)
  }
});

// DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204
router.delete('/:user_id/favorites/:id', async (req, res, next) => {
  try {
      await destroyFavorite({ 
        user_id: req.params.user_id, 
        id: req.params.id });
      res.sendStatus(204); // Send a 204 No Content response upon successful deletion
  } catch (error) {
      next(error);
  }
});

module.exports = router;