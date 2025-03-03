import { z } from 'zod';
import fs from 'fs';
import path from 'path';

/**
 * Reads and parses JSON schema file
 * @param schemaPath - Path to the schema file
 * @returns Zod schema
 */
export const loadSchema = (schemaPath: string): z.ZodType => {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const schemaJson = JSON.parse(schemaContent);
  
  if (schemaJson.type === 'array' && schemaJson.items?.type === 'string') {
    const itemSchema = z.string()
      .min(schemaJson.items.minLength)
      .max(schemaJson.items.maxLength);
    
    return z.array(itemSchema)
      .max(schemaJson.maxItems);
  }
  
  throw new Error(`Invalid schema format: ${JSON.stringify(schemaJson)}`);
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