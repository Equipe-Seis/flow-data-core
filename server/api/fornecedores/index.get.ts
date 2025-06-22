import { readFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'data', 'fornecedores.json');

  try {
    const fileData = await readFile(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error('Erro ao ler fornecedores:', err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao carregar fornecedores',
    });
  }
});
