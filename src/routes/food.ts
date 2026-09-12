/* 
Aqui devemos ter rotas para as seguintes funcionalidades:
- Registro de nova refeição (post) [x]
- Edição de refeição mapeada por ID (put)
- Apagar refeição anterior (delete)
- Listar refeições unitárias ou completas (get)
- Recuperar metricas - lógica de soma por função (get) 
*/

import { FastifyInstance } from "fastify";
import z, { string } from "zod";
import { randomUUID } from "node:crypto";
import { knexDb } from "../database";
import { id } from "zod/v4/locales";

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
}
