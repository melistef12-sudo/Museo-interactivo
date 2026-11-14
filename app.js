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

const feedbackData = {
  a: {correct:false,status:'RESPUESTA INCOMPLETA',title:'¡Atención! Crecimiento sin equidad territorial.',text:'Aunque esta medida puede elevar el indicador del PIB nacional, los datos muestran que el crecimiento urbano no se filtra automáticamente al campo. La brecha multidimensional del 22,4 % en zonas rurales seguiría intacta al no intervenir salud, educación ni servicios básicos.'},
  b: {correct:false,status:'ALIVIO TEMPORAL',title:'¡Efecto temporal!',text:'Un subsidio único alivia momentáneamente la Pobreza Monetaria al permitir comprar la canasta básica ese mes. Sin embargo, no resuelve las 5 dimensiones de la Pobreza Multidimensional: un hogar no construye un acueducto ni una escuela con un giro puntual.'},
  c: {correct:true,status:'DECISIÓN BASADA EN EVIDENCIA',title:'¡Decisión integral!',text:'Atacas simultáneamente las raíces del problema: mejoras vivienda y servicios, educación y trabajo en el campo (reduciendo el 22,4 % de Pobreza Multidimensional) y generas capacidades productivas que elevan los ingresos permanentes (reduciendo el 39,5 % de Pobreza Monetaria), mientras aportas al PIB real.'}
};
const optionButtons = [...document.querySelectorAll('.option-button')];
function chooseOption(key) {
  const result = feedbackData[key];
  if (!result) return;
  optionButtons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle('selected', button.dataset.option === key);
  });
  const panel = document.getElementById('game-feedback');
  panel.hidden = false;
  panel.classList.toggle('correct', result.correct);
  document.getElementById('feedback-status').textContent = result.status;
  document.getElementById('feedback-title').textContent = result.title;
  document.getElementById('feedback-text').textContent = result.text;
  document.getElementById('retry-button').focus({preventScroll:true});
}
optionButtons.forEach((button) => button.addEventListener('click', () => chooseOption(button.dataset.option)));
document.getElementById('retry-button').addEventListener('click', () => {
  document.getElementById('game-feedback').hidden = true;
  document.getElementById('game-feedback').classList.remove('correct');
  optionButtons.forEach((button) => { button.disabled = false; button.classList.remove('selected'); });
  optionButtons[0].focus();
});

renderChart('pib');
renderView('home', {focusHeading:false});
