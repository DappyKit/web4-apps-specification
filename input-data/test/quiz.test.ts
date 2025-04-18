import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Quiz Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'quiz.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'quiz-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      name: 'Test Quiz',
      questions: [],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short name', () => {
    const invalidData = {
      ...correctData,
      name: 'ab',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too long description', () => {
    const invalidData = {
      ...correctData,
      description: 'This description is way too long and exceeds twenty characters',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short question text', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: 'ab',
          options: ['dog', 'cat', 'mouse', 'rabbit'],
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too few options', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: 'Who is barking?',
          options: ['dog', 'cat', 'mouse'],
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too many options', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: 'Who is barking?',
          options: ['dog', 'cat', 'mouse', 'rabbit', 'hamster'],
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short option', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: 'Who is barking?',
          options: ['dog', 'ab', 'mouse', 'rabbit'],
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })
})
