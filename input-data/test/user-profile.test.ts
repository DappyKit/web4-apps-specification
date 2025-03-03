import { validateInputData } from '../input-validation'
import path from 'path'
import fs from 'fs'

describe('User Profile Validation', () => {
  const schemaPath = path.join(__dirname, '..', 'schemas', 'user-profile.json')
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'data', 'user-profile-correct.json'), 'utf-8')
  )

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath)
    expect(result).toBe(true)
  })

  test('should throw error for missing required fields', () => {
    const invalidData = {
      username: 'johndoe42',
      fullName: 'John Doe',
      // age is missing
      privacySettings: correctData.privacySettings,
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for username too short', () => {
    const invalidData = {
      ...correctData,
      username: 'jo',
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for username too long', () => {
    const invalidData = {
      ...correctData,
      username: 'johndoejohndoejohndoejohndoe', // More than 20 characters
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid age range', () => {
    const invalidDataTooYoung = {
      ...correctData,
      age: 10,
    }
    const invalidDataTooOld = {
      ...correctData,
      age: 130,
    }
    expect(() => validateInputData(invalidDataTooYoung, schemaPath)).toThrow()
    expect(() => validateInputData(invalidDataTooOld, schemaPath)).toThrow()
  })

  test('should throw error for too many interests', () => {
    const invalidData = {
      ...correctData,
      interests: ['one', 'two', 'three', 'four', 'five', 'six'], // More than 5 items
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for invalid privacy visibility setting', () => {
    const invalidData = {
      ...correctData,
      privacySettings: {
        ...correctData.privacySettings,
        profileVisibility: 'unknown', // Not in the enum
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should throw error for missing required nested fields', () => {
    const invalidData = {
      ...correctData,
      privacySettings: {
        profileVisibility: 'public',
        // showAge is missing
      },
    }
    expect(() => validateInputData(invalidData, schemaPath)).toThrow()
  })

  test('should accept data with missing optional fields', () => {
    const validData = {
      username: 'johndoe42',
      fullName: 'John Doe',
      age: 28,
      privacySettings: correctData.privacySettings,
      // bio, location, and interests are missing but optional
    }
    const result = validateInputData(validData, schemaPath)
    expect(result).toBe(true)
  })
})
