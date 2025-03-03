import { validateInputData } from './input-validation';
import path from 'path';
import fs from 'fs';

describe('validateInputData', () => {
  const schemaPath = path.join(__dirname, 'schemas', 'quiz.json');
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'quiz-correct.json'), 'utf-8')
  );

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath);
    expect(result).toBe(true);
  });

  test('should throw error for missing required fields', () => {
    const invalidData = {
      name: "Test Quiz",
      questions: []
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too short name', () => {
    const invalidData = {
      ...correctData,
      name: "ab"
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too long description', () => {
    const invalidData = {
      ...correctData,
      description: "This description is way too long and exceeds twenty characters"
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too short question text', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: "ab",
          options: ["dog", "cat", "mouse", "rabbit"]
        }
      ]
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too few options', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: "Who is barking?",
          options: ["dog", "cat", "mouse"]
        }
      ]
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too many options', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: "Who is barking?",
          options: ["dog", "cat", "mouse", "rabbit", "hamster"]
        }
      ]
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });

  test('should throw error for too short option', () => {
    const invalidData = {
      ...correctData,
      questions: [
        {
          text: "Who is barking?",
          options: ["dog", "ab", "mouse", "rabbit"]
        }
      ]
    };
    expect(() => validateInputData(invalidData, schemaPath)).toThrow();
  });
}); 