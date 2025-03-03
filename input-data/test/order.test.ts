import { validateInputData } from '../input-validation'
import path from 'path'
import fs from 'fs'

describe('Order Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'order.json')
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'order-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath)
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      orderId: 'ORD-12345678',
      customerId: 'CUST-98765',
      orderDate: '2023-06-15T14:30:00Z',
      status: 'processing',
      items: correctData.items,
      shipping: correctData.shipping,
      payment: correctData.payment,
      // totals is missing
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid orderId pattern', () => {
    const invalidData = {
      ...correctData,
      orderId: 'ORDER-12345', // Doesn't match the required pattern
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for too short customerId', () => {
    const invalidData = {
      ...correctData,
      customerId: 'CU', // Less than 5 characters
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid status value', () => {
    const invalidData = {
      ...correctData,
      status: 'returning', // Not in the enum
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for empty items array', () => {
    const invalidData = {
      ...correctData,
      items: [],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for negative quantity', () => {
    const invalidData = {
      ...correctData,
      items: [
        {
          ...correctData.items[0],
          quantity: -1,
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for negative price', () => {
    const invalidData = {
      ...correctData,
      items: [
        {
          ...correctData.items[0],
          price: -10.99,
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required shipping address fields', () => {
    const invalidData = {
      ...correctData,
      shipping: {
        ...correctData.shipping,
        address: {
          street: '123 Main Street',
          city: 'Anytown',
          state: 'California',
          // zipCode is missing
          country: 'United States',
        },
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid shipping method', () => {
    const invalidData = {
      ...correctData,
      shipping: {
        ...correctData.shipping,
        method: 'priority', // Not in the enum
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for negative shipping cost', () => {
    const invalidData = {
      ...correctData,
      shipping: {
        ...correctData.shipping,
        cost: -5.99,
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid payment method', () => {
    const invalidData = {
      ...correctData,
      payment: {
        ...correctData.payment,
        method: 'gift_card', // Not in the enum
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid payment status', () => {
    const invalidData = {
      ...correctData,
      payment: {
        ...correctData.payment,
        status: 'processing', // Not in the enum for payment status
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for negative total values', () => {
    const invalidData = {
      ...correctData,
      totals: {
        ...correctData.totals,
        tax: -5.5,
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      orderId: 'ORD-12345678',
      customerId: 'CUST-98765',
      orderDate: '2023-06-15T14:30:00Z',
      status: 'processing',
      items: correctData.items,
      shipping: correctData.shipping,
      payment: correctData.payment,
      totals: correctData.totals,
      // notes is missing but optional
    }
    const result = validateInputData(validData, schemaPath)
    expect(result).toBe(true)
  })
})
