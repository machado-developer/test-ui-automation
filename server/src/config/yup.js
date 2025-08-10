import { setLocale } from "yup";

// Configurando as mensagens de validação personalizadas
export default {
  setLocale: setLocale({
    mixed: {
      required: 'o campo ${path} é obrigatório',
      default: 'o campo ${path} é obrigatório',
    },

    number: {
      min: 'o campo ${path} deve ser maior que ${min}',
      max: 'o campo ${path} deve ser menor que ${max}',
      
    },

    string: {
      email: 'o email inserido não é válido',
      min: 'o campo ${path} deve conter no mínimo ${min} caracteres',
      max: 'o campo ${path} deve conter no máximo ${max} caracteres',
    },

    date: {
      min: 'a data deve ser maior ou igual a ${min}',
    },
  }),
};
