import fastify from "fastify";
import { foodRoutes } from "./routes/food.js";

import { ZodError, z } from "zod";
import { AppError } from "./errors/app-error.js";
import { auth } from "./routes/login.js";

import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "./env/index.js";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Daily Diet API",
      description: "API para controle de dieta diária — projeto de estudos.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(foodRoutes, {
  prefix: "/food",
});

app.register(auth, {
  prefix: "/auth",
});

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
