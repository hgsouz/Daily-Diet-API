import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("food_description", (table) => {
    (table.uuid("id").primary(),
      table.string("name").nullable,
      table.string("description").nullable,
      table.date("date").nullable,
      table.time("time").nullable,
      table.string("inOutDiet").nullable);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("food_description");
}
