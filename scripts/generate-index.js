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

        title: content.title || '',
        area: content.area || '',

        metodo: content.metodo || '',
        amostra: content.amostra || '',
        material_colheita: content.material_colheita || '',
        descricao_clinica: content.descricao_clinica || '',
        transporte_estabilidade: content.transporte_estabilidade || '',
        tempo_resposta: content.tempo_resposta || '',
        setor: content.setor || '',
        observacoes: content.observacoes || ''
      };
    });

  // ✅ ordenar por área + título (coerência global do site)
  testes.sort((a, b) => {
    return a.area.localeCompare(b.area) || a.title.localeCompare(b.title);
  });

  return testes;
}

const data = getAllTestes();

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(data, null, 2),
  'utf-8'
);

console.log(`index.json gerado com ${data.length} testes`);
