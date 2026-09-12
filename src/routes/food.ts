/* 
Aqui devemos ter rotas para as seguintes funcionalidades:
- Registro de nova refeição (post) [x]
- Edição de refeição mapeada por ID (put) [x]
- Apagar refeição anterior (delete) [delete] [x]
- Listar refeições unitárias ou completas (get) [x]
- Recuperar metricas - lógica de soma por função (get) 
*/

import { FastifyInstance } from "fastify";
import z from "zod";
import { randomUUID } from "node:crypto";
import { knexDb } from "../database";

export async function foodRoutes(app: FastifyInstance) {
  //GET
  app.get("/", async () => {
    const listFood = await knexDb("food_description").select();

    return { listFood };
  });

  app.get("/:id", async (request) => {
    const getUniqueFoodSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getUniqueFoodSchema.parse(request.params);

    const listUniqueFood = await knexDb("food_description")
      .select()
      .where({ id });

    return { listUniqueFood };
  });

  // PUT
  app.put("/:id", async (request, reply) => {
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

    await knexDb("food_description")
      .update({
        name,
        description,
        date,
        time,
        inOutDiet,
      })
      .where({ id });

    return reply.status(200).send("Refeição atualizada com sucesso!");
  });

  // POST
  app.post("/create", async (request, reply) => {
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
      id: randomUUID(),
      name,
      description,
      date,
      time,
      inOutDiet,
    });

    return reply.status(201).send("Nova refeição adicionada com sucesso!");
  });

  // DELETE
  app.delete("/:id", async (request) => {
    const getUniqueFoodSchema = z.object({
      id: z.uuid(),
    });

    const { id } = getUniqueFoodSchema.parse(request.params);

    const deleteUniqueFood = await knexDb("food_description")
      .delete()
      .where({ id });

    return { deleteUniqueFood };
  });
}
