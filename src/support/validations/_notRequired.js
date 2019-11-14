export const validateNotRequired = (validator) => (value) => !value || validator(value)
export const setUniqueNotRequired = (value) => value || null
