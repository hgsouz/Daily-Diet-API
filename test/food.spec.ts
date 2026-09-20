import { afterAll, beforeEach, describe, it } from "vitest";
import { randomUUID } from "node:crypto";

import { execSync } from "node:child_process";
import request from "supertest";
import { app } from "../src/app.js";

describe("food routes", () => {
  beforeEach(() => {
    app.ready();
  });

  afterAll(() => {
    app.close;
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  // Create
  it("should add a new food", async () => {
    await request(app.server)
      .post("/food/create")
      .send({
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .expect(201);
  });

  // Update
  it("should update an old created food", async () => {
    const id = randomUUID();

    request(app.server)
      .post("/food/create")
      .send({
        id: id,
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .expect(201);

    await request(app.server)
      .put(`/food/${id}`)
      .send({
        name: "Example2",
        description: "Example2",
        date: "2026-02-02",
        time: "01:01",
        inOutDiet: "outDiet",
      })
      .expect(200);
  });

  // Listar
  it("should list all the foods created before", async () => {
    await request(app.server).get("/food").expect(200);
  });

  it("should list an unique food created before by id", async () => {
    const id = randomUUID();

    request(app.server)
      .post("/food/create")
      .send({
        id: id,
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .expect(201);

    await request(app.server).get(`/food/${id}`).expect(200);
  });

  // Deletar
  it("should delete an old created food", async () => {
    const id = randomUUID();

    request(app.server)
      .post("/food/create")
      .send({
        id: id,
        name: "Example",
        description: "Example",
        date: "2026-01-01",
        time: "10:10",
        inOutDiet: "inDiet",
      })
      .expect(201);

    await request(app.server).delete(`/food/${id}`).expect(204);
  });
});
