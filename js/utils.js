(function(){
  const data={
    categories:[
      {id:'plumbing',name:'Plumbing',icon:'🔧',description:'Leaks, taps, pipes and installations'},
      {id:'electrician',name:'Electrician',icon:'⚡',description:'Repairs, fittings and safety checks'},
      {id:'ac-repair',name:'AC Repair',icon:'❄️',description:'Service, installation and repairs'},
      {id:'cleaning',name:'Cleaning',icon:'🧹',description:'Home and deep cleaning'},
      {id:'carpentry',name:'Carpentry',icon:'🪚',description:'Furniture repair and custom work'},
      {id:'tech-repair',name:'Tech Repair',icon:'💻',description:'Laptop and mobile repair'},
      {id:'beauty',name:'Beauty',icon:'✦',description:'At-home beauty services'},
      {id:'tutoring',name:'Tutoring',icon:'📚',description:'Qualified local tutors'}
    ],
    professionals:[
      {id:'pro-001',businessName:'Sharma Plumbing Co.',ownerName:'Amit Sharma',category:'Plumbing',rating:4.9,reviews:186,distance:1.2,experience:'12 yrs experience',startingPrice:299,available:true,verified:true,initials:'AS'},
      {id:'pro-002',businessName:'QuickFix Home Services',ownerName:'Rahul Verma',category:'Plumbing',rating:4.8,reviews:124,distance:2.7,experience:'8 yrs experience',startingPrice:249,available:true,verified:true,initials:'RV'},
      {id:'pro-003',businessName:'Raj Electricals',ownerName:'Raj Kumar',category:'Electrician',rating:4.9,reviews:212,distance:1.2,experience:'10 yrs experience',startingPrice:249,available:true,verified:true,initials:'RK'},
      {id:'pro-004',businessName:'SparkRight Services',ownerName:'Vikas Mehta',category:'Electrician',rating:4.8,reviews:163,distance:2.1,experience:'7 yrs experience',startingPrice:299,available:true,verified:true,initials:'VM'},
      {id:'pro-005',businessName:'Cool Air Experts',ownerName:'Imran Khan',category:'AC Repair',rating:4.9,reviews:206,distance:2.0,experience:'11 yrs experience',startingPrice:399,available:true,verified:true,initials:'IK'},
      {id:'pro-006',businessName:'FreshNest Cleaning',ownerName:'Meera Patel',category:'Cleaning',rating:4.8,reviews:138,distance:1.8,experience:'6 yrs experience',startingPrice:499,available:true,verified:true,initials:'MP'}
    ],
    services:[
      {id:'tap-repair',name:'Tap and leak repair',category:'Plumbing',startingPrice:299,duration:'30–60 min'},
      {id:'switchboard',name:'Switchboard repair',category:'Electrician',startingPrice:249,duration:'30–45 min'},
      {id:'ac-service',name:'AC service',category:'AC Repair',startingPrice:499,duration:'60–90 min'},
      {id:'deep-clean',name:'Deep home cleaning',category:'Cleaning',startingPrice:999,duration:'2–4 hr'},
      {id:'furniture-repair',name:'Furniture repair',category:'Carpentry',startingPrice:399,duration:'60–120 min'},
      {id:'laptop-check',name:'Laptop diagnosis',category:'Tech Repair',startingPrice:299,duration:'30–60 min'}
    ]
  };
  function qs(s,scope=document){return scope.querySelector(s)}
  function qsa(s,scope=document){return [...scope.querySelectorAll(s)]}
  function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function toast(message){let el=qs('#fixindoToast');if(!el){el=document.createElement('div');el.id='fixindoToast';el.className='toast';document.body.append(el)}el.textContent=message;el.classList.add('show');clearTimeout(window.__fixindoToast);window.__fixindoToast=setTimeout(()=>el.classList.remove('show'),3200)}
  function money(value){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value)}
  function today(){return new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
  const sessionKey='fixindo_access_token';
  const userKey='fixindo_session_user';
  const api={
    token(){return sessionStorage.getItem(sessionKey)||''},
    user(){try{return JSON.parse(sessionStorage.getItem(userKey)||'null')}catch{return null}},
    setSession(payload){if(payload?.accessToken)sessionStorage.setItem(sessionKey,payload.accessToken);if(payload?.user)sessionStorage.setItem(userKey,JSON.stringify(payload.user));return payload?.user||null},
    clearSession(){sessionStorage.removeItem(sessionKey);sessionStorage.removeItem(userKey)},
    async request(path,{method='GET',body,headers={},retry=true}={}){
      const auth=this.token();
      const response=await fetch(`/api${path}`,{method,credentials:'include',headers:{...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...(auth?{Authorization:`Bearer ${auth}`}:{}) ,...headers},body:body===undefined?undefined:(body instanceof FormData?body:JSON.stringify(body))});
      let payload={};try{payload=await response.json()}catch{}
      if(response.status===401&&retry&&path!=='/auth/refresh'){
        const refresh=await fetch('/api/auth/refresh',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'}});let refreshed={};try{refreshed=await refresh.json()}catch{}
        if(refresh.ok&&refreshed.accessToken){this.setSession(refreshed);return this.request(path,{method,body,headers,retry:false})}
        this.clearSession();window.dispatchEvent(new CustomEvent('fixindo:session-ended'));
      }
      if(!response.ok)throw new Error(payload.error||'Unable to complete that request.');
      return payload;
    },
    auth:{
      register(payload){return api.request('/auth/register',{method:'POST',body:payload})},
      login(payload){return api.request('/auth/login',{method:'POST',body:payload})},
      logout(){return api.request('/auth/logout',{method:'POST'})},
      session(){return api.request('/auth/session')},
      forgotPassword(payload){return api.request('/auth/forgot-password',{method:'POST',body:payload})},
      resetPassword(payload){return api.request('/auth/reset-password',{method:'POST',body:payload})}
    },
    categories(){return api.request('/categories')},
    providers(params={}){const query=new URLSearchParams(Object.entries(params).filter(([,value])=>value!==undefined&&value!==null&&value!=='')).toString();return api.request(`/providers${query?`?${query}`:''}`)},
    provider(id){return api.request(`/providers/${id}`)},
    me(){return api.request('/me')},
    updateProfile(payload){return api.request('/me/profile',{method:'PUT',body:payload})},
    saveLocation(payload){return api.request('/me/location',{method:'PUT',body:payload})},
    preferences(payload){return api.request('/me/preferences',{method:'PUT',body:payload})},
    bookings(scope){return api.request(`/bookings${scope?`?scope=${scope}`:''}`)},
    createBooking(payload){return api.request('/bookings',{method:'POST',body:payload})},
    bookingStatus(id,payload){return api.request(`/bookings/${id}/status`,{method:'PATCH',body:payload})},
    timeline(id){return api.request(`/bookings/${id}/timeline`)},
    notifications(){return api.request('/notifications')},
    readNotification(id){return api.request(`/notifications/${id}/read`,{method:'POST'})},
    messages(id){return api.request(`/messages/${id}`)},
    sendMessage(id,body){return api.request(`/messages/${id}`,{method:'POST',body:{body}})},
    contact(payload){return api.request('/contact',{method:'POST',body:payload})},
    providerProfile(){return api.request('/providers/me/profile')},
    saveProviderProfile(payload){return api.request('/providers/me/profile',{method:'PUT',body:payload})},
    providerServices(){return api.request('/providers/me/services')},
    saveProviderServices(services){return api.request('/providers/me/services',{method:'PUT',body:{services}})},
    providerDashboard(){return api.request('/providers/me/dashboard')},
    availability(availability){return api.request('/providers/me/availability',{method:'PATCH',body:{available:availability}})},
    upload(kind,file){const uploadKind=kind.replace(/^provider-/,'');const form=new FormData();form.append(uploadKind==='avatar'?'image':'images',file);return api.request(uploadKind==='avatar'?'/uploads/avatar':`/uploads/provider/${uploadKind}`,{method:'POST',body:form})}
  };
  function setButtonLoading(button,loading,label){if(!button)return;button.disabled=loading;if(loading){button.dataset.originalLabel=button.innerHTML;button.textContent=label||'Please wait…'}else if(button.dataset.originalLabel){button.innerHTML=button.dataset.originalLabel;delete button.dataset.originalLabel}}
  window.Fixindo={data,qs,qsa,escapeHtml,toast,money,today,api,setButtonLoading};
})();
