import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { randomUUID } from "node:crypto";

import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app.js";

describe("food routes", () => {
  let token: string;

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync("npm run knex -- migrate:rollback --all");
    execSync("npm run knex -- migrate:latest");

    await request(app.server)
      .post("/auth/create")

      .send({
        name: "Teste",
        email: "teste@teste.com",
        password: "testing",
      });

    const loginResponse = await request(app.server)
      .post("/auth")

      .send({
        email: "teste@teste.com",
        password: "testing",
      });

    token = loginResponse.body.token;
  });

  // Create
  it("should add a new food", async () => {
    const { body } = await request(app.server)
      .post("/food/create")
      .send({
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const id = body.id;
  });

  // Update
  it("should update an old created food", async () => {
    const { body } = await request(app.server)
      .post("/food/create")
      .send({
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const id = body.id;

    await request(app.server)
      .put(`/food/${id}`)
      .send({
        name: "Example2",
        description: "Example2",
        date: "2026-02-02",
        time: "01:01",
        inOutDiet: "outDiet",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // Listar
  it("should list all the foods created before", async () => {
    await request(app.server)
      .get("/food")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should list an unique food created before by id", async () => {
    const { body } = await request(app.server)
      .post("/food/create")
      .send({
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const id = body.id;

    await request(app.server)
      .get(`/food/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  // Deletar
  it("should delete an old created food", async () => {
    const { body } = await request(app.server)
      .post("/food/create")
      .send({
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const id = body.id;

    await request(app.server)
      .delete(`/food/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });
});
