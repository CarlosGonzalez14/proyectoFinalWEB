exports.seed = async function (knex) {
    await knex('Respuestas100Leones').del();
    await knex('Preguntas100Leones').del();
  
    const preguntas = [
      {
        pregunta: '¿Cuáles son los lenguajes de programación más demandados?',
        categoria: 'Algoritmos y programación',
        dificultad: 'Normal',
      },
      {
        pregunta: '¿Cuáles son los dispositivos de red y ciberseguridad más importantes?',
        categoria: 'Redes y ciberseguridad',
        dificultad: 'Difícil',
      },
      {
        pregunta: '¿Cuáles son los lenguajes operativos con más cuota de mercado?',
        categoria: 'Sistemas Operativos',
        dificultad: 'Fácil',
      },
    ];
  
    const idsPreguntas = await knex('Preguntas100Leones').insert(preguntas).returning('id_pregunta');
  
    const idPreguntaValues = idsPreguntas.map((idObj) => idObj.id_pregunta || idObj);
  
    const respuestas = [
      { id_pregunta: idPreguntaValues[0], respuesta: 'JavaScript', puntaje: 29 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'Python', puntaje: 19 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'Java', puntaje: 17 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'C#', puntaje: 11 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'PHP', puntaje: 9 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'C/C++', puntaje: 9 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'Ruby', puntaje: 4 },
      { id_pregunta: idPreguntaValues[0], respuesta: 'Go', puntaje: 2 },
  
      { id_pregunta: idPreguntaValues[1], respuesta: 'Router', puntaje: 30 },
      { id_pregunta: idPreguntaValues[1], respuesta: 'Switch', puntaje: 25 },
      { id_pregunta: idPreguntaValues[1], respuesta: 'Firewall', puntaje: 22 },
      { id_pregunta: idPreguntaValues[1], respuesta: 'AP/AC', puntaje: 10 },
      { id_pregunta: idPreguntaValues[1], respuesta: 'Servidor AAA', puntaje: 8 },
      { id_pregunta: idPreguntaValues[1], respuesta: 'Load Balancer', puntaje: 5 },
  
      { id_pregunta: idPreguntaValues[2], respuesta: 'Windows', puntaje: 73 },
      { id_pregunta: idPreguntaValues[2], respuesta: 'OS X (Apple)', puntaje: 20 },
      { id_pregunta: idPreguntaValues[2], respuesta: 'Linux', puntaje: 5 },
      { id_pregunta: idPreguntaValues[2], respuesta: 'ChromeOS', puntaje: 2 },
    ];
  
    await knex('Respuestas100Leones').insert(respuestas);
  };
  