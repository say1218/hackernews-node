//const { ApolloServer , PubSub} = require('apollo-server');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');


const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express  =  require('express');
const http  = require('http');


const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')
const Subscription = require('./resolvers/Subscription')

const { getUserId } = require('./utils');

const prisma = new PrismaClient();
//const pubsub = new PubSub();

const resolvers  = {
  Query,
  Mutation,
  Subscription,
  User,
  Link
}


// 3
// const server = new ApolloServer({
//   typeDefs : fs.readFileSync(
//     path.join(__dirname, 'schema.graphql'),
//     'utf8'
//   ),
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   context:({ req }) => {
//     return {
//       ...req,
//       prisma,
//       pubsub,
//       userId:
//         req && req.headers.authorization
//           ? getUserId(req)
//           : null
//     };
  //}
  //above - Instead of attaching an object directly, you’re now creating the context as a function which returns the context. 
  //The advantage of this approach is that you can attach the HTTP request that carries the incoming GraphQL query 
  //(or mutation) to the context as well. This will allow your resolvers to read the Authorization header and validate 
  //if the user who submitted the request is eligible to perform the requested operation.

  //above-(before authentication) attaching an instance of PrismaClient (as prisma) to it when the GraphQLServer is instantiated, you’ll now be able to access context.prisma in all of your resolvers
//});






// server
//   .listen()
//   .then(({ url }) =>
//     console.log(`Server is running on ${url}`)
// );


async function startApolloServer() {

  const app = express();
  const httpServer = http.createServer(app);

  const resolvers  = {
    Query,
    Mutation,
    Subscription,
    User,
    Link
  }

  const server = new ApolloServer({
    typeDefs : fs.readFileSync(
      path.join(__dirname, 'schema.graphql'),
      'utf8'
    ),
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context:({ req }) => {
      return {
        ...req,
        prisma,
        userId:
          req && req.headers.authorization
            ? getUserId(req)
            : null
      };
    }
    //above - Instead of attaching an object directly, you’re now creating the context as a function which returns the context. 
    //The advantage of this approach is that you can attach the HTTP request that carries the incoming GraphQL query 
    //(or mutation) to the context as well. This will allow your resolvers to read the Authorization header and validate 
    //if the user who submitted the request is eligible to perform the requested operation.
  
    //above-(before authentication) attaching an instance of PrismaClient (as prisma) to it when the GraphQLServer is instantiated, you’ll now be able to access context.prisma in all of your resolvers
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();