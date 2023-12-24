const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const email = require('../utils/email');
const sendEmail = require('../utils/email');
const crypto = require('crypto')
const { promisify } = require('util');



const signToken = id => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });

  return token; // Add this line to return the token
};

const cookieOptions = {
  expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      //secure: true,
      httpOnly: true
}


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);

  res.cookie('jwt', token, cookieOptions )

  // Exclude password field from the user object
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};



exports.register = catchAsync(async (req, res, next) => {
  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 200 ,res)
});



exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check email and password exist
  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password'), 400);
  }

  const user = await User.findOne({ email }).select('+password').exec();

  if (!user || !(await user.validLogin(password, user.password))) {
    return next(new AppError('Incorrect Credentials', 401));
  }

  createSendToken(user, 200, res);
});


exports.protect = catchAsync(async (req, res, next) => {
  // 1. Check if a token exists in the request headers
  const authHeader = req.headers.authorization;
  const jwtCookie = req.cookies.jwt;

  if (!authHeader && !jwtCookie) {
    return next(new AppError('Not authorized. Please log in.', 401));
  }

  // 2. Extract the token from the authorization header
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (jwtCookie) {
    token = jwtCookie;
  }

  // 3. Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. Check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User not found.', 401));
  }

  const jwtIssuedAt = new Date(decoded.iat * 1000); // Convert UNIX timestamp to JavaScript Date object
  if (user.passwordChangedAt && jwtIssuedAt < user.passwordChangedAt) {
    return next(new AppError('Token expired. Please log in again.', 401));
  }

  // Grant access to the protected route
  req.user = user; // Add the user object to the request for future use
  next();
});


exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if(!(await user.validLogin(req.body.passwordCurrent, user.password))){
      return next(new AppError('Current Password Is Wrong', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm; 
  await user.save();

  
  createSendToken(user, 200 ,res)

});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User from database based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
      return next(new AppError("Email Doesn't Exist", 404));
  }

  // 2) Generate Random reset Token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the token back to the user email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password:\n\n${resetUrl}\n\nThe password reset link will be valid for 10 minutes.`;

  try{
    await sendEmail({
      email: user.email,
      subject: 'Password Change',
      message
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset link send'
  })

  }catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending password reset token ', 500));

  }


});


exports.resetPassword = catchAsync(async(req,res,next) => {

  const encrypedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  user = await User.findOne({passwordResetToken: encrypedToken, passwordResetTokenExpires: {$gt: Date.now()}})

  if(!user){
    return next(new AppError('The Token Has Expired / Invalid', 500));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm; 
  user.passwordResetTokenExpires = undefined;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();

  await user.save()

  // Log in the user 

  createSendToken(user, 200 ,res)


})



exports.isLoggedIn = catchAsync(async (req, res, next) => {

  const jwtCookie = req.cookies.jwt;



  // 2. Extract the token from the authorization header
  let token;
  if (!jwtCookie) {
    return next();
  }
  else{
    token = jwtCookie;
  }

  // 3. Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4. Check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next();
    
  }

  const jwtIssuedAt = new Date(decoded.iat * 1000); // Convert UNIX timestamp to JavaScript Date object
  if (user.passwordChangedAt && jwtIssuedAt < user.passwordChangedAt) {
    return next();
  }

  // Grant access to the protected route
  res.locals.user = user; // Add the user object to the request for future use

  next();
});