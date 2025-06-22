// server/api/cnpj/[cnpj].ts

export default defineEventHandler(async (event) => {
  const { cnpj } = event.context.params!;

  console.log('CNPJ recebido:', cnpj); // para testes

  // Validação básica
  if (!cnpj || !/^\d{14}$/.test(cnpj)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'CNPJ inválido',
    });
  }

  try {
    const response = await $fetch(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.error('Erro ReceitaWS:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao consultar ReceitaWS',
    });
  }
});
