import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Login Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'login.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'login-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'securePass123',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid email format', () => {
    const invalidData = {
      ...correctData,
      email: 'invalid-email',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short email', () => {
    const invalidData = {
      ...correctData,
      email: 'a@b.c',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short password', () => {
    const invalidData = {
      ...correctData,
      password: 'short',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too long password', () => {
    const invalidData = {
      ...correctData,
      password: 'thisPasswordIsWayTooLongAndExceedsThirtyCharacters',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for non-boolean isRemember', () => {
    const invalidData = {
      ...correctData,
      isRemember: 'yes',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })
})
