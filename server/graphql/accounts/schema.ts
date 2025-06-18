import { gql } from "apollo-server-express";

export const schema = gql`
  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type OdooClient {
    id: Int!
    name: String!
    email: String
    vat: String
    street: String
    phone: String
  }

  type OdooResult {
    success: Boolean!
    message: String!
    clientId: Int
    clientData: OdooClient
  }

  input AccountInput {
    name: String!
    email: String!
  }

  input OdooClientInput {
    name: String!
    email: String
    vat: String
    street: String
    phone: String
  }

  extend type Query {
    testAccQ: Int
    accountById(id: ID!): Account
    accounts(name: String, page: Int, perPage: Int): [Account!]!
    searchOdooClient(email: String, name: String): [OdooClient!]!
  }

  extend type Mutation {
    testAccM: Boolean
    createAccount(input: AccountInput!): Account
    createOdooClient(input: OdooClientInput!): OdooResult!
    updateOdooClient(clientId: Int!, input: OdooClientInput!): OdooResult!
    syncAccountWithOdoo(accountId: ID!): OdooResult!
  }
`;
