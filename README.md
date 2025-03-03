# Web4 Apps Specification

Web4 applications combine the potential of decentralized technologies and AI. At the intersection of these two innovative technologies, a standard is needed to leverage their combined advantages.

The core idea of the Web4 application standard is to abstract away from specific blockchain implementations and programming languages. Applications are described using natural language, detailing use cases and testing methods. In turn, [LLM](https://en.wikipedia.org/wiki/Large_language_model) models generate the application's implementation in the required language and for a specific [DLT](https://en.wikipedia.org/wiki/Distributed_ledger). This makes the applications accessible to anyone, and their performance improves as LLMs and DLTs evolve.

This format supports both regular web applications and also [Frames v2](https://docs.farcaster.xyz/developers/frames/v2/) from Farcaster.


## Validator

### `validate.ts`
Contains a TypeScript function (`validateWeb4AppData`) that checks whether a JSON object follows the required Web4AppData structure. It verifies mandatory fields, optional fields, and length limits for strings. If validation fails, it throws an error specifying the problematic field.

### `test.js`
Demonstrates how to test the `validate.ts` file. It includes:
- Valid data scenario (should pass)
- Various invalid data scenarios (missing fields, string length issues, etc.) that should fail

You can run the tests by installing TypeScript and ts-node locally in your project, then simply execute:
```bash
npm ci
npm test
```
This will compile and run `test.js` (which imports `validate.ts`), showing whether each scenario passed or failed.

## Input Data Validation System

The project includes a robust input data validation system that provides flexible schema validation for various types of input data. This system is essential for creating applications from templates, ensuring that all user-provided input meets the required specifications before processing.

### How It Works

The validation system converts JSON Schema definitions to Zod validation schemas, providing type-safe, runtime validation with detailed error messages. The main functionality is exposed through:

```typescript
validateInputData(data: unknown, schemaPath: string): boolean
```

This function validates input data against a schema defined in a JSON file and returns `true` if valid or throws a detailed error if invalid.

### Available Schemas

The system includes a variety of predefined schemas for common data structures:

- **Contact**: Personal contact information with validation for email and phone formats
- **Todo**: Task management data with status tracking and priorities
- **Event**: Event planning data with location, datetime validation, and attendee tracking
- **Recipe**: Detailed recipe format with ingredients, instructions, and nutritional information
- **Survey**: Comprehensive survey builder with questions, sections, and response validation
- **Product**: E-commerce product specifications with pricing and inventory
- **Order**: Order processing data with line items and shipping information
- **User Profile**: User account information with preferences and settings
- **Quiz**: Question and answer format for educational applications
- **Login**: Authentication credentials with security requirements

### Example Usage

Testing schema validation is straightforward:

```typescript
import { validateInputData } from './input-data/input-validation';
import path from 'path';

// Path to schema definition
const schemaPath = path.join(__dirname, 'input-data', 'schemas', 'todo.json');

// Sample data
const todoData = {
  "id": "TODO-0001",
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the new API endpoints",
  "status": "in_progress",
  "priority": "high",
  "completed": false,
  "dueDate": "2023-07-25T17:00:00Z"
};

try {
  const isValid = validateInputData(todoData, schemaPath);
  console.log('Validation successful:', isValid);
} catch (error) {
  console.error('Validation failed:', error.errors);
}
```

### Running Validation Tests

The repository includes comprehensive tests for each schema:

```bash
npm run test:input
```

This will run validation tests for all schemas, confirming both positive cases (correct data) and negative cases (data with various validation errors).

### Extending with New Schemas

You can create custom schemas by adding new JSON schema files to the `input-data/schemas` directory. The validation system supports:

- String validation (length, format, pattern, enumeration)
- Number validation (min/max)
- Boolean values
- Arrays with item validation
- Nested objects with required/optional fields

Each schema in the repository comes with example data in the `input-data/data` directory, providing templates for your own implementations.

## Development

### Running Tests

You can run the tests by installing TypeScript and dependencies locally in your project, then execute:
```bash
npm ci
npm run test:all
```

This will run both Web4 tests and input schema validation tests, showing whether each scenario passed or failed.

### Code Quality Tools

This project uses several tools to maintain code quality and consistency:

#### Prettier
For code formatting:
```bash
# Check formatting
npm run format:check

# Fix formatting issues
npm run format
```

#### ESLint
For code linting:
```bash
# Check linting
npm run lint:check

# Fix linting issues
npm run lint
```

#### TypeScript
For type checking:
```bash
# Run type checking
npx tsc --noEmit
```

### Continuous Integration

This project uses GitHub Actions for continuous integration. The following checks run automatically:

- **On Pull Requests to main branch**:
  - Linting and formatting checks
  - Type checking
  - All tests (with multiple Node.js versions)

- **On Push to main branch**:
  - Same checks as pull requests

For more details, see the [GitHub Actions workflows](.github/workflows/README.md).

## Web4 structure

```typescript
/**
 * Web4AppData is the main interface for describing a universal web application
 * that can integrate crypto actions, AI usage, and multi-platform support.
 */
export interface Web4AppData {
  /**
   * The 'project' object contains key information about the application.
   */
  project: {
    /**
     * Human-readable name of the application.
     */
    name: string

    /**
     * Current release or version of the project.
     */
    version: string

    /**
     * Brief summary of the application's purpose or functionality.
     */
    description: string

    /**
     * A list of main objectives or outcomes the project hopes to achieve.
     */
    goals: string[]
  }

  /**
   * An array describing the core features of the application.
   */
  features: Array<{
    /**
     * Name or title of the feature.
     */
    name: string

    /**
     * Natural-language explanation of the feature's purpose and functionality.
     */
    description: string
  }>

  /**
   * A collection of test scenarios for validating app functionality.
   */
  tests: {
    /**
     * An array of named scenarios, each describing a test in plain English.
     */
    testScenarios: Array<{
      /**
       * Descriptive name for the test scenario.
       */
      name: string

      /**
       * Freeform explanation of test steps, expected outcomes, or edge cases.
       */
      description: string
    }>
  }

  /**
   * A list of authors or contributors to the project.
   */
  authors: Array<{
    /**
     * Role in the project (e.g. 'Maintainer', 'Contributor').
     */
    role: string

    /**
     * Name of the author.
     */
    name: string

    /**
     * Optional contact info (e.g. email or handle).
     */
    contact?: string
  }>

  /**
   * Optional references or version history for deeper context.
   */
  references?: {
    /**
     * (Optional) A list of external libraries or dependencies used by the project.
     */
    librariesOrDependencies?: Array<{
      /**
       * Name of the library or dependency.
       */
      name: string

      /**
       * URL or link to documentation or repository.
       */
      url: string

      /**
       * Additional notes about usage or constraints.
       */
      notes?: string
    }>
  }

  /**
   * An array specifying how the app will run on different platforms (e.g. Farcaster, Telegram).
   */
  platformSupport?: Array<{
    /**
     * Name of the platform (e.g. 'Browser', 'Telegram').
     */
    platform: string

    /**
     * Additional details or constraints related to this platform (optional).
     */
    notes?: string
  }>

  /**
   * An object describing how AI might be integrated into the project.
   */
  aiUsage?: {
    /**
     * A natural-language description of how AI will be used.
     */
    description: string

    /**
     * Any optional details, such as model types or data sources (optional).
     */
    optionalDetails?: string
  }

  /**
   * An object detailing the project's crypto usage and actions.
   */
  cryptoIntegration?: {
    /**
     * High-level explanation of how crypto is used (payments, data retrieval, etc.).
     */
    description: string

    /**
     * A list of specific crypto-related actions supported by the application.
     */
    actions: Array<{
      /**
       * Identifier for the crypto action (e.g. 'paymentAction').
       */
      name: string

      /**
       * Plain-language explanation of what this action accomplishes.
       */
      description: string

      /**
       * (Optional) A list of chains where this action can be performed,
       * along with any special notes for each chain.
       */
      supportedChains?: Array<{
        /**
         * Name of the blockchain (e.g. 'Ethereum', 'Polygon').
         */
        chain: string

        /**
         * Additional information or constraints for that chain.
         */
        notes?: string
      }>
    }>
  }
}

```
