type OpenApiSchema = Record<string, unknown>;

type OpenApiSpec = {
  openapi: string;
  info: Record<string, unknown>;
  servers: Array<Record<string, unknown>>;
  tags: Array<Record<string, unknown>>;
  components: Record<string, unknown>;
  paths: Record<string, unknown>;
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'ID data yang akan diproses.',
  schema: {
    type: 'integer',
    example: 1,
  },
};

const bearerSecurity = [{ bearerAuth: [] }];

const jsonContent = (schema: OpenApiSchema) => ({
  'application/json': {
    schema,
  },
});

const success = (description: string, schema: OpenApiSchema) => ({
  description,
  content: jsonContent(schema),
});

const errorResponse = (description: string) => ({
  description,
  content: jsonContent({ $ref: '#/components/schemas/ErrorResponse' }),
});

const requestBody = (schema: OpenApiSchema, required = true) => ({
  required,
  content: jsonContent(schema),
});

export const openApiSpec: OpenApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Kulinerku Backend API',
    version: '1.0.0',
    description:
      'Dokumentasi lengkap Swagger/OpenAPI untuk backend Kulinerku. Gunakan Bearer Token dari endpoint login untuk mengakses endpoint yang diproteksi.',
    contact: {
      name: 'Kulinerku Backend',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Server saat ini',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Registrasi dan login pengguna.' },
    { name: 'Users', description: 'Manajemen data pengguna dan admin.' },
    { name: 'Categories', description: 'Manajemen kategori makanan.' },
    { name: 'Foods', description: 'Manajemen menu makanan.' },
    { name: 'Orders', description: 'Pemesanan makanan.' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Masukkan JWT access token dari response POST /auth/login.',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Budi Santoso' },
          email: {
            type: 'string',
            format: 'email',
            example: 'budi@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'budi@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'password123',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Budi Santoso' },
          email: {
            type: 'string',
            format: 'email',
            example: 'budi@example.com',
          },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-30T00:28:20.000Z',
          },
        },
      },
      UserWithPassword: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: {
              password: { type: 'string', example: '$2b$10$hashedPassword' },
            },
          },
        ],
      },
      CategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: 'Makanan Berat' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Makanan Berat' },
        },
      },
      FoodRequest: {
        type: 'object',
        required: ['name', 'price', 'categoryId'],
        properties: {
          name: { type: 'string', example: 'Nasi Goreng' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Nasi goreng spesial dengan telur.',
          },
          price: { type: 'number', format: 'float', example: 25000 },
          categoryId: { type: 'integer', example: 1 },
        },
      },
      Food: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Nasi Goreng' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Nasi goreng spesial dengan telur.',
          },
          price: { type: 'number', format: 'float', example: 25000 },
          categoryId: { type: 'integer', example: 1 },
        },
      },
      FoodWithCategory: {
        allOf: [
          { $ref: '#/components/schemas/Food' },
          {
            type: 'object',
            properties: {
              category: { $ref: '#/components/schemas/Category' },
            },
          },
        ],
      },
      OrderItemRequest: {
        type: 'object',
        required: ['foodId', 'qty'],
        properties: {
          foodId: { type: 'integer', example: 1 },
          qty: { type: 'integer', minimum: 1, example: 2 },
        },
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['userId', 'items'],
        properties: {
          userId: { type: 'integer', example: 1 },
          items: {
            type: 'array',
            minItems: 1,
            items: { $ref: '#/components/schemas/OrderItemRequest' },
          },
        },
      },
      OrderDetail: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          qty: { type: 'integer', example: 2 },
          price: { type: 'number', format: 'float', example: 25000 },
          subtotal: { type: 'number', format: 'float', example: 50000 },
          orderId: { type: 'integer', example: 1 },
          foodId: { type: 'integer', example: 1 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          totalPrice: { type: 'number', format: 'float', example: 50000 },
          status: { type: 'string', example: 'pending' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-30T00:28:20.000Z',
          },
          userId: { type: 'integer', example: 1 },
        },
      },
      OrderWithDetails: {
        allOf: [
          { $ref: '#/components/schemas/Order' },
          {
            type: 'object',
            properties: {
              orderdetail: {
                type: 'array',
                items: { $ref: '#/components/schemas/OrderDetail' },
              },
            },
          },
        ],
      },
      OrderWithDetailsAndUser: {
        allOf: [
          { $ref: '#/components/schemas/OrderWithDetails' },
          {
            type: 'object',
            properties: {
              user: { $ref: '#/components/schemas/UserWithPassword' },
            },
          },
        ],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            oneOf: [
              { type: 'string', example: 'Unauthorized' },
              {
                type: 'array',
                items: { type: 'string' },
                example: ['Validation error'],
              },
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'integer', example: 400 },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register pengguna baru',
        description: 'Mendaftarkan pengguna baru dengan role default user.',
        requestBody: requestBody({
          $ref: '#/components/schemas/RegisterRequest',
        }),
        responses: {
          '201': success('User berhasil dibuat.', {
            $ref: '#/components/schemas/UserWithPassword',
          }),
          '400': errorResponse(
            'Email sudah digunakan atau request tidak valid.',
          ),
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login pengguna',
        description:
          'Menghasilkan JWT access token untuk autentikasi endpoint yang diproteksi.',
        requestBody: requestBody({ $ref: '#/components/schemas/LoginRequest' }),
        responses: {
          '201': success('Login berhasil.', {
            $ref: '#/components/schemas/LoginResponse',
          }),
          '400': errorResponse('User tidak ditemukan atau password salah.'),
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Ambil semua pengguna role user',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        responses: {
          '200': success('Daftar pengguna role user.', {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
        },
      },
    },
    '/users/admins': {
      get: {
        tags: ['Users'],
        summary: 'Ambil semua pengguna role admin',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        responses: {
          '200': success('Daftar pengguna role admin.', {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Ambil semua kategori',
        responses: {
          '200': success('Daftar kategori.', {
            type: 'array',
            items: { $ref: '#/components/schemas/Category' },
          }),
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Buat kategori baru',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        requestBody: requestBody({
          $ref: '#/components/schemas/CategoryRequest',
        }),
        responses: {
          '201': success('Kategori berhasil dibuat.', {
            $ref: '#/components/schemas/Category',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
        },
      },
    },
    '/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Update kategori',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: requestBody({
          $ref: '#/components/schemas/CategoryRequest',
        }),
        responses: {
          '200': success('Kategori berhasil diupdate.', {
            $ref: '#/components/schemas/Category',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
          '404': errorResponse('Kategori tidak ditemukan.'),
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Hapus kategori',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          '200': success('Kategori berhasil dihapus.', {
            $ref: '#/components/schemas/Category',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
          '404': errorResponse('Kategori tidak ditemukan.'),
        },
      },
    },
    '/foods': {
      get: {
        tags: ['Foods'],
        summary: 'Ambil semua makanan',
        responses: {
          '200': success('Daftar makanan beserta kategori.', {
            type: 'array',
            items: { $ref: '#/components/schemas/FoodWithCategory' },
          }),
        },
      },
      post: {
        tags: ['Foods'],
        summary: 'Buat makanan baru',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        requestBody: requestBody({ $ref: '#/components/schemas/FoodRequest' }),
        responses: {
          '201': success('Makanan berhasil dibuat.', {
            $ref: '#/components/schemas/Food',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
        },
      },
    },
    '/foods/{id}': {
      put: {
        tags: ['Foods'],
        summary: 'Update makanan',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        parameters: [idParam],
        requestBody: requestBody({ $ref: '#/components/schemas/FoodRequest' }),
        responses: {
          '200': success('Makanan berhasil diupdate.', {
            $ref: '#/components/schemas/Food',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
          '404': errorResponse('Makanan tidak ditemukan.'),
        },
      },
      delete: {
        tags: ['Foods'],
        summary: 'Hapus makanan',
        description: 'Hanya dapat diakses oleh admin yang sudah login.',
        security: bearerSecurity,
        parameters: [idParam],
        responses: {
          '200': success('Makanan berhasil dihapus.', {
            $ref: '#/components/schemas/Food',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse(
            'Hanya admin yang boleh mengakses endpoint ini.',
          ),
          '404': errorResponse('Makanan tidak ditemukan.'),
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Ambil semua order',
        description: 'Dapat diakses oleh pengguna yang sudah login.',
        security: bearerSecurity,
        responses: {
          '200': success('Daftar order beserta detail dan user.', {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderWithDetailsAndUser' },
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Buat order baru',
        description:
          'Hanya dapat diakses oleh pengguna role user yang sudah login.',
        security: bearerSecurity,
        requestBody: requestBody({
          $ref: '#/components/schemas/CreateOrderRequest',
        }),
        responses: {
          '201': success('Order berhasil dibuat.', {
            $ref: '#/components/schemas/OrderWithDetails',
          }),
          '401': errorResponse('Token tidak dikirim atau tidak valid.'),
          '403': errorResponse('Hanya role user yang boleh membuat order.'),
          '404': errorResponse('Food pada salah satu item tidak ditemukan.'),
        },
      },
    },
  },
};

export const swaggerHtml = `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kulinerku Backend API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/api-docs-json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          persistAuthorization: true,
        });
      };
    </script>
  </body>
</html>`;
