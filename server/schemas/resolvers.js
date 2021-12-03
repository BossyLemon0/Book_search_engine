const { User } = require('../models');
const {
    createUser,
    getSingleUser,
    saveBook,
    deleteBook,
    login,
  } = require('../controllers/user-controller');

const resolvers = {
    Query:{
        createOneUser: createUser
    }
};

module.exports = resolvers;
