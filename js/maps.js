(function(){
  function mount(container){if(!container)return;const location=window.Fixindo.location?.getSaved()||{label:'New Delhi, India'};container.innerHTML=`<div class="map-placeholder" role="img" aria-label="Map placeholder centered on ${location.label}"><div class="map-pin"><span>⌖</span></div><span class="map-caption">${location.label} · Frontend map placeholder</span></div>`}
  document.addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-map-placeholder]').forEach(mount));
  window.Fixindo.maps={mount};
})();