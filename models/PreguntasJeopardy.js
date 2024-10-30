const { Model } = require('objection');

class PreguntasJeopardy extends Model {
  static get tableName() {
    return 'PreguntasJeopardy';
  }

  static get idColumn() {
    return 'id_pregunta';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['pregunta', 'respuesta', 'categoria', 'puntaje'],

      properties: {
        id_pregunta: { type: 'integer' },
        pregunta: { type: 'string', maxLength: 255 },
        respuesta: { type: 'string', maxLength: 255 },
        categoria: { type: 'string', maxLength: 100 },
        puntaje: { type: 'integer' },
      },
    };
  }
}

module.exports = PreguntasJeopardy;