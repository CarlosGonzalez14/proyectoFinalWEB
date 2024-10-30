exports.up = function(knex) {
    return knex.schema
      .createTable('PreguntasJeopardy', (table) => {
        table.increments('id_pregunta').primary();
        table.string('pregunta', 255).notNullable();
        table.string('respuesta', 255).notNullable();
        table.string('categoria', 100).notNullable();
        table.integer('puntaje').notNullable();
      })
      .createTable('Preguntas100Leones', (table) => {
        table.increments('id_pregunta').primary();
        table.string('pregunta', 255).notNullable();
        table.string('categoria', 100).notNullable();
        table.string('dificultad', 50).notNullable();
      })
      .createTable('Respuestas100Leones', (table) => {
        table.increments('id_respuesta').primary();
        table.integer('id_pregunta').unsigned().notNullable();
        table.string('respuesta', 255).notNullable();
        table.integer('puntaje').notNullable();
        table.foreign('id_pregunta').references('id_pregunta').inTable('Preguntas100Leones').onDelete('CASCADE');
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('Respuestas100Leones')
      .dropTableIfExists('Preguntas100Leones')
      .dropTableIfExists('PreguntasJeopardy');
  };
  