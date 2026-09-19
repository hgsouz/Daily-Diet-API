import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("food_description", (table) => {
    (table.uuid("id").primary(),
      table.text("name").notNullable(),
      table.text("description").nullable(),
      table.date("date").notNullable(),
      table.time("time").notNullable(),
      table.string("inOutDiet").notNullable());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("food_description");
}
