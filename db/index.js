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
  const SQL = /*sql*/ `INSERT INTO products(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
// createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
const createUser = async ({username, password}) => {
  const SQL = /*sql*/ `INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 10)]);
  return response.rows[0];
};


// seed data

// fetchUsers - returns an array of users in the database

// fetchProducts - returns an array of products in the database
// createFavorite - creates a favorite in the database and returns the created record
// fetchFavorites - returns an array favorites for a user
// destroyFavorite - deletes a favorite in the database

module.exports = {
  client,
  createTables,
  createProduct,
  createUser
}