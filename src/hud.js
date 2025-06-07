import { isWorldPaused, getEndSummary } from './world.js';

export function updateHUD({ tick, entities, species, deaths, edgeRejects, energyTotal, energyAvg }) {
  const hud = document.getElementById('hud');
  if (!hud) return;

  const summary = getEndSummary();
  if (summary) {
    hud.innerHTML = `Ticks: ${summary.ticks}<br>Pop max: ${summary.popMax}<br>Species: ${summary.species}`;
    return;
  }

  let html = `Tick: ${tick}<br>Entities: ${entities}<br>Species: ${species}`;
  html += `<br>Energy total: ${energyTotal.toFixed(1)}<br>Avg/tile: ${energyAvg.toFixed(2)}`;
  html += `<br>Edge rejects: ${edgeRejects}`;

  if (deaths && deaths.length) {
    const recent = deaths.slice(-5);
    html += '<br>Deaths:';
    html += '<br>' + recent.map(id => `<span style="color:red">${id}</span>`).join('<br>');
  } else {
    html += '<br>Deaths: 0';
  }

  hud.innerHTML = html;

  let pause = document.getElementById('hudPause');
  if (!pause) {
    pause = document.createElement('div');
    pause.id = 'hudPause';
    document.body.appendChild(pause);
  }
  pause.textContent = '⏸ PAUSE';
  pause.style.display = isWorldPaused() ? 'block' : 'none';
}
