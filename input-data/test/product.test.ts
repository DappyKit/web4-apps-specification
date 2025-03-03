import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Product Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'product.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'product-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      productId: 'PRD-123456',
      name: 'Wireless Headphones',
      price: 249.99,
      category: 'electronics',
      // images is missing
      stock: 42,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid productId pattern', () => {
    const invalidData = {
      ...correctData,
      productId: 'PRODUCT-123', // Doesn't match the required pattern
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for too short product name', () => {
    const invalidData = {
      ...correctData,
      name: 'HP', // Less than 3 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for negative price', () => {
    const invalidData = {
      ...correctData,
      price: -10.99,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid category', () => {
    const invalidData = {
      ...correctData,
      category: 'toys', // Not in the enum
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for empty images array', () => {
    const invalidData = {
      ...correctData,
      images: [],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for missing required image fields', () => {
    const invalidData = {
      ...correctData,
      images: [
        {
          url: 'https://example.com/images/headphones-1.jpg',
          // alt is missing
          isPrimary: true,
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid URL format', () => {
    const invalidData = {
      ...correctData,
      images: [
        {
          url: 'not-a-valid-url',
          alt: 'Invalid URL test',
          isPrimary: true,
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for negative stock', () => {
    const invalidData = {
      ...correctData,
      stock: -5,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid dimensions', () => {
    const invalidData = {
      ...correctData,
      specifications: {
        ...correctData.specifications,
        dimensions: {
          ...correctData.specifications.dimensions,
          unit: 'feet', // Not in the enum
        },
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      productId: 'PRD-123456',
      name: 'Wireless Headphones',
      price: 249.99,
      category: 'electronics',
      images: [
        {
          url: 'https://example.com/images/headphones-1.jpg',
          alt: 'Product image',
        },
      ],
      stock: 42,
      // description, specifications, tags, and ratings are missing but optional
    }
    const result = validateInputData({ data: validData, schema: schemaJson })
    expect(result).toBe(true)
  })
})
