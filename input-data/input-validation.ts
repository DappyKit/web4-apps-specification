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
  
  if (schemaJson.type === 'object') {
    const stringSchema = (minLength: number, maxLength: number, format?: string) => {
      let schema = z.string().min(minLength).max(maxLength);
      if (format === 'email') {
        schema = schema.email();
      }
      return schema;
    };

    if (schemaJson.properties.questions) {
      // Quiz schema
      const questionSchema = z.object({
        text: stringSchema(
          schemaJson.properties.questions.items.properties.text.minLength,
          schemaJson.properties.questions.items.properties.text.maxLength
        ),
        options: z.array(stringSchema(
          schemaJson.properties.questions.items.properties.options.items.minLength,
          schemaJson.properties.questions.items.properties.options.items.maxLength
        ))
          .length(schemaJson.properties.questions.items.properties.options.minItems)
      });

      return z.object({
        name: stringSchema(
          schemaJson.properties.name.minLength,
          schemaJson.properties.name.maxLength
        ),
        description: stringSchema(
          schemaJson.properties.description.minLength,
          schemaJson.properties.description.maxLength
        ),
        questions: z.array(questionSchema)
      });
    } else {
      // Login schema
      return z.object({
        email: stringSchema(
          schemaJson.properties.email.minLength,
          schemaJson.properties.email.maxLength,
          schemaJson.properties.email.format
        ),
        password: stringSchema(
          schemaJson.properties.password.minLength,
          schemaJson.properties.password.maxLength
        ),
        isRemember: z.boolean()
      });
    }
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