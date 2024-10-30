exports.seed = async function(knex) {
    await knex('PreguntasJeopardy').del();
  
    await knex('PreguntasJeopardy').insert([
      {
        pregunta: 'Encuentra la integral definida de f(x) = 2x desde x = 1 hasta x = 3.',
        respuesta: '\\int_{1}^{3} 2x \\, dx = 8.',
        categoria: 'Matemáticas básicas',
        puntaje: 200
      },
      {
        pregunta: 'Calcula la derivada de la función f(x) = e^{2x} \\sin(x) utilizando la regla del producto.',
        respuesta: 'f\'(x) = e^{2x} (2 \\sin(x) + \\cos(x)).',
        categoria: 'Matemáticas básicas',
        puntaje: 400
      },
      {
        pregunta: 'Encuentra la integral indefinida \\int \\frac{1}{x \\ln(x)} \\, dx.',
        respuesta: '\\ln(\\ln(x)) + C.',
        categoria: 'Matemáticas básicas',
        puntaje: 600
      },
      {
        pregunta: 'Resuelve el sistema de ecuaciones utilizando el método de matrices.',
        respuesta: 'x = 1, y = 0, z = 0.',
        categoria: 'Matemáticas básicas',
        puntaje: 800
      },
      {
        pregunta: 'Encuentra los valores propios y vectores propios de la siguiente matriz: A = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}.',
        respuesta: 'Valores propios: \\lambda_1 = 3, \\lambda_2 = 1. Vectores propios: v_1 = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}, v_2 = \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix}.',
        categoria: 'Matemáticas básicas',
        puntaje: 1000
      },
  
      {
        pregunta: '¿Qué lenguaje de programación es conocido por su uso en desarrollo web y tiene una sintaxis similar a C?',
        respuesta: 'JavaScript.',
        categoria: 'Ingeniería en Sistemas',
        puntaje: 200
      },
      {
        pregunta: '¿Cuál es la 4ta capa del modelo OSI?',
        respuesta: 'Capa de transporte.',
        categoria: 'Ingeniería en Sistemas',
        puntaje: 400
      },
      {
        pregunta: 'Método HTTP que permite enviar modificaciones parciales a un recurso en el servidor.',
        respuesta: 'PATCH.',
        categoria: 'Ingeniería en Sistemas',
        puntaje: 600
      },
      {
        pregunta: '¿Qué significa CRUD en el contexto de bases de datos?',
        respuesta: 'Create, Read, Update, Delete.',
        categoria: 'Ingeniería en Sistemas',
        puntaje: 800
      },
      {
        pregunta: 'Menciona dos tipos de sistemas operativos.',
        respuesta: 'Sistemas operativos monolíticos y distribuidos.',
        categoria: 'Ingeniería en Sistemas',
        puntaje: 1000
      },
  
      {
        pregunta: '¿Qué material se utiliza comúnmente para construir estructuras de soporte como puentes?',
        respuesta: 'Acero o concreto.',
        categoria: 'Ingeniería Civil',
        puntaje: 200
      },
      {
        pregunta: '¿Cuál es el proceso de determinar las reacciones internas y externas en estructuras?',
        respuesta: 'Análisis estructural.',
        categoria: 'Ingeniería Civil',
        puntaje: 400
      },
      {
        pregunta: 'Prueba in situ que mide la resistencia del suelo al golpear un barreno con un martillo estándar.',
        respuesta: 'El SPT o Sondeo de penetración estándar.',
        categoria: 'Ingeniería Civil',
        puntaje: 600
      },
      {
        pregunta: '¿Qué parámetro adimensional clasifica el régimen del flujo en subcrítico (Fr < 1)?',
        respuesta: 'Número de Froude.',
        categoria: 'Ingeniería Civil',
        puntaje: 800
      },
      {
        pregunta: 'Es la parte de la presión total que es soportada por la estructura sólida del suelo, excluyendo la presión de los poros de agua.',
        respuesta: 'Presión efectiva.',
        categoria: 'Ingeniería Civil',
        puntaje: 1000
      }
    ]);
  };
  