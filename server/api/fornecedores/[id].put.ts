import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  if (isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
  }

  function isISODateOnly(str: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(str);
  }

  function convertBrToFullISOString(str: string): string {
    const [day, month, year] = str.split('/').map(Number);
    if (!day || !month || !year) {
      throw new Error('Data inválida');
    }
    return new Date(Date.UTC(year, month - 1, day)).toISOString(); // sempre UTC
  }

  function convertIsoToFullISOString(str: string): string {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day)).toISOString();
  }

  if (body.tipoPessoa === 'Física' && body.dataNascimento) {
    try {
      body.dataNascimento = isISODateOnly(body.dataNascimento)
        ? convertIsoToFullISOString(body.dataNascimento)
        : convertBrToFullISOString(body.dataNascimento)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de nascimento inválido. Use DD/MM/YYYY.',
      });
    }
  }

  if (body.tipoPessoa === 'Jurídica' && body.abertura) {
    try {
      body.abertura = isISODateOnly(body.abertura)
        ? convertIsoToFullISOString(body.abertura)
        : convertBrToFullISOString(body.abertura)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de abertura inválido. Use DD/MM/YYYY.',
      });
    }
  }

  body.cpf = body.cpf?.replace(/\D/g, '') || null
  body.cnpj = body.cnpj?.replace(/\D/g, '') || null

  if (body.tipoPessoa === 'Jurídica' && body.cnpj) {
    const duplicado = await prisma.fornecedor.findFirst({
      where: { cnpj: body.cnpj, id: { not: Number(id) } },
    })
    if (duplicado) {
      throw createError({ statusCode: 400, statusMessage: 'CNPJ já está em uso.' })
    }
    body.cpf = null
    body.dataNascimento = null
  }

  if (body.tipoPessoa === 'Física' && body.cpf) {
    const duplicado = await prisma.fornecedor.findFirst({
      where: { cpf: body.cpf, id: { not: Number(id) } },
    })
    if (duplicado) {
      throw createError({ statusCode: 400, statusMessage: 'CPF já está em uso.' })
    }
    body.cnpj = null
    body.abertura = null
  }

  try {
    const fornecedorExistente = await prisma.fornecedor.findUnique({
      where: { id: Number(id) },
    })

    if (!fornecedorExistente) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: { id: Number(id) },
      data: { ...body },
    })

    return fornecedorAtualizado;
  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err)
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar fornecedor.' })
  }
})
