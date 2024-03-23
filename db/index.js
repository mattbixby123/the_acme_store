//db index file

// client - a node pg client
const pg = require('pg');
const client = new pg.Client(process.env.DB_NAME || 'postgres://localhost/the_acme_store');
// extra imports for dependency usages
const uuid = require('uuid');
const bcrypt = require('bcrypt');

// createTables method - drops and creates the tables for your application
const createTables = async () => {
  const SQL = /*sql*/
  `
  DROP TABLE IF EXISTS favorites;
  DROP TABLE IF EXISTS products;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users(
    id UUID PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
  );
  CREATE TABLE products(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE favorites(
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
  );
  `;
  await client.query(SQL);
};

// createProduct - creates a product in the database and returns the created record
const createProduct = async ({name}) => {
  const SQL = /*sql*/ `INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
// createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
const createUser = async ({username, password}) => {
  const SQL = /*sql*/ `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;`;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 10)]);
  return response.rows[0];
};

// fetchUsers - returns an array of users in the database
const fetchUsers = async () => {
  const SQL = /*sql*/ `SELECT * from users;`;
  const response = await client.query(SQL);
  return response.rows;
};

// fetchProducts - returns an array of products in the database
const fetchProducts = async () => {
  const SQL = /*sql*/ `SELECT * from products;`;
  const response = await client.query(SQL);
  return response.rows;
};

// createFavorite - creates a favorite in the database and returns the created record
const createFavorite =  async ({user_id, product_id}) => {
  const SQL = /*sql*/ `INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *;`;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
}

// fetchFavorites - returns an array favorites for a user
const fetchFavorites = async (user_id) => {
  const SQL = /*sql*/ `SELECT * from favorites WHERE user_id='${user_id}'`
  const response = await client.query(SQL);
  return response.rows;
}

// destroyFavorite - deletes a favorite in the database
const destroyFavorite = async ({user_id, product_id}) => {
  const SQL = /*sql*/ `DELETE * from favorites WHERE user_id='${user_id}' AND product_id='${product_id}'`;
  const response = await client.query(SQL); 
  //no return statement for this one
};

// seed data
const seed = async () => {

  await Promise.all([
    createUser({username: 'codingislife', password: 'p@ssw0rd'}),
    createUser({username: 'matt', password: 'eyes'}),
    createUser({username: 'tj', password: 'ears'}),
    createProduct({name: 'blue shoes'}),
    createProduct({name: 'red shoes'}),
    createProduct({name: 'green shoes'}),
  ]);
  const users = await fetchUsers();
  console.log('Users are ', await fetchUsers());
  const products = await fetchProducts();
  console.log('Products are ', await fetchProducts());
  await Promise.all([
    createFavorite({user_id: users[0].id, product_id: products[2].id}),
    createFavorite({user_id: users[1].id, product_id: products[1].id}),
    createFavorite({user_id: users[2].id, product_id: products[0].id})
  ])
  console.log('Favorites ', await fetchFavorites(users[0].id))
};

module.exports = {
  client,
  createTables,
  createProduct,
  createUser,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
  seed
}