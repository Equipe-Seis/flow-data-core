import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  let dataNascimento = null
  let abertura = null

  const convertToISO = (dataBr: string) => {
    const [day, month, year] = dataBr.split('/').map(Number)
    return new Date(year, month - 1, day).toISOString() // Subtrai 1 do mês porque o JavaScript usa base 0
  }

  if (body.tipoPessoa === 'Física' && body.dataNascimento) {
    try {
      dataNascimento = convertToISO(body.dataNascimento) // Converte a data para ISO-8601
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de nascimento inválido. Use o formato DD/MM/YYYY.',
      })
    }
  }

  if (body.tipoPessoa === 'Jurídica' && !body.abertura) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Abertura é um campo obrigatório para pessoa jurídica.',
    })
  } else if (body.tipoPessoa === 'Jurídica' && body.abertura) {
    abertura = body.abertura
    try {
      abertura = convertToISO(body.abertura) // Converte a data para ISO-8601
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de abertura inválido. Use o formato DD/MM/YYYY.',
      })
    }

  }

  try {
    // Cria um novo fornecedor no banco de dados usando Prisma
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
      }
    })

    // Retorna o novo fornecedor criado
    return novoFornecedor
  } catch (err) {
    console.error('Erro ao salvar fornecedor no banco:', err)

    // Cria um erro 500
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao salvar fornecedor no banco de dados',
    })
  }
})
