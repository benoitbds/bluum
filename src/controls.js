export function initControls(onNew, onTogglePause, onEnd) {
  const container = document.createElement('div');
  container.id = 'controls';

  const newBtn = document.createElement('button');
  newBtn.className = 'pixel';
  newBtn.textContent = 'NEW';

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'pixel';
  pauseBtn.textContent = 'PAUSE';

  const endBtn = document.createElement('button');
  endBtn.className = 'pixel';
  endBtn.textContent = 'END';

  newBtn.addEventListener('click', () => {
    onNew();
    pauseBtn.textContent = 'PAUSE';
  });

  pauseBtn.addEventListener('click', () => {
    const paused = onTogglePause();
    pauseBtn.textContent = paused ? 'PLAY' : 'PAUSE';
  });

  endBtn.addEventListener('click', () => {
    onEnd();
  });

  container.appendChild(newBtn);
  container.appendChild(pauseBtn);
  container.appendChild(endBtn);
  document.body.appendChild(container);
}
