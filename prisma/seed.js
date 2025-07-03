
import { seedFornecedores } from './seeds/seedFornecedores.js'
import { seedInsumos } from './seeds/seedInsumos.js'

async function main() {
  await seedFornecedores()
  await seedInsumos()
  console.log('Seed finalizado com sucesso.')
}

main().catch((e) => {
  console.error('Erro ao executar seed:', e)
  process.exit(1)
})