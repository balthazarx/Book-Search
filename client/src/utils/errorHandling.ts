// Create a utils/errorHandling.ts file
export const handleGraphQLError = (error: any) => {
    const errorMessage = error?.graphQLErrors?.[0]?.message || 
      error?.networkError?.result?.errors?.[0]?.message ||
      'Something went wrong!';
    
    return errorMessage;
  };