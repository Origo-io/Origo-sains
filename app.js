const $=s=>document.querySelector(s);
let lang=localStorage.lang||'id',theme=localStorage.theme||'light',entered=false,page=0,held=null,q=.8;
const T=k=>I18N[lang][k]||k,vib=n=>navigator.vibrate&&navigator.vibrate(n),UP=new THREE.Vector3(0,1,0);
// ---------- Scene ----------
const cv=$('#c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:false}),S=new THREE.Scene(),C=new THREE.PerspectiveCamera(70,1,.05,30),rc=new THREE.Raycaster();
C.rotation.order='YXZ';C.position.set(0,1.6,1.5);S.add(C);
S.add(new THREE.HemisphereLight(0xffffff,0x8899aa,1));
const dl=new THREE.DirectionalLight(0xffffff,.35);dl.position.set(2,5,3);S.add(dl);
const pl=new THREE.PointLight(0xfff4e0,.6,12);pl.position.set(0,3.4,-1.5);S.add(pl);
function resize(){R.setSize(innerWidth*q,innerHeight*q,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
// tekstur dari canvas (tanpa file gambar)
function tex(w,h,fn,rep){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}return t}
const tFloor=tex(128,128,(g,w,h)=>{for(let i=0;i<4;i++){g.fillStyle=(i%3)?'#e6eff1':'#fff';g.fillRect((i%2)*64,(i>>1)*64,64,64)}g.strokeStyle='#b4c6cc';g.lineWidth=3;g.strokeRect(0,0,64,64);g.strokeRect(64,0,64,64);g.strokeRect(0,64,64,64);g.strokeRect(64,64,64,64)},[5,5]),
tWall=tex(128,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#dbe7ea';g.fillRect(0,0,3,h);g.fillRect(0,h-3,w,3)},[5,2]),
tSky=tex(256,128,(g,w,h)=>{const r=g.createLinearGradient(0,0,0,h);r.addColorStop(0,'#7fdcec');r.addColorStop(1,'#fff');g.fillStyle=r;g.fillRect(0,0,w,h);g.strokeStyle='#fff';g.lineWidth=8;g.strokeRect(0,0,w,h);g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke()}),
tSign=tex(512,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#00bcd4';g.fillRect(0,0,w,12);g.fillStyle='#ff9800';g.fillRect(0,h-12,w,12);g.font='bold 62px sans-serif';g.textAlign='center';g.fillStyle='#00bcd4';g.fillText('ORIGO',150,84);g.fillStyle='#4caf50';g.fillText('SAINS',362,84)}),
shT=tex(64,64,g=>{const r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(0,0,0,.42)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64)});
const themed=[],roots=[],slots=[],doors=[],vs=[],items=[];
function box(w,h,d,col,x,y,z,th,map){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:col,map:map||null}));m.position.set(x,y,z);S.add(m);if(th)themed.push([m,th[0],th[1]]);return m}
function plane(w,h,map,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}));m.position.set(x,y,z);S.add(m)}
function shadow(w,d,x,y,z){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({map:shT,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.raycast=()=>{};return m}
// ruangan
box(10,.1,10,0xffffff,0,-.05,0,[0xffffff,0x4b5b6e],tFloor);
[[10,4,.1,0,2,-5],[10,4,.1,0,2,5],[.1,4,10,-5,2,0],[.1,4,10,5,2,0]].forEach(a=>box(a[0],a[1],a[2],0xffffff,a[3],a[4],a[5],[0xffffff,0x6b7d92],tWall));
box(10,.1,10,0xffffff,0,4.05,0,[0xffffff,0x3a4658]);
[[-2.5,-2],[2.5,-2],[-2.5,2],[2.5,2]].forEach(a=>{const l=new THREE.Mesh(new THREE.BoxGeometry(1.6,.04,.5),new THREE.MeshBasicMaterial({color:0xfffdf2}));l.position.set(a[0],3.98,a[1]);S.add(l)});
box(10,.12,.12,0x00bcd4,0,1.2,-4.93);box(10,.12,.12,0x00bcd4,0,1.2,4.93);
plane(3.2,1.4,tSky,-1.6,2.5,-4.93);plane(2.6,.65,tSign,2.6,2.5,-4.93);
S.add(shadow(5.8,1.9,0,.01,-3));
// meja kerja + rak tabung
box(5,.9,1,0x00bcd4,0,.45,-3);box(5.1,.05,1.1,0xffffff,0,.925,-3);box(5,.04,.02,0xff9800,0,.88,-2.49);
box(1.4,.06,.3,0xff9800,1.6,.98,-3);
function slot(x,y){const m=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.01,14),new THREE.MeshLambertMaterial({color:0x00bcd4}));
 m.position.set(x,y,-3);m.userData={kind:'slot',occ:null};S.add(m);roots.push(m);slots.push(m)}
