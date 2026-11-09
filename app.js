const $=s=>document.querySelector(s);
let lang=localStorage.lang||'id',theme=localStorage.theme||'light',entered=false,page=0,held=null;
const T=k=>I18N[lang][k]||k;
// ---------- 3D ----------
const cv=$('#c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:false}),S=new THREE.Scene(),
C=new THREE.PerspectiveCamera(70,1,.05,30),rc=new THREE.Raycaster();
C.rotation.order='YXZ';C.position.set(0,1.6,1.5);S.add(C);
S.add(new THREE.HemisphereLight(0xffffff,0x8899aa,1.15));const dl=new THREE.DirectionalLight(0xffffff,.5);dl.position.set(2,5,3);S.add(dl);
function resize(){R.setSize(innerWidth*.7,innerHeight*.7,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const themed=[],roots=[],slots=[],doors=[],vs=[];
function box(w,h,d,col,x,y,z,th){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:col}));m.position.set(x,y,z);S.add(m);if(th)themed.push([m,th[0],th[1]]);return m}
// ruangan
box(10,.1,10,0,0,-.05,0,[0xdde9ec,0x1c2531]);
[[10,4,.1,0,2,-5],[10,4,.1,0,2,5],[.1,4,10,-5,2,0],[.1,4,10,5,2,0]].forEach(a=>box(a[0],a[1],a[2],0,a[3],a[4],a[5],[0xf3f8fa,0x2a3544]));
box(10,.1,.12,0x00bcd4,0,1.2,-4.93);box(10,.1,.12,0x00bcd4,0,1.2,4.93);
// meja kerja + rak tabung
box(5,.9,1,0x00bcd4,0,.45,-3);box(5.1,.05,1.1,0xffffff,0,.925,-3);box(1.4,.06,.3,0xff9800,1.6,.98,-3);
function slot(x,y){const m=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.01,12),new THREE.MeshLambertMaterial({color:0x00bcd4}));
m.position.set(x,y,-3);m.userData={kind:'slot',occ:null};S.add(m);roots.push(m);slots.push(m)}
[-2,-1.2,-.4].forEach(x=>slot(x,.955));[1.1,1.6,2.1].forEach(x=>slot(x,1.015));
// wadah gelas
const VT={tube:{r:.025,h:.16,cap:15},beaker:{r:.06,h:.1,cap:250},erlen:{r:.06,rt:.02,h:.14,cap:250},petri:{r:.07,h:.02,cap:20},pipette:{r:.008,h:.2,cap:3}};
function vessel(t){const v=VT[t],g=new THREE.Group(),gm=new THREE.CylinderGeometry(v.rt??v.r,v.r,v.h,12,1,true);gm.translate(0,v.h/2,0);
g.add(new THREE.Mesh(gm,new THREE.MeshLambertMaterial({color:0x7fe9f5,transparent:true,opacity:.4,side:2})));
const lg=new THREE.CylinderGeometry(1,1,1,12);lg.translate(0,.5,0);const lm=new THREE.Mesh(lg,new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.85}));lm.visible=false;g.add(lm);
const w=Math.max(v.r*2,.07),hp=new THREE.Mesh(new THREE.BoxGeometry(w,v.h,w),new THREE.MeshBasicMaterial());hp.geometry.translate(0,v.h/2,0);hp.visible=false;g.add(hp);
g.userData={kind:'vessel',type:t,cap:v.cap,items:[],temp:25,lm,v,fizz:0,col:null};roots.push(g);vs.push(g);S.add(g);return g}
function bottle(code){const m=M[code],g=new THREE.Group(),b=new THREE.CylinderGeometry(.04,.04,.16,10),c=new THREE.CylinderGeometry(.022,.022,.04,8);
b.translate(0,.08,0);c.translate(0,.18,0);
g.add(new THREE.Mesh(b,new THREE.MeshLambertMaterial({color:new THREE.Color(m.col).multiplyScalar(.9)})));
g.add(new THREE.Mesh(c,new THREE.MeshLambertMaterial({color:m.hz>=3?0xff9800:0x4caf50})));
g.userData={kind:'bottle',code};roots.push(g);S.add(g);return g}
// lemari
function cabinet(x,f,col,fill){
 box(.8,2.2,2,col,x,1.1,-1);[.8,1.4].forEach(y=>box(.7,.04,1.9,0xffffff,x+f*.05,y,-1));
 const g=new THREE.Group();g.position.set(x+f*.42,1.1,-2);
 const d=new THREE.Mesh(new THREE.BoxGeometry(.04,2.1,1.95),new THREE.MeshLambertMaterial({color:col}));d.position.z=.98;g.add(d);
 g.userData={kind:'door',open:false,t:0,f};S.add(g);roots.push(g);doors.push(g);
 [.82,1.42].forEach((y,r)=>[-1.7,-1.35,-1,-.65,-.3].forEach((z,i)=>{const o=fill(r,i);o.position.set(x+f*.05,y,z)}))}
