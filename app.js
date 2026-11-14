// Merge the separate evidence scene into station 02 so the definition and its example graph appear together.
const evidenceScene = document.getElementById('view-3');
const measurementScene = document.getElementById('view-2');
if (evidenceScene && measurementScene) {
  const evidenceHeading = document.createElement('div');
  evidenceHeading.className = 'evidence-heading';
  evidenceHeading.innerHTML = '<p class="eyebrow"><span class="station-kicker">EVIDENCIA</span> · DATOS OFICIALES DEL DANE</p><h3>Del indicador a la realidad</h3><p class="lede">Explora las cifras seleccionadas. Cada gráfica usa su propia escala y periodo: no se completan años sin datos ni se mezclan territorios con el total nacional.</p>';
  const comparator = measurementScene.querySelector('.comparator');
  const interactionHint = measurementScene.querySelector('.interaction-hint');
  const chartShell = evidenceScene.querySelector('.chart-shell');
  const dataNote = evidenceScene.querySelector('.data-note');
  const chartEyebrow = chartShell?.querySelector('.chart-header .eyebrow');
  if (chartEyebrow) chartEyebrow.textContent = 'EJEMPLO · CRECIMIENTO DEL PIB NACIONAL';
  if (chartShell && comparator) {
    const evidenceBlock = document.createElement('section');
    evidenceBlock.className = 'evidence-block';
    evidenceBlock.setAttribute('aria-label', 'Gráficas de evidencia del DANE');
    evidenceBlock.append(evidenceHeading, chartShell);
    if (dataNote) evidenceBlock.append(dataNote);
    (interactionHint || comparator).insertAdjacentElement('afterend', evidenceBlock);
  }
  evidenceScene.remove();
  const stationThree = document.getElementById('view-4');
  const stationFour = document.getElementById('view-5');
  if (stationThree) {
    stationThree.id = 'view-3';
    stationThree.dataset.index = '3';
    const marker = stationThree.querySelector('.station-kicker');
    if (marker) marker.textContent = '03';
    const title = stationThree.querySelector('h2');
    if (title) title.id = 'station-3-title';
    stationThree.setAttribute('aria-labelledby', 'station-3-title');
  }
  if (stationFour) {
    stationFour.id = 'view-4';
    stationFour.dataset.index = '4';
    const marker = stationFour.querySelector('.station-kicker');
    if (marker) marker.textContent = '04';
    const title = stationFour.querySelector('h2');
    if (title) title.id = 'station-4-title';
    stationFour.setAttribute('aria-labelledby', 'station-4-title');
  }
  const removedNavItem = document.querySelector('.station-link[data-station="3"]');
  removedNavItem?.remove();
  document.querySelectorAll('.station-link').forEach((button, index) => {
    const number = index + 1;
    button.dataset.station = String(number);
    button.textContent = String(number).padStart(2, '0');
    button.setAttribute('aria-label', `Estación ${String(number).padStart(2, '0')}`);
  });
  const heading = measurementScene.querySelector('.station-heading .eyebrow');
  if (heading) heading.innerHTML = '<span class="station-kicker">02</span> · MEDICIÓN Y EVIDENCIA';
  const summary = measurementScene.querySelector('.station-heading .lede');
  if (summary) summary.textContent = 'Un solo indicador no cuenta toda la historia. Compara qué mide cada cifra y observa la evidencia del DANE para entender cómo el crecimiento económico convive con brechas de ingreso y bienestar entre territorios.';
  const style = document.createElement('style');
  style.textContent = `.evidence-block{margin-top:2.4rem;padding-top:1.6rem;border-top:1px solid rgba(255,255,255,.14)}.evidence-heading{max-width:780px;margin-bottom:1rem}.evidence-heading h3{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.2rem);margin:.35rem 0 .55rem}.evidence-heading .lede{font-size:.9rem}.evidence-block .chart-shell{margin-top:1rem;border-color:rgba(255,255,255,.16);background:linear-gradient(145deg,#171a22,#111319)}.evidence-block .chart-header{align-items:flex-start}.evidence-block .chart-header .eyebrow{color:var(--amber)}.evidence-block .chart-header h3{font-size:clamp(1.35rem,2.5vw,1.8rem)}.evidence-block .chart-plot{display:block;min-height:0;padding:1.2rem .25rem .7rem;background:none;border:0;overflow:hidden}.evidence-block .chart-plot svg{width:100%;height:auto;max-height:360px}.evidence-block .chart-legend{padding:.75rem .8rem;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08)}.evidence-block .data-note{padding:.8rem 1rem;margin:.75rem 0 0;background:rgba(255,183,3,.055);border-left:2px solid var(--amber);line-height:1.65}.chart-tab[aria-selected="true"]{font-weight:700}.station-view[data-index="2"]{padding-bottom:4rem}@media(max-width:600px){.evidence-block{margin-top:1.7rem;padding-top:1.2rem}.evidence-block .chart-shell{padding:.9rem .65rem}.evidence-block .chart-plot{padding:.7rem 0}.evidence-heading .lede{font-size:.82rem}}`;
  document.head.append(style);
}

