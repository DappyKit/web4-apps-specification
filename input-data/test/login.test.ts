import { validateInputData } from '../input-validation'
import path from 'path'
import fs from 'fs'

describe('Login Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'login.json')
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'login-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath)
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'securePass123',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid email format', () => {
    const invalidData = {
      ...correctData,
      email: 'invalid-email',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for too short email', () => {
    const invalidData = {
      ...correctData,
      email: 'a@b.c',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for too short password', () => {
    const invalidData = {
      ...correctData,
      password: 'short',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for too long password', () => {
    const invalidData = {
      ...correctData,
      password: 'thisPasswordIsWayTooLongAndExceedsThirtyCharacters',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for non-boolean isRemember', () => {
    const invalidData = {
      ...correctData,
      isRemember: 'yes',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })
})
