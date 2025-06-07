export function initTempoSlider(onChange) {
  const container = document.createElement('div');
  container.id = 'sliderContainer';

  const input = document.createElement('input');
  input.type = 'range';
  input.id = 'tempo';
  input.min = '100';
  input.max = '2000';
  input.value = '1000';
  input.step = '100';

  const label = document.createElement('span');
  label.id = 'tempoLabel';
  label.textContent = 'Tick: 1.0 s';

  container.appendChild(input);
  container.appendChild(label);
  document.body.appendChild(container);

  input.addEventListener('input', () => {
    const ms = Number(input.value);
    label.textContent = `Tick: ${(ms / 1000).toFixed(1)} s`;
    onChange(ms);
  });
}
