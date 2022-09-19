import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";

const schema = await loadSchema("**/src/schema/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

export default schema;
