import fastify from "fastify";
import { foodRoutes } from "./routes/food";

export const app = fastify();

app.register(foodRoutes, {
  prefix: "/food",
});
