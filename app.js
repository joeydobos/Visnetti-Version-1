const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');



const app = express();
const cors = require('cors'); // Import the cors package

app.set('view engine', 'pug')
app.set('views', './views')

// 1) MIDDLEWARES
app.use(express.static('public'));


app.use( helmet({ contentSecurityPolicy: false }) );



if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100, 
  windowMs : 60* 60 * 1000,
  message: 'To many requests from this IP'
})

app.use('/api', limiter);

app.use(express.json({limit: '1000kb '}));
app.use(cookieParser());

//Data Sanitisation against NoSQL query injection

app.use(mongoSanitize());

//Data Sanitization against XSS (cross side scripting)

app.use(xss());


app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies)
  next();
});

// 3) ROUTES



app.use('/', viewRouter)
app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);



app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
