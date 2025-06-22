import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const filePath = join(process.cwd(), 'data', 'fornecedores.json')

  const data = await readFile(filePath, 'utf-8')
  const fornecedores = JSON.parse(data)

  const fornecedor = fornecedores.find(f => f.id === Number(id))

  if (!fornecedor) {
    throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
  }

  return fornecedor
})
