/**
 * Validates that the given data adheres to the Web4AppData structure.
 * Checks all required fields, optional fields (with their sub-fields if present),
 * and string length constraints (max 255 for general fields, max 4096 for "description").
 *
 * @param data - The parsed JSON data to validate.
 * @throws Error if any required field is missing or if any field exceeds allowed length/structure.
 */
export async function validateWeb4AppData(data: any): Promise<void> {
  if (!data || typeof data !== 'object') {
    throw new Error('Root object is not correct')
  }

  // ----- Helper functions -----

  /**
   * Ensures a value is a string and meets length requirements.
   * If isRequired is true, the value must exist.
   */
  const checkString = (value: any, fieldPath: string, isRequired: boolean, maxLength: number) => {
    if (isRequired && (value === undefined || value === null)) {
      throw new Error(`Field "${fieldPath}" is not correct (missing required string)`)
    }
    if (value !== undefined && value !== null) {
      if (typeof value !== 'string') {
        throw new Error(`Field "${fieldPath}" is not correct (should be a string)`)
      }
      if (value.length > maxLength) {
        throw new Error(`Field "${fieldPath}" is not correct (length exceeds ${maxLength})`)
      }
    }
  }

  /**
   * Ensures a value is an array. If isRequired is true, the array must exist.
   */
  const checkArray = (value: any, fieldPath: string, isRequired: boolean) => {
    if (isRequired && !Array.isArray(value)) {
      throw new Error(`Field "${fieldPath}" is not correct (missing required array)`)
    }
    if (value !== undefined && value !== null && !Array.isArray(value)) {
      throw new Error(`Field "${fieldPath}" is not correct (should be an array)`)
    }
  }

  /**
   * Ensures a value is an object. If isRequired is true, the object must exist.
   */
  const checkObject = (value: any, fieldPath: string, isRequired: boolean) => {
    if (isRequired && (!value || typeof value !== 'object' || Array.isArray(value))) {
      throw new Error(`Field "${fieldPath}" is not correct (missing required object)`)
    }
    if (value !== undefined && value !== null) {
      if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`Field "${fieldPath}" is not correct (should be an object)`)
      }
    }
  }

  // ----- Validate top-level required fields -----
  checkObject(data.project, 'project', true)
  checkArray(data.features, 'features', true)
  checkObject(data.tests, 'tests', true)
  checkArray(data.authors, 'authors', true)

  // ----- Validate project -----
  const { project } = data
  checkString(project?.name, 'project.name', true, 255)
  checkString(project?.version, 'project.version', true, 255)
  checkString(project?.description, 'project.description', true, 4096)
  checkArray(project?.goals, 'project.goals', true)
  if (Array.isArray(project?.goals)) {
    project.goals.forEach((g: any, idx: number) => {
      checkString(g, `project.goals[${idx}]`, true, 255)
    })
  }

  // ----- Validate features -----
  if (Array.isArray(data.features)) {
    data.features.forEach((feature: any, i: number) => {
      checkObject(feature, `features[${i}]`, true)
      checkString(feature?.name, `features[${i}].name`, true, 255)
      checkString(feature?.description, `features[${i}].description`, true, 4096)
    })
  }

  // ----- Validate tests -----
  const { tests } = data
  checkArray(tests?.testScenarios, 'tests.testScenarios', true)
  if (Array.isArray(tests?.testScenarios)) {
    tests.testScenarios.forEach((scenario: any, i: number) => {
      checkObject(scenario, `tests.testScenarios[${i}]`, true)
      checkString(scenario?.name, `tests.testScenarios[${i}].name`, true, 255)
      checkString(scenario?.description, `tests.testScenarios[${i}].description`, true, 4096)
    })
  }

  // ----- Validate authors -----
  if (Array.isArray(data.authors)) {
    data.authors.forEach((author: any, i: number) => {
      checkObject(author, `authors[${i}]`, true)
      checkString(author?.role, `authors[${i}].role`, true, 255)
      checkString(author?.name, `authors[${i}].name`, true, 255)
      checkString(author?.contact, `authors[${i}].contact`, false, 255)
    })
  }

  // ----- Validate references (optional) -----
  if (data.references !== undefined && data.references !== null) {
    checkObject(data.references, 'references', false)

    if (
      data.references.librariesOrDependencies !== undefined &&
      data.references.librariesOrDependencies !== null
    ) {
      checkArray(
        data.references.librariesOrDependencies,
        'references.librariesOrDependencies',
        false
      )
      if (Array.isArray(data.references.librariesOrDependencies)) {
        data.references.librariesOrDependencies.forEach((lib: any, i: number) => {
          checkObject(lib, `references.librariesOrDependencies[${i}]`, true)
          checkString(lib?.name, `references.librariesOrDependencies[${i}].name`, true, 255)
          checkString(lib?.url, `references.librariesOrDependencies[${i}].url`, true, 255)
          checkString(lib?.notes, `references.librariesOrDependencies[${i}].notes`, false, 255)
        })
      }
    }
  }

  // ----- Validate platformSupport (optional) -----
  if (data.platformSupport !== undefined && data.platformSupport !== null) {
    checkArray(data.platformSupport, 'platformSupport', false)
    if (Array.isArray(data.platformSupport)) {
      data.platformSupport.forEach((ps: any, i: number) => {
        checkObject(ps, `platformSupport[${i}]`, true)
        checkString(ps?.platform, `platformSupport[${i}].platform`, true, 255)
        checkString(ps?.notes, `platformSupport[${i}].notes`, false, 255)
      })
    }
  }

  // ----- Validate aiUsage (optional) -----
  if (data.aiUsage !== undefined && data.aiUsage !== null) {
    checkObject(data.aiUsage, 'aiUsage', false)
    checkString(data.aiUsage?.description, 'aiUsage.description', true, 4096)
    checkString(data.aiUsage?.optionalDetails, 'aiUsage.optionalDetails', false, 255)
  }

  // ----- Validate cryptoIntegration (optional) -----
  if (data.cryptoIntegration !== undefined && data.cryptoIntegration !== null) {
    checkObject(data.cryptoIntegration, 'cryptoIntegration', false)
    checkString(data.cryptoIntegration?.description, 'cryptoIntegration.description', true, 4096)

    if (!Array.isArray(data.cryptoIntegration.actions)) {
      throw new Error('Field "cryptoIntegration.actions" is not correct (missing required array)')
    }
    data.cryptoIntegration.actions.forEach((action: any, i: number) => {
      checkObject(action, `cryptoIntegration.actions[${i}]`, true)
      checkString(action?.name, `cryptoIntegration.actions[${i}].name`, true, 255)
      checkString(action?.description, `cryptoIntegration.actions[${i}].description`, true, 4096)

      if (action.supportedChains !== undefined && action.supportedChains !== null) {
        checkArray(action.supportedChains, `cryptoIntegration.actions[${i}].supportedChains`, false)
        action.supportedChains.forEach((chainItem: any, ci: number) => {
          checkObject(chainItem, `cryptoIntegration.actions[${i}].supportedChains[${ci}]`, true)
          checkString(
            chainItem?.chain,
            `cryptoIntegration.actions[${i}].supportedChains[${ci}].chain`,
            true,
            255
          )
          checkString(
            chainItem?.notes,
            `cryptoIntegration.actions[${i}].supportedChains[${ci}].notes`,
            false,
            255
          )
        })
      }
    })
  }
}
