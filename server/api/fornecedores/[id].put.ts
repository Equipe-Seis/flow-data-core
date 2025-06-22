import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'data', 'fornecedores.json')

  const data = await readFile(filePath, 'utf-8')
  let fornecedores = JSON.parse(data)

  const index = fornecedores.findIndex(f => f.id === Number(id))
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
  }

  fornecedores[index] = { ...fornecedores[index], ...body }

  await writeFile(filePath, JSON.stringify(fornecedores, null, 2), 'utf-8')

  return fornecedores[index]
})
