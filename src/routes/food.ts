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

export async function foodRoutes(app: FastifyInstance) {
  //GET
  app.get("/", { preHandler: [checkAuth] }, async (request) => {
    const userId = request.user.sub;

    const listFood = await knexDb("food_description")
      .where({ userId })
      .select();

    return { listFood };
  });

  app.get("/:id", { preHandler: [checkAuth] }, async (request) => {
    const userId = request.user.sub;

    const getUniqueFoodSchema = z.object({
      id: z.uuid(),
    });
    const { id } = getUniqueFoodSchema.parse(request.params);

    const listUniqueFood = await knexDb("food_description")
      .where({ id, userId })
      .first();

    if (!listUniqueFood) {
      throw new AppError("Refeição não encontrada", 404);
    }

    return { listUniqueFood };
  });

  // PUT
  app.put("/:id", { preHandler: [checkAuth] }, async (request, reply) => {
    const userId = request.user.sub;

    const editFoodParamSchema = z.object({
      id: z.uuid(),
    });

    const editFoodSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.iso.date(),
      time: z.iso.time(),
      inOutDiet: z.enum(["inDiet", "outDiet"]),
    });

    const { id } = editFoodParamSchema.parse(request.params);
    const { name, description, date, time, inOutDiet } = editFoodSchema.parse(
      request.body,
    );

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
  });

  // POST
  app.post("/create", { preHandler: [checkAuth] }, async (request, reply) => {
    const userId = request.user.sub;
    const id = randomUUID();

    const createFoodSchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.iso.date(),
      time: z.iso.time(),
      inOutDiet: z.enum(["inDiet", "outDiet"]),
    });

    const { name, description, date, time, inOutDiet } = createFoodSchema.parse(
      request.body,
    );

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
  });

  // DELETE
  app.delete("/:id", { preHandler: [checkAuth] }, async (request, reply) => {
    const userId = request.user.sub;

    const getUniqueFoodSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getUniqueFoodSchema.parse(request.params);

    const deletedRows = await knexDb("food_description")
      .delete()
      .where({ id, userId });

    if (deletedRows === 0) {
      throw new AppError("Refeição não encontrada", 404);
    }

    return reply.status(204).send("Refeição deletada com sucesso!");
  });
}
