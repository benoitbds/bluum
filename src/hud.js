export function updateHUD({ tick, entities, species, deaths }) {
  const hud = document.getElementById('hud');
  if (!hud) return;
  let html = `Tick: ${tick}<br>Entities: ${entities}<br>Species: ${species}`;
  if (deaths && deaths.length) {
    html += `<br>Deaths: ${deaths.join(', ')}`;
  }
  hud.innerHTML = html;
}
