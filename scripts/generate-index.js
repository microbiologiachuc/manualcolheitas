const fs = require('fs');
const path = require('path');

const TESTES_DIR = path.join(__dirname, '../content/testes');
const OUTPUT_FILE = path.join(TESTES_DIR, 'index.json');

function getAllTestes() {
  const files = fs.readdirSync(TESTES_DIR);

  const testes = files
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => {
      const filePath = path.join(TESTES_DIR, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      return {
        slug: file.replace('.json', ''),
        nome: content.nome || '',
        area: content.area || '',
        descricao: content.descricao || ''
      };
    });

  return testes;
}

const data = getAllTestes();

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(data, null, 2),
  'utf-8'
);

console.log('index.json gerado com sucesso');