[-2,-1.2,-.4].forEach(x=>slot(x,.955));[1.1,1.6,2.1].forEach(x=>slot(x,1.015));
// ---------- Wadah ----------
const VT={tube:{r:.025,h:.16,cap:15},beaker:{r:.06,h:.1,cap:250},erlen:{r:.06,rt:.02,h:.14,cap:250},petri:{r:.07,h:.02,cap:20},pipette:{r:.008,h:.2,cap:3}};
function vessel(t){const v=VT[t],g=new THREE.Group(),gm=new THREE.CylinderGeometry(v.rt??v.r,v.r,v.h,14,1,true);gm.translate(0,v.h/2,0);
 g.add(new THREE.Mesh(gm,new THREE.MeshPhongMaterial({color:0x9ff0f8,transparent:true,opacity:.38,side:2,specular:0xffffff,shininess:110,depthWrite:false})));
 const lg=new THREE.CylinderGeometry(1,1,1,12);lg.translate(0,.5,0);const lm=new THREE.Mesh(lg,new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.88}));lm.visible=false;g.add(lm);
 const w=Math.max(v.r*2,.07),hp=new THREE.Mesh(new THREE.BoxGeometry(w,v.h,w),new THREE.MeshBasicMaterial());hp.geometry.translate(0,v.h/2,0);hp.visible=false;g.add(hp);
 const sh=shadow(.2,.2,0,.003,0);g.add(sh);
 g.userData={kind:'vessel',type:t,cap:v.cap,items:[],temp:25,lm,v,fizz:0,col:null,sh};roots.push(g);vs.push(g);items.push(g);S.add(g);return g}
const lbl={};function label(m){return lbl[m.code]||(lbl[m.code]=tex(128,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle=m.hz>=3?'#ff9800':m.hz==2?'#00bcd4':'#4caf50';g.fillRect(0,0,w,16);g.fillStyle='#12202b';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText(m.f.slice(0,7),w/2,50)}))}
function bottle(code){const m=M[code],g=new THREE.Group(),b=new THREE.CylinderGeometry(.04,.04,.16,12),c=new THREE.CylinderGeometry(.022,.022,.04,8),
 lb=new THREE.CylinderGeometry(.0415,.0415,.085,12,1,true,-.95,1.9);b.translate(0,.08,0);c.translate(0,.18,0);lb.translate(0,.075,0);
 g.add(new THREE.Mesh(b,new THREE.MeshLambertMaterial({color:new THREE.Color(m.col).multiplyScalar(.92)})));
 g.add(new THREE.Mesh(c,new THREE.MeshLambertMaterial({color:m.hz>=3?0xff9800:0x4caf50})));
 g.add(new THREE.Mesh(lb,new THREE.MeshBasicMaterial({map:label(m)})));
 const sh=shadow(.16,.16,0,.003,0);g.add(sh);
 g.userData={kind:'bottle',code,sh};roots.push(g);items.push(g);S.add(g);return g}
