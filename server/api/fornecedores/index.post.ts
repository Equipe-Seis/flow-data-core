import prisma from "../prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const tipoPessoa = body.tipoPessoa;

  if (tipoPessoa === 'Física') {
    const exists = await prisma.fornecedor.findFirst({
      where: {
        cpf: body.cpf,
      },
    });

    if (exists) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CPF já cadastrado para outro fornecedor.',
      });
    }

    // Garante que CNPJ não será salvo acidentalmente
    body.cnpj = null;
  } else if (tipoPessoa === 'Jurídica') {
    const exists = await prisma.fornecedor.findFirst({
      where: {
        cnpj: body.cnpj,
      },
    });

    if (exists) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CNPJ já cadastrado para outro fornecedor.',
      });
    }

    body.cpf = null;
  }

  let dataNascimento = null;
  let abertura = null;

  const convertToISO = (dataBr: string) => {
    try {
      const [day, month, year] = dataBr.split("/").map(Number);
      return new Date(year, month - 1, day).toISOString();
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: "Formato de data inválido. Use o formato DD/MM/YYYY.",
      });
    }
  };

  if (body.tipoPessoa === "Física" && body.dataNascimento) {
    dataNascimento = convertToISO(body.dataNascimento);
  }

  if (body.tipoPessoa === "Jurídica" && !body.abertura) {
    throw createError({
      statusCode: 400,
      statusMessage: "Abertura é um campo obrigatório para pessoa jurídica.",
    });
  }

  if (body.tipoPessoa === "Jurídica" && body.abertura) {
    abertura = convertToISO(body.abertura);
  }

  try {
    const novoFornecedor = await prisma.fornecedor.create({
      data: {
        tipoPessoa: body.tipoPessoa,
        nome: body.nome,
        cpf: body.cpf,
        dataNascimento: dataNascimento,
        telefone: body.telefone,
        cnpj: body.cnpj,
        fantasia: body.fantasia,
        abertura: abertura,
        situacao: body.situacao,
        tipo: body.tipo,
        porte: body.porte,
        natureza_juridica: body.natureza_juridica,
        cep: body.cep,
        logradouro: body.logradouro,
        bairro: body.bairro,
        localidade: body.localidade,
        uf: body.uf,
        email: body.email,
      },
    });

    return novoFornecedor;
  } catch (err) {
    console.error("Erro ao salvar fornecedor no banco:", err);

    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao salvar fornecedor no banco de dados",
    });
  }
});
