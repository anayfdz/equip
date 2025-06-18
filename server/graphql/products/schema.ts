import { gql } from "apollo-server-express";

export const schema = gql`
  type Product {
    _id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: String
    createdAt: String
    updatedAt: String
  }

  type PurchaseResult {
    success: Boolean!
    message: String!
    remainingStock: Int
  }

  input ProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: String
  }

  extend type Query {
    testProdQ: Int
    productById(id: ID!): Product
    products(accountId: String, page: Int, perPage: Int): [Product!]!
  }

  extend type Mutation {
    testProdM: Boolean
    createProduct(input: ProductInput!): Product
    purchaseProduct(accountId: ID!, productId: ID!, quantity: Int!): PurchaseResult!
  }
`;
