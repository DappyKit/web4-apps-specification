import { validateInputData } from '../input-validation'
import path from 'path'
import fs from 'fs'

describe('Survey Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'survey.json')
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'survey-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath)
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      surveyId: 'SRV-12345678',
      title: 'Customer Satisfaction Survey',
      description: 'Help us improve our products and services by providing your feedback',
      createdBy: 'admin@example.com',
      createdAt: '2023-06-01T10:00:00Z',
      status: 'active',
      settings: correctData.settings,
      sections: correctData.sections,
      // audience is missing
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid surveyId pattern', () => {
    const invalidData = {
      ...correctData,
      surveyId: 'SURVEY-123', // Doesn't match the required pattern
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for title too short', () => {
    const invalidData = {
      ...correctData,
      title: 'Poll', // Less than 5 characters
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for description too short', () => {
    const invalidData = {
      ...correctData,
      description: 'A survey', // Less than 10 characters
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid email in createdBy', () => {
    const invalidData = {
      ...correctData,
      createdBy: 'not-an-email', // Invalid email format
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid status', () => {
    const invalidData = {
      ...correctData,
      status: 'running', // Not in the enum
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required settings fields', () => {
    const invalidData = {
      ...correctData,
      settings: {
        allowAnonymous: true,
        requireLogin: false,
        // allowMultipleSubmissions is missing
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid redirectUrl format', () => {
    const invalidData = {
      ...correctData,
      settings: {
        ...correctData.settings,
        redirectUrl: 'not-a-valid-url',
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for empty sections array', () => {
    const invalidData = {
      ...correctData,
      sections: [], // Should have at least 1 item
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required section fields', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          sectionId: 'general',
          title: 'General Information',
          // order is missing
          questions: correctData.sections[0].questions,
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for empty questions array', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[0],
          questions: [], // Should have at least 1 item
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required question fields', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[0],
          questions: [
            {
              questionId: 'age-group',
              type: 'dropdown',
              // text is missing
              isRequired: true,
            },
          ],
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid question type', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[0],
          questions: [
            {
              ...correctData.sections[0].questions[0],
              type: 'slider', // Not in the enum
            },
          ],
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for question text too short', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[0],
          questions: [
            {
              ...correctData.sections[0].questions[0],
              text: 'Age?', // Less than 5 characters
            },
          ],
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required option fields', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[0],
          questions: [
            {
              ...correctData.sections[0].questions[0],
              options: [
                {
                  optionId: 'age-18-24',
                  // text is missing
                },
              ],
            },
          ],
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid condition in conditionalLogic', () => {
    const invalidData = {
      ...correctData,
      sections: [
        {
          ...correctData.sections[2],
          questions: [
            correctData.sections[2].questions[0],
            {
              ...correctData.sections[2].questions[1],
              conditionalLogic: {
                ...correctData.sections[2].questions[1].conditionalLogic,
                condition: 'startsWith', // Not in the enum
              },
            },
          ],
        },
      ],
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid audience type', () => {
    const invalidData = {
      ...correctData,
      audience: {
        ...correctData.audience,
        type: 'members', // Not in the enum
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for abandonRate over 100', () => {
    const invalidData = {
      ...correctData,
      statistics: {
        ...correctData.statistics,
        abandonRate: 120, // Should be maximum 100
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      surveyId: 'SRV-12345678',
      title: 'Customer Satisfaction Survey',
      description:
        'Help us improve our products and services by providing your feedback in this short survey.',
      createdBy: 'admin@example.com',
      createdAt: '2023-06-01T10:00:00Z',
      status: 'active',
      settings: correctData.settings,
      sections: correctData.sections,
      audience: {
        type: 'public',
      },
      // expiresAt, statistics, and tags are missing but optional
    }
    const result = validateInputData(validData, schemaPath)
    expect(result).toBe(true)
  })
})
