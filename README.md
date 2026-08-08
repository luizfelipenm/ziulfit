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

- **Correção crítica do velocímetro**: identificado um bug matemático real no `conic-gradient` que comprimia as 4 faixas de cor inteiras no lado esquerdo do arco (o vermelho, verde e amarelo ficavam praticamente invisíveis, sobrando só uma fatia de vermelho e amarelo). A fórmula de ângulo foi corrigida para que as cores agora preencham corretamente todo o arco visível, da esquerda para a direita: vermelho → verde → amarelo → vermelho. Também aumentada a opacidade base dos rótulos (de 30% para 72%) para que fiquem sempre nitidamente coloridos, mesmo fora do estado "aceso".
- **Marcadores nomeados e acesos no velocímetro**: cada faixa do velocímetro (Abaixo, Normal, Sobrepeso, Obesidade) tem seu nome exibido acima, na cor da própria faixa. Na home, o rótulo acende quando o ponteiro da prévia passa por cima daquela faixa. No resultado real, o rótulo correspondente ao IMC calculado já aparece aceso.
- **Correção do mapeamento de cores**: o velocímetro segue vermelho → verde → amarelo → vermelho da esquerda para a direita — vermelho para abaixo do peso, verde para peso normal, amarelo para sobrepeso, vermelho para obesidade (qualquer grau).
- **Prévia animada na home**: o velocímetro da página inicial varre continuamente todo o mostrador, mudando de cor ao cruzar cada faixa, demonstrando como o resultado real vai aparecer. O velocímetro do resultado (etapa "Seu IMC") continua fixo na posição real calculada.
- **Animações**: a logo ganhou um pulso cardíaco com a linha se "desenhando" continuamente; o ponteiro do velocímetro real faz uma varredura de entrada garantida e pulsa suavemente quando cai na faixa vermelha. Tudo respeita `prefers-reduced-motion`.
- **Cálculo do IMC corrigido**: identificadas duas causas raiz que faziam o resultado sempre cair em "Obesidade grau III" — altura digitada em metros sendo tratada como centímetros, e peso com vírgula sendo mal interpretado. Os campos agora aceitam vírgula ou ponto livremente, convertem metros→cm automaticamente, e validam a faixa plausível.
- **Persistência**: respostas são salvas automaticamente em `localStorage`. Ao reabrir o site, a pessoa pode retomar de onde parou ou começar do zero.
- **Séries nos exercícios**: cada exercício do plano de treino mostra séries x repetições, ajustadas pelo objetivo e nível de atividade.
- **Biotipo**: etapa com teste do punho (ilustrado) e 3 cards (Ecto/Meso/Endomorfo) que ajustam calorias, macros e cardio do plano final.
- **Logo "ZIULFIT"**: corrigido bug de `flex gap`; clicar no logo volta para a página inicial mantendo os dados preenchidos.
- **Mobile**: testado em iPhone (Safari) e Android (Chrome) sem overflow horizontal em nenhuma etapa.

