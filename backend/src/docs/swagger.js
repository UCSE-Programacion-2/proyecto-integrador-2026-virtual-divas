const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de PintuNort',
    version: '1.0.0',
    description: 'Documentacion de endpoints para la gestion de productos.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    {
      name: 'Productos',
      description: 'Operaciones CRUD de productos',
    },
  ],
  paths: {
    '/api/products': {
      get: {
        summary: 'Obtener productos',
        tags: ['Productos'],
        parameters: [
          {
            name: 'categoria',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: ['interior', 'exterior', 'esmalte', 'accesorio'],
            },
            description: 'Filtra productos por categoria.',
          },
        ],
        responses: {
          200: {
            description: 'Listado de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product',
                  },
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      post: {
        summary: 'Crear producto',
        tags: ['Productos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Producto creado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        summary: 'Obtener producto por ID',
        tags: ['Productos'],
        parameters: [
          {
            $ref: '#/components/parameters/ProductId',
          },
        ],
        responses: {
          200: {
            description: 'Producto encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      put: {
        summary: 'Actualizar producto',
        tags: ['Productos'],
        parameters: [
          {
            $ref: '#/components/parameters/ProductId',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProductInput',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Producto actualizado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Product',
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/BadRequest',
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
        },
      },
      delete: {
        summary: 'Eliminar producto',
        tags: ['Productos'],
        parameters: [
          {
            $ref: '#/components/parameters/ProductId',
          },
        ],
        responses: {
          200: {
            description: 'Producto eliminado correctamente',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/MessageResponse',
                },
              },
            },
          },
          404: {
            $ref: '#/components/responses/NotFound',
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
  },
  components: {
    parameters: {
      ProductId: {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          example: '65a7fbdc65cde12d8a29c123',
        },
        description: 'ID de MongoDB del producto.',
      },
    },
    schemas: {
      Product: {
        allOf: [
          {
            $ref: '#/components/schemas/ProductInput',
          },
          {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '65a7fbdc65cde12d8a29c123',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        ],
      },
      ProductInput: {
        type: 'object',
        required: ['nombre', 'marca', 'categoria', 'precio'],
        properties: {
          nombre: {
            type: 'string',
            example: 'Pintura latex interior blanca',
          },
          marca: {
            type: 'string',
            example: 'Alba',
          },
          categoria: {
            type: 'string',
            enum: ['interior', 'exterior', 'esmalte', 'accesorio'],
            example: 'interior',
          },
          precio: {
            type: 'number',
            example: 12500,
          },
          stock: {
            type: 'number',
            default: 0,
            example: 15,
          },
          descripcion: {
            type: 'string',
            example: 'Pintura lavable para paredes interiores.',
          },
          imagen: {
            type: 'string',
            default: '',
            example: 'https://example.com/pintura.jpg',
          },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          mensaje: {
            type: 'string',
            example: 'Producto eliminado correctamente',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          mensaje: {
            type: 'string',
            example: 'Producto no encontrado',
          },
          error: {
            type: 'string',
            example: 'Detalle del error',
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Solicitud invalida',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
