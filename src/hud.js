export function updateHUD({ tick, entities, species, deaths }) {
  const hud = document.getElementById('hud');
  if (!hud) return;
  let html = `Tick: ${tick}<br>Entities: ${entities}<br>Species: ${species}`;

  if (deaths && deaths.length) {
    const recent = deaths.slice(-5);
    html += '<br>Deaths:';
    html += '<br>' + recent.map(id => `<span style="color:red">${id}</span>`).join('<br>');
  } else {
    html += '<br>Deaths: 0';
  }

  hud.innerHTML = html;
}
