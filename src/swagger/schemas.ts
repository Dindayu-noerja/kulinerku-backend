export const errorResponseSchema = {
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
};

export const registerRequestSchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', example: 'Budi Santoso' },
    email: { type: 'string', format: 'email', example: 'budi@example.com' },
    password: { type: 'string', format: 'password', example: 'password123' },
  },
};

export const loginRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', example: 'budi@example.com' },
    password: { type: 'string', format: 'password', example: 'password123' },
  },
};

export const loginResponseSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
};

export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Budi Santoso' },
    email: { type: 'string', format: 'email', example: 'budi@example.com' },
    role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2026-05-30T00:28:20.000Z',
    },
  },
};

export const userWithPasswordSchema = {
  allOf: [
    userSchema,
    {
      type: 'object',
      properties: {
        password: { type: 'string', example: '$2b$10$hashedPassword' },
      },
    },
  ],
};

export const categoryRequestSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', example: 'Makanan Berat' },
  },
};

export const categorySchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    name: { type: 'string', example: 'Makanan Berat' },
  },
};

export const foodRequestSchema = {
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
};

export const foodSchema = {
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
};

export const foodWithCategorySchema = {
  allOf: [
    foodSchema,
    {
      type: 'object',
      properties: {
        category: categorySchema,
      },
    },
  ],
};

export const orderItemRequestSchema = {
  type: 'object',
  required: ['foodId', 'qty'],
  properties: {
    foodId: { type: 'integer', example: 1 },
    qty: { type: 'integer', minimum: 1, example: 2 },
  },
};

export const createOrderRequestSchema = {
  type: 'object',
  required: ['userId', 'items'],
  properties: {
    userId: { type: 'integer', example: 1 },
    items: {
      type: 'array',
      minItems: 1,
      items: orderItemRequestSchema,
    },
  },
};

export const orderDetailSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 1 },
    qty: { type: 'integer', example: 2 },
    price: { type: 'number', format: 'float', example: 25000 },
    subtotal: { type: 'number', format: 'float', example: 50000 },
    orderId: { type: 'integer', example: 1 },
    foodId: { type: 'integer', example: 1 },
  },
};

export const orderSchema = {
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
};

export const orderWithDetailsSchema = {
  allOf: [
    orderSchema,
    {
      type: 'object',
      properties: {
        orderdetail: {
          type: 'array',
          items: orderDetailSchema,
        },
      },
    },
  ],
};

export const orderWithDetailsAndUserSchema = {
  allOf: [
    orderWithDetailsSchema,
    {
      type: 'object',
      properties: {
        user: userWithPasswordSchema,
      },
    },
  ],
};

export const arrayOf = (schema: Record<string, unknown>) => ({
  type: 'array',
  items: schema,
});