// ---------- Lemari (berongga, pintu kaca) ----------
function cabinet(x,f,col,hcol,fill){
 box(.04,2.2,2,col,x-f*.38,1.1,-1);box(.8,.04,2,col,x,2.2,-1);box(.8,.1,2,col,x,.05,-1);
 box(.8,2.2,.04,col,x,1.1,-2);box(.8,2.2,.04,col,x,1.1,0);
 [.8,1.4].forEach(y=>box(.72,.03,1.92,0xffffff,x+f*.02,y,-1));
 S.add(shadow(1.5,2.8,x,.01,-1));
 const g=new THREE.Group();g.position.set(x+f*.42,1.1,-2);
 const d=new THREE.Mesh(new THREE.BoxGeometry(.03,2.1,1.95),new THREE.MeshPhongMaterial({color:0x9ff0f8,transparent:true,opacity:.28,specular:0xffffff,shininess:90,depthWrite:false}));d.position.z=.98;g.add(d);
 const h=new THREE.Mesh(new THREE.BoxGeometry(.05,.3,.035),new THREE.MeshLambertMaterial({color:hcol}));h.position.set(f*.04,0,1.85);g.add(h);
 g.userData={kind:'door',open:false,t:0,f};S.add(g);roots.push(g);doors.push(g);
 [.815,1.415].forEach((y,r)=>[-1.7,-1.35,-1,-.65,-.3].forEach((z,i)=>{const o=fill(r,i);o.position.set(x+f*.05,y,z);o.rotation.y=f*Math.PI/2}))}
const GL=[['tube','beaker','erlen','petri','pipette'],['beaker','erlen','tube','tube','petri']],CH=[['hcl','naoh','nahco3','h2o','phenol'],['cuso4','agno3','nacl','ethanol','zn']];
cabinet(-4.6,1,0x00bcd4,0xff9800,(r,i)=>vessel(GL[r][i]));
cabinet(4.6,-1,0xff9800,0x00bcd4,(r,i)=>bottle(CH[r][i]));
// efek: aliran tuang + gelembung
const stream=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,6).translate(0,.5,0),new THREE.MeshBasicMaterial({color:0x7fe9f5,transparent:true,opacity:.85}));stream.visible=false;S.add(stream);
const bubs=[];for(let i=0;i<24;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.007,5,4),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85}));m.visible=false;S.add(m);bubs.push({m,l:0})}
// ---------- Logika wadah ----------
const tot=d=>d.items.reduce((a,i)=>a+i.ml,0);
function mix(d){const t=tot(d),c=new THREE.Color(0,0,0);d.items.forEach(i=>c.add(new THREE.Color(M[i.code].col).multiplyScalar(i.ml/t)));return c}
function upd(g){const d=g.userData,t=tot(d);d.lm.visible=t>0;if(!t)return;const r=((d.v.rt??d.v.r)+d.v.r)/2*.85;
 d.lm.scale.set(r,Math.max(.002,d.v.h*.9*Math.min(1,t/d.cap)),r);d.lm.material.color.set(d.col||mix(d))}
function add(g,code,ml){const d=g.userData;ml=Math.min(ml,d.cap-tot(d));if(ml<=0){say(T('full'));return false}
 const it=d.items.find(i=>i.code==code);it?it.ml+=ml:d.items.push({code,ml});const a=M[code];
 d.items.forEach(i=>{if(i.code==code)return;const b=M[i.code],r=RULES.find(r=>(r[0]==a.cls&&r[1]==b.cls)||(r[0]==b.cls&&r[1]==a.cls));
  if(r){d.temp+=r[2];if(r[3])d.col=r[3];if(r[4])d.fizz=2.5;say(T(r[5]));vib([20,30,20])}});upd(g);return true}
function take(g,ml){const d=g.userData,t=tot(d);ml=Math.min(ml,t);const out=d.items.map(i=>({code:i.code,ml:ml*i.ml/t}));
 d.items.forEach(i=>i.ml-=ml*i.ml/t);d.items=d.items.filter(i=>i.ml>.01);if(!d.items.length)d.col=null;upd(g);return out}
