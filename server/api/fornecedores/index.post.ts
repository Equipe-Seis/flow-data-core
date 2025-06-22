import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = join(process.cwd(), 'data', 'fornecedores.json')

  let fornecedores = []

  try {
    const data = await readFile(filePath, 'utf-8')
    fornecedores = JSON.parse(data)
  } catch {
    // arquivo pode não existir, criar um array vazio
    fornecedores = []
  }

  // Descobre o maior id existente
  const maiorId = fornecedores.reduce((max, f) => f.id > max ? f.id : max, 0)

  // Adiciona o novo fornecedor com id incremental
  const novoFornecedor = { id: maiorId + 1, ...body }

  fornecedores.push(novoFornecedor)

  await writeFile(filePath, JSON.stringify(fornecedores, null, 2), 'utf-8')

  return novoFornecedor
})
