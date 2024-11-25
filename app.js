const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');
const PreguntasJeopardy = require('./models/PreguntasJeopardy');

const knex = Knex(knexConfig.development);
Model.knex(knex);

async function obtenerPregunta(categoria, puntaje) {
  const pregunta = await PreguntasJeopardy.query()
  .where('categoria', categoria)
  .andWhere('puntaje', puntaje)
  .first();
  
  return pregunta;
}

console.log(PreguntasJeopardy);

module.exports = { obtenerPregunta };
