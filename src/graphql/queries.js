/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCarburants = /* GraphQL */ `
  query GetCarburants($id: ID!) {
    getCarburants(id: $id) {
      id
      level
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCarburants = /* GraphQL */ `
  query ListCarburants(
    $filter: ModelCarburantsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarburants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        level
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