const GL=[['tube','beaker','erlen','petri','pipette'],['beaker','erlen','tube','tube','petri']],
CH=[['hcl','naoh','nahco3','h2o','phenol'],['cuso4','agno3','nacl','ethanol','zn']];
cabinet(-4.6,1,0x00bcd4,(r,i)=>vessel(GL[r][i]));
cabinet(4.6,-1,0xff9800,(r,i)=>bottle(CH[r][i]));
// logika wadah
const tot=d=>d.items.reduce((a,i)=>a+i.ml,0);
function mix(d){const t=tot(d),c=new THREE.Color(0,0,0);d.items.forEach(i=>c.add(new THREE.Color(M[i.code].col).multiplyScalar(i.ml/t)));return c}
function upd(g){const d=g.userData,t=tot(d);d.lm.visible=t>0;if(!t)return;const r=((d.v.rt??d.v.r)+d.v.r)/2*.85;
 d.lm.scale.set(r,Math.max(.002,d.v.h*.9*Math.min(1,t/d.cap)),r);d.lm.material.color.set(d.col||mix(d))}
function add(g,code,ml){const d=g.userData;ml=Math.min(ml,d.cap-tot(d));if(ml<=0){say(T('full'));return}
 const it=d.items.find(i=>i.code==code);it?it.ml+=ml:d.items.push({code,ml});const a=M[code];
 d.items.forEach(i=>{if(i.code==code)return;const b=M[i.code],r=RULES.find(r=>(r[0]==a.cls&&r[1]==b.cls)||(r[0]==b.cls&&r[1]==a.cls));
  if(r){d.temp+=r[2];if(r[3])d.col=r[3];if(r[4])d.fizz=2.5;say(T(r[5]))}});upd(g)}
function take(g,ml){const d=g.userData,t=tot(d);ml=Math.min(ml,t);const out=d.items.map(i=>({code:i.code,ml:ml*i.ml/t}));
 d.items.forEach(i=>i.ml-=ml*i.ml/t);d.items=d.items.filter(i=>i.ml>.01);if(!d.items.length)d.col=null;upd(g);return out}
// interaksi
function look(){rc.setFromCamera({x:0,y:0},C);for(const h of rc.intersectObjects(roots,true)){if(h.distance>3)break;let o=h.object;while(o&&!o.userData.kind)o=o.parent;if(o&&o!==held)return o}return null}
function pick(o){if(o.userData.slot){o.userData.slot.userData.occ=null;o.userData.slot=null}held=o;C.attach(o);o.position.set(.28,-.28,-.6);o.rotation.set(0,0,0)}
function place(s){S.attach(held);held.position.copy(s.position);held.rotation.set(0,0,0);s.userData.occ=held;held.userData.slot=s;held=null}
function act(){if(!playing())return;const o=look(),k=o&&o.userData.kind;
 if(k=='door')o.userData.open=!o.userData.open;
 else if(k=='slot'){if(held&&!o.userData.occ)place(o)}
 else if(!held&&o)pick(o);
 else if(held&&!o){const s=slots.find(s=>!s.userData.occ);s?place(s):say(T('no_slot'))}}
function pour(){if(!playing())return;if(!held)return say(T('hand_empty'));const o=look();
 if(!o||o.userData.kind!='vessel')return say(T('aim'));const u=held.userData;
 if(u.kind=='bottle')add(o,u.code,25);else if(o!==held){if(!tot(u))return say(T('empty'));take(held,25).forEach(x=>add(o,x.code,x.ml))}}
const nm=o=>o.userData.kind=='bottle'?M[o.userData.code][lang]:T(o.userData.type);
const desc=o=>{const d=o.userData;return nm(o)+': '+(d.items.map(i=>M[i.code][lang]+' '+Math.round(i.ml)+'ml').join(', ')||'—')+' · '+Math.round(d.temp)+'°C'};
function hud(){const o=look(),k=o&&o.userData.kind;let p='';
 if(k=='door')p=T(o.userData.open?'close':'open');else if(k=='slot')p=held?T('place'):'';
 else if(o)p=(held?'':T('pick')+' ')+nm(o);$('#pr').textContent=p;
 const v=k=='vessel'?o:held&&held.userData.kind=='vessel'?held:null;$('#inf').hidden=!v;if(v)$('#inf').textContent=desc(v)}
