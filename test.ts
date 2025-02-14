/**
 * Sample tests for validateWeb4AppData function
 * Each test tries to validate a data object. If the data is invalid,
 * the function should throw an error, which we catch and log.
 */

import { validateWeb4AppData } from './validate'

// Utility to print test results more clearly
function logTestResult(testName: string, error?: unknown) {
  if (!error) {
    console.log(`✅ [PASSED]: ${testName}`)
  } else {
    console.error(`❌ [FAILED]: ${testName}`)
    console.error(`   Error: ${(error as Error).message}`)
  }
}

/**
 * Run all test scenarios, including:
 * 1) Completely valid data
 * 2) Missing required fields
 * 3) Exceeding length constraints
 * 4) Optional fields with/without sub-fields
 */
async function runTests() {
  // 1) Completely valid data
  const validData = {
    project: {
      name: "React + Vite Ping Pong",
      version: "1.0.0",
      description: "A short description within 4096 characters.",
      goals: ["Fun", "Score Tracking", "Learn Blockchain"]
    },
    features: [
      {
        name: "Reactive Gameplay",
        description: "Smooth ball and paddle movement."
      }
    ],
    tests: {
      testScenarios: [
        {
          name: "Initial Launch",
          description: "Check if the game launches properly."
        }
      ]
    },
    authors: [
      {
        role: "Maintainer",
        name: "Jane",
        contact: "jane@example.com"
      }
    ],
    references: {
      librariesOrDependencies: [
        {
          name: "React",
          url: "https://react.dev",
          notes: "Required for UI."
        }
      ]
    },
    platformSupport: [
      {
        platform: "Browser",
        notes: "Standard usage."
      }
    ],
    aiUsage: {
      description: "No direct AI usage.",
      optionalDetails: "Could be added later."
    },
    cryptoIntegration: {
      description: "Store and compare scores on-chain.",
      actions: [
        {
          name: "saveTopScore",
          description: "Saves a new top score.",
          supportedChains: [
            {
              chain: "Ethereum",
              notes: "Tested on mainnet."
            }
          ]
        }
      ]
    }
  }

  try {
    await validateWeb4AppData(validData)
    logTestResult("Valid data structure test")
  } catch (error) {
    logTestResult("Valid data structure test", error)
  }

  // 2) Missing required fields (example: missing project.name)
  const missingProjectName = {
    project: {
      version: "1.0.0",
      description: "Missing project name.",
      goals: ["Goal1", "Goal2"]
    },
    features: [],
    tests: { testScenarios: [] },
    authors: []
  }

  try {
    await validateWeb4AppData(missingProjectName)
    logTestResult("Missing required field: project.name (should fail)")
  } catch (error) {
    logTestResult("Missing required field: project.name (should fail)", undefined)
  }

  // 3) Exceeding length constraints
  // We'll try to exceed the description limit (4096 chars) in project.description
  const tooLongDescription = "a".repeat(5000)
  const exceedDescriptionData = {
    project: {
      name: "Test",
      version: "1.0.0",
      description: tooLongDescription,
      goals: ["Goal1"]
    },
    features: [],
    tests: { testScenarios: [] },
    authors: []
  }

  try {
    await validateWeb4AppData(exceedDescriptionData)
    logTestResult("Exceeding description length (should fail)")
  } catch (error) {
    logTestResult("Exceeding description length (should fail)", undefined)
  }

  // 4) Optional fields with sub-fields (example: references.librariesOrDependencies missing required sub-fields)
  const invalidReferences = {
    project: {
      name: "Project with invalid references",
      version: "1.0.0",
      description: "Short desc",
      goals: ["Goal1"]
    },
    features: [],
    tests: { testScenarios: [] },
    authors: [],
    references: {
      librariesOrDependencies: [
        {
          // missing 'name' and 'url'
          notes: "We forgot name and url"
        }
      ]
    }
  }

  try {
    await validateWeb4AppData(invalidReferences)
    logTestResult("References missing library name/url (should fail)")
  } catch (error) {
    logTestResult("References missing library name/url (should fail)", undefined)
  }

  // 5) Test partial optional field presence (cryptoIntegration without supportedChains)
  const partialCryptoIntegration = {
    project: {
      name: "Project partial crypto test",
      version: "1.0.0",
      description: "Testing partial optional field presence.",
      goals: ["Goal1"]
    },
    features: [],
    tests: {
      testScenarios: [
        { name: "Test scenario", description: "Test scenario desc" }
      ]
    },
    authors: [
      {
        role: "Contributor",
        name: "John"
      }
    ],
    cryptoIntegration: {
      description: "We have no actions array — should fail because actions is required",
      // 'actions' array is missing
    }
  }

  try {
    await validateWeb4AppData(partialCryptoIntegration)
    logTestResult("Missing 'actions' in cryptoIntegration (should fail)")
  } catch (error) {
    logTestResult("Missing 'actions' in cryptoIntegration (should fail)", undefined)
  }
}

runTests()
