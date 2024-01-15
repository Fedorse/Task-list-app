export const formDataToJson = formData => JSON.stringify(Object.fromEntries(formData))
export const isValidFormData = formData => formData.get('titlTask') && formData.get('descriptionTask');