let lt=0;function say(m){$('#log').textContent=m;clearTimeout(lt);lt=setTimeout(()=>$('#log').textContent='',4000)}
// kontrol
let yaw=0,pitch=0,mv={x:0,z:0},keys={},lp=null,fr=0,last=0;
const playing=()=>entered&&$('#book').hidden&&$('#menu').hidden;
cv.addEventListener('pointerdown',e=>lp=[e.clientX,e.clientY]);addEventListener('pointerup',()=>lp=null);
cv.addEventListener('pointermove',e=>{if(!lp||!playing())return;yaw-=(e.clientX-lp[0])*.006;pitch=Math.max(-1.2,Math.min(1.2,pitch-(e.clientY-lp[1])*.006));lp=[e.clientX,e.clientY]});
const js=$('#js'),kn=$('#kn');
function jm(e){const r=js.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const l=Math.hypot(dx,dy),m=45;if(l>m){dx*=m/l;dy*=m/l}mv={x:dx/m,z:dy/m};kn.style.transform=`translate(${dx}px,${dy}px)`}
const je=()=>{js.dataset.a='';mv={x:0,z:0};kn.style.transform=''};
js.addEventListener('pointerdown',e=>{js.setPointerCapture(e.pointerId);js.dataset.a=1;jm(e)});
js.addEventListener('pointermove',e=>js.dataset.a&&jm(e));js.addEventListener('pointerup',je);js.addEventListener('pointercancel',je);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k=='e')act();if(k=='f')pour()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
$('#act').onclick=act;$('#pour').onclick=pour;
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;
 if(playing()){const x=mv.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),z=mv.z+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0),sp=2.2*dt,p=C.position;
  p.x+=(Math.cos(yaw)*x+Math.sin(yaw)*z)*sp;p.z+=(-Math.sin(yaw)*x+Math.cos(yaw)*z)*sp;
  p.x=Math.max(-3.7,Math.min(3.7,p.x));p.z=Math.max(-4.5,Math.min(4.5,p.z));if(Math.abs(p.x)<2.8&&p.z<-2.2)p.z=-2.2;
  C.rotation.set(pitch,yaw,0);if(++fr%6==0)hud()}
 doors.forEach(d=>{const u=d.userData;u.t+=((u.open?1:0)-u.t)*Math.min(1,dt*8);d.rotation.y=u.f*1.75*u.t});
 vs.forEach(g=>{const u=g.userData;u.lm.position.y=u.fizz>0?Math.random()*.004:0;if(u.fizz>0)u.fizz-=dt;u.temp+=(25-u.temp)*dt*.05});
 R.render(S,C)}
requestAnimationFrame(loop);
// ---------- Buku Indeks ----------
function opts(sel,arr){sel.innerHTML=arr.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}
function buildFilters(){const l=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 opts($('#fl'),[['',T('letter')+' ▾'],...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(x=>[x,x])]);
 opts($('#fc'),[['',T('cat')+' ▾'],['chem',T('c_chem')],['chem/acid','– '+T('c_acid')],['chem/base','– '+T('c_base')],['chem/salt','– '+T('c_salt')],['chem/solvent','– '+T('c_solvent')],['chem/indicator','– '+T('c_ind')],['bio',T('c_bio')],['phys',T('c_phys')]]);
 opts($('#fh'),[['',T('hz')+' ▾'],...[0,1,2,3,4].map(x=>[x,'H'+x])]);$('#fl').value=l;$('#fc').value=c;$('#fh').value=h}
function renderBook(){const q=$('#q').value.toLowerCase(),L=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 const r=MATS.filter(m=>{const n=m[lang];return(!q||n.toLowerCase().includes(q)||m.f.toLowerCase().includes(q))&&(!L||n[0].toUpperCase()==L)&&(!c||m.cat.startsWith(c))&&(h===''||m.hz==h)}).sort((a,b)=>a[lang].localeCompare(b[lang])),
 N=20,pages=Math.max(1,Math.ceil(r.length/N));page=Math.min(page,pages-1);
 $('#ls').innerHTML=r.slice(page*N,page*N+N).map(m=>`<div class="r"><b>${m[lang]}</b><span>${m.f}</span><i class="h${m.hz}">H${m.hz}</i>${entered?`<button data-c="${m.code}">${T('fetch')}</button>`:''}</div>`).join('');
 $('#pn').textContent=(page+1)+' / '+pages}
['#q','#fl','#fc','#fh'].forEach(s=>$(s).addEventListener('input',()=>{page=0;renderBook()}));
$('#pp').onclick=()=>{if(page>0){page--;renderBook()}};$('#pnx').onclick=()=>{page++;renderBook()};
$('#ls').onclick=e=>{const c=e.target.dataset.c;if(!c)return;if(held)return say(T('hand_empty')+'?');pick(bottle(c));$('#book').hidden=true;say(T('fetched')+M[c][lang])};
// ---------- Menu / tema / bahasa ----------
function applyI18n(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(e=>e.textContent=T(e.dataset.i));
 $('#q').placeholder=T('search');$('#bl').textContent=lang.toUpperCase();buildFilters();renderBook()}
function applyTheme(){const d=theme=='dark';document.body.dataset.t=theme;S.background=new THREE.Color(d?0x121821:0xffffff);themed.forEach(a=>a[0].material.color.set(d?a[2]:a[1]))}
$('#bl').onclick=()=>{lang=lang=='id'?'en':'id';localStorage.lang=lang;applyI18n()};
$('#bt').onclick=()=>{theme=theme=='dark'?'light':'dark';localStorage.theme=theme;applyTheme()};
$('#bm').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#book').hidden=true};
$('#bb').onclick=()=>{$('#book').hidden=!$('#book').hidden;$('#menu').hidden=true;renderBook()};
$('#mb').onclick=()=>{$('#menu').hidden=true;$('#book').hidden=false;renderBook()};
$('#go').onclick=()=>{entered=true;$('#menu').hidden=true;renderBook()};
applyTheme();applyI18n();