const sequence = ['home', '1', '2', '3', '4', 'closing'];
const stationNames = {home:'PORTADA', '1':'ESTACIÓN 01', '2':'ESTACIÓN 02', '3':'ESTACIÓN 03', '4':'ESTACIÓN 04', closing:'CIERRE'};
let currentView = 'home';

function updateActiveMenu(stationIndex) {
  document.querySelectorAll('.station-link').forEach((button) => {
    const active = Number(button.dataset.station) === Number(stationIndex);
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
}
function renderView(nextView, {focusHeading = true} = {}) {
  if (!sequence.includes(String(nextView))) return;
  currentView = String(nextView);
  document.querySelectorAll('.view').forEach((view) => {
    const visible = view.dataset.view === (currentView === 'home' || currentView === 'closing' ? currentView : 'station') &&
      (currentView === 'home' || currentView === 'closing' || view.dataset.index === currentView);
    view.hidden = !visible;
  });
  updateActiveMenu(/^\d$/.test(currentView) ? Number(currentView) : null);
  const step = sequence.indexOf(currentView);
  document.getElementById('progress-label').textContent = stationNames[currentView];
  document.getElementById('progress-bar').style.width = `${(step / (sequence.length - 1)) * 100}%`;
  document.getElementById('back-button').disabled = false;
  document.getElementById('next-button').innerHTML = currentView === 'closing' ? 'Volver al inicio <span aria-hidden="true">↗</span>' : 'Continuar <span aria-hidden="true">→</span>';
  document.getElementById('back-button').innerHTML = '<span aria-hidden="true">←</span> Volver';
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (focusHeading) {
    const heading = document.querySelector('.view:not([hidden]) h1, .view:not([hidden]) h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({preventScroll: true}); }
  }
}
function navigate(delta) {
  const index = sequence.indexOf(currentView);
  renderView(sequence[(index + delta + sequence.length) % sequence.length]);
}
document.querySelectorAll('.station-link').forEach((button) => button.addEventListener('click', () => renderView(button.dataset.station)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => renderView(button.dataset.go)));
document.getElementById('back-button').addEventListener('click', () => navigate(-1));
document.getElementById('next-button').addEventListener('click', () => navigate(1));

const indicators = {
  pib: {number:'INDICADOR 01', title:'Producto Interno Bruto', symbol:'↗', measures:'El valor de mercado de todos los bienes y servicios finales producidos en el país durante un periodo determinado.', limit:'Muestra la riqueza total generada, pero no cómo se reparte entre los ciudadanos.'},
  monetaria: {number:'INDICADOR 02', title:'Pobreza Monetaria', symbol:'$', measures:'La insuficiencia de ingresos económicos de un hogar para adquirir la canasta básica de alimentos y servicios.', limit:'Evalúa capacidad de compra, pero no si el hogar tiene acceso a salud o escuelas de calidad.'},
  multidimensional: {number:'INDICADOR 03', title:'Pobreza Multidimensional (PM)', symbol:'✳', measures:'Las privaciones directas de un hogar en 5 dimensiones: educación, trabajo, salud, vivienda y servicios públicos, y niñez y juventud.', limit:'No refleja caídas súbitas de ingresos monetarios a corto plazo.'}
};
function selectIndicator(key) {
  const item = indicators[key];
  if (!item) return;
  document.querySelectorAll('.tab-button').forEach((button) => {
    const active = button.dataset.indicator === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  document.getElementById('indicator-number').textContent = item.number;
  document.getElementById('indicator-title').textContent = item.title;
  document.getElementById('indicator-symbol').textContent = item.symbol;
  document.getElementById('indicator-measures').textContent = item.measures;
  document.getElementById('indicator-limit').textContent = item.limit;
  document.getElementById('indicator-panel').setAttribute('aria-labelledby', `tab-${key}`);
}
document.querySelectorAll('.tab-button').forEach((button, index, buttons) => {
  button.addEventListener('click', () => selectIndicator(button.dataset.indicator));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    buttons[next].focus();
    selectIndicator(buttons[next].dataset.indicator);
  });
});

// Plot only the reference values supplied for the exhibit; no missing years are interpolated.
const chartData = {
  pib: {title:'Crecimiento del PIB nacional', unit:'VARIACIÓN ANUAL (%)', caption:'Tasas anuales en volumen · trimestres II seleccionados', max:4, tick:1, insight:'Los puntos seleccionados muestran un crecimiento de 0,4 % en 2023-II, 1,5 % en 2024-II, 1,9 % en 2025-II y 3,5 % en 2026pr-II. El dato de 2026pr es provisional; no se estiman los periodos intermedios.', rows:[{label:'2023-II',value:.4,color:'national'},{label:'2024-II',value:1.5,color:'national'},{label:'2025-II',value:1.9,color:'national'},{label:'2026pr-II',value:3.5,color:'national'}]},
  monetaria: {title:'Pobreza monetaria', unit:'PERSONAS EN POBREZA (%)', caption:'Referencias disponibles · 2020 y 2025', max:50, tick:10, insight:'En 2025, la incidencia fue 28,0 % a nivel nacional, 24,6 % en cabeceras y 39,5 % en centros poblados y rural disperso. El 43,1 % es el dato nacional de 2020; se muestra separado porque corresponde a otro año.', rows:[{label:'2020 · Nacional',value:43.1,color:'national'},{label:'2025 · Nacional',value:28,color:'national'},{label:'2025 · Cabeceras',value:24.6,color:'urban'},{label:'2025 · Centros poblados y rural disperso',shortLabel:['2025 · Centros poblados y','rural disperso'],value:39.5,color:'rural'}]},
  multidimensional: {title:'Pobreza multidimensional', unit:'PERSONAS EN POBREZA (%)', caption:'Referencias disponibles · 2018 y 2025', max:25, tick:5, insight:'En 2025, la incidencia fue 9,9 % a nivel nacional, 6,3 % en cabeceras y 22,4 % en centros poblados y rural disperso (más de tres veces la cifra de cabeceras). El 19,1 % es el dato nacional de 2018, mostrado como referencia de otro año.', rows:[{label:'2018 · Nacional',value:19.1,color:'national'},{label:'2025 · Nacional',value:9.9,color:'national'},{label:'2025 · Cabeceras',value:6.3,color:'urban'},{label:'2025 · Centros poblados y rural disperso',shortLabel:['2025 · Centros poblados y','rural disperso'],value:22.4,color:'rural'}]}
};
const svgNS = 'http://www.w3.org/2000/svg';
const chartColors = {national:'#00a896',urban:'#e63946',rural:'#8d99ae'};
function makeSvgElement(name, attrs = {}) {
  const element = document.createElementNS(svgNS, name);
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}
function formatPercent(value) { return `${String(value).replace('.', ',')} %`; }
function renderChart(key) {
  const chart = chartData[key];
  if (!chart) return;
  document.querySelectorAll('.chart-tab').forEach((button) => {
    const active = button.dataset.chart === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.getElementById('chart-title').textContent = chart.title;
  document.querySelector('.chart-unit').textContent = chart.unit;
  document.getElementById('chart-caption').textContent = chart.caption;
  const plot = document.getElementById('chart-plot');
  plot.setAttribute('aria-label', `${chart.title}. ${chart.rows.map(row => `${row.label}: ${String(row.value).replace('.', ',')} por ciento`).join('; ')}`);
  document.querySelector('.data-note').textContent = `${chart.insight} Fuente: DANE, Cuentas Nacionales y Encuesta de Calidad de Vida (ECV). Los años sin dato no se interpolan.`;

  const width = 900, left = 300, right = 790, top = 43, rowHeight = 58;
  const height = top + chart.rows.length * rowHeight + 20;
  const svg = makeSvgElement('svg', {viewBox:`0 0 ${width} ${height}`, role:'img', 'aria-labelledby':'chart-svg-title chart-svg-desc', preserveAspectRatio:'xMidYMid meet'});
  const title = makeSvgElement('title', {id:'chart-svg-title'}); title.textContent = chart.title;
  const desc = makeSvgElement('desc', {id:'chart-svg-desc'}); desc.textContent = chart.rows.map(row => `${row.label}: ${formatPercent(row.value)}`).join('. ');
  svg.append(title, desc);
  const tickCount = chart.max / chart.tick;
  for (let i = 0; i <= tickCount; i += 1) {
    const value = i * chart.tick;
    const x = left + (value / chart.max) * (right - left);
    svg.append(makeSvgElement('line', {x1:x,y1:top-5,x2:x,y2:height-16,stroke:'rgba(255,255,255,.13)','stroke-width':'1'}));
    const tickLabel = makeSvgElement('text', {x,y:top-14,fill:'#a1a5b1','font-size':'12','text-anchor':'middle','font-family':'DM Sans, Arial, sans-serif'});
    tickLabel.textContent = `${String(value).replace('.', ',')} %`;
    svg.append(tickLabel);
  }
  chart.rows.forEach((row, index) => {
    const y = top + index * rowHeight + 18;
    const label = makeSvgElement('text', {x:8,y:y+4,fill:'#f2f0e9','font-size':'13','font-family':'DM Sans, Arial, sans-serif'});
    if (row.shortLabel) row.shortLabel.forEach((line, lineIndex) => {
      const tspan = makeSvgElement('tspan', {x:8,dy:lineIndex === 0 ? 0 : 15});
      tspan.textContent = line;
      label.append(tspan);
    });
    else label.textContent = row.label;
    svg.append(label);
    const barWidth = Math.max(2, (row.value / chart.max) * (right - left));
    svg.append(makeSvgElement('rect', {x:left,y:y-10,width:barWidth,height:20,rx:4,fill:chartColors[row.color]}));
    const valueLabel = makeSvgElement('text', {x:Math.min(left + barWidth + 9, 815),y:y+5,fill:'#f2f0e9','font-size':'13','font-weight':'700','font-family':'DM Sans, Arial, sans-serif'});
    valueLabel.textContent = formatPercent(row.value);
    svg.append(valueLabel);
  });
  plot.replaceChildren(svg);
  document.getElementById('chart-legend').hidden = key === 'pib';
}
document.querySelectorAll('.chart-tab').forEach((button) => button.addEventListener('click', () => renderChart(button.dataset.chart)));

const gameQuestions = [
  {question:'¿Cuál política prioriza un bienestar más sostenible para el campo?',help:'Elige la respuesta que combine crecimiento y acceso a derechos en las zonas rurales.',options:[
    {key:'a',label:'Exenciones tributarias para grandes industrias y capitales.',correct:false,status:'CRECIMIENTO SIN EQUIDAD',title:'¡Atención! Crecimiento sin equidad territorial.',text:'Aunque esta medida puede elevar el PIB nacional, los datos muestran que el crecimiento urbano no se filtra automáticamente al campo. La brecha multidimensional del 22,4 % en zonas rurales seguiría intacta al no intervenir salud, educación ni servicios básicos.'},
    {key:'b',label:'Un bono monetario único para familias rurales durante un mes.',correct:false,status:'ALIVIO TEMPORAL',title:'¡Efecto temporal!',text:'Un subsidio único alivia momentáneamente la Pobreza Monetaria al permitir comprar la canasta básica ese mes. Sin embargo, no resuelve las 5 dimensiones de la Pobreza Multidimensional: un hogar no construye un acueducto ni una escuela con un giro puntual.'},
    {key:'c',label:'Invertir en acueductos veredales, escuelas técnicas rurales, vías terciarias y formalización laboral agropecuaria.',correct:true,status:'DECISIÓN BASADA EN EVIDENCIA',title:'¡Decisión integral!',text:'Atacas simultáneamente las raíces del problema: mejoras vivienda y servicios, educación y trabajo en el campo, reduciendo el 22,4 % de Pobreza Multidimensional y generando capacidades productivas que elevan ingresos permanentes, además de aportar al PIB real.'}
  ]},
  {question:'¿Qué señal es más importante para leer la realidad de Colombia?',help:'Antes de celebrar el crecimiento, revisa quién tiene acceso a oportunidades reales.',options:[
    {key:'a',label:'La cifra del PIB nacional en aumento.',correct:false,status:'PIB NO LO EXPLICA TODO',title:'El PIB cuenta la producción, no siempre la distribución.',text:'El PIB refleja el tamaño de la economía, pero no muestra si las personas tienen ingreso estable, servicios básicos ni acceso a educación y salud.'},
    {key:'b',label:'La combinación de PIB, pobreza monetaria y pobreza multidimensional.',correct:true,status:'MIRADA COMPLETA',title:'¡Correcto! El análisis debe ser multidimensional.',text:'Cada indicador responde a una pregunta distinta: producción, ingreso y acceso a derechos. Juntos permiten entender mejor la desigualdad territorial y el bienestar real.'},
    {key:'c',label:'Solo la tasa de crecimiento anual.',correct:false,status:'CRECIMIENTO PARCIAL',title:'Crecimiento sin mirada territorial.',text:'La tasa de crecimiento puede mejorar la narrativa macroeconómica, pero no revela si los beneficios llegaron a hogares rurales ni a comunidades con mayor vulnerabilidad.'}
  ]},
  {question:'Si tu objetivo es cerrar brechas de bienestar, ¿qué prioridad es más efectiva?',help:'La mejor decisión suele combinar equidad, infraestructura y capacidades productivas.',options:[
    {key:'a',label:'Aumentar más impuestos a las familias de bajos ingresos.',correct:false,status:'MEDIDA INADECUADA',title:'No es la vía adecuada.',text:'Aumentar la carga fiscal sobre quienes menos tienen refuerza la desigualdad y no resuelve la falta de infraestructura ni de oportunidades en el campo.'},
    {key:'b',label:'Invertir en servicios básicos y capacidades productivas en zonas rurales.',correct:true,status:'ESTRATEGIA INTEGRAL',title:'¡Decisión acertada!',text:'La inversión en acueductos, educación técnica, vías terciarias y formalización laboral genera bienestar real y también condiciones para una actividad económica más duradera.'},
    {key:'c',label:'Repartir un subsidio único para todos por igual.',correct:false,status:'SUBSIDIO LIMITADO',title:'Efecto parcial y fragmentado.',text:'Un subsidio universal sin inversión territorial no resuelve la infraestructura ni la calidad de servicios esenciales que sostienen la vida y la productividad.'}
  ]}
];
const optionButtons = [...document.querySelectorAll('.option-button')];
let currentQuestionIndex = 0, totalCorrect = 0, answered = false;
function updateQuestionUI() {
  const question = gameQuestions[currentQuestionIndex];
  document.getElementById('game-step').textContent = `PREGUNTA ${currentQuestionIndex + 1} / ${gameQuestions.length}`;
  document.getElementById('game-question-title').textContent = question.question;
  document.getElementById('game-question-copy').textContent = question.help;
  optionButtons.forEach((button, index) => {
    const option = question.options[index];
    button.dataset.option = option.key;
    button.innerHTML = `<span class="option-letter">${option.key.toUpperCase()}</span><span>${option.label}</span><span class="option-arrow" aria-hidden="true">↗</span>`;
    button.disabled = false;
    button.classList.remove('selected');
    button.setAttribute('aria-label', option.label);
  });
  document.getElementById('game-feedback').hidden = true;
  document.getElementById('game-feedback').classList.remove('correct');
  document.getElementById('next-question-button').hidden = true;
  answered = false;
}
function showFeedback(optionKey) {
  if (answered) return;
  const selected = gameQuestions[currentQuestionIndex].options.find((option) => option.key === optionKey);
  if (!selected) return;
  if (selected.correct) totalCorrect += 1;
  answered = true;
  optionButtons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle('selected', button.dataset.option === optionKey);
  });
  const panel = document.getElementById('game-feedback');
  const nextButton = document.getElementById('next-question-button');
  panel.hidden = false;
  panel.classList.toggle('correct', selected.correct);
  document.getElementById('feedback-status').textContent = selected.status;
  document.getElementById('feedback-title').textContent = selected.title;
  document.getElementById('feedback-text').textContent = selected.text;
  if (currentQuestionIndex === gameQuestions.length - 1) {
    document.getElementById('feedback-status').textContent = 'RESULTADO FINAL';
    document.getElementById('feedback-title').textContent = `Tu resultado: ${totalCorrect} de ${gameQuestions.length} respuestas correctas.`;
    document.getElementById('feedback-text').textContent = totalCorrect === gameQuestions.length ? '¡Excelente! Demuestras una comprensión sólida de cómo la evidencia y la equidad territorial deben guiar la política pública.' : 'Sigue revisando las brechas territoriales y la relación entre crecimiento, ingreso y acceso a derechos. El bienestar no se mide solo por el PIB.';
    nextButton.hidden = true;
  } else {
    nextButton.hidden = false;
    nextButton.innerHTML = 'Siguiente pregunta <span aria-hidden="true">→</span>';
  }
  document.getElementById('retry-button').textContent = 'Intentar de nuevo ↻';
}
function resetGame() { currentQuestionIndex = 0; totalCorrect = 0; updateQuestionUI(); }
optionButtons.forEach((button) => button.addEventListener('click', () => showFeedback(button.dataset.option)));
document.getElementById('next-question-button').addEventListener('click', () => {
  if (!answered) return;
  currentQuestionIndex += 1;
  updateQuestionUI();
  optionButtons[0].focus();
});
document.getElementById('retry-button').addEventListener('click', () => { resetGame(); optionButtons[0].focus(); });

renderChart('pib');
renderView('home', {focusHeading:false});
resetGame();
