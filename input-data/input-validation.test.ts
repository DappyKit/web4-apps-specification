import { validateInputData } from './input-validation';
import path from 'path';
import fs from 'fs';

describe('validateInputData', () => {
  const schemaPath = path.join(__dirname, 'schemas', 'quiz.json');
  const correctData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'quiz-correct.json'), 'utf-8')
  );
  const incorrectData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'quiz-incorrect.json'), 'utf-8')
  );

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