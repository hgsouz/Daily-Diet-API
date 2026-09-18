import fastify from "fastify";
import { foodRoutes } from "./routes/food";

import { ZodError, z } from "zod";
import { AppError } from "./errors/app-error";

export const app = fastify();

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Formato incorreto de dados.",
      issues: z.treeifyError(error),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  console.log(error);
  return reply.status(500).send({
    message: "Erro interno no servidor, tente novamente mais tarde.",
  });
});

app.register(foodRoutes, {
  prefix: "/food",
});
