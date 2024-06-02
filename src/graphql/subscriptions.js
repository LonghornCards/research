// src/graphql/subscriptions.js

export const onCreateSubscription = /* GraphQL */ `
  subscription OnCreateSubscription {
    onCreateSubscription {
      id
      email
    }
  }
`;
