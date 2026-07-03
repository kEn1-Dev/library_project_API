export const generateUsuarioId = (): number => {
  return Math.floor(Math.random() * 90000) + 10000; // Generates 5-digit ID (10000-99999)
};

export const generateRecursoId = (): number => {
  return Math.floor(Math.random() * 900000) + 100000; // Generates 6-digit ID (100000-999999)
};

export const generateDescargaId = (): number => {
  return Math.floor(Math.random() * 9000000) + 1000000; // Generates 7-digit ID (1000000-9999999)
};
