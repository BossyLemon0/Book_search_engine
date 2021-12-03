// import user model
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
  // get a single user by either their id or their username
  // idk if the original turnery operator is correct, going to change it
  async getSingleUser(parent, {  userId , username }) {
    const foundUser = await User.findOne({
      $or: [{ _id: userId }, { username: username }],
    });

    if (!foundUser) {
      throw new AuthenticationError('Cannot find a user with this id!' );
    }

    return foundUser;
  },
  // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
  async createUser(parent, { username, email, password }) {
    const user = await User.create(username, email, password);

    if (!user) {
      throw new AuthenticationError('Something is wrong!');
    }
    const token = signToken(user);
    return { token, user };
  },
  // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
  // {body} is destructured req.body
  async login(parent, { username, email, password }) {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      throw new AuthenticationError("Can't find this user");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Wrong password!');
    }
    const token = signToken(user);
    return{ token, user };
  },
  // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
  // user comes from `req.user` created in the auth middleware function
  async saveBook(parent, { userId, bookId }) {
    console.log(userId);
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: bookId } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (err) {
      console.log(err);
      throw new AuthenticationError('something went wrong, check the console');
    }
  },
  // remove a book from `savedBooks`
  async deleteBook(parent, { userId, bookId }) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { savedBooks: { bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      throw new AuthenticationError("Couldn't find user with this id!");
    }
    return updatedUser;
  },
};
