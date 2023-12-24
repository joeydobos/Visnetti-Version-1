const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

// Get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    } 
  });
}); 
exports.getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id; // Assuming the user ID is passed in the URL parameter

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Exclude sensitive data
  user.password = undefined;
  user.passwordConfirm = undefined;

  // Return the user details
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});




exports.deleteAccount = catchAsync(async (req, res, next) => {
  // Get the user from the request object (set in the protect middleware)
  const user = req.user;

  // Delete the user from the database
  await User.findByIdAndDelete(user._id);

  // Return a response indicating successful deletion
  res.status(204).json({
    status: 'success',
    data: null
  });
});



