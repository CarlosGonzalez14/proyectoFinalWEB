const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('./knexfile');
const PreguntasJeopardy = require('./models/PreguntasJeopardy');
const Preguntas100Leones = require('./models/Preguntas100Leones');
const Respuestas100Leones = require('./models/Respuestas100Leones');



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

async function obtenerPregunta100Leones(idPregunta) {
  try {
    const pregunta = await Preguntas100Leones.query().findById(idPregunta);

    if (!pregunta) {
      throw new Error(`No se encontró la pregunta con el ID ${idPregunta}`);
    }

    return pregunta;
  } catch (error) {
    console.error(`Error al obtener la pregunta: ${error.message}`);
    throw error;
  }
}

async function obtenerRespuestas100Leones(idPregunta) {
  try {
    const respuestas = await Respuestas100Leones.query().where('id_pregunta', idPregunta);

    if (!respuestas || respuestas.length === 0) {
      throw new Error(`No se encontraron respuestas para la pregunta con el ID ${idPregunta}`);
    }

    return respuestas;
  } catch (error) {
    console.error(`Error al obtener las respuestas: ${error.message}`);
    throw error;
  }
}

module.exports = { obtenerPregunta , obtenerPregunta100Leones, obtenerRespuestas100Leones };
