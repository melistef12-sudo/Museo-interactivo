const sequence = ['home', '1', '2', '3', '4', '5', 'closing'];
const stationNames = {home:'PORTADA', '1':'ESTACIÓN 01', '2':'ESTACIÓN 02', '3':'ESTACIÓN 03', '4':'ESTACIÓN 04', '5':'ESTACIÓN 05', closing:'CIERRE'};
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
  document.getElementById('back-button').innerHTML = currentView === 'home' ? '<span aria-hidden="true">←</span> Volver' : '<span aria-hidden="true">←</span> Volver';
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (focusHeading) {
    const visibleView = document.querySelector('.view:not([hidden])');
    const heading = visibleView?.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll: true});
    }
  }
}

function navigate(delta) {
  const index = sequence.indexOf(currentView);
  const next = (index + delta + sequence.length) % sequence.length;
  renderView(sequence[next]);
}

document.querySelectorAll('.station-link').forEach((button) => {
  button.addEventListener('click', () => renderView(button.dataset.station));
});
document.querySelectorAll('[data-go]').forEach((button) => {
  button.addEventListener('click', () => renderView(button.dataset.go));
});
document.getElementById('back-button').addEventListener('click', () => navigate(-1));
document.getElementById('next-button').addEventListener('click', () => navigate(1));

