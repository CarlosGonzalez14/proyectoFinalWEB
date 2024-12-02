const { Model } = require('objection');

class Preguntas100Leones extends Model {
    static get tableName() {
      return 'Preguntas100Leones';
    }
  
    static get idColumn() {
      return 'id_pregunta';
    }
  
    static get jsonSchema() {
      return {
        type: 'object',
        required: ['pregunta', 'categoria', 'dificultad'],
  
        properties: {
          id_pregunta: { type: 'integer' },
          pregunta: { type: 'string', maxLength: 255 },
          categoria: { type: 'string', maxLength: 100 },
          dificultad: { type: 'string', maxLength: 50 },
        },
      };
    }
  
    static get relationMappings() {
      const Respuestas100Leones = require('./Respuestas100Leones');
  
      return {
        respuestas: {
          relation: Model.HasManyRelation,
          modelClass: Respuestas100Leones,
          join: {
            from: 'Preguntas100Leones.id_pregunta',
            to: 'Respuestas100Leones.id_pregunta',
          },
        },
      };
    }
  }
  
  module.exports = Preguntas100Leones;