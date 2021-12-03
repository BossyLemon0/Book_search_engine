const { gql } = require('apollo-server-express');

const typeDefs = gql`
type bookSchema{
    authors: String
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type User{
    username: String!
    email: String!
    password: String!
    savedBooks:[bookSchema]
}

type Auth{
    token: ID!
    user: User
}

type Query{
    getSingleUser: User
}

type Mutation{
    createUser(username: String!, email: String!, password: String!): Auth
    login(username: String!, email: String!): Auth
    saveBook(UserId: ID!, bookId: ID!): User
    deleteBook(UserId: ID!, bookId:ID!): User
}
`;

module.exports = typeDefs;