import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mi API Next.js 15",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
    },
    // El patrón "**/*.ts" es vital para entrar en subcarpetas como /auth/register/
    apis: ["./src/app/api/**/*.ts", "./app/api/**/*.ts"],
  });
  return spec;
};
