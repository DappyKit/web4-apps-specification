import fs from 'fs'
import path from 'path'
import { JsonSchema } from './input-validation'
import { validateInputData } from './input-validation'

/**
 * Reads and parses JSON schema file
 * @param schemaPath - Path to the schema file
 * @returns JSON schema object
 */
export const loadSchemaFromPath = (schemaPath: string): JsonSchema => {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8')
  return JSON.parse(schemaContent) as JsonSchema
}

/**
 * @deprecated Use validateInputData with schema object instead
 * Validates input data against the provided schema file
 * @param data - Data to validate
 * @param schemaPath - Path to the schema file
 * @returns true if validation passes
 * @throws ZodError if validation fails
 */
export const validateInputDataFromPath = (data: unknown, schemaPath: string): boolean => {
  const schema = loadSchemaFromPath(schemaPath)
  return validateInputData({ data, schema })
}