// ---------- Interaksi ----------
let tw=[],pt=0,ptgt=null,hl=null;const pcol=new THREE.Color();
function look(p){rc.setFromCamera(p||{x:0,y:0},C);for(const h of rc.intersectObjects(roots,true)){if(h.distance>3)break;let o=h.object;while(o&&!o.userData.kind)o=o.parent;if(o&&o!==held)return o}return null}
function glow(o,on){o&&o.traverse(m=>{if(m.material&&m.material.emissive)m.material.emissive.setHex(on?0x0b6a78:0)})}
function pick(o){tw=tw.filter(a=>a.o!==o);if(o.userData.slot){o.userData.slot.userData.occ=null;o.userData.slot=null}held=o;C.attach(o);vib(12)}
function place(s){S.attach(held);tw.push({o:held,p:s.position.clone()});s.userData.occ=held;held.userData.slot=s;held=null;vib(12)}
function act(o){o=o||look();const k=o&&o.userData.kind;
 if(k=='door'){o.userData.open=!o.userData.open;vib(15)}
 else if(k=='slot'){if(held&&!o.userData.occ)place(o)}
 else if(!held&&(k=='vessel'||k=='bottle'))pick(o);
 else if(held&&!o){const s=slots.find(s=>!s.userData.occ);s?place(s):say(T('no_slot'))}}
function pour(o){if(!playing())return;if(!held)return say(T('hand_empty'));o=o||look();
 if(!o||o.userData.kind!='vessel')return say(T('aim'));const u=held.userData;let ok=false;
 if(u.kind=='bottle'){ok=add(o,u.code,25);pcol.set(M[u.code].col).lerp(new THREE.Color(0x7fe9f5),.45)}
 else if(o!==held){if(!tot(u))return say(T('empty'));pcol.copy(u.lm.material.color);take(held,25).forEach(x=>add(o,x.code,x.ml));ok=true}
 if(ok){pt=.8;ptgt=o;vib(10)}}
const nm=o=>o.userData.kind=='bottle'?M[o.userData.code][lang]:T(o.userData.type);
const desc=o=>{const d=o.userData,t=tot(d);return `<b>${nm(o)}</b> · ${Math.round(d.temp)}°C<div class="bar"><u style="width:${Math.min(100,t/d.cap*100)}%"></u></div>`+(d.items.map(i=>`<div><s style="background:${M[i.code].col}"></s>${M[i.code][lang]} ${Math.round(i.ml)}ml</div>`).join('')||'<div>—</div>')};
function hud(){const o=look(),k=o&&o.userData.kind;if(o!==hl){glow(hl,false);glow(o,true);hl=o}
 let p='';if(k=='door')p=T(o.userData.open?'close':'open');else if(k=='slot')p=held?T('place'):'';else if(o)p=(held?'':T('pick')+' ')+nm(o);
 $('#pr').textContent=p;const v=k=='vessel'?o:held&&held.userData.kind=='vessel'?held:null;$('#inf').hidden=!v;if(v)$('#inf').innerHTML=desc(v)}
let lt=0;function say(m){$('#log').textContent=m;clearTimeout(lt);lt=setTimeout(()=>$('#log').textContent='',3500)}
// ---------- Kontrol (halus + ketuk objek) ----------
let yaw=0,pitch=0,ty=0,tp=0,vx=0,vz=0,bob=0,mv={x:0,z:0},keys={},lp=null,tap=null,fr=0,last=0,fa=0,fc=0;
const playing=()=>entered&&$('#book').hidden&&$('#menu').hidden;
cv.addEventListener('pointerdown',e=>{lp=[e.clientX,e.clientY];tap={t:performance.now(),m:0}});
cv.addEventListener('pointermove',e=>{if(!lp||!playing())return;const dx=e.clientX-lp[0],dy=e.clientY-lp[1];if(tap)tap.m+=Math.abs(dx)+Math.abs(dy);
 ty-=dx*.006;tp=Math.max(-1.2,Math.min(1.2,tp-dy*.006));lp=[e.clientX,e.clientY]});
cv.addEventListener('pointerup',e=>{if(tap&&tap.m<12&&performance.now()-tap.t<350&&playing()){
 const o=look({x:e.clientX/innerWidth*2-1,y:-e.clientY/innerHeight*2+1});if(o){held&&o.userData.kind=='vessel'?pour(o):act(o)}}tap=null});
