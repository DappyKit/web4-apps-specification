import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Todo Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'todo.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'todo-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      id: 'TODO-0001',
      title: 'Complete project documentation',
      status: 'in_progress',
      // priority is missing
      completed: false,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid id pattern', () => {
    const invalidData = {
      ...correctData,
      id: 'TASK-0001', // Doesn't match the required pattern
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for title too short', () => {
    const invalidData = {
      ...correctData,
      title: 'Do', // Less than 3 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for title too long', () => {
    const invalidData = {
      ...correctData,
      title: 'A'.repeat(101), // More than 100 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for description too long', () => {
    const invalidData = {
      ...correctData,
      description: 'A'.repeat(501), // More than 500 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid status', () => {
    const invalidData = {
      ...correctData,
      status: 'started', // Not in the enum
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid priority', () => {
    const invalidData = {
      ...correctData,
      priority: 'critical', // Not in the enum
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for non-boolean completed', () => {
    const invalidData = {
      ...correctData,
      completed: 'yes', // Not a boolean
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid dueDate format', () => {
    const invalidData = {
      ...correctData,
      dueDate: 'tomorrow', // Invalid date format
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      id: 'TODO-0001',
      title: 'Complete project documentation',
      status: 'in_progress',
      priority: 'high',
      completed: false,
      // description and dueDate are missing but optional
    }
    const result = validateInputData({ data: validData, schema: schemaJson })
    expect(result).toBe(true)
  })
})
