type ValidadeTodoDescriptionResult = {
  success: boolean;
  errors: string[];
};

export function validateTodoDescription(
  description: string,
): ValidadeTodoDescriptionResult {
  const errors = [];

  if (description.length <= 3) {
    errors.push('Descrição precisa ter mais que 3 caracteres');
  }

  return {
    success: errors.length === 0,
    errors,
  };
}
