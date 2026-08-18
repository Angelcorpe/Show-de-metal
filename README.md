# Show de Metal

Agenda de shows de rock e metal (todos os subgêneros) na cidade de São Paulo (capital), agregando informações de fontes como [Heavy.Events](https://heavy.events) e [Wikimetal](https://wikimetal.com.br).

## Stack

Aplicação estática em HTML/CSS/JS puro (sem build step, sem framework). Foi a opção mais simples que atende aos requisitos: listagem ordenada por data, filtro por período e exibição dos 3 campos obrigatórios por show (logo, data, link de ingresso).

## Estrutura de pastas

```
.
├── index.html          # Página principal (lista + filtros)
├── css/
│   └── style.css
├── js/
│   └── app.js           # Carrega data/shows.json, ordena, filtra e renderiza os cards
├── data/
│   └── shows.json       # Fonte de dados dos shows (edição manual)
└── scripts/              # Reservado para um futuro coletor automatizado (ver "Atualização dos dados")
```

## Dados: `data/shows.json`

Cada show é um objeto com os campos:

```json
{
  "banda": "Nome da banda",
  "logo_url": "https://...",
  "data": "AAAA-MM-DD",
  "local": "Nome da casa de show - São Paulo",
  "link_ingresso": "https://... ou 'a confirmar'"
}
```

- `data` deve estar no formato ISO (`AAAA-MM-DD`) para permitir ordenação e filtro corretos.
- Quando um dado ainda não está disponível, use a string `"a confirmar"` no campo correspondente (não deixe o campo ausente nem invente informação).
- O arquivo atual (`data/shows.json`) contém **152 shows reais**, coletados em 18/08/2026 diretamente das páginas de evento do Heavy.Events (listagem `heavy.events/cidade/sao-paulo-sp`, 5 páginas) e de um artigo de agenda do Wikimetal. Ver `data/shows_import.csv` para a mesma base em CSV.

## Atualização dos dados (coleta)

A coleta automatizada (scraping) recorrente **não foi implementada** como script: ambos os sites podem mudar de estrutura sem aviso e um scraper não supervisionado corre o risco de introduzir eventos incorretos ou desatualizados — o que viola a regra de não inventar/errar dados do projeto. Em vez disso, a base atual foi montada com uma **coleta manual assistida** (visitando cada página de evento e extraindo os campos exatamente como publicados, sem inferências).

**Caminho principal para manter atualizado: edição manual.** Para adicionar ou atualizar um show:

1. Colete a informação diretamente em Heavy.Events, Wikimetal ou fonte oficial da banda/casa de show.
2. Adicione ou edite o objeto correspondente em `data/shows.json`, seguindo o schema acima.
3. Garanta que o show é na cidade de São Paulo (capital) — eventos na Grande SP (ABC, Osasco, Guarulhos etc.) não entram.

Se no futuro for viável construir um coletor confiável, ele pode ser adicionado em `scripts/scrape.ts` como uma etapa que **gera uma sugestão** de atualização (não grava direto em produção), para revisão manual antes de entrar em `data/shows.json`.

## Pontos que precisam da sua revisão manual

A coleta trouxe alguns itens ambíguos que **não foram removidos nem alterados** — ficou como extraído da fonte, para você decidir:

- **Cidade possivelmente errada**: "Vitória Rock Fest 2026" (20/09) — a página indica São Paulo, mas o endereço extraído corresponde a Copacabana/RJ.
- **Não parecem ser show ao vivo da banda**: "Meet & Greet Angra" (02/10 e 03/10) — é um encontro com a banda, sem apresentação confirmada; "Iron Maiden Para Crianças" (26/10) — atração temática infantil, não é a banda original.
- **Possível duplicidade na fonte** (mesma data/local, nomes quase idênticos): "Domingueira K7 & Os Valvulados" vs. "Sabadão K7 & Os Valvulados" (22/08); "Touché Amoré Stage Four" vs. "Touché Amoré (Stage Four show) + Celeste" (12/09).
- **Bandas cover/tributo** (o nome original aparece entre parênteses ou como "Covers:"): vários shows de "Manifesto Rock Bar" e similares, além de "LINKIN PARK (Zero) + KORN (Klowns)", "DIO (Heaven and Hell)", "System of a Down (Fuck The System) + Avenged Sevenfold (Fiction)", "Kiss (Danger) + Scorpions (Dynamite)" — são bandas tributo, não os artistas originais.
- **Gêneros na fronteira do rock** (mantidos pois o projeto pede "todos os subgêneros", mas fica a seu critério remover): A Flock of Seagulls, El Mato a un Policia Motorizado, Pholhas, Elton John Diamonds, Babilônia Rita Lee Tributo, Rogério Skylab, The White Buffalo, Roxette UK - The Tribute Show, Tigers Jaw, Post Punk Brasil apresenta PLOHO, Charles Edward apresenta Double You, e os festivais multi-gênero "Best of Blues and Rock 2026" e "Primavera Sound São Paulo 2026" (datas de multi-dia: só o primeiro dia foi registrado).
- **`logo_url: "a confirmar"`**: shows encontrados apenas no artigo do Wikimetal (grandes turnês: Iron Maiden, Slayer, Deep Purple, Opeth, Helloween, Babymetal, ZZ Top, Ronnie Wood, Johnny Marr, entre outros) não tinham imagem disponível na fonte usada.
- **Excluídos por decisão sua**: "The Wall - O Musical" e "The Blues Brothers o Musical" (produções teatrais, não shows de banda).
- Removido por já ter ocorrido: "Edu Falaschi" (15/08/2026, anterior à data da coleta).

## Como rodar localmente

Como o `js/app.js` carrega `data/shows.json` via `fetch`, é preciso servir os arquivos por HTTP (abrir o `index.html` direto do disco com `file://` bloqueia o fetch em alguns navegadores). Exemplo:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000
```

## Funcionalidades

- Lista de shows ordenada por data (mais próximos primeiro).
- Cada card exibe: logo/imagem da banda, data do show e link/informação de ingresso.
- Filtro por período de data (De / Até), com botão para limpar o filtro.
