import { validateInputData } from '../input-validation'
import { loadSchemaFromPath, validateInputDataFromPath } from '../schema-utils'
import path from 'path'
import fs from 'fs'

describe('Event Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'event.json')
  const schemaJson = loadSchemaFromPath(schemaPath)
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'event-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData({ data: correctData, schema: schemaJson })
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      eventId: 'EVT-123456',
      title: 'Web Development Workshop 2023',
      description:
        'A hands-on workshop focused on modern web development techniques with React and Node.js',
      category: 'workshop',
      startDate: '2023-08-15T09:00:00Z',
      endDate: '2023-08-15T17:00:00Z',
      location: correctData.location,
      // organizer is missing
      isPublic: true,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid eventId pattern', () => {
    const invalidData = {
      ...correctData,
      eventId: 'EVENT-123', // Doesn't match the required pattern
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for title too short', () => {
    const invalidData = {
      ...correctData,
      title: 'Web', // Less than 5 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for description too short', () => {
    const invalidData = {
      ...correctData,
      description: 'Short', // Less than 10 characters
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid category', () => {
    const invalidData = {
      ...correctData,
      category: 'seminar', // Not in the enum
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for missing required location fields', () => {
    const invalidData = {
      ...correctData,
      location: {
        // name is missing
        address: '123 Innovation Street',
        city: 'San Francisco',
        country: 'United States',
        isVirtual: false,
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid virtualLink', () => {
    const invalidData = {
      ...correctData,
      location: {
        ...correctData.location,
        isVirtual: true,
        virtualLink: 'not-a-valid-url',
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for missing required organizer fields', () => {
    const invalidData = {
      ...correctData,
      organizer: {
        name: 'Tech Academy',
        // email is missing
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid organizer email', () => {
    const invalidData = {
      ...correctData,
      organizer: {
        ...correctData.organizer,
        email: 'not-an-email',
      },
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for invalid attendee status', () => {
    const invalidData = {
      ...correctData,
      attendees: [
        {
          ...correctData.attendees[0],
          status: 'maybe', // Not in the enum
        },
      ],
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for negative maxAttendees', () => {
    const invalidData = {
      ...correctData,
      maxAttendees: -10,
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should throw error for non-boolean isPublic', () => {
    const invalidData = {
      ...correctData,
      isPublic: 'yes', // Not a boolean
    }
    expect(() => validateInputData({ data: invalidData, schema: schemaJson })).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      eventId: 'EVT-123456',
      title: 'Web Development Workshop 2023',
      description:
        'A hands-on workshop focused on modern web development techniques with React and Node.js',
      category: 'workshop',
      startDate: '2023-08-15T09:00:00Z',
      endDate: '2023-08-15T17:00:00Z',
      location: {
        name: 'Tech Hub Conference Center',
        isVirtual: false,
      },
      organizer: {
        name: 'Tech Academy',
        email: 'events@techacademy.example.com',
      },
      isPublic: true,
      // attendees and maxAttendees are missing but optional
    }
    const result = validateInputData({ data: validData, schema: schemaJson })
    expect(result).toBe(true)
  })
})
