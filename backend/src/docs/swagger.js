// Arma un requestBody JSON a partir de las propiedades
const jsonBody = (properties) => ({
  required: true,
  content: { 'application/json': { schema: { type: 'object', properties } } },
});

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de PintuNort',
    version: '1.0.0',
    description: 'Documentacion de endpoints para la gestion de productos.',
  },
  servers: [
    {
      url: '/',
      description: 'Servidor actual (local o producción)',
    },
  ],
  tags: [
    {
      name: 'Productos',
      description: 'Operaciones CRUD de productos (escritura solo admin)',
    },
    { name: 'Auth', description: 'Registro, login y usuario actual' },
    { name: 'Carrito', description: 'Carrito guardado del usuario logueado' },
    { name: 'Pedidos', description: 'Compras simuladas' },
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
          {
            name: 'q',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Busca por nombre, marca o descripcion.',
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
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
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
        security: [{ bearerAuth: [] }],
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

    '/api/auth/register': {
      post: {
        summary: 'Registrar usuario',
        tags: ['Auth'],
        requestBody: jsonBody({
          name: { type: 'string', example: 'Juan' },
          email: { type: 'string', example: 'juan@mail.com' },
          password: { type: 'string', example: '123456' },
        }),
        responses: {
          201: { description: 'Usuario creado (devuelve token y user)' },
          400: { $ref: '#/components/responses/BadRequest' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Iniciar sesion',
        tags: ['Auth'],
        requestBody: jsonBody({
          email: { type: 'string', example: 'admin@pintunort.com' },
          password: { type: 'string', example: 'admin123' },
        }),
        responses: {
          200: { description: '{ token, user: { id, name, email, role } }' },
          401: { description: 'Credenciales invalidas' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Usuario de la sesion actual',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: '{ user }' }, 401: { description: 'Sin sesion' } },
      },
    },
    '/api/cart': {
      get: {
        summary: 'Obtener mi carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: '{ items, total }' }, 401: { description: 'Sin sesion' } },
      },
      put: {
        summary: 'Reemplazar mi carrito completo',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody({
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: { productId: { type: 'string' }, quantity: { type: 'number' } },
            },
          },
        }),
        responses: {
          200: { description: '{ items, total }' },
          400: { description: 'Datos invalidos' },
        },
      },
      delete: {
        summary: 'Vaciar mi carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Carrito vacio' } },
      },
    },
    '/api/cart/items': {
      post: {
        summary: 'Agregar producto al carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody({
          productId: { type: 'string' },
          quantity: { type: 'number', example: 1 },
        }),
        responses: {
          201: { description: '{ items, total }' },
          400: { description: 'Datos invalidos' },
          404: { description: 'Producto no encontrado' },
        },
      },
    },
    '/api/cart/items/{productId}': {
      patch: {
        summary: 'Cambiar cantidad (0 = quitar)',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody({ quantity: { type: 'number', example: 2 } }),
        responses: {
          200: { description: '{ items, total }' },
          404: { description: 'No esta en el carrito' },
        },
      },
      delete: {
        summary: 'Quitar producto del carrito',
        tags: ['Carrito'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: '{ items, total }' },
          404: { description: 'No esta en el carrito' },
        },
      },
    },
    '/api/orders': {
      post: {
        summary: 'Simular compra',
        tags: ['Pedidos'],
        security: [{ bearerAuth: [] }],
        requestBody: jsonBody({
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: { productId: { type: 'string' }, quantity: { type: 'number' } },
            },
          },
          cliente: {
            type: 'object',
            properties: {
              nombre: { type: 'string' },
              apellido: { type: 'string' },
              email: { type: 'string' },
              telefono: { type: 'string' },
              direccion: { type: 'string' },
              ciudad: { type: 'string' },
              zona: { type: 'string' },
              notas: { type: 'string' },
            },
          },
          metodoPago: { type: 'string', enum: ['efectivo', 'transferencia', 'tarjeta'] },
        }),
        responses: {
          201: { description: '{ mensaje, order } (descuenta stock y vacia el carrito)' },
          400: { description: 'Sin stock o datos invalidos' },
        },
      },
      get: {
        summary: 'Listar todos los pedidos (admin)',
        tags: ['Pedidos'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array de pedidos' }, 403: { description: 'Solo admin' } },
      },
    },
    '/api/orders/mine': {
      get: {
        summary: 'Mis pedidos',
        tags: ['Pedidos'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Array de pedidos del usuario' } },
      },
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Detalle de un pedido (dueño o admin)',
        tags: ['Pedidos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Pedido' }, 404: { description: 'No encontrado' } },
      },
    },
    '/api/orders/{id}/status': {
      patch: {
        summary: 'Cambiar estado del pedido (admin)',
        tags: ['Pedidos'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: jsonBody({
          estado: { type: 'string', enum: ['pendiente', 'preparando', 'entregado', 'cancelado'] },
        }),
        responses: {
          200: { description: 'Pedido actualizado' },
          400: { description: 'Estado invalido' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
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
