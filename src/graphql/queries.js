// src/graphql/queries.js

export const getSubscription = /* GraphQL */ `
  query GetSubscription($id: ID!) {
    getSubscription(id: $id) {
      id
      email
    }
  }
`;

export const listSubscriptions = /* GraphQL */ `
  query ListSubscriptions {
    listSubscriptions {
      items {
        id
        email
      }
    }
  }
`;