const indicators = {
  pib: {
    number:'INDICADOR 01', title:'Producto Interno Bruto', symbol:'↗',
    measures:'El valor de mercado de todos los bienes y servicios finales producidos en el país durante un periodo determinado.',
    limit:'Muestra la riqueza total generada, pero no cómo se reparte entre los ciudadanos.'
  },
  monetaria: {
    number:'INDICADOR 02', title:'Pobreza Monetaria', symbol:'$',
    measures:'La insuficiencia de ingresos económicos de un hogar para adquirir la canasta básica de alimentos y servicios.',
    limit:'Evalúa capacidad de compra, pero no si el hogar tiene acceso a salud o escuelas de calidad.'
  },
  multidimensional: {
    number:'INDICADOR 03', title:'Pobreza Multidimensional (PM)', symbol:'✳',
    measures:'Las privaciones directas de un hogar en 5 dimensiones: educación, trabajo, salud, vivienda y servicios públicos, y niñez y juventud.',
    limit:'No refleja caídas súbitas de ingresos monetarios a corto plazo.'
  }
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

const chartData = {
  pib: {
    title:'Crecimiento del PIB', caption:'Tasas anuales en volumen · 2023-II a 2026pr-II', max:4,
    groups:[{label:'2023-II',values:[['Nacional',.4,'national']]},{label:'2024-II',values:[['Nacional',1.5,'national']]},{label:'2025-II',values:[['Nacional',1.9,'national']]},{label:'2026pr-II',values:[['Nacional',3.5,'national']]}]
  },
  monetaria: {
    title:'Incidencia de Pobreza Monetaria', caption:'Porcentaje de personas · 2020 y 2025', max:50,
    groups:[{label:'2020',values:[['Nacional',43.1,'national']]},{label:'2025',values:[['Nacional',28,'national'],['Cabeceras',24.6,'urban'],['Rural',39.5,'rural']]}]
  },
  multidimensional: {
    title:'Incidencia de Pobreza Multidimensional (PM)', caption:'Porcentaje de hogares · 2018 y 2025', max:25,
    groups:[{label:'2018',values:[['Nacional',19.1,'national']]},{label:'2025',values:[['Nacional',9.9,'national'],['Cabeceras',6.3,'urban'],['Rural',22.4,'rural']]}]
  }
};
function renderChart(key) {
  const chart = chartData[key];
  if (!chart) return;
  document.querySelectorAll('.chart-tab').forEach((button) => {
    const active = button.dataset.chart === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  document.getElementById('chart-title').textContent = chart.title;
  document.getElementById('chart-caption').textContent = chart.caption;
  const plot = document.getElementById('chart-plot');
  plot.setAttribute('aria-label', `${chart.title}. ${chart.groups.map(group => `${group.label}: ${group.values.map(value => `${value[0]} ${String(value[1]).replace('.', ',')} por ciento`).join(', ')}`).join('; ')}`);
  plot.replaceChildren();
  chart.groups.forEach((group) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'bar-group';
    groupEl.setAttribute('role', 'group');
    groupEl.setAttribute('aria-label', group.label);
    group.values.forEach(([label, value, color]) => {
      const item = document.createElement('div');
      item.className = 'bar-item';
      item.setAttribute('aria-label', `${label}: ${String(value).replace('.', ',')} %`);
      const valueEl = document.createElement('span');
      valueEl.className = 'bar-value';
      valueEl.textContent = `${String(value).replace('.', ',')} %`;
      const bar = document.createElement('span');
      bar.className = `bar ${color === 'national' ? '' : color}`;
      bar.style.height = `${Math.max(3, value / chart.max * 100)}%`;
      bar.setAttribute('aria-hidden', 'true');
      const year = document.createElement('span');
      year.className = 'bar-year';
      year.textContent = label;
      item.append(valueEl, bar, year);
      groupEl.append(item);
    });
    const yearLabel = document.createElement('span');
    yearLabel.className = 'bar-year';
    yearLabel.textContent = group.label;
    yearLabel.setAttribute('aria-hidden', 'true');
    groupEl.append(yearLabel);
    plot.append(groupEl);
  });
  document.getElementById('chart-legend').hidden = key === 'pib';
}
document.querySelectorAll('.chart-tab').forEach((button) => button.addEventListener('click', () => renderChart(button.dataset.chart)));

const gameQuestions = [
  {
    question: '¿Cuál política prioriza un bienestar más sostenible para el campo?',
    help: 'Elige la respuesta que combine crecimiento y acceso a derechos en las zonas rurales.',
    options: [
      { key: 'a', label: 'Exenciones tributarias para grandes industrias y capitales.', correct: false, status: 'CRECIMIENTO SIN EQUIDAD', title: '¡Atención! Crecimiento sin equidad territorial.', text: 'Aunque esta medida puede elevar el PIB nacional, los datos muestran que el crecimiento urbano no se filtra automáticamente al campo. La brecha multidimensional del 22,4 % en zonas rurales seguiría intacta al no intervenir salud, educación ni servicios básicos.' },
      { key: 'b', label: 'Un bono monetario único para familias rurales durante un mes.', correct: false, status: 'ALIVIO TEMPORAL', title: '¡Efecto temporal!', text: 'Un subsidio único alivia momentáneamente la Pobreza Monetaria al permitir comprar la canasta básica ese mes. Sin embargo, no resuelve las 5 dimensiones de la Pobreza Multidimensional: un hogar no construye un acueducto ni una escuela con un giro puntual.' },
      { key: 'c', label: 'Invertir en acueductos veredales, escuelas técnicas rurales, vías terciarias y formalización laboral agropecuaria.', correct: true, status: 'DECISIÓN BASADA EN EVIDENCIA', title: '¡Decisión integral!', text: 'Atacas simultáneamente las raíces del problema: mejoras vivienda y servicios, educación y trabajo en el campo, reduciendo el 22,4 % de Pobreza Multidimensional y generando capacidades productivas que elevan ingresos permanentes, además de aportar al PIB real.' }
    ]
  },
  {
    question: '¿Qué señal es más importante para leer la realidad de Colombia?',
    help: 'Antes de celebrar el crecimiento, revisa quién tiene acceso a oportunidades reales.',
    options: [
      { key: 'a', label: 'La cifra del PIB nacional en aumento.', correct: false, status: 'PIB NO LO EXPLICA TODO', title: 'El PIB cuenta la producción, no siempre la distribución.', text: 'El PIB refleja el tamaño de la economía, pero no muestra si las personas tienen ingreso estable, servicios básicos ni acceso a educación y salud.' },
      { key: 'b', label: 'La combinación de PIB, pobreza monetaria y pobreza multidimensional.', correct: true, status: 'MIRADA COMPLETA', title: '¡Correcto! El análisis debe ser multidimensional.', text: 'Cada indicador responde a una pregunta distinta: producción, ingreso y acceso a derechos. Juntos permiten entender mejor la desigualdad territorial y el bienestar real.' },
      { key: 'c', label: 'Solo la tasa de crecimiento anual.', correct: false, status: 'CRECIMIENTO PARCIAL', title: 'Crecimiento sin mirada territorial.', text: 'La tasa de crecimiento puede mejorar la narrativa macroeconómica, pero no revela si los beneficios llegaron a hogares rurales ni a comunidades con mayor vulnerabilidad.' }
    ]
  },
  {
    question: 'Si tu objetivo es cerrar brechas de bienestar, ¿qué prioridad es más efectiva?',
    help: 'La mejor decisión suele combinar equidad, infraestructura y capacidades productivas.',
    options: [
      { key: 'a', label: 'Aumentar más impuestos a las familias de bajos ingresos.', correct: false, status: 'MEDIDA INADECUADA', title: 'No es la vía adecuada.', text: 'Aumentar la carga fiscal sobre quienes menos tienen refuerza la desigualdad y no resuelve la falta de infraestructura ni de oportunidades en el campo.' },
      { key: 'b', label: 'Invertir en servicios básicos y capacidades productivas en zonas rurales.', correct: true, status: 'ESTRATEGIA INTEGRAL', title: '¡Decisión acertada!', text: 'La inversión en acueductos, educación técnica, vías terciarias y formalización laboral genera bienestar real y también condiciones para una actividad económica más duradera.' },
      { key: 'c', label: 'Repartir un subsidio único para todos por igual.', correct: false, status: 'SUBSIDIO LIMITADO', title: 'Efecto parcial y fragmentado.', text: 'Un subsidio universal sin inversión territorial no resuelve la infraestructura ni la calidad de servicios esenciales que sostienen la vida y la productividad.' }
    ]
  }
];

const optionButtons = [...document.querySelectorAll('.option-button')];
let currentQuestionIndex = 0;
let totalCorrect = 0;
let answered = false;

function updateQuestionUI() {
  const currentQuestion = gameQuestions[currentQuestionIndex];
  document.getElementById('game-step').textContent = `PREGUNTA ${currentQuestionIndex + 1} / ${gameQuestions.length}`;
  document.getElementById('game-question-title').textContent = currentQuestion.question;
  document.getElementById('game-question-copy').textContent = currentQuestion.help;

  optionButtons.forEach((button, index) => {
    const option = currentQuestion.options[index];
    button.dataset.option = option.key;
    button.innerHTML = `<span class="option-letter">${option.key.toUpperCase()}</span><span>${option.label}</span><span class="option-arrow" aria-hidden="true">↗</span>`;
    button.disabled = false;
    button.classList.remove('selected');
    button.setAttribute('aria-label', option.label);
  });

  const panel = document.getElementById('game-feedback');
  panel.hidden = true;
  panel.classList.remove('correct');
  document.getElementById('next-question-button').hidden = true;
  answered = false;
}

function showFeedback(optionKey) {
  const currentQuestion = gameQuestions[currentQuestionIndex];
  const selected = currentQuestion.options.find((opt) => opt.key === optionKey);
  if (!selected) return;

  if (selected.correct) totalCorrect += 1;
  answered = true;

  optionButtons.forEach((button) => {
    const isSelected = button.dataset.option === optionKey;
    button.disabled = true;
    button.classList.toggle('selected', isSelected);
  });

  const panel = document.getElementById('game-feedback');
  const nextButton = document.getElementById('next-question-button');
  const retryButton = document.getElementById('retry-button');
  panel.hidden = false;
  panel.classList.toggle('correct', selected.correct);
  document.getElementById('feedback-status').textContent = selected.status;
  document.getElementById('feedback-title').textContent = selected.title;
  document.getElementById('feedback-text').textContent = selected.text;

  const isLastQuestion = currentQuestionIndex === gameQuestions.length - 1;
  if (isLastQuestion) {
    const finalMessage = `${totalCorrect} de ${gameQuestions.length} respuestas correctas.`;
    document.getElementById('feedback-status').textContent = 'RESULTADO FINAL';
    document.getElementById('feedback-title').textContent = `Tu resultado: ${finalMessage}`;
    document.getElementById('feedback-text').textContent = totalCorrect === gameQuestions.length ? '¡Excelente! Demuestras una comprensión sólida de cómo la evidencia y la equidad territorial deben guiar la política pública.' : 'Sigue revisando las brechas territoriales y la relación entre crecimiento, ingreso y acceso a derechos. El bienestar no se mide solo por el PIB.';
    nextButton.hidden = true;
    retryButton.textContent = 'Intentar de nuevo ↻';
  } else {
    nextButton.hidden = false;
    nextButton.innerHTML = 'Siguiente pregunta <span aria-hidden="true">→</span>';
    retryButton.textContent = 'Intentar de nuevo ↻';
  }
}

function resetGame() {
  currentQuestionIndex = 0;
  totalCorrect = 0;
  updateQuestionUI();
}

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (answered) return;
    showFeedback(button.dataset.option);
  });
});

document.getElementById('next-question-button').addEventListener('click', () => {
  if (answered) {
    currentQuestionIndex += 1;
    if (currentQuestionIndex >= gameQuestions.length) {
      resetGame();
      return;
    }
    updateQuestionUI();
  }
});

document.getElementById('retry-button').addEventListener('click', () => {
  resetGame();
});

renderChart('pib');
renderView('home', {focusHeading:false});
resetGame();
