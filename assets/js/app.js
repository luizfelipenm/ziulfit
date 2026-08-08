/* ============ STATE ============ */
const state = {
  step: 0,
  nome:'', idade:null, sexo:'', peso:null, altura:null,
  biotipo:'',
  refeicoesDia:'', agua:'', frutasVeg:'', fastFood:'', pulaRefeicoes:'',
  trabalho:'', nivelAtividade:'', diasTreino:'', tempoSessao:'',
  horasSono:'', qualidadeSono:'', horarioRegular:''
};

const RAIL_STEPS = [
  {label:'Cadastro'},
  {label:'Seu IMC'},
  {label:'Biotipo'},
  {label:'Alimentação'},
  {label:'Rotina'},
  {label:'Sono'},
  {label:'Seu plano'}
];

/* ============ SVG BODIES ============ */
function bodySVG(tipo, color){
  color = color || 'currentColor';
  if(tipo==='ecto') return `<svg viewBox="0 0 64 88" fill="none">
    <circle cx="32" cy="11" r="7" stroke="${color}" stroke-width="2.4"/>
    <path d="M32 18v26M24 24h16M32 30l-6 22M32 30l6 22M26 52l-2 26M38 52l2 26M24 24l-4 16M40 24l4 16" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
  if(tipo==='meso') return `<svg viewBox="0 0 64 88" fill="none">
    <circle cx="32" cy="11" r="7" stroke="${color}" stroke-width="2.6"/>
    <path d="M22 22h20l-3 22h-14l-3-22z" stroke="${color}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M22 23l-7 15M42 23l7 15M27 44l-3 32M37 44l3 32" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>
  </svg>`;
  return `<svg viewBox="0 0 64 88" fill="none">
    <circle cx="32" cy="11" r="7" stroke="${color}" stroke-width="2.5"/>
    <path d="M24 21c-3 8-4 16-1 24 2 5 16 5 18 0 3-8 2-16-1-24h-16z" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M24 22l-6 14M40 22l6 14M27 47l-2 30M37 47l2 30" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

const wristSVG = `<svg viewBox="0 0 120 120" fill="none">
  <path d="M38 96V56c0-14 8-24 22-24s22 10 22 24v40" stroke="#4fd1e8" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="60" cy="66" rx="26" ry="12" stroke="#c8f542" stroke-width="3" stroke-dasharray="4 5"/>
  <path d="M30 70c-4-2-7-6-6-10 1-3 4-4 7-3M90 70c4-2 7-6 6-10-1-3-4-4-7-3" stroke="#eef4f2" stroke-width="2.6" stroke-linecap="round"/>
  <circle cx="27" cy="58" r="3.4" fill="#eef4f2"/>
  <circle cx="93" cy="58" r="3.4" fill="#eef4f2"/>
</svg>`;

/* ============ HELPERS ============ */
function set(key,val){ state[key]=val; }
function fmt(n, dec){ return Number(n).toLocaleString('pt-BR',{minimumFractionDigits:dec||0, maximumFractionDigits:dec||0}); }

function choiceGroup(name, glabel, options, current, cols){
  cols = cols || 2;
  const colClass = cols===1?'col1':(cols===3?'col3':'');
  const items = options.map(o=>{
    const sel = current===o.value ? 'selected':'';
    return `<div class="choice ${sel}" role="button" tabindex="0" data-name="${name}" data-value="${o.value}">
      <span class="ctitle">${o.title}</span>
      ${o.desc?`<span class="cdesc">${o.desc}</span>`:''}
    </div>`;
  }).join('');
  return `<div class="choice-group full">
    <div class="glabel">${glabel}</div>
    <div class="choices ${colClass}">${items}</div>
  </div>`;
}

/* ============ IMC LOGIC ============ */
function calcIMC(){
  const alturaM = state.altura/100;
  return state.peso / (alturaM*alturaM);
}
function classificaIMC(imc){
  if(imc < 18.5) return {label:'Abaixo do peso', color:'var(--blue)'};
  if(imc < 25) return {label:'Peso normal', color:'var(--lime)'};
  if(imc < 30) return {label:'Sobrepeso', color:'var(--amber)'};
  if(imc < 35) return {label:'Obesidade grau I', color:'var(--coral)'};
  if(imc < 40) return {label:'Obesidade grau II', color:'var(--coral)'};
  return {label:'Obesidade grau III', color:'var(--coral)'};
}

/* ============ PLAN LOGIC ============ */
function calcPlano(){
  const imc = calcIMC();
  const idade = state.idade, peso = state.peso, altura = state.altura;
  let bmr;
  if(state.sexo==='M') bmr = 10*peso + 6.25*altura - 5*idade + 5;
  else if(state.sexo==='F') bmr = 10*peso + 6.25*altura - 5*idade - 161;
  else bmr = 10*peso + 6.25*altura - 5*idade - 78;

  const fatorMap = {sedentario:1.2, leve:1.375, moderado:1.55, intenso:1.725};
  const fator = fatorMap[state.nivelAtividade] || 1.375;
  const tdee = bmr * fator;

  let objetivo, meta, deficit=false, superavit=false;
  if(imc < 18.5){ objetivo='Ganho de peso saudável'; meta = tdee + 350; superavit=true; }
  else if(imc < 25){ objetivo='Manutenção e condicionamento'; meta = tdee; }
  else if(imc < 30){ objetivo='Emagrecimento moderado'; meta = tdee - 450; deficit=true; }
  else { objetivo='Emagrecimento'; meta = tdee - 550; deficit=true; }

  // Ajuste pelo biotipo
  if(state.biotipo==='ecto' && !deficit) meta += 150;       // metabolismo rápido
  if(state.biotipo==='endo' && deficit) meta -= 100;        // metabolismo mais lento
  meta = Math.max(meta, bmr*1.15);

  const proteinaG = peso * (deficit||superavit ? 2.0 : 1.8);
  const proteinaKcal = proteinaG*4;

  // Distribuição de gordura/carbo ajustada pelo biotipo
  let gordPct = 0.27;
  if(state.biotipo==='ecto') gordPct = 0.24;  // mais espaço para carbo
  if(state.biotipo==='endo') gordPct = 0.32;  // menos carbo, mais gordura boa

  const gorduraKcal = meta*gordPct;
  const gorduraG = gorduraKcal/9;
  const carboKcal = Math.max(meta - proteinaKcal - gorduraKcal, meta*0.20);
  const carboG = carboKcal/4;

  return {imc, bmr, tdee, meta, objetivo, deficit, superavit, proteinaG, gorduraG, carboG};
}

function planoRefeicoes(meta, n){
  const templates = {
    3: [['Café da manhã',0.30],['Almoço',0.40],['Jantar',0.30]],
    4: [['Café da manhã',0.25],['Almoço',0.35],['Lanche da tarde',0.15],['Jantar',0.25]],
    5: [['Café da manhã',0.22],['Lanche da manhã',0.10],['Almoço',0.32],['Lanche da tarde',0.13],['Jantar',0.23]],
    6: [['Café da manhã',0.20],['Lanche da manhã',0.10],['Almoço',0.28],['Lanche da tarde',0.12],['Jantar',0.22],['Ceia',0.08]]
  };
  const key = n<=2?3 : (n>=6?6:n);
  const sug = {
    'Café da manhã':'Proteína (ovos/iogurte), carboidrato integral e fruta',
    'Lanche da manhã':'Fruta com oleaginosas ou iogurte natural',
    'Almoço':'Proteína magra, arroz/tubérculo, feijão e salada à vontade',
    'Lanche da tarde':'Fruta, whey ou pão integral com proteína',
    'Jantar':'Proteína magra, vegetais e carboidrato moderado',
    'Ceia':'Proteína leve (iogurte/queijo) se sentir fome antes de dormir'
  };
  return templates[key].map(([nome,pct])=>({
    nome, kcal: Math.round(meta*pct), sug: sug[nome]
  }));
}

function planoTreino(dias, nivel, objetivo, biotipo){
  const emagrecer = objetivo.includes('Emagrecimento');
  let cardio = emagrecer ? ' + 15–20min de cardio leve' : '';
  if(biotipo==='endo' && emagrecer) cardio = ' + 20–30min de cardio';
  if(biotipo==='ecto') cardio = emagrecer ? ' + 10–15min de cardio leve' : '';
  const nivelTxt = nivel==='sedentario' ? ' (cargas leves, foco em técnica)' : '';
  const libs = {
    fullA: ['Agachamento ou leg press','Supino ou flexão de braço','Remada curvada ou puxada','Elevação lateral','Prancha abdominal'+cardio],
    fullB: ['Levantamento terra ou stiff','Desenvolvimento de ombro','Puxada frente ou barra fixa','Afundo ou cadeira extensora','Abdominal remador'+cardio],
    upper: ['Supino reto','Remada baixa','Desenvolvimento de ombro','Rosca direta','Tríceps corda'],
    lower: ['Agachamento livre','Stiff ou mesa flexora','Cadeira extensora','Panturrilha em pé','Abdominal'+cardio],
    push: ['Supino inclinado','Desenvolvimento militar','Elevação lateral','Tríceps testa','Tríceps corda'],
    pull: ['Barra fixa ou puxada','Remada curvada','Face pull','Rosca direta','Rosca alternada'],
    legs: ['Agachamento livre','Leg press','Stiff','Panturrilha','Abdominal'+cardio],
    cardioDay: ['Cardio contínuo 25–35min (esteira, bike ou caminhada)','Mobilidade e alongamento 10min']
  };
  let plano = [];
  if(dias<=2){
    plano = [
      {dia:'Dia 1', foco:'Full Body A'+nivelTxt, ex:libs.fullA},
      {dia:'Dia 2', foco:'Full Body B'+nivelTxt, ex:libs.fullB}
    ];
  } else if(dias===3){
    plano = [
      {dia:'Dia 1', foco:'Full Body A'+nivelTxt, ex:libs.fullA},
      {dia:'Dia 2', foco:'Full Body B'+nivelTxt, ex:libs.fullB},
      {dia:'Dia 3', foco:'Full Body A + cardio', ex:libs.fullA}
    ];
  } else if(dias===4){
    plano = [
      {dia:'Dia 1', foco:'Superiores', ex:libs.upper},
      {dia:'Dia 2', foco:'Inferiores', ex:libs.lower},
      {dia:'Dia 3', foco:'Superiores', ex:libs.upper},
      {dia:'Dia 4', foco:'Inferiores', ex:libs.lower}
    ];
  } else if(dias===5){
    plano = [
      {dia:'Dia 1', foco:'Push (peito/ombro/tríceps)', ex:libs.push},
      {dia:'Dia 2', foco:'Pull (costas/bíceps)', ex:libs.pull},
      {dia:'Dia 3', foco:'Pernas', ex:libs.legs},
      {dia:'Dia 4', foco:'Superiores', ex:libs.upper},
      {dia:'Dia 5', foco:'Cardio + core', ex:libs.cardioDay}
    ];
  } else {
    plano = [
      {dia:'Dia 1', foco:'Push', ex:libs.push},
      {dia:'Dia 2', foco:'Pull', ex:libs.pull},
      {dia:'Dia 3', foco:'Pernas', ex:libs.legs},
      {dia:'Dia 4', foco:'Push', ex:libs.push},
      {dia:'Dia 5', foco:'Pull', ex:libs.pull},
      {dia:'Dia 6', foco:'Pernas + cardio', ex:libs.legs}
    ];
  }
  while(plano.length < 7){
    plano.push({dia:'Dia '+(plano.length+1), foco:'Descanso', ex:['Alongamento leve','Caminhada opcional'], rest:true});
  }
  return plano;
}

const BIO_INFO = {
  ecto: {
    nome:'Ectomorfo',
    desc:'Corpo naturalmente magro, metabolismo acelerado, dificuldade para ganhar peso e músculo.',
    planoTxt:'Seu metabolismo acelerado pede mais carboidratos e calorias, com cardio moderado para não atrapalhar o ganho de massa.'
  },
  meso: {
    nome:'Mesomorfo',
    desc:'Estrutura atlética, ganha músculo com facilidade e responde bem ao treino.',
    planoTxt:'Sua estrutura responde bem a treino e dieta equilibrados — consistência é o que vai definir seu resultado.'
  },
  endo: {
    nome:'Endomorfo',
    desc:'Estrutura mais larga, tendência a acumular gordura com facilidade, metabolismo mais lento.',
    planoTxt:'Seu metabolismo mais lento pede carboidratos controlados, mais gorduras boas e cardio um pouco mais presente.'
  }
};

/* ============ RENDER: RAIL + PROGRESS ============ */
function renderRail(){
  const rail = document.getElementById('rail');
  const tag = document.getElementById('stepTag');
  const mp = document.getElementById('mprogress');
  const mpBar = document.getElementById('mprogressBar');
  if(state.step===0){
    rail.innerHTML='';
    tag.textContent='INÍCIO';
    mp.classList.remove('visible');
    return;
  }
  const idx = state.step - 1;
  tag.textContent = `ETAPA ${state.step} / ${RAIL_STEPS.length}`;
  mp.classList.add('visible');
  mpBar.style.width = `${(state.step/RAIL_STEPS.length)*100}%`;
  rail.innerHTML = RAIL_STEPS.map((s,i)=>{
    let cls = '';
    if(i===idx) cls='active'; else if(i<idx) cls='done';
    return `<div class="rail-item ${cls}">
      <span class="rail-num">${String(i+1).padStart(2,'0')}</span>
      <span class="rail-label">${s.label}</span>
    </div>`;
  }).join('');
}

/* ============ RENDER: STEPS ============ */
function renderStep0(){
  return `
  <div class="card hero">
    <div>
      <p class="eyebrow">Avaliação gratuita · 5 minutos</p>
      <h1 class="hero-title">Seu corpo,<br><span class="accent">seu plano.</span></h1>
      <p class="hero-lede">Responda sobre seu corpo, biotipo, alimentação, rotina e sono. A ZIULFIT calcula seu IMC e monta um plano de treino e alimentação sob medida — na hora, direto no seu celular.</p>
      <div class="hero-points">
        <div class="hero-point"><span class="n">01</span> Cadastro e cálculo automático do IMC</div>
        <div class="hero-point"><span class="n">02</span> Descubra seu biotipo com o teste do punho</div>
        <div class="hero-point"><span class="n">03</span> Perguntas sobre alimentação, rotina e sono</div>
        <div class="hero-point"><span class="n">04</span> Plano de treino e cardápio gerado para você</div>
      </div>
      <button class="btn btn-primary" id="startBtn">Iniciar avaliação →</button>
    </div>
    <div class="hero-visual">
      <div class="gauge">
        <div class="gauge-arc" style="background:conic-gradient(from 180deg,
            var(--blue) 0deg 25.2deg,
            var(--lime) 25.2deg 72deg,
            var(--amber) 72deg 108deg,
            var(--coral) 108deg 180deg,
            transparent 180deg 360deg);"></div>
        <div class="gauge-mask"></div>
        <div class="gauge-needle" style="--angle:100deg"></div>
      </div>
      <div class="hero-badges">
        <span class="hbadge">IMC</span>
        <span class="hbadge">BIOTIPO</span>
        <span class="hbadge">TREINO</span>
        <span class="hbadge">DIETA</span>
      </div>
    </div>
  </div>`;
}

function renderStep1(){
  return `
  <div class="card">
    <p class="eyebrow">Etapa 01</p>
    <h2>Vamos te conhecer</h2>
    <p class="sub">Esses dados são a base para calcular seu IMC e sua necessidade calórica.</p>
    <div class="grid">
      <div class="field full">
        <label for="nome">Nome</label>
        <input type="text" id="nome" autocomplete="name" placeholder="Como podemos te chamar?" value="${state.nome}">
      </div>
      <div class="field">
        <label for="idade">Idade (anos)</label>
        <input type="number" id="idade" inputmode="numeric" min="14" max="100" placeholder="Ex: 28" value="${state.idade ?? ''}">
      </div>
      <div class="field">
        <label for="sexo">Sexo biológico</label>
        <select id="sexo">
          <option value="" ${!state.sexo?'selected':''} disabled>Selecione</option>
          <option value="M" ${state.sexo==='M'?'selected':''}>Masculino</option>
          <option value="F" ${state.sexo==='F'?'selected':''}>Feminino</option>
          <option value="O" ${state.sexo==='O'?'selected':''}>Prefiro não dizer</option>
        </select>
        <span class="hint">Usado apenas para o cálculo metabólico (fórmula de Mifflin-St Jeor)</span>
      </div>
      <div class="field">
        <label for="peso">Peso atual (kg)</label>
        <input type="number" id="peso" inputmode="decimal" min="30" max="300" step="0.1" placeholder="Ex: 78.5" value="${state.peso ?? ''}">
      </div>
      <div class="field">
        <label for="altura">Altura (cm)</label>
        <input type="number" id="altura" inputmode="numeric" min="120" max="230" placeholder="Ex: 172" value="${state.altura ?? ''}">
      </div>
    </div>
    <div class="btn-row">
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn" disabled>Calcular meu IMC →</button>
    </div>
  </div>`;
}

function renderStep2(){
  const imc = calcIMC();
  const classe = classificaIMC(imc);
  const clamped = Math.min(Math.max(imc,15),40);
  const angle = ((clamped-15)/25)*180;
  const notes = {
    'Abaixo do peso':'Seu IMC indica que você está abaixo da faixa considerada saudável. Seu plano vai priorizar ganho de peso de forma gradual e nutritiva.',
    'Peso normal':'Seu IMC está dentro da faixa considerada saudável. Seu plano vai focar em manutenção, condicionamento e hábitos consistentes.',
    'Sobrepeso':'Seu IMC está acima da faixa considerada ideal. Seu plano vai priorizar um déficit calórico moderado e sustentável.',
    'Obesidade grau I':'Seu IMC indica obesidade grau I. Seu plano vai focar em emagrecimento gradual, com treino adaptado ao seu nível atual.',
    'Obesidade grau II':'Seu IMC indica obesidade grau II. Recomendamos também acompanhamento médico junto ao plano de emagrecimento.',
    'Obesidade grau III':'Seu IMC indica obesidade grau III. É importante buscar acompanhamento médico especializado além do plano de hábitos.'
  };
  return `
  <div class="card">
    <p class="eyebrow">Etapa 02</p>
    <h2>Seu IMC${state.nome?`, ${state.nome.split(' ')[0]}`:''}</h2>
    <p class="sub">Índice de Massa Corporal — relação entre seu peso e sua altura.</p>
    <div class="imc-wrap">
      <div class="gauge">
        <div class="gauge-arc" style="background:conic-gradient(from 180deg,
            var(--blue) 0deg 25.2deg,
            var(--lime) 25.2deg 72deg,
            var(--amber) 72deg 108deg,
            var(--coral) 108deg 180deg,
            transparent 180deg 360deg);"></div>
        <div class="gauge-mask"></div>
        <div class="gauge-needle" style="--angle:${angle}deg"></div>
      </div>
      <div class="imc-value mono" style="color:${classe.color}">${fmt(imc,1)}</div>
      <div class="imc-classe" style="border-color:${classe.color};color:${classe.color}">${classe.label}</div>
      <div class="imc-legend">
        <span><i class="sw" style="background:var(--blue)"></i>Abaixo do peso</span>
        <span><i class="sw" style="background:var(--lime)"></i>Normal</span>
        <span><i class="sw" style="background:var(--amber)"></i>Sobrepeso</span>
        <span><i class="sw" style="background:var(--coral)"></i>Obesidade</span>
      </div>
      <p class="imc-note">${notes[classe.label]}</p>
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" id="backBtn">← Voltar</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn">Continuar →</button>
    </div>
  </div>`;
}

function renderStep3(){
  const sel = t => state.biotipo===t?'selected':'';
  const color = t => state.biotipo===t?'var(--lime)':'var(--text-dim)';
  return `
  <div class="card">
    <p class="eyebrow">Etapa 03</p>
    <h2>Qual é o seu biotipo?</h2>
    <p class="sub">O biotipo indica a tendência natural do seu corpo — e ajuda a ajustar calorias, carboidratos e cardio no seu plano.</p>

    <div class="wrist-box">
      ${wristSVG}
      <div>
        <h3>🖐 Não sabe? Faça o teste do punho</h3>
        <p>Com uma mão, envolva o punho oposto usando o <b style="color:var(--text)">polegar e o dedo médio</b>, logo abaixo do osso do pulso. Veja o que acontece:</p>
        <div class="wrist-steps">
          <span><i class="wdot" style="background:var(--blue)"></i><span><b>Os dedos se sobrepõem</b> (um passa por cima do outro) → você tende a ser <b>Ectomorfo</b></span></span>
          <span><i class="wdot" style="background:var(--lime)"></i><span><b>Os dedos apenas se encostam</b> → você tende a ser <b>Mesomorfo</b></span></span>
          <span><i class="wdot" style="background:var(--coral)"></i><span><b>Os dedos não se alcançam</b> → você tende a ser <b>Endomorfo</b></span></span>
        </div>
      </div>
    </div>

    <div class="bio-cards">
      <div class="bio-card ${sel('ecto')}" role="button" tabindex="0" data-bio="ecto">
        ${bodySVG('ecto', color('ecto'))}
        <div class="bname">Ectomorfo</div>
        <div class="bdesc">Magro por natureza, ossos finos, metabolismo rápido, dificuldade para ganhar peso.</div>
      </div>
      <div class="bio-card ${sel('meso')}" role="button" tabindex="0" data-bio="meso">
        ${bodySVG('meso', color('meso'))}
        <div class="bname">Mesomorfo</div>
        <div class="bdesc">Estrutura atlética, ombros mais largos, ganha músculo com facilidade.</div>
      </div>
      <div class="bio-card ${sel('endo')}" role="button" tabindex="0" data-bio="endo">
        ${bodySVG('endo', color('endo'))}
        <div class="bname">Endomorfo</div>
        <div class="bdesc">Estrutura mais larga, tendência a acumular gordura, metabolismo mais lento.</div>
      </div>
    </div>
    <p class="hint" style="margin-top:6px">A maioria das pessoas é uma mistura — escolha o que mais se parece com você hoje.</p>

    <div class="btn-row">
      <button class="btn btn-ghost" id="backBtn">← Voltar</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn" disabled>Continuar →</button>
    </div>
  </div>`;
}

function renderStep4(){
  return `
  <div class="card">
    <p class="eyebrow">Etapa 04</p>
    <h2>Sua alimentação diária</h2>
    <p class="sub">Conte um pouco sobre como você costuma se alimentar no dia a dia.</p>
    <div class="grid">
      ${choiceGroup('refeicoesDia','Quantas refeições você faz por dia?',[
        {value:'2',title:'2 refeições'},
        {value:'3',title:'3 refeições'},
        {value:'4',title:'4 refeições'},
        {value:'5',title:'5 refeições'},
        {value:'6',title:'6 refeições'},
      ], state.refeicoesDia)}
      ${choiceGroup('agua','Quanto de água você bebe por dia?',[
        {value:'baixo',title:'Menos de 1L'},
        {value:'medio',title:'1L a 2L'},
        {value:'bom',title:'2L a 3L'},
        {value:'alto',title:'Mais de 3L'},
      ], state.agua)}
      ${choiceGroup('frutasVeg','Porções de frutas e verduras por dia?',[
        {value:'nenhuma',title:'Quase nenhuma'},
        {value:'poucas',title:'1 a 2 porções'},
        {value:'medias',title:'3 a 4 porções'},
        {value:'muitas',title:'5 ou mais porções'},
      ], state.frutasVeg)}
      ${choiceGroup('fastFood','Frequência de fast food, doces ou refrigerante?',[
        {value:'raro',title:'Raramente'},
        {value:'baixa',title:'1 a 2x por semana'},
        {value:'media',title:'3 a 4x por semana'},
        {value:'alta',title:'Quase todo dia'},
      ], state.fastFood)}
      ${choiceGroup('pulaRefeicoes','Você costuma pular refeições?',[
        {value:'nao',title:'Não'},
        {value:'as-vezes',title:'Às vezes'},
        {value:'sim',title:'Sim, com frequência'},
      ], state.pulaRefeicoes, 3)}
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" id="backBtn">← Voltar</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn" disabled>Continuar →</button>
    </div>
  </div>`;
}

function renderStep5(){
  return `
  <div class="card">
    <p class="eyebrow">Etapa 05</p>
    <h2>Sua rotina e atividade física</h2>
    <p class="sub">Isso ajuda a calcular seu gasto calórico e montar um treino que cabe na sua semana.</p>
    <div class="grid">
      ${choiceGroup('trabalho','Como é o seu dia de trabalho?',[
        {value:'sentado',title:'Sentado(a)', desc:'A maior parte do tempo'},
        {value:'pe',title:'Em pé', desc:'Bastante tempo em pé'},
        {value:'ativo',title:'Fisicamente ativo', desc:'Esforço físico constante'},
      ], state.trabalho, 3)}
      ${choiceGroup('nivelAtividade','Seu nível de atividade física atual',[
        {value:'sedentario',title:'Sedentário', desc:'Pouco ou nenhum exercício'},
        {value:'leve',title:'Leve', desc:'Exercício leve 1–3x/semana'},
        {value:'moderado',title:'Moderado', desc:'Exercício moderado 3–5x/semana'},
        {value:'intenso',title:'Intenso', desc:'Exercício intenso 6–7x/semana'},
      ], state.nivelAtividade)}
      ${choiceGroup('diasTreino','Quantos dias por semana você pode treinar?',[
        {value:'2',title:'2 dias'},
        {value:'3',title:'3 dias'},
        {value:'4',title:'4 dias'},
        {value:'5',title:'5 dias'},
        {value:'6',title:'6 dias'},
      ], state.diasTreino)}
      ${choiceGroup('tempoSessao','Tempo disponível por treino',[
        {value:'30',title:'~30 min'},
        {value:'45',title:'~45 min'},
        {value:'60',title:'~60 min'},
        {value:'60+',title:'Mais de 60 min'},
      ], state.tempoSessao)}
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" id="backBtn">← Voltar</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn" disabled>Continuar →</button>
    </div>
  </div>`;
}

function renderStep6(){
  return `
  <div class="card">
    <p class="eyebrow">Etapa 06</p>
    <h2>Seu sono</h2>
    <p class="sub">O sono influencia diretamente seus resultados de treino e alimentação.</p>
    <div class="grid">
      ${choiceGroup('horasSono','Quantas horas você dorme, em média, por noite?',[
        {value:'menos5',title:'Menos de 5h'},
        {value:'5a6',title:'5h a 6h'},
        {value:'6a7',title:'6h a 7h'},
        {value:'7a8',title:'7h a 8h'},
        {value:'mais8',title:'Mais de 8h'},
      ], state.horasSono)}
      ${choiceGroup('qualidadeSono','Como você avalia a qualidade do seu sono?',[
        {value:'ruim',title:'Ruim'},
        {value:'regular',title:'Regular'},
        {value:'boa',title:'Boa'},
        {value:'otima',title:'Ótima'},
      ], state.qualidadeSono)}
      ${choiceGroup('horarioRegular','Você tem horário regular para dormir e acordar?',[
        {value:'sim',title:'Sim'},
        {value:'nao',title:'Não, varia bastante'},
      ], state.horarioRegular)}
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" id="backBtn">← Voltar</button>
      <span class="spacer"></span>
      <button class="btn btn-primary" id="nextBtn" disabled>Ver meu plano →</button>
    </div>
  </div>`;
}

function renderStep7(){
  const p = calcPlano();
  const classe = classificaIMC(p.imc);
  const refeicoes = planoRefeicoes(p.meta, Number(state.refeicoesDia||4));
  const treino = planoTreino(Number(state.diasTreino||3), state.nivelAtividade, p.objetivo, state.biotipo);
  const bio = BIO_INFO[state.biotipo];

  const proteinaPct = Math.round((p.proteinaG*4/p.meta)*100);
  const carboPct = Math.round((p.carboG*4/p.meta)*100);
  const gorduraPct = Math.round((p.gorduraG*9/p.meta)*100);

  const dicaAgua = {baixo:'Você indicou beber pouca água — tente aumentar gradualmente para pelo menos 2L por dia.', medio:'Sua ingestão de água está razoável — busque chegar perto de 2 a 2,5L por dia.', bom:'Sua hidratação está boa, continue assim.', alto:'Ótima hidratação, siga nesse ritmo.'}[state.agua] || '';
  const dicaFruta = {nenhuma:'Inclua ao menos 2 porções de frutas ou verduras por dia — comece pelo café da manhã e almoço.', poucas:'Tente aumentar para 3 a 4 porções diárias de frutas e verduras.', medias:'Boa quantidade — mantenha a variedade de cores no prato.', muitas:'Excelente consumo de frutas e verduras, siga assim.'}[state.frutasVeg] || '';
  const dicaFast = {raro:'Seu consumo de ultraprocessados é baixo — ótimo hábito para manter.', baixa:'Consumo controlado — tente manter no máximo 1 a 2x por semana.', media:'Tente reduzir gradualmente para 1 a 2x por semana, trocando por opções caseiras.', alta:'Esse é o ponto de maior impacto no seu resultado — reduza aos poucos, substituindo por preparações caseiras.'}[state.fastFood] || '';
  const dicaSono = {menos5:'Menos de 5h de sono prejudica recuperação muscular e controle do apetite — priorize dormir mais cedo.', '5a6':'Tente ganhar mais 1h de sono por noite — isso melhora recuperação e disposição para treinar.', '6a7':'Está próximo do ideal — buscar 7h+ vai potencializar seus resultados.', '7a8':'Boa faixa de sono, mantenha a consistência.', mais8:'Ótimo tempo de sono, continue priorizando o descanso.'}[state.horasSono] || '';

  return `
  <div class="card">
    <div class="result-head">
      <div>
        <p class="eyebrow">Seu plano personalizado</p>
        <h2>${state.nome ? state.nome.split(' ')[0]+', aqui está o seu plano' : 'Seu plano está pronto'}</h2>
      </div>
      <span class="obj-badge">${p.objetivo}</span>
    </div>

    <div class="stat-row">
      <div class="stat">
        <div class="slabel">IMC</div>
        <div class="sval" style="color:${classe.color}">${fmt(p.imc,1)}</div>
        <div class="ssub">${classe.label}</div>
      </div>
      <div class="stat">
        <div class="slabel">Gasto diário</div>
        <div class="sval">${fmt(p.tdee)}</div>
        <div class="ssub">kcal (TDEE estimado)</div>
      </div>
      <div class="stat">
        <div class="slabel">Meta calórica</div>
        <div class="sval">${fmt(p.meta)}</div>
        <div class="ssub">kcal por dia</div>
      </div>
      <div class="stat">
        <div class="slabel">Treinos/semana</div>
        <div class="sval">${state.diasTreino}</div>
        <div class="ssub">${state.tempoSessao} min por sessão</div>
      </div>
    </div>

    ${bio ? `
    <div class="section-block">
      <div class="section-title">Seu biotipo</div>
      <div class="bio-result">
        ${bodySVG(state.biotipo, 'var(--lime)')}
        <div>
          <div class="brname">Biotipo: <b>${bio.nome}</b></div>
          <div class="brtxt">${bio.planoTxt}</div>
        </div>
      </div>
    </div>` : ''}

    <div class="section-block">
      <div class="section-title">Plano alimentar</div>
      <div class="macro-row">
        <div class="macro protein">
          <div class="mname">Proteína</div>
          <div class="mgrams">${fmt(p.proteinaG)} g</div>
          <div class="mbar"><i style="width:${proteinaPct}%"></i></div>
        </div>
        <div class="macro carb">
          <div class="mname">Carboidrato</div>
          <div class="mgrams">${fmt(p.carboG)} g</div>
          <div class="mbar"><i style="width:${carboPct}%"></i></div>
        </div>
        <div class="macro fat">
          <div class="mname">Gordura</div>
          <div class="mgrams">${fmt(p.gorduraG)} g</div>
          <div class="mbar"><i style="width:${gorduraPct}%"></i></div>
        </div>
      </div>
      <div class="meal-list">
        ${refeicoes.map(r=>`
          <div class="meal">
            <span class="mealname">${r.nome}</span>
            <span class="mealsug">${r.sug}</span>
            <span class="mealkcal">${fmt(r.kcal)} kcal</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="section-block">
      <div class="section-title">Plano de treino — semana modelo</div>
      <div class="week-grid">
        ${treino.map(d=>`
          <div class="day ${d.rest?'rest':''}">
            <div class="dname">${d.dia}</div>
            <div class="dfocus">${d.foco}</div>
            <div class="dexercises"><ul>${d.ex.map(e=>`<li>${e}</li>`).join('')}</ul></div>
          </div>`).join('')}
      </div>
    </div>

    <div class="section-block">
      <div class="section-title">Hábitos e recuperação</div>
      <div class="tips-grid">
        <div class="tip"><b>Hidratação —</b> ${dicaAgua}</div>
        <div class="tip"><b>Frutas e verduras —</b> ${dicaFruta}</div>
        <div class="tip"><b>Ultraprocessados —</b> ${dicaFast}</div>
        <div class="tip"><b>Sono —</b> ${dicaSono}</div>
      </div>
    </div>

    <div class="btn-row">
      <button class="btn btn-ghost" id="restartBtn">↺ Refazer avaliação</button>
    </div>

    <div class="disclaimer">
      Este plano é gerado automaticamente com base nas informações fornecidas e em fórmulas gerais de estimativa (Mifflin-St Jeor). A classificação de biotipo pelo punho é um método popular e aproximado, sem precisão científica. Este conteúdo tem caráter educativo e não substitui a avaliação de um nutricionista, médico ou educador físico — especialmente em casos de obesidade, restrições alimentares ou condições de saúde pré-existentes.
    </div>
  </div>`;
}

/* ============ VALIDATION ============ */
function validateStep(){
  if(state.step===1){
    return state.nome.trim().length>1 && state.idade>0 && state.sexo && state.peso>0 && state.altura>0;
  }
  if(state.step===3){ return !!state.biotipo; }
  if(state.step===4){
    return state.refeicoesDia && state.agua && state.frutasVeg && state.fastFood && state.pulaRefeicoes;
  }
  if(state.step===5){
    return state.trabalho && state.nivelAtividade && state.diasTreino && state.tempoSessao;
  }
  if(state.step===6){
    return state.horasSono && state.qualidadeSono && state.horarioRegular;
  }
  return true;
}

/* ============ MAIN RENDER ============ */
function render(){
  const app = document.getElementById('app');
  const renderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6, renderStep7];
  app.innerHTML = renderers[state.step]();
  renderRail();
  bindEvents();
  window.scrollTo({top:0, behavior:'smooth'});
}

function refreshNext(){
  const nb = document.getElementById('nextBtn');
  if(nb) nb.disabled = !validateStep();
}

function bindEvents(){
  const startBtn = document.getElementById('startBtn');
  if(startBtn) startBtn.onclick = ()=>{ state.step=1; render(); };

  const backBtn = document.getElementById('backBtn');
  if(backBtn) backBtn.onclick = ()=>{ state.step--; render(); };

  const restartBtn = document.getElementById('restartBtn');
  if(restartBtn) restartBtn.onclick = ()=>{
    Object.assign(state, {step:0, nome:'', idade:null, sexo:'', peso:null, altura:null,
      biotipo:'',
      refeicoesDia:'', agua:'', frutasVeg:'', fastFood:'', pulaRefeicoes:'',
      trabalho:'', nivelAtividade:'', diasTreino:'', tempoSessao:'',
      horasSono:'', qualidadeSono:'', horarioRegular:''});
    render();
  };

  const nextBtn = document.getElementById('nextBtn');
  if(nextBtn){
    nextBtn.disabled = !validateStep();
    nextBtn.onclick = ()=>{ state.step++; render(); };
  }

  ['nome','idade','sexo','peso','altura'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.oninput = ()=>{
      state[id] = (id==='idade'||id==='peso'||id==='altura') ? parseFloat(el.value)||null : el.value;
      refreshNext();
    };
  });

  // choice cards
  document.querySelectorAll('.choice').forEach(el=>{
    const activate = ()=>{
      const name = el.dataset.name;
      set(name, el.dataset.value);
      document.querySelectorAll(`.choice[data-name="${name}"]`).forEach(c=>c.classList.remove('selected'));
      el.classList.add('selected');
      refreshNext();
    };
    el.onclick = activate;
    el.onkeydown = e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); } };
  });

  // biotype cards
  document.querySelectorAll('.bio-card').forEach(el=>{
    const activate = ()=>{
      state.biotipo = el.dataset.bio;
      // re-render step to update SVG colors + selection
      render();
    };
    el.onclick = activate;
    el.onkeydown = e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); activate(); } };
  });
}

const logoHome = document.getElementById('logoHome');
if(logoHome){
  const goHome = ()=>{ if(state.step!==0){ state.step=0; render(); } };
  logoHome.onclick = goHome;
  logoHome.onkeydown = e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); goHome(); } };
}

render();