cv.addEventListener('pointercancel',()=>{tap=null;lp=null});addEventListener('pointerup',()=>lp=null);
const js=$('#js'),kn=$('#kn');
function jm(e){const r=js.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const l=Math.hypot(dx,dy),m=46;if(l>m){dx*=m/l;dy*=m/l}mv={x:dx/m,z:dy/m};kn.style.transform=`translate(${dx}px,${dy}px)`}
const je=()=>{js.dataset.a='';mv={x:0,z:0};kn.style.transform=''};
js.addEventListener('pointerdown',e=>{js.setPointerCapture(e.pointerId);js.dataset.a=1;jm(e)});js.addEventListener('pointermove',e=>js.dataset.a&&jm(e));js.addEventListener('pointerup',je);js.addEventListener('pointercancel',je);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(k=='e'&&playing())act();if(k=='f')pour()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
$('#act').onclick=()=>playing()&&act();$('#pour').onclick=()=>pour();
const v3a=new THREE.Vector3(),v3b=new THREE.Vector3();
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000||.016);last=t;const k=Math.min(1,dt*12);
 fa+=dt;fc++;if(fa>2){const f=fc/fa;if(f<28&&q>.5){q-=.1;resize()}else if(f>55&&q<1){q+=.05;resize()}fa=fc=0}
 if(playing()){
  let x=mv.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),z=mv.z+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);const l=Math.hypot(x,z);if(l>1){x/=l;z/=l}
  const a=Math.min(1,dt*9);vx+=(x*2.4-vx)*a;vz+=(z*2.4-vz)*a;const p=C.position;
  p.x+=(Math.cos(yaw)*vx+Math.sin(yaw)*vz)*dt;p.z+=(-Math.sin(yaw)*vx+Math.cos(yaw)*vz)*dt;
  p.x=Math.max(-3.7,Math.min(3.7,p.x));p.z=Math.max(-4.5,Math.min(4.5,p.z));if(Math.abs(p.x)<2.8&&p.z<-2.2)p.z=-2.2;
  const sp=Math.hypot(vx,vz);bob+=sp*dt*4.2;p.y=1.6+Math.sin(bob)*.022*Math.min(1,sp/2);
  const b=Math.min(1,dt*18);yaw+=(ty-yaw)*b;pitch+=(tp-pitch)*b;C.rotation.set(pitch,yaw,0);if(++fr%5==0)hud()}
 // tangan: melayang halus, bergoyang, miring saat menuang
 if(held){const h=held.position,r=held.rotation,pr=pt>0;h.x+=(.28-(ty-yaw)*.4-vx*.01-h.x)*k;h.y+=(-.28+(pr?.06:0)-Math.abs(Math.sin(bob))*.008-h.y)*k;h.z+=(-.6-h.z)*k;
  r.x+=(0-r.x)*k;r.y+=(0-r.y)*k;r.z+=((pr?-1.05:0)-r.z)*k}else pt=0;
 for(let i=tw.length-1;i>=0;i--){const a=tw[i],o=a.o,kk=Math.min(1,dt*14);o.position.lerp(a.p,kk);o.rotation.x*=1-kk;o.rotation.y*=1-kk;o.rotation.z*=1-kk;
  if(o.position.distanceTo(a.p)<.004){o.position.copy(a.p);o.rotation.set(0,0,0);tw.splice(i,1)}}
 if(pt>0&&held&&ptgt){pt-=dt;held.getWorldPosition(v3a);v3a.y+=.06;ptgt.getWorldPosition(v3b);v3b.y+=ptgt.userData.v.h*.8;v3b.sub(v3a);const L=v3b.length();
  stream.visible=true;stream.position.copy(v3a);stream.quaternion.setFromUnitVectors(UP,v3b.normalize());stream.scale.set(1,L,1);stream.material.color.copy(pcol)}else stream.visible=false;
 vs.forEach(g=>{const u=g.userData;u.lm.position.y=u.fizz>0?Math.random()*.004:0;
  if(u.fizz>0){u.fizz-=dt;if(Math.random()<.5){const b=bubs.find(b=>b.l<=0);if(b){g.getWorldPosition(b.m.position);b.m.position.x+=(Math.random()-.5)*u.v.r;b.m.position.z+=(Math.random()-.5)*u.v.r;b.m.position.y+=u.v.h*.3;b.l=1;b.m.visible=true}}}
  u.temp+=(25-u.temp)*dt*.05});
 bubs.forEach(b=>{if(b.l>0){b.l-=dt;b.m.position.y+=dt*.12;if(b.l<=0)b.m.visible=false}});
 items.forEach(g=>g.userData.sh.visible=g.parent!==C);
 doors.forEach(d=>{const u=d.userData;u.t+=((u.open?1:0)-u.t)*Math.min(1,dt*7);d.rotation.y=u.f*1.75*(u.t*u.t*(3-2*u.t))});
 R.render(S,C)}
