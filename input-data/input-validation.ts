import { z } from 'zod';
import fs from 'fs';
import path from 'path';

type JsonSchema = {
  type: string;
  format?: string;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
};

/**
 * Converts JSON Schema string constraints to Zod schema
 * @param schema - JSON Schema string definition
 * @returns Zod string schema with applied constraints
 */
const createStringSchema = (schema: JsonSchema): z.ZodString => {
  let zodSchema = z.string();
  
  if (schema.minLength !== undefined) {
    zodSchema = zodSchema.min(schema.minLength);
  }
  if (schema.maxLength !== undefined) {
    zodSchema = zodSchema.max(schema.maxLength);
  }
  if (schema.format === 'email') {
    zodSchema = zodSchema.email();
  }
  
  return zodSchema;
};

/**
 * Converts JSON Schema array constraints to Zod schema
 * @param schema - JSON Schema array definition
 * @returns Zod array schema with applied constraints
 */
const createArraySchema = (schema: JsonSchema): z.ZodArray<any> => {
  const itemSchema = convertJsonSchemaToZod(schema.items!);
  let zodSchema = z.array(itemSchema);
  
  if (schema.minItems !== undefined && schema.maxItems !== undefined && 
      schema.minItems === schema.maxItems) {
    zodSchema = zodSchema.length(schema.minItems);
  } else {
    if (schema.minItems !== undefined) {
      zodSchema = zodSchema.min(schema.minItems);
    }
    if (schema.maxItems !== undefined) {
      zodSchema = zodSchema.max(schema.maxItems);
    }
  }
  
  return zodSchema;
};

/**
 * Converts JSON Schema object constraints to Zod schema
 * @param schema - JSON Schema object definition
 * @returns Zod object schema with applied constraints
 */
const createObjectSchema = (schema: JsonSchema): z.ZodObject<any> => {
  const shape: Record<string, z.ZodTypeAny> = {};
  
  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      shape[key] = convertJsonSchemaToZod(propSchema);
    }
  }
  
  let zodSchema = z.object(shape);
  
  if (schema.required?.length) {
    zodSchema = zodSchema.required();
  }
  
  return zodSchema;
};

/**
 * Converts JSON Schema to Zod schema
 * @param schema - JSON Schema definition
 * @returns Corresponding Zod schema
 */
const convertJsonSchemaToZod = (schema: JsonSchema): z.ZodTypeAny => {
  switch (schema.type) {
    case 'string':
      return createStringSchema(schema);
    case 'array':
      return createArraySchema(schema);
    case 'object':
      return createObjectSchema(schema);
    case 'boolean':
      return z.boolean();
    default:
      throw new Error(`Unsupported schema type: ${schema.type}`);
  }
};

/**
 * Reads and parses JSON schema file
 * @param schemaPath - Path to the schema file
 * @returns Zod schema
 */
export const loadSchema = (schemaPath: string): z.ZodType => {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const schemaJson = JSON.parse(schemaContent) as JsonSchema;
  return convertJsonSchemaToZod(schemaJson);
};

/**
 * Validates input data against the provided schema
 * @param data - Data to validate
 * @param schemaPath - Path to the schema file
 * @returns true if validation passes
 * @throws ZodError if validation fails
 */
export const validateInputData = (data: unknown, schemaPath: string): boolean => {
  const schema = loadSchema(schemaPath);
  schema.parse(data);
  return true;
}; 