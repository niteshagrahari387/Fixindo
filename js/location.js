(function(){
  const fallback={latitude:28.6139,longitude:77.2090,label:'New Delhi, India',isLive:false};
  function save(location){localStorage.setItem('fixindo-location',JSON.stringify(location));return location}
  function getSaved(){try{return JSON.parse(localStorage.getItem('fixindo-location'))||fallback}catch{return fallback}}
  function getLocation(){return new Promise(resolve=>{if(!navigator.geolocation){resolve(save(fallback));return}navigator.geolocation.getCurrentPosition(position=>{const location=save({latitude:position.coords.latitude,longitude:position.coords.longitude,label:'Current live location',isLive:true});if(window.Fixindo.api.token())window.Fixindo.api.saveLocation(location).catch(()=>undefined);resolve(location)},()=>resolve(save(fallback)),{timeout:7000,maximumAge:300000})})}
  function renderLabels(location=getSaved()){document.querySelectorAll('[data-location-label]').forEach(el=>el.textContent=location.label)}
  document.addEventListener('DOMContentLoaded',()=>{renderLabels();document.querySelectorAll('[data-use-location]').forEach(button=>button.addEventListener('click',async()=>{button.disabled=true;button.textContent='Detecting…';const location=await getLocation();renderLabels(location);button.disabled=false;button.textContent='✓ Location active';window.Fixindo.toast(location.isLive?'Live location selected.':'Using sample New Delhi location.')}))});
  window.Fixindo.location={getLocation,getSaved,renderLabels};
})();