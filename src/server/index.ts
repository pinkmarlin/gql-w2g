import { ApolloServer, gql } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";

import express from "express";
import http from "http";
import typeDefs from "../schema";
import resolvers from "../resolvers";
import playgroundMiddleware from "graphql-playground-middleware-express";
import cors from "cors";

const DEFAULT_PORT = 4000;

const buildServer = async (port = DEFAULT_PORT) => {
  const app = express();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs: typeDefs as any,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageDisabled(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    cache: "bounded",
    csrfPrevention: true,
  });

  await server.start();

  server.applyMiddleware({ app });
  // Middleware
  app.get(
    "/playground",
    //@ts-ignore
    playgroundMiddleware.default({
      endpoint: "/graphql",
      env: process.env,
      workspaceName: "W2G",
    })
  );

  app.use(cors());

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once("listening", resolve).once("error", reject);
  })
    .then(() => {
      console.log("🚀 Server is ready at http://localhost:4000/graphql");
      console.log(
        "🚀 GQL Playground is ready at http://localhost:4000/playground"
      );
    })
    .catch((err) => {
      console.error("💀 Error starting the node server", err);
    });
};

export default buildServer;
