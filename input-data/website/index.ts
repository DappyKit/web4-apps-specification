import { validateInputData, JsonSchema } from '../input-validation'

/**
 * Quiz schema example
 */
const quizSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    description: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
          },
          options: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 3,
              maxLength: 20,
            },
            minItems: 4,
            maxItems: 4,
          },
        },
        required: ['text', 'options'],
      },
    },
  },
  required: ['name', 'description', 'questions'],
}

/**
 * Quiz data example
 */
const quizData = {
  name: 'Animal Quiz',
  description: 'About animals',
  questions: [
    {
      text: 'Who is barking?',
      options: ['dog', 'cat', 'mouse', 'rabbit'],
    },
    {
      text: 'Who is jumping?',
      options: ['rabbit', 'elephant', 'rhino', 'hippo'],
    },
  ],
}

/**
 * DOM elements
 */
const schemaInput = document.getElementById('schemaInput') as HTMLTextAreaElement
const dataInput = document.getElementById('dataInput') as HTMLTextAreaElement
const validateBtn = document.getElementById('validateBtn') as HTMLButtonElement
const resultContainer = document.getElementById('resultContainer') as HTMLDivElement
const resultMessage = document.getElementById('resultMessage') as HTMLParagraphElement
const loadSchemaBtn = document.getElementById('loadSchemaBtn') as HTMLButtonElement
const loadDataBtn = document.getElementById('loadDataBtn') as HTMLButtonElement

/**
 * Shows a success message
 * @param message - The success message to display
 */
function showSuccess(message: string): void {
  resultContainer.classList.remove('hidden', 'error')
  resultContainer.classList.add('success')
  resultMessage.textContent = message
}

/**
 * Shows an error message
 * @param message - The error message to display
 */
function showError(message: string): void {
  resultContainer.classList.remove('hidden', 'success')
  resultContainer.classList.add('error')
  resultMessage.textContent = message
}

/**
 * Hides the result message
 */
function hideResult(): void {
  resultContainer.classList.add('hidden')
  resultContainer.classList.remove('success', 'error')
  resultMessage.textContent = ''
}

/**
 * Validates the input data against the schema
 */
function validateInputs(): void {
  try {
    // Parse input data
    const schema = JSON.parse(schemaInput.value) as JsonSchema
    const data = JSON.parse(dataInput.value) as unknown

    // Validate data against schema
    validateInputData({ data, schema })

    // Show success message
    showSuccess('Validation successful! Your data is valid.')
  } catch (error) {
    // Show error message
    showError(error instanceof Error ? error.message : 'Invalid JSON or validation error')
  }
}

/**
 * Loads the example quiz schema
 */
function loadQuizSchema(): void {
  schemaInput.value = JSON.stringify(quizSchema, null, 2)
  hideResult()
}

/**
 * Loads the example quiz data
 */
function loadQuizData(): void {
  dataInput.value = JSON.stringify(quizData, null, 2)
  hideResult()
}

/**
 * Initialize the application
 */
function init(): void {
  // Add event listeners
  validateBtn.addEventListener('click', validateInputs)
  loadSchemaBtn.addEventListener('click', loadQuizSchema)
  loadDataBtn.addEventListener('click', loadQuizData)

  // Hide result on input change
  schemaInput.addEventListener('input', hideResult)
  dataInput.addEventListener('input', hideResult)
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init)
