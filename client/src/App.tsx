import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './utils/auth';

// Create main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Create middleware for auth headers
const authLink = setContext((_, { headers }) => {
  // Get the token from Auth
  const token = Auth.getToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client with auth
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="app-container">
        <Navbar />
        <Outlet />
      </div>
    </ApolloProvider>
  );
}

export default App;