class Respuestas100Leones extends Model {
    static get tableName() {
      return 'Respuestas100Leones';
    }
  
    static get idColumn() {
      return 'id_respuesta';
    }
  
    static get jsonSchema() {
      return {
        type: 'object',
        required: ['id_pregunta', 'respuesta', 'puntaje'],
  
        properties: {
          id_respuesta: { type: 'integer' },
          id_pregunta: { type: 'integer' },
          respuesta: { type: 'string', maxLength: 255 },
          puntaje: { type: 'integer' },
        },
      };
    }
  }
  