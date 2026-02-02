import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      username
      email
    }
  }
`;

function TestApollo() {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Apollo Client Test - Users</h2>
      {data.users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {data.users.map((user: any) => (
            <li key={user.id}>
              ID: {user.id}, Username: {user.username}, Email: {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestApollo;