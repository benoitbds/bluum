export const params = {
  energyMax: 10,
  regen: 0.2,
  survivalCost: 1,
  reproMul: 3,
  mutationRate: 0.1
};

export function initParamsPanel(setEnergyMax) {
  const panel = document.createElement('div');
  panel.id = 'paramsPanel';

  const toggle = document.createElement('div');
  toggle.id = 'paramsToggle';
  toggle.textContent = 'P';
  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const fields = [
    { key: 'energyMax', min: 1, max: 20, step: 1 },
    { key: 'regen', min: 0, max: 1, step: 0.01 },
    { key: 'survivalCost', min: 0, max: 5, step: 0.1 },
    { key: 'reproMul', min: 1, max: 5, step: 0.1 },
    { key: 'mutationRate', min: 0, max: 1, step: 0.01 }
  ];

  fields.forEach(f => {
    const row = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = f.key + ': ';
    const val = document.createElement('span');
    val.textContent = params[f.key];
    label.appendChild(val);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = f.min;
    input.max = f.max;
    input.step = f.step;
    input.value = params[f.key];

    input.addEventListener('input', () => {
      params[f.key] = Number(input.value);
      val.textContent = params[f.key];
      if (f.key === 'energyMax' && typeof setEnergyMax === 'function') {
        setEnergyMax(params.energyMax);
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    panel.appendChild(row);
  });

  function togglePanel() {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }

  toggle.addEventListener('click', togglePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'p' || e.key === 'P') togglePanel();
  });
}
