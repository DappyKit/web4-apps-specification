import { validateInputData } from '../input-validation'
import { validateInputDataFromPath, loadSchemaFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Recipe Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'recipe.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'recipe-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should also work with path-based validation for backward compatibility', () => {
    const result = validateInputDataFromPath(correctData, schemaPath)
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      recipeId: 'RCP-987654',
      title: 'Classic Chocolate Chip Cookies',
      description:
        'A timeless favorite, these chocolate chip cookies are crispy on the outside, chewy on the inside.',
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid recipeId pattern', () => {
    const invalidData = {
      ...correctData,
      recipeId: 'RECIPE-123', // Doesn't match the required pattern
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for title too short', () => {
    const invalidData = {
      ...correctData,
      title: 'Cake', // Less than 5 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for description too short', () => {
    const invalidData = {
      ...correctData,
      description: 'Cookies', // Less than 10 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for negative time values', () => {
    const invalidData = {
      ...correctData,
      prepTime: -5,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for zero servings', () => {
    const invalidData = {
      ...correctData,
      servings: 0, // Should be at least 1
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid difficulty', () => {
    const invalidData = {
      ...correctData,
      difficulty: 'expert', // Not in the enum
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too many categories', () => {
    const invalidData = {
      ...correctData,
      categories: ['one', 'two', 'three', 'four', 'five', 'six'], // More than 5
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for empty ingredients array', () => {
    const invalidData = {
      ...correctData,
      ingredients: [], // Should have at least 1 item
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for missing required ingredient fields', () => {
    const invalidData = {
      ...correctData,
      ingredients: [
        {
          name: 'flour',
          // quantity is missing
          unit: 'cups',
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for empty steps array', () => {
    const invalidData = {
      ...correctData,
      steps: [], // Should have at least 1 item
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid step number', () => {
    const invalidData = {
      ...correctData,
      steps: [
        {
          ...correctData.steps[0],
          number: 0, // Should be at least 1
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for negative nutrition values', () => {
    const invalidData = {
      ...correctData,
      nutrition: {
        ...correctData.nutrition,
        calories: -100,
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for non-boolean dietary flags', () => {
    const invalidData = {
      ...correctData,
      isVegetarian: 'yes', // Not a boolean
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      recipeId: 'RCP-987654',
      title: 'Classic Chocolate Chip Cookies',
      description:
        'Soft and chewy chocolate chip cookies with a golden edge and melty chocolate chunks',
      prepTime: 15,
      cookTime: 12,
      totalTime: 27,
      servings: 24,
      ingredients: correctData.ingredients,
      steps: correctData.steps,
      // author, difficulty, cuisine, categories, nutrition, isVegetarian, isVegan, isGlutenFree are missing but optional
    }
    const result = validateInputData({ data: validData, schema: schemaJson })
    expect(result).toBe(true)
  })
})
