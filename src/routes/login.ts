/* 
Aqui devemos criar rotas de criação e validação e login da plataforma -
Metodos: Post & Get
*/

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { knexDb } from "../database.js";
import { randomUUID } from "node:crypto";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function auth(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();
  // Post
  const authSchema = z.object({
    name: z.string().min(1),
    email: z.string(),
    password: z.string().min(6),
  });

  server.post(
    "/create",
    {
      schema: {
        tags: ["Auth"],
        summary: "Cadastro de novo usuário",
        body: authSchema,
        response: {
          201: z.null(),
          409: z.object({ message: z.string() }),
        },
      },
    },

    async (request, reply) => {
      const { name, email, password } = request.body;

      const existing = await knexDb("users").where({ email }).first();
      if (existing) {
        return reply.status(409).send({ message: "E-mail já cadastrado." });
      }

      const password_hash = await bcrypt.hash(password, 8);

      await knexDb("users").insert({
        id: randomUUID(),
        name,
        email,
        password_hash,
      });

      return reply.status(201).send(null);
    },
  );

  const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  server.post(
    "/",
    {
      schema: {
        tags: ["Auth"],
        summary: "Login de usuário cadastrado",
        body: loginSchema,
        response: {
          200: z.object({ token: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },

    async (request, reply) => {
      const { email, password } = request.body;

      const user = await knexDb("users").where({ email }).first();

      const checkPassword = user
        ? await bcrypt.compare(password, user.password_hash)
        : false;

      if (!user || !checkPassword) {
        return reply
          .status(401)
          .send({ message: "Usúario e/ou senha incorretos" });
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        { sign: { expiresIn: "1d" } },
      );

      return reply.status(200).send({ token });
    },
  );
}
