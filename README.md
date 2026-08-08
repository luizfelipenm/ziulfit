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

- **Semáforo de cores real**: o velocímetro do IMC (na home e no resultado) agora usa só verde, amarelo e vermelho — verde para peso normal, amarelo para abaixo do peso/sobrepeso, vermelho para obesidade — refletindo a situação real em vez de uma paleta decorativa de 4 cores.
- **Animações**: a logo ganhou um pulso cardíaco (o ícone é literalmente um batimento) com a linha se "desenhando" continuamente; o ponteiro do velocímetro agora faz uma varredura de entrada garantida (antes dependia de uma `transition` que não disparava em elementos recém-criados) e pulsa suavemente quando cai na faixa vermelha. Tudo respeita `prefers-reduced-motion` com um estado final estático equivalente.
- **Cálculo do IMC corrigido**: identificadas duas causas raiz que faziam o resultado sempre cair em "Obesidade grau III" — (1) altura digitada em metros (ex: `1.78`) sendo tratada como centímetros, e (2) o campo de peso (`type="number"`) descartando a vírgula decimal (ex: `90,5` virava `905`). Os campos agora aceitam vírgula ou ponto livremente, convertem metros→cm automaticamente quando detectado, e validam a faixa plausível (peso 30–300kg, altura 100–230cm) com aviso visual inline.
- **Persistência**: respostas são salvas automaticamente em `localStorage` a cada alteração. Ao reabrir o site, a pessoa vê a opção de retomar de onde parou (pulando direto para a próxima pergunta pendente) ou começar do zero.
- **Séries nos exercícios**: cada exercício do plano de treino agora mostra séries x repetições (ex: "3x12-15"), ajustadas pelo objetivo (emagrecimento/manutenção/ganho) e pelo nível de atividade (iniciantes recebem volume reduzido). Itens de cardio mostram duração em minutos.
- **Biotipo**: nova etapa com teste do punho (ilustrado) e 3 cards (Ecto/Meso/Endomorfo) que ajustam calorias, macros e cardio do plano final.
- **Logo "ZIULFIT"**: corrigido bug de `flex gap` que separava visualmente "ZIUL" e "FIT"; agora clicar no logo volta para a página inicial (mantendo os dados preenchidos).
- **Mobile**: corrigida a barra lateral de etapas (rail) que ficava visível indevidamente em telas pequenas; corrigida quebra de texto no bloco do teste do punho; testado em iPhone (Safari) e Android (Chrome) sem overflow horizontal em nenhuma etapa.

