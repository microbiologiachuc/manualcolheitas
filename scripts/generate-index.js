const fs = require('fs');
const path = require('path');

const TESTES_DIR = path.join(__dirname, '../content/testes');
const OUTPUT_FILE = path.join(TESTES_DIR, 'index.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const fields = {};

  let currentKey = null;
  let isMultiline = false;

  yaml.split('\n').forEach(line => {
    const trimmed = line.trim();

    // ignorar vazio
    if (!trimmed) return;

    // multiline (YAML |)
    if (isMultiline) {
      if (line.startsWith(' ') || line.startsWith('\t')) {
        fields[currentKey] += '\n' + trimmed;
        return;
      } else {
        isMultiline = false;
      }
    }

    const idx = trimmed.indexOf(':');
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    // multiline begin
    if (value === '|') {
      fields[key] = '';
      currentKey = key;
      isMultiline = true;
      return;
    }

    // remover aspas
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    fields[key] = value;
  });

  return fields;
}

function getAllTestes() {
  const files = fs.readdirSync(TESTES_DIR);

  const testes = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(TESTES_DIR, file);
      const raw = fs.readFileSync(filePath, 'utf-8');

      const content = parseFrontmatter(raw);

      return {
        slug: file.replace('.md', ''),

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

  // ordenar por área + título
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
