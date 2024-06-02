// src/graphql/mutations.js

export const createSubscription = /* GraphQL */ `
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      id
      email
    }
  }
`;
