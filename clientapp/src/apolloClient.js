import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
    uri: "https://hfnajybwp9.execute-api.us-east-1.amazonaws.com/dev/graphql",

});