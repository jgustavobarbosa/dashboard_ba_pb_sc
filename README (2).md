# Dashboard: judicialização da saúde (TJBA, TJPB, TJSC)

Página estática, sem build e sem dependências (só a fonte IBM Plex Sans via Google Fonts, opcional).

## Como publicar

- **GitHub Pages:** suba os 5 arquivos na raiz do repositório (ou numa pasta) e ative Pages em Settings > Pages.
- **Local:** abra `index.html` no navegador.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura e textos |
| `style.css` | Visual |
| `data.js` | **Todos os dados.** Para usar o datalake, gere este arquivo a partir do maestro |
| `app.js` | Filtros, gráficos e cálculo da estimativa |

## Origem dos dados

Capturas de tela do painel de saúde do CNJ, dados até 31/08/2026. As séries de 2026 conferem com os totais do painel; pontos de 2025 sem rótulo foram lidos do gráfico (aproximados). Saúde Pública só existe para o TJBA.

## Estimativa de valores

Cenário, não dado oficial: casos novos × parcela contra o poder público × ticket (inicial R$ 18 mil). As referências públicas (Bahia R$ 458 mi em 2025, Santa Catarina R$ 749 mi em 2024) estão em `data.js` e servem de teste de realidade.

## Pendências

- Trocar ticket e parcela por valores reais do datalake.
- Ranking nominal de medicamentos e tratamentos por estado (não há fonte aberta).
- Dado de gasto atual da Paraíba.
- Filtros por grau, natureza, município e órgão julgador.
