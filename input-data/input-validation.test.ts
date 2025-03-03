import { validateInputData } from './input-validation';
import path from 'path';
import fs from 'fs';

describe('validateInputData', () => {
  const schemaPath = path.join(__dirname, 'schemas', 'quiz.json');
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'quiz-correct.json'), 'utf-8')
  );

  const incorrectData = [
    'A',
    'B',
    'This is a very long string that exceeds twenty characters limit',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10'
  ];

  test('should return true for valid data', () => {
    const result = validateInputData(correctData, schemaPath);
    expect(result).toBe(true);
  });

  test('should throw error for too many items', () => {
    expect(() => validateInputData(incorrectData, schemaPath)).toThrow();
  });

  test('should throw error for too short strings', () => {
    expect(() => validateInputData(['a', 'b', 'c'], schemaPath)).toThrow();
  });

  test('should throw error for too long strings', () => {
    expect(() =>
      validateInputData(['this string is definitely longer than twenty characters'], schemaPath)
    ).toThrow();
  });
}); 