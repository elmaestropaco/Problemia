(() => {
  const info=document.createElement('p');info.className='dialog-note';info.id='offlineInfo';document.getElementById('settingsForm').append(info);
  if('serviceWorker'in navigator&&['https:','http:'].includes(location.protocol))navigator.serviceWorker.register('./sw.js?v=20261019',{updateViaCache:'none'}).then(async()=>{await navigator.serviceWorker.ready;info.textContent='Aplicación preparada para abrir sin conexión en este dispositivo.'}).catch(()=>{info.textContent='No se ha podido preparar el modo sin conexión. Recarga cuando tengas red.'});
  else info.textContent='Para preparar el arranque sin conexión, abre Problemia desde GitHub Pages o un servidor local. Los archivos descargados también funcionan al abrir index.html.';
})();