requestAnimationFrame(loop);
// ---------- Buku Indeks ----------
function opts(sel,arr){sel.innerHTML=arr.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}
function buildFilters(){const l=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 opts($('#fl'),[['',T('letter')+' ▾'],...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(x=>[x,x])]);
 opts($('#fc'),[['',T('cat')+' ▾'],['chem',T('c_chem')],['chem/acid','– '+T('c_acid')],['chem/base','– '+T('c_base')],['chem/salt','– '+T('c_salt')],['chem/solvent','– '+T('c_solvent')],['chem/indicator','– '+T('c_ind')],['bio',T('c_bio')],['phys',T('c_phys')]]);
 opts($('#fh'),[['',T('hz')+' ▾'],...[0,1,2,3,4].map(x=>[x,'H'+x])]);$('#fl').value=l;$('#fc').value=c;$('#fh').value=h}
function renderBook(){const qq=$('#q').value.toLowerCase(),L=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 const r=MATS.filter(m=>{const n=m[lang];return(!qq||n.toLowerCase().includes(qq)||m.f.toLowerCase().includes(qq))&&(!L||n[0].toUpperCase()==L)&&(!c||m.cat.startsWith(c))&&(h===''||m.hz==h)}).sort((a,b)=>a[lang].localeCompare(b[lang])),
 N=20,pages=Math.max(1,Math.ceil(r.length/N));page=Math.min(page,pages-1);
 $('#ls').innerHTML=r.slice(page*N,page*N+N).map(m=>`<div class="r"><b>${m[lang]}</b><span>${m.f}</span><i class="h${m.hz}">H${m.hz}</i>${entered?`<button data-c="${m.code}">${T('fetch')}</button>`:''}</div>`).join('');
 $('#pn').textContent=(page+1)+' / '+pages}
['#q','#fl','#fc','#fh'].forEach(s=>$(s).addEventListener('input',()=>{page=0;renderBook()}));
$('#pp').onclick=()=>{if(page>0){page--;renderBook()}};$('#pnx').onclick=()=>{page++;renderBook()};
$('#ls').onclick=e=>{const c=e.target.dataset.c;if(!c)return;if(held)return say(T('hand_empty')+'?');const b=bottle(c);b.position.copy(C.position).add(new THREE.Vector3(0,-.3,-.5));pick(b);$('#book').hidden=true;say(T('fetched')+M[c][lang])};
// ---------- Menu / tema / bahasa ----------
function applyI18n(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(e=>e.textContent=T(e.dataset.i));$('#q').placeholder=T('search');$('#bl').textContent=lang.toUpperCase();buildFilters();renderBook()}
function applyTheme(){const d=theme=='dark';document.body.dataset.t=theme;S.background=new THREE.Color(d?0x121821:0xffffff);themed.forEach(a=>a[0].material.color.set(d?a[2]:a[1]));pl.intensity=d?.9:.6}
$('#bl').onclick=()=>{lang=lang=='id'?'en':'id';localStorage.lang=lang;applyI18n()};
$('#bt').onclick=()=>{theme=theme=='dark'?'light':'dark';localStorage.theme=theme;applyTheme()};
$('#bm').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#book').hidden=true};
$('#bb').onclick=()=>{$('#book').hidden=!$('#book').hidden;$('#menu').hidden=true;renderBook()};
$('#mb').onclick=()=>{$('#menu').hidden=true;$('#book').hidden=false;renderBook()};
$('#go').onclick=()=>{entered=true;$('#menu').hidden=true;renderBook()};
applyTheme();applyI18n();
