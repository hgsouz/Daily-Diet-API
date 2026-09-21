/* 
Aqui devemos ter rotas para as seguintes funcionalidades:
- Registro de nova refeição (post) [x]
- Edição de refeição mapeada por ID (put) [x]
- Apagar refeição anterior (delete) [delete] [x]
- Listar refeições unitárias ou completas (get) [x]
- Recuperar metricas - lógica de soma por função (get) 
*/

import type { FastifyInstance } from "fastify";
import z from "zod";
import { randomUUID } from "node:crypto";
import { knexDb } from "../database.js";
import { AppError } from "../errors/app-error.js";
import { checkAuth } from "../middlewares/check_auth.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export async function foodRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  // Post
  const createFoodSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.iso.date(),
    time: z.iso.time(),
    inOutDiet: z.enum(["inDiet", "outDiet"]),
  });

  server.post(
    "/create",
    {
      preHandler: [checkAuth],
      schema: {
        tags: ["Food"],
        summary: "Criação de uma nova refeição",
        security: [{ bearerAuth: [] }],
        body: createFoodSchema,
        response: {
          201: z.object({ id: z.uuid() }),
        },
      },
    },

    async (request, reply) => {
      const userId = request.user.sub;
      const id = randomUUID();

      const { name, description, date, time, inOutDiet } = request.body;

      await knexDb("food_description").insert({
        id,
        userId,
        name,
        description,
        date,
        time,
        inOutDiet,
      });

      return reply.status(201).send({ id });
    },
  );

  //GET
  const getUniqueFoodSchema = z.object({
    id: z.uuid(),
  });

  server.get(
    "/",
    {
      preHandler: [checkAuth],
      schema: {
        tags: ["Food"],
        summary: "Listar todas as refeições",
        security: [{ bearerAuth: [] }],
      },
    },

    async (request) => {
      const userId = request.user.sub;

      const listFood = await knexDb("food_description")
        .where({ userId })
        .select();

      return { listFood };
    },
  );

  server.get(
    "/:id",
    {
      preHandler: [checkAuth],
      schema: {
        tags: ["Food"],
        summary: "Listar uma refeição com base em seu ID",
        security: [{ bearerAuth: [] }],
        params: getUniqueFoodSchema,
      },
    },

    async (request) => {
      const userId = request.user.sub;

      const { id } = request.params;

      const listUniqueFood = await knexDb("food_description")
        .where({ id, userId })
        .first();

      if (!listUniqueFood) {
        throw new AppError("Refeição não encontrada", 404);
      }

      return { listUniqueFood };
    },
  );

  // PUT
  const editFoodSchema = z.object({
    name: z.string(),
    description: z.string(),
    date: z.iso.date(),
    time: z.iso.time(),
    inOutDiet: z.enum(["inDiet", "outDiet"]),
  });

  const editFoodParamSchema = z.object({
    id: z.uuid(),
  });

  server.put(
    "/:id",
    {
      preHandler: [checkAuth],
      schema: {
        tags: ["Food"],
        summary: "Atualização de uma refeição com base em seu ID",
        security: [{ bearerAuth: [] }],
        body: editFoodSchema,
        params: editFoodParamSchema,
        response: {
          200: z.string(),
        },
      },
    },

    async (request, reply) => {
      const userId = request.user.sub;

      const { id } = request.params;
      const { name, description, date, time, inOutDiet } = request.body;

      const updatedRows = await knexDb("food_description")
        .update({
          name,
          description,
          date,
          time,
          inOutDiet,
        })
        .where({ id, userId });

      if (updatedRows === 0) {
        throw new AppError("Refeição não encontrada", 404);
      }

      return reply.status(200).send("Refeição atualizada com sucesso!");
    },
  );

  // DELETE
  const deleteUniqueFoodSchema = z.object({
    id: z.uuid(),
  });

  server.delete(
    "/:id",
    {
      preHandler: [checkAuth],
      schema: {
        tags: ["Food"],
        summary: "Apagar uma refeição",
        security: [{ bearerAuth: [] }],
        params: deleteUniqueFoodSchema,
        response: {
          204: z.null(),
        },
      },
    },

    async (request, reply) => {
      const userId = request.user.sub;

      const { id } = request.params;

      const deletedRows = await knexDb("food_description")
        .delete()
        .where({ id, userId });

      if (deletedRows === 0) {
        throw new AppError("Refeição não encontrada", 404);
      }

      return reply.status(204).send(null);
    },
  );
}
