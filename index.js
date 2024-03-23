//root index file
// require('dotenv').config();
const express = require('express'); // line 1 or 2 for express
const app = express(); // line 2/2 for express
const {
  client,
  createTables,
  seed
} = require('./db');

// port call for express server funcitonality
const port = process.env.PORT || 3000; 
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
    console.log('some curl commands to test');
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/products`);
 });

// middleware - needed when integrating express for listening
app.use(express.json());
app.use(require('morgan')('dev')); //Log the requests as they come in with morgan
// app.use('/api', require('./routes')); //call needed to link the express routes


//init function
const init = async () => {
  console.log('connecting to db');
  await client.connect();
  console.log('connected to db');
  await createTables();
  console.log('tables created');
  await seed();

};

init();
