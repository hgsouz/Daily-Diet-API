/* 
Aqui devemos criar rotas de criação e validação e login da plataforma -
Metodos: Post & Get
*/

import type { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { knexDb } from "../database.js";
import { randomUUID } from "node:crypto";

export async function auth(app: FastifyInstance) {
  // Post
  app.post("/create", async (request, reply) => {
    const authSchema = z.object({
      name: z.string().min(1),
      email: z.string(),
      password: z.string().min(6),
    });

    const { name, email, password } = authSchema.parse(request.body);

    const existing = await knexDb("user").where({ email }).first();
    if (existing) {
      return reply.status(409).send({ message: "E-mail já cadastrado." });
    }

    const password_hash = await bcrypt.hash(password, 8);

    await knexDb("user").insert({
      id: randomUUID(),
      name,
      email,
      password_hash,
    });

    return reply.status(201).send();
  });

  app.post("/", async (request, reply) => {
    const loginSchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = loginSchema.parse(request.body);

    const user = await knexDb("user").where({ email }).first();

    const checkPassword = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !checkPassword) {
      reply.status(401).send({ message: "Usúario e/ou senha incorretos" });
    }

    const token = await reply.jwtSign(
      {},
      { sign: { sub: user.id, expiresIn: "1d" } },
    );

    return reply.status(200).send({ token });
  });
}
