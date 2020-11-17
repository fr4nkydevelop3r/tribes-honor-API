const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

//connect to db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR', err));

//import routes

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const tribesRoutes = require('./routes/tribes');
const membersRoutes = require('./routes/members');

//app middlewares
app.use(morgan('dev')); //with this you can see the request in the console
//app.use(cors()) //allow all origins

app.use(bodyParser.json());

if ((process.env.NODE_ENV = 'development')) {
  app.use(cors({ origin: `http://localhost:3000` }));
}

//middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', tribesRoutes);
app.use('/api', membersRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} = ${process.env.NODE_ENV}`,
  );
});
