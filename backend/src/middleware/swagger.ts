// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import { Express } from 'express';

// const options: swaggerJSDoc.Options = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Libragold API',
//       version: '1.0.0',
//       description: 'REST API for Libragold Group — Pilgrimage, Tours, Hotels, Visa & Bookings',
//     },
//     servers: [
//       {
//         url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT} || 3001`,
//         description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
//       },
//     ],

//     //  Reusable Security Scheme 
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//           description: 'Enter your JWT token from POST /api/auth/login',
//         },
//       },

//       //  Reusable Schemas 
//       schemas: {
//         AdminPublic: {
//           type: 'object',
//           properties: {
//             id:        { type: 'integer', example: 1 },
//             username:  { type: 'string',  example: 'jane_admin' },
//             role:      { type: 'string',  enum: ['admin', 'super_admin'] },
//             createdAt: { type: 'string',  format: 'date-time' },
//           },
//         },
//         Booking: {
//           type: 'object',
//           properties: {
//             id:            { type: 'integer' },
//             bookingRef:    { type: 'string',  example: 'LG-20260001' },
//             service:       { type: 'string',  example: 'Pilgrimage' },
//             customerName:  { type: 'string' },
//             email:         { type: 'string',  format: 'email' },
//             phone:         { type: 'string' },
//             status:        { type: 'string',  enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
//             paymentMethod: { type: 'string',  enum: ['pay-now', 'pay-later', 'installment'] },
//             amount:        { type: 'string' },
//             createdAt:     { type: 'string',  format: 'date-time' },
//           },
//         },
//         Payment: {
//           type: 'object',
//           properties: {
//             id:        { type: 'integer' },
//             bookingId: { type: 'integer' },
//             reference: { type: 'string' },
//             amount:    { type: 'number' },
//             currency:  { type: 'string', example: 'NGN' },
//             method:    { type: 'string', enum: ['card', 'transfer'] },
//             status:    { type: 'string', enum: ['pending', 'success', 'failed'] },
//             createdAt: { type: 'string', format: 'date-time' },
//           },
//         },
//       },

//       //  Reusable Responses
//       responses: {
//         Unauthorized: {
//           description: 'Unauthorized — missing or invalid JWT token',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: { error: { type: 'string', example: 'Unauthorized — no token provided' } },
//               },
//             },
//           },
//         },
//         Forbidden: {
//           description: 'Forbidden — insufficient permissions',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: { error: { type: 'string', example: 'Forbidden — Super Admin access required' } },
//               },
//             },
//           },
//         },
//         NotFound: {
//           description: 'Resource not found',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: { error: { type: 'string', example: 'Admin not found' } },
//               },
//             },
//           },
//         },
//         BadRequest: {
//           description: 'Bad request — validation error',
//           content: {
//             'application/json': {
//               schema: {
//                 type: 'object',
//                 properties: { error: { type: 'string', example: 'Username and password are required' } },
//               },
//             },
//           },
//         },
//       },
//     },
//   },

//   // Point to all route files that contain @swagger JSDoc comments
//   apis: ['./src/routes/*.ts', './src/routes/*.js'],
// };

// const swaggerSpec = swaggerJSDoc(options);

// export function setupSwagger(app: Express): void {
//   // Only expose Swagger UI in non-production, OR protect it behind a check
//   if (process.env.NODE_ENV === 'production' && !process.env.SWAGGER_ENABLED) {
//     console.log('ℹ️  Swagger UI disabled in production. Set SWAGGER_ENABLED=true to enable.');
//     return;
//   }

//   app.use(
//     '/api-docs',
//     swaggerUi.serve,
//     swaggerUi.setup(swaggerSpec, {
//       customSiteTitle: 'Libragold API Docs',
//       swaggerOptions: {
//         persistAuthorization: true, // keeps JWT token across page reloads
//       },
//     })
//   );

//   // Expose raw JSON spec (useful for Postman import)
//   app.get('/api-docs.json', (_req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
//   });

//   console.log(`📄 Swagger UI → /api-docs`);
// }


import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Libragold API',
      version: '1.0.0',
      description: 'REST API for Libragold Group — Pilgrimage, Tours, Hotels, Visa & Bookings',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3001}`,
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],

    // ─── Reusable Security Scheme ──────────────────────────────────────────────
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from POST /api/auth/login',
        },
      },

      // ─── Reusable Schemas ────────────────────────────────────────────────────
      schemas: {
        AdminPublic: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            username:  { type: 'string',  example: 'jane_admin' },
            role:      { type: 'string',  enum: ['admin', 'super_admin'] },
            createdAt: { type: 'string',  format: 'date-time' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id:            { type: 'integer' },
            bookingRef:    { type: 'string',  example: 'LG-20260001' },
            service:       { type: 'string',  example: 'Pilgrimage' },
            customerName:  { type: 'string' },
            email:         { type: 'string',  format: 'email' },
            phone:         { type: 'string' },
            status:        { type: 'string',  enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
            paymentMethod: { type: 'string',  enum: ['pay-now', 'pay-later', 'installment'] },
            amount:        { type: 'string' },
            createdAt:     { type: 'string',  format: 'date-time' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id:        { type: 'integer' },
            bookingId: { type: 'integer' },
            reference: { type: 'string' },
            amount:    { type: 'number' },
            currency:  { type: 'string', example: 'NGN' },
            method:    { type: 'string', enum: ['card', 'transfer'] },
            status:    { type: 'string', enum: ['pending', 'success', 'failed'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },

      // ─── Reusable Responses ──────────────────────────────────────────────────
      responses: {
        Unauthorized: {
          description: 'Unauthorized — missing or invalid JWT token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Unauthorized — no token provided' } },
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden — insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Forbidden — Super Admin access required' } },
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Admin not found' } },
              },
            },
          },
        },
        BadRequest: {
          description: 'Bad request — validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Username and password are required' } },
              },
            },
          },
        },
      },
    },
  },

  // Point to all route files that contain @swagger JSDoc comments
  apis: ['./src/routes/*.ts', './src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  // Only expose Swagger UI in non-production, OR protect it behind a check
  if (process.env.NODE_ENV === 'production' && !process.env.SWAGGER_ENABLED) {
    console.log('ℹ️  Swagger UI disabled in production. Set SWAGGER_ENABLED=true to enable.');
    return;
  }

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Libragold API Docs',
      swaggerOptions: {
        persistAuthorization: true, // keeps JWT token across page reloads
      },
    })
  );

  // Expose raw JSON spec (useful for Postman import)
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📄 Swagger UI → /api-docs`);
}