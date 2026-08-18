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
- O arquivo atual (`data/shows.json`) contém **5 shows fictícios de exemplo**, todos com o prefixo `[PLACEHOLDER]` no nome da banda, apenas para validar o layout. Eles devem ser substituídos pelos dados reais antes de publicar a aplicação.

## Atualização dos dados (coleta)

A coleta automatizada (scraping) de Heavy.Events e Wikimetal **não foi implementada** nesta primeira versão: ambos os sites podem mudar de estrutura sem aviso e um scraper não supervisionado corre o risco de introduzir eventos incorretos ou desatualizados na agenda — o que viola a regra de não inventar/errar dados do projeto.

**Caminho principal: atualização manual.** Para adicionar ou atualizar um show:

1. Colete a informação diretamente em Heavy.Events, Wikimetal ou fonte oficial da banda/casa de show.
2. Adicione ou edite o objeto correspondente em `data/shows.json`, seguindo o schema acima.
3. Garanta que o show é na cidade de São Paulo (capital) — eventos na Grande SP (ABC, Osasco, Guarulhos etc.) não entram.

Se no futuro for viável construir um coletor confiável, ele pode ser adicionado em `scripts/scrape.ts` como uma etapa que **gera uma sugestão** de atualização (não grava direto em produção), para revisão manual antes de entrar em `data/shows.json`.

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
