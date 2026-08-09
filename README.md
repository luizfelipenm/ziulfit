# ZIULFIT

Site de avaliação fitness: cadastro, cálculo de IMC, biotipo (com teste do punho), perguntas de alimentação, rotina e sono — gerando um plano de treino e alimentação personalizado. 100% client-side (HTML/CSS/JS puro), otimizado para mobile (iOS Safari e Android Chrome).

## Estrutura

```
ziulfit/
├── index.html          # Página principal (estrutura HTML)
├── README.md
└── assets/
    ├── css/
    │   └── style.css   # Todos os estilos (tema dark premium, responsivo)
    ├── js/
    │   └── app.js      # Lógica: estado, IMC, plano, renderização das etapas
    └── img/
        └── favicon.svg # Ícone do site
```

## Como rodar

Basta abrir o `index.html` no navegador — não há build nem dependências.

Para publicar no GitHub Pages: suba a pasta inteira no repositório e ative o Pages na branch principal.

## Fórmulas usadas

- **IMC**: peso / altura² (classificação OMS)
- **TMB**: Mifflin-St Jeor, com fator de atividade (1.2–1.725)
- **Meta calórica**: ajustada por objetivo (déficit/superávit) e biotipo
- **Macros**: proteína 1.8–2.0 g/kg; gordura 24–32% (por biotipo); carboidrato no restante

> Conteúdo educativo — não substitui nutricionista, médico ou educador físico.

## Changelog

- **Meta tags de link (Open Graph / Twitter Card)**: adicionadas todas as tags que controlam como o link aparece ao ser compartilhado no WhatsApp, Telegram, Instagram, X/Twitter, LinkedIn etc. — título, descrição, e uma imagem de preview (`assets/img/og-image.png`, 1200×630) desenhada no mesmo estilo visual do site. Também incluídas as tags padrão de SEO (`description`, `keywords`) e `<link rel="canonical">`. **Importante**: as URLs usam `https://ziulfit.digital/` como placeholder — troque pelo domínio real assim que definir onde vai hospedar (busque e substitua essa URL em `index.html`).
- **Velocímetro redesenhado conforme referência**: agora com 5 faixas (Abaixo do peso, Normal, Risco de sobrepeso, Sobrepeso, Obeso) usando as faixas oficiais `<18,5 / 18,5–22,9 / 23–24,9 / 25–29,9 / >30`, em dois anéis concêntricos — externo com o nome da categoria, interno com a faixa numérica — e um hub central "IMC". Ponteiro mantido com a mesma mecânica de sempre, só a paleta foi atualizada.
- **Marcadores nomeados e acesos no velocímetro**: cada faixa tem seu nome e faixa numérica exibidos diretamente sobre o anel colorido, com destaque quando o ponteiro passa por cima (na prévia) ou aponta pra ela (no resultado real).
- **Prévia animada na home**: o velocímetro da página inicial varre continuamente as 5 faixas, demonstrando como o resultado real vai aparecer.
- **Animações**: a logo tem um pulso cardíaco com a linha se "desenhando" continuamente. Tudo respeita `prefers-reduced-motion`.
- **Cálculo do IMC corrigido**: altura em metros e peso com vírgula agora são interpretados corretamente, com validação de faixa plausível.
- **Persistência**: respostas salvas automaticamente em `localStorage`, com opção de retomar de onde parou.
- **Séries nos exercícios**: cada exercício mostra séries x repetições, ajustadas pelo objetivo e nível de atividade.
- **Biotipo**: etapa com teste do punho e 3 cards (Ecto/Meso/Endomorfo) que ajustam o plano final.
- **Logo "ZIULFIT"**: junta corretamente; clicar nela volta para a página inicial.
- **Mobile**: testado em iPhone (incluindo a largura mais estreita comum, 375px) e Android sem overflow horizontal.

