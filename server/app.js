import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

const app = express();

// Configure middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure the port
const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Server is listening to port ${port}`);
});

export default app;
