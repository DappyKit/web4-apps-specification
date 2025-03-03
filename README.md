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
