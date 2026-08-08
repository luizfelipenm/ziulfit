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
