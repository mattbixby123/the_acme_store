//root index file
// require('dotenv').config();
const {
  client,
  createTables
} = require('./db');

//init function
const init = async () => {
  console.log('connecting to db');
  await client.connect();
  console.log('connected to db');
  await createTables();
  console.log('tables created');

};

init();
