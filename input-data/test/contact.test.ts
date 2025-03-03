import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Contact Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'contact.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'contact-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      firstName: 'John',
      // lastName is missing
      email: 'john@example.com',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for firstName too short', () => {
    const invalidData = {
      ...correctData,
      firstName: 'J', // Less than 2 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for lastName too long', () => {
    const invalidData = {
      ...correctData,
      lastName: 'A'.repeat(51), // More than 50 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid email format', () => {
    const invalidData = {
      ...correctData,
      email: 'not-an-email', // Invalid email format
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid phone format', () => {
    const invalidData = {
      ...correctData,
      phone: 'not-a-phone-number', // Doesn't match the required pattern
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for phone too short', () => {
    const invalidData = {
      ...correctData,
      phone: '123', // Less than 7 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for phone too long', () => {
    const invalidData = {
      ...correctData,
      phone: '+1-' + '5'.repeat(30), // More than 20 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for non-boolean isActive', () => {
    const invalidData = {
      ...correctData,
      isActive: 'yes', // Not a boolean
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      // phone and isActive are missing but optional
    }
    const result = validateInputData({ data: validData, schema: schemaJson })
    expect(result).toBe(true)
  })
})
