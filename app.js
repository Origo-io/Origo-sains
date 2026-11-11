const $=s=>document.querySelector(s),lin=h=>new THREE.Color(h).convertSRGBToLinear(),rnd=Math.random;
let lang=localStorage.lang||'id',theme=localStorage.theme||'light',entered=false,page=0,held=null,q=.9,mode='view',pagerT=0;
const T=k=>I18N[lang][k]||k,vib=n=>navigator.vibrate&&navigator.vibrate(n),UP=new THREE.Vector3(0,1,0);
const ICON={tube:'🧪',beaker:'🥛',erlen:'⚗️',petri:'🧫',pipette:'💉',bottle:'🧴'};
const byF={};MATS.forEach(m=>{if(!byF[m.f])byF[m.f]=m});
const BASIC=['HCl','H2SO4','HNO3','NaOH','KOH','NaHCO3','CaCO3','NaCl','CuSO4','AgNO3','KMnO4','Zn','Mg','Na','Fe','H2O','H2O2','MnO2','C6H12O6','CH3COOH','Na2CO3','NH3','KI','BaCl2','C2H5OH','C12H22O11','C20H14O4','Pb(NO3)2','FeCl3','NaOH'].map(f=>byF[f]&&byF[f].code).filter(Boolean);
let sel=new Set(JSON.parse(localStorage.sel||'null')||BASIC);const saveSel=()=>localStorage.sel=JSON.stringify([...sel]);
// ================= RENDERER & CAHAYA =================
const cv=$('#c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true}),S=new THREE.Scene(),C=new THREE.PerspectiveCamera(70,1,.05,40),rc=new THREE.Raycaster();
R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
C.rotation.order='YXZ';C.position.set(0,1.6,4.2);S.add(C);
const hemi=new THREE.HemisphereLight(0xffffff,0x9fb4bd,.5);S.add(hemi);
const sun=new THREE.DirectionalLight(0xffffff,.75);sun.position.set(4,9,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:1,far:30});sun.shadow.bias=-.0004;S.add(sun);
const pls=[[0,3.6,-3],[0,3.6,2.5]].map(p=>{const l=new THREE.PointLight(0xfff2dc,.5,14);l.position.set(...p);S.add(l);return l});
const fl=new THREE.PointLight(0xffa040,0,5);S.add(fl);
function resize(){R.setSize(innerWidth*q,innerHeight*q,false);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
// lingkungan pantulan (kaca & logam tampak nyata)
{const pm=new THREE.PMREMGenerator(R),es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.BoxGeometry(30,12,30),new THREE.MeshBasicMaterial({color:0xcfe9ef,side:THREE.BackSide})));
 [[-5,5.9,-3],[5,5.9,-3],[0,5.9,4]].forEach(p=>{const l=new THREE.Mesh(new THREE.PlaneGeometry(6,2),new THREE.MeshBasicMaterial({color:new THREE.Color(7,7,7)}));l.position.set(...p);l.rotation.x=Math.PI/2;es.add(l)});
 S.environment=pm.fromScene(es,.04).texture}
// ================= TEKSTUR PROSEDURAL HD =================
function tex(w,h,fn,rep,raw){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1])}t.anisotropy=4;if(!raw)t.encoding=THREE.sRGBEncoding;return t}
const speck=(g,w,h,n,c,s)=>{for(let i=0;i<n;i++){g.fillStyle=c();g.fillRect(rnd()*w,rnd()*h,s,s)}};
const tFloor=tex(512,512,(g,w,h)=>{for(let i=0;i<4;i++){const x=(i%2)*256,y=(i>>1)*256,v=232+rnd()*16|0;g.fillStyle=`rgb(${v-6},${v},${v+3})`;g.fillRect(x,y,256,256);g.strokeStyle='rgba(110,145,155,.2)';g.lineWidth=1.5;
 for(let k=0;k<6;k++){g.beginPath();g.moveTo(x+rnd()*256,y);g.bezierCurveTo(x+rnd()*256,y+80,x+rnd()*256,y+170,x+rnd()*256,y+256);g.stroke()}}
 speck(g,w,h,6000,()=>`rgba(90,120,130,${rnd()*.16})`,2);g.strokeStyle='#9db3ba';g.lineWidth=5;for(let i=0;i<2;i++)for(let j=0;j<2;j++)g.strokeRect(i*256,j*256,256,256)},[7,6]),
tWall=tex(512,512,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);speck(g,w,h,9000,()=>`rgba(120,150,160,${rnd()*.07})`,2);g.fillStyle='rgba(120,160,170,.25)';for(let x=0;x<w;x+=128)g.fillRect(x,0,3,h);g.fillStyle='rgba(0,188,212,.12)';g.fillRect(0,h-70,w,70)},[7,2]),
tGrain=tex(256,256,(g,w,h)=>{g.fillStyle='#f2f2f2';g.fillRect(0,0,w,h);speck(g,w,h,4000,()=>`rgba(0,0,0,${rnd()*.07})`,1.5)},[2,2]),
tBrush=tex(256,256,(g,w,h)=>{g.fillStyle='#ececec';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.fillStyle=`rgba(${rnd()<.5?'255,255,255':'0,0,0'},${rnd()*.08})`;g.fillRect(rnd()*w,rnd()*h,40+rnd()*120,1)}},[2,2]),
tSky=tex(256,128,(g,w,h)=>{const r=g.createLinearGradient(0,0,0,h);r.addColorStop(0,'#6fd3e6');r.addColorStop(1,'#f4feff');g.fillStyle=r;g.fillRect(0,0,w,h);g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<5;i++){g.beginPath();g.ellipse(30+i*50,40+rnd()*40,26,10,0,0,7);g.fill()}g.strokeStyle='#fff';g.lineWidth=8;g.strokeRect(0,0,w,h);g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke()}),
tSign=tex(512,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#00bcd4';g.fillRect(0,0,w,12);g.fillStyle='#ff9800';g.fillRect(0,h-12,w,12);g.font='bold 62px sans-serif';g.textAlign='center';g.fillStyle='#00bcd4';g.fillText('ORIGO',190,86);g.fillStyle='#4caf50';g.fillText('SAINS',386,86);g.font='64px serif';g.fillText('🦜',60,88)});
// ================= MATERIAL & HELPER =================
const themed=[],roots=[],slots=[],doors=[],vs=[],items=[],blocks=[],cabs={};
function mat(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:lin(c),roughness:.6,metalness:0,envMapIntensity:.55},o))}
function box(w,h,d,col,x,y,z,o,th){o=Object.assign({},o);const nc=o.nc;delete o.nc;const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(col,o));m.position.set(x,y,z);m.castShadow=!nc;m.receiveShadow=true;S.add(m);if(th)themed.push([m,th[0],th[1]]);return m}
function plane(w,h,map,x,y,z,ry){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map}));m.position.set(x,y,z);if(ry)m.rotation.y=ry;S.add(m)}
const glassM=new THREE.MeshPhysicalMaterial({color:lin('#bff4fa'),transparent:true,opacity:.28,roughness:.05,clearcoat:1,clearcoatRoughness:.05,envMapIntensity:1.6,side:2,depthWrite:false});
// ================= RUANGAN (14 x 12) =================
box(14,.1,12,0xffffff,0,-.05,0,{map:tFloor,roughness:.28,nc:1},[0xffffff,0x56677a]);
[[14.2,4.2,.1,0,2.1,-6.05],[14.2,4.2,.1,0,2.1,6.05],[.1,4.2,12.2,-7.05,2.1,0],[.1,4.2,12.2,7.05,2.1,0]].forEach(a=>box(a[0],a[1],a[2],0xffffff,a[3],a[4],a[5],{map:tWall,roughness:.9,nc:1},[0xffffff,0x6b7d92]));
box(14.2,.1,12.2,0xffffff,0,4.25,0,{map:tGrain,nc:1},[0xffffff,0x3a4658]);
[[-3.5,-3],[3.5,-3],[-3.5,1.5],[3.5,1.5],[0,-0.7],[0,4]].forEach(a=>{const l=new THREE.Mesh(new THREE.BoxGeometry(1.8,.04,.5),mat('#fffdf2',{emissive:lin('#fffdf2'),emissiveIntensity:2.2}));l.position.set(a[0],4.17,a[1]);S.add(l)});
[[14,.12,.12,0,1.2,-5.93],[14,.12,.12,0,1.2,5.93],[.12,.12,12,-6.93,1.2,0],[.12,.12,12,6.93,1.2,0]].forEach(a=>box(a[0],a[1],a[2],0x00bcd4,a[3],a[4],a[5],{metalness:.5,roughness:.3,nc:1}));
plane(3.6,1.5,tSky,-1.8,2.6,-5.99);plane(2.8,.7,tSign,3.2,2.7,-5.99);
// ================= MEJA (3 buah) =================
const sg=new THREE.CylinderGeometry(.07,.07,.01,16);
function slot(x,y,z){const m=new THREE.Mesh(sg,mat('#00bcd4',{roughness:.3,metalness:.4}));m.position.set(x,y,z);m.userData={kind:'slot',occ:null};m.receiveShadow=true;S.add(m);roots.push(m);slots.push(m)}
function table(cx,cz,w,n,xs,rack){
 box(w,.9,1.1,0x00bcd4,cx,.45,cz,{map:tBrush,metalness:.5,roughness:.35});box(w+.1,.05,1.2,0xffffff,cx,.925,cz,{map:tGrain,roughness:.25,envMapIntensity:.9});box(w,.04,.02,0xff9800,cx,.88,cz+.56,{nc:1});
 const pt=tex(256,64,(g,W,H)=>{g.fillStyle='#fff';g.fillRect(0,0,W,H);g.fillStyle='#00bcd4';g.font='bold 34px sans-serif';g.textAlign='center';g.fillText('MEJA • TABLE '+n,W/2,44)});plane(.9,.22,pt,cx,.6,cz+.56);
 xs.forEach(x=>slot(x,.955,cz));if(rack){box(1.6,.06,.3,0xff9800,rack,.98,cz,{metalness:.3});[-.5,0,.5].forEach(d=>slot(rack+d,1.015,cz))}
 blocks.push([cx-w/2-.35,cx+w/2+.35,cz-.55-.35,cz+.55+.35])}
table(0,-5.35,6,1,[-2.4,-1.6,-.8,0],1.9);table(-3.2,-2,4,2,[-4.6,-3.7,-2.8,-1.9]);table(3.2,-2,4,3,[1.9,2.8,3.7,4.6]);
// ================= WADAH & BOTOL =================
const VT={tube:{r:.025,h:.16,cap:15},beaker:{r:.06,h:.1,cap:250},erlen:{r:.06,rt:.02,h:.14,cap:250},petri:{r:.07,h:.02,cap:20},pipette:{r:.008,h:.2,cap:3}},VG={};
function vgeo(t){if(VG[t])return VG[t];const v=VT[t],w=Math.max(v.r*2,.07);return VG[t]={g:new THREE.CylinderGeometry(v.rt??v.r,v.r,v.h,20,1,true).translate(0,v.h/2,0),hp:new THREE.BoxGeometry(w,v.h,w).translate(0,v.h/2,0)}}
const LG=new THREE.CylinderGeometry(1,1,1,16).translate(0,.5,0);
function vessel(t){const v=VT[t],G=vgeo(t),g=new THREE.Group();g.add(new THREE.Mesh(G.g,glassM.clone()));
 const lm=new THREE.Mesh(LG,new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.9,roughness:.1,envMapIntensity:.8}));lm.visible=false;g.add(lm);
 const pm=new THREE.Mesh(LG,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9}));pm.visible=false;g.add(pm);
 const hp=new THREE.Mesh(G.hp,new THREE.MeshBasicMaterial());hp.visible=false;g.add(hp);
 g.userData={kind:'vessel',type:t,cap:v.cap,items:[],temp:25,lm,pm,v,col:null,ppt:null,rx:null,done:new Set(),fl:null};roots.push(g);vs.push(g);items.push(g);S.add(g);return g}
const BG=[new THREE.CylinderGeometry(.04,.04,.16,18).translate(0,.08,0),new THREE.CylinderGeometry(.022,.022,.04,10).translate(0,.18,0),new THREE.CylinderGeometry(.0415,.0415,.085,18,1,true,-.95,1.9).translate(0,.075,0)];
function vis(h){const c=new THREE.Color(h);if(c.r+c.g+c.b>2.45)c.lerp(new THREE.Color('#8fdcea'),.4);return c}
function label(m){return tex(128,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle=m.hz>=3?'#ff9800':m.hz==2?'#00bcd4':'#4caf50';g.fillRect(0,0,w,16);g.fillStyle='#12202b';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText(m.f.slice(0,7),w/2,50)})}
function bottle(code){const m=M[code],g=new THREE.Group(),lt=label(m);
 g.add(new THREE.Mesh(BG[0],mat('#'+vis(m.col).getHexString(),{roughness:.2,transparent:true,opacity:.93})));g.add(new THREE.Mesh(BG[1],mat(m.hz>=3?'#ff9800':'#4caf50',{roughness:.4})));g.add(new THREE.Mesh(BG[2],new THREE.MeshBasicMaterial({map:lt})));
 g.traverse(o=>o.castShadow=true);g.userData={kind:'bottle',code,lt};roots.push(g);items.push(g);S.add(g);return g}
function kill(o){S.remove(o);[roots,items,vs].forEach(a=>{const i=a.indexOf(o);if(i>=0)a.splice(i,1)});if(o.userData.lt)o.userData.lt.dispose()}
// ================= LEMARI LEBAR (rak berhalaman) =================
function cabinet(kind,x,f){const L=6,H=2.4,zc=-1.5,col=kind=='glass'?0x00bcd4:0xff9800,hc=kind=='glass'?'#ff9800':'#00bcd4',o={map:tBrush,metalness:.55,roughness:.35};
 box(.05,H,L,col,x-f*.375,H/2,zc,o);box(.8,.05,L,col,x,H,zc,o);box(.8,.1,L,col,x,.05,zc,o);box(.8,H,.05,col,x,H/2,zc-L/2,o);box(.8,H,.05,col,x,H/2,zc+L/2,o);
 [.8,1.4,2].forEach(y=>box(.74,.03,L-.1,0xffffff,x+f*.02,y,zc,{roughness:.3}));
 blocks.push([x-.4-.35,x+.4+.35,zc-L/2-.1,zc+L/2+.1]);
 const cab={kind,cells:[],doors:[]};cabs[kind]=cab;
 [[zc-L/2,1],[zc+L/2,-1]].forEach(([pz,dz])=>{const g=new THREE.Group();g.position.set(x+f*.42,H/2,pz);
  const d=new THREE.Mesh(new THREE.BoxGeometry(.03,H-.1,L/2-.02),glassM.clone());d.material.opacity=.2;d.position.z=dz*L/4;g.add(d);
  const h=new THREE.Mesh(new THREE.BoxGeometry(.05,.3,.035),mat(hc,{metalness:.6,roughness:.3}));h.position.set(f*.04,0,dz*(L/2-.15));g.add(h);
  g.userData={kind:'door',open:false,t:0,f,dz,cab:kind};S.add(g);roots.push(g);doors.push(g);cab.doors.push(g)});
 [.815,1.415,2.015].forEach(y=>{for(let i=0;i<10;i++)cab.cells.push({x:x+f*.05,y,z:zc-L/2+.3+i*.6,rot:f*Math.PI/2,obj:null,spec:null})});return cab}
const GLP=[...Array(10).fill('tube'),...Array(5).fill('beaker'),...Array(5).fill('erlen'),...Array(5).fill('petri'),...Array(5).fill('pipette')];
const gc=cabinet('glass',-6.6,1),cc=cabinet('chem',6.6,-1);
function spawn(cab,c){if(c.obj||!c.spec)return;const o=cab.kind=='glass'?vessel(c.spec):bottle(c.spec);o.position.set(c.x,c.y,c.z);o.rotation.y=c.rot;o.userData.cell=c;o.userData.cab=cab.kind;c.obj=o}
gc.cells.forEach((c,i)=>{c.spec=GLP[i];spawn(gc,c)});
let sortedC={},chemList=[],cpage=0;const sortedAll=()=>sortedC[lang]||(sortedC[lang]=MATS.slice().sort((a,b)=>a[lang].localeCompare(b[lang])));
function fillChem(){chemList=sortedAll().filter(m=>sel.has(m.code));const pages=Math.max(1,Math.ceil(chemList.length/30));cpage=Math.min(cpage,pages-1);
 cc.cells.forEach((c,i)=>{if(c.obj){kill(c.obj);c.obj=null}const m=chemList[cpage*30+i];c.spec=m?m.code:null;spawn(cc,c)});$('#pn2').textContent=`${T('rack')} ${cpage+1}/${pages} · ${chemList.length}`}
$('#pp2').onclick=()=>{if(cpage>0){cpage--;fillChem();pagerT=performance.now()+4000}};$('#pnx2').onclick=()=>{if((cpage+1)*30<chemList.length){cpage++;fillChem();pagerT=performance.now()+4000}};
// ================= BEO ORIGO (Easter egg) =================
let beoHead,pa=0,AC;
(function(){const g=new THREE.Group();g.position.set(-6.1,0,-5.4);g.rotation.y=Math.PI/4;
 const P=(geo,c,o,x,y,z,s)=>{const m=new THREE.Mesh(geo,mat(c,o));m.position.set(x,y,z);if(s)m.scale.set(...s);m.castShadow=true;return m},SP=new THREE.SphereGeometry(1,20,16);
 g.add(P(new THREE.CylinderGeometry(.32,.36,.9,28),'#ffffff',{roughness:.25},0,.45,0));const ring=P(new THREE.TorusGeometry(.33,.025,8,36),'#00bcd4',{metalness:.6,roughness:.3},0,.9,0);ring.rotation.x=Math.PI/2;g.add(ring);
 const pr=P(new THREE.CylinderGeometry(.02,.02,.5,8),'#7a4a28',{},0,1.05,0);pr.rotation.z=Math.PI/2;g.add(pr);
 const b=new THREE.Group();b.position.y=1.3;g.add(b);
 b.add(P(SP,'#4caf50',{roughness:.5},0,0,0,[.13,.2,.11]),P(SP,'#9be37f',{roughness:.6},0,-.02,.05,[.1,.15,.08]));
 [-1,1].forEach(s=>b.add(P(SP,'#00bcd4',{roughness:.4},s*.11,-.02,-.01,[.04,.16,.09])));
 [['#00bcd4',-.045],['#ff9800',0],['#00bcd4',.045]].forEach(a=>{const t=P(new THREE.BoxGeometry(.035,.32,.012),a[0],{},a[1],-.3,-.09);t.rotation.x=.35;b.add(t)});
 const h=new THREE.Group();h.position.set(0,.25,.02);b.add(h);beoHead=h;
 h.add(P(SP,'#4caf50',{roughness:.5},0,0,0,[.09,.09,.09]),P(new THREE.ConeGeometry(.035,.09,10),'#ff9800',{roughness:.3},0,-.01,.1),P(new THREE.ConeGeometry(.02,.07,6),'#00bcd4',{},0,.1,-.02));
 h.children[1].rotation.x=Math.PI/2;
 [-1,1].forEach(s=>{h.add(P(SP,'#ffffff',{},s*.065,.02,.06,[.022,.022,.022]),P(SP,'#111111',{},s*.07,.02,.078,[.011,.011,.011]))});
 const hp=new THREE.Mesh(new THREE.BoxGeometry(.5,.7,.5),new THREE.MeshBasicMaterial());hp.visible=false;hp.position.y=1.2;g.add(hp);
 g.userData={kind:'parrot'};roots.push(g);S.add(g)})();
function squawk(){pa=1.4;vib([30,40,30]);say('🦜 '+T('tip'+(1+Math.floor(rnd()*5))));
 try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type='square';o.connect(g);g.connect(AC.destination);
  o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(1900,t+.12);o.frequency.exponentialRampToValueAtTime(700,t+.3);g.gain.setValueAtTime(.07,t);g.gain.exponentialRampToValueAtTime(.001,t+.35);o.start(t);o.stop(t+.36)}catch(e){}}
// ================= TANGAN KANAN =================
const HA=new THREE.Group();HA.position.set(.3,-.3,-.6);C.add(HA);
const hm=(c,o)=>mat(c,Object.assign({roughness:.55,depthTest:false,depthWrite:false},o));const skin=hm('#E8B994'),sleeve=hm('#ffffff',{roughness:.7}),cuff=hm('#00bcd4');
function limb(a,b,r1,r2,m){const d=new THREE.Vector3().subVectors(b,a),l=d.length(),me=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,l,12).translate(0,l/2,0),m);me.position.copy(a);me.quaternion.setFromUnitVectors(UP,d.normalize());me.renderOrder=20;HA.add(me)}
function ball(x,y,z,r){const me=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),skin);me.position.set(x,y,z);me.renderOrder=21;HA.add(me)}
limb(new THREE.Vector3(.34,-.4,.62),new THREE.Vector3(.1,-.03,.1),.075,.05,sleeve);limb(new THREE.Vector3(.12,-.07,.12),new THREE.Vector3(.095,-.03,.1),.052,.052,cuff);
ball(.075,.03,.03,.045);ball(.04,.06,.07,.017);ball(0,.07,.075,.017);ball(-.04,.06,.068,.017);ball(-.065,.05,.02,.02);
// ================= LOGIKA ZAT =================
const tot=d=>d.items.reduce((a,i)=>a+i.ml,0);
function liqCol(d){if(d.col)return vis(d.col).convertSRGBToLinear();const t=tot(d),c=new THREE.Color(0,0,0);d.items.forEach(i=>c.add(vis(M[i.code].col).multiplyScalar(i.ml/t)));return c.convertSRGBToLinear()}
function upd(g){const d=g.userData,t=tot(d);d.lm.visible=t>0;if(!t)return;const r=((d.v.rt??d.v.r)+d.v.r)/2*.86;d.lm.scale.set(r,Math.max(.002,d.v.h*.9*Math.min(1,t/d.cap)),r);if(!d.rx)d.lm.material.color.copy(liqCol(d))}
function add(g,code,ml){const d=g.userData;ml=Math.min(ml,d.cap-tot(d));if(ml<=0){say(T('full'));return false}const it=d.items.find(i=>i.code==code);it?it.ml+=ml:d.items.push({code,ml});upd(g);return true}
function take(g,ml){const d=g.userData,t=tot(d);ml=Math.min(ml,t);const out=d.items.map(i=>({code:i.code,ml:ml*i.ml/t}));d.items.forEach(i=>i.ml-=ml*i.ml/t);d.items=d.items.filter(i=>i.ml>.01);
 if(!d.items.length){d.col=null;d.ppt=null;d.done=new Set();d.pm.visible=false}upd(g);return out}
// ---- mesin reaksi (aturan per kelas + ion) ----
const TR=[['acid','base',{heat:18,col:'#E8FBFF',msg:'neutralize'}],['acid','carbonate',{heat:-2,bub:1,msg:'fizz'}],['acid','sulfide',{bub:.7,smoke:.7,msg:'smoke'}],['acid','sulfite',{bub:.6,smoke:.4,msg:'fizz'}],
['acid','active_metal',{heat:14,bub:1.2,msg:'hydrogen'}],['acid','water',{heat:5,msg:'dilute'}],['dehydrating','water',{heat:25,msg:'dilute'}],['base','water',{heat:5,msg:'dissolve'}],
['alkali_metal','water',{heat:45,bub:1.2,smoke:.6,fire:1,flash:1,msg:'alkali'}],['oxidizer','flammable',{heat:60,smoke:.9,fire:1,flash:1,msg:'fire'}],['oxidizer','sugar',{heat:50,smoke:.9,fire:1,flash:1,msg:'fire'}],
['dehydrating','sugar',{heat:40,smoke:1,bub:.8,col:'#151515',msg:'carbon'}],['peroxide','catalyst',{heat:25,bub:2,smoke:.7,col:'#FFFFFF',msg:'foam'}]];
const HT={Cu:'#3F8FFF',Fe2:'#6E9F6E',Fe3:'#A0522D',Ni:'#6FBF73',Co:'#C06080',Mn:'#C8B8A0',Cr:'#5FA97A',Ag:'#8B6B4A',Hg:'#E0B800',Zn:'#F2F2F2',Al:'#F2F2F2',Pb:'#F2F2F2',Mg:'#F2F2F2',Sn:'#F2F2F2',Cd:'#F2F2F2',Be:'#F2F2F2',Ga:'#F2F2F2',In:'#F2F2F2',Bi:'#F2F2F2',Sb:'#F2F2F2'};
const PS={Cu:'#1b1b1b',Pb:'#222',Ag:'#222',Hg:'#222',Hg2:'#222',Fe2:'#2b2b2b',Fe3:'#2b2b2b',Ni:'#222',Co:'#222',Cd:'#E8C500',Zn:'#EEEEEE',Mn:'#D9A0A0',Sn:'#7A5C3E',Bi:'#3b2b20',Sb:'#E67E22'};
const PT={'Ag+Cl':'#F4F4F4','Ag+Br':'#F2EBC5','Ag+I':'#F5E96A','Ag+CrO4':'#8B2A1D','Ag+CO3':'#E8E4C8','Ag+PO4':'#E8D850','Ba+SO4':'#FAFAFA','Ba+CO3':'#F4F4F4','Ba+CrO4':'#E5D84A','Ba+PO4':'#F4F4F4','Pb+I':'#F2D21B','Pb+Cl':'#F4F4F4','Pb+SO4':'#F4F4F4','Pb+CrO4':'#E8B800','Pb+CO3':'#F4F4F4','Ca+CO3':'#F4F4F4','Ca+C2O4':'#F4F4F4','Ca+PO4':'#F4F4F4','Sr+SO4':'#F4F4F4','Sr+CO3':'#F4F4F4','Mg+CO3':'#F4F4F4','Zn+CO3':'#F4F4F4','Cu+CO3':'#5BA38C','Cu+PO4':'#6FB7C9','Fe2+CO3':'#9aa58a'};
const IND={phenolphthalein:['','#FF2D95'],methyl_orange:['#FF4D3D','#FFD23F'],methyl_red:['#FF3B3B','#FFE14D'],bromothymol_blue:['#FFE14D','#2F6BFF'],litmus:['#FF5A5A','#4A6BFF'],universal_indicator:['#FF3B3B','#8B3FD1'],phenol_red:['#FFD23F','#FF2D75'],thymol_blue:['#FF6A6A','#2F6BFF'],congo_red:['#4A6BFF','#C02020']};
const DISP={Cu:'#B87333',Ag:'#D8D8D8',Pb:'#6E7176',Hg:'#C0C0C0'};
const ion=m=>{const p=(m.x||'').split(':');return{c:p[0],a:p[1]}};
function pairFx(a,b){const ta=a.cls.split(' '),tb=b.cls.split(' '),ia=ion(a),ib=ion(b);let f=null;const set=o=>{f=Object.assign(f||{heat:0,bub:0,smoke:0,fire:0,flash:0,col:'',ppt:'',msg:''},o)};
 for(const r of TR)if((ta.includes(r[0])&&tb.includes(r[1]))||(ta.includes(r[1])&&tb.includes(r[0])))set(r[2]);
 [[ia,ib],[ib,ia]].forEach(([u,v])=>{if(!u.c||!v.a||u.c==v.c)return;const k=u.c+'+'+v.a;let col=PT[k];if(!col&&v.a=='OH'&&HT[u.c])col=HT[u.c];if(!col&&v.a=='S'&&PS[u.c])col=PS[u.c];if(col)set({ppt:col,msg:'precipitate'})});
 [[a,b,ta,tb],[b,a,tb,ta]].forEach(([i,o,ti,to])=>{const iv=IND[i.code];if(iv){const k=to.includes('acid')?0:to.includes('base')?1:-1;if(k>=0&&iv[k])set({col:iv[k],msg:'colorchange'})}
  if(ti.includes('active_metal')&&DISP[ion(o).c])set({heat:8,ppt:DISP[ion(o).c],col:'#EAF6F8',msg:'displace'})});
 return f}
function flames(u){if(u.fl)return u.fl;const f=new THREE.Group();for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.02+i*.005,.08,8).translate(0,.04,0),new THREE.MeshBasicMaterial({color:i?0xffd23f:0xff6a00,transparent:true,opacity:.9}));c.position.x=(i-1)*.02;f.add(c)}f.position.y=u.v.h*.9;f.visible=false;return u.fl=f}
function reactV(g){const d=g.userData;if(d.rx)return;if(d.items.length<2)return say(T('need2'));
 const fx={heat:0,bub:0,smoke:0,fire:0,flash:0,col:'',ppt:'',msgs:[]};let n=0;
 for(let i=0;i<d.items.length;i++)for(let j=i+1;j<d.items.length;j++){const ci=d.items[i].code,cj=d.items[j].code,k=ci<cj?ci+'|'+cj:cj+'|'+ci;if(d.done.has(k))continue;d.done.add(k);const f=pairFx(M[ci],M[cj]);if(!f)continue;n++;
  fx.heat+=f.heat;fx.bub=Math.max(fx.bub,f.bub);fx.smoke=Math.max(fx.smoke,f.smoke);fx.fire|=f.fire;fx.flash|=f.flash;if(f.col)fx.col=f.col;if(f.ppt)fx.ppt=f.ppt;if(f.msg&&!fx.msgs.includes(f.msg))fx.msgs.push(f.msg)}
 if(!n)return say(T('none'));
 const from=liqCol(d),tc=fx.col||(fx.ppt?'#E6F5F8':null);d.rx={t:0,dur:3.2,fx,from,to:tc?vis(tc).convertSRGBToLinear():from.clone()};
 if(fx.ppt)d.ppt={col:fx.ppt,amt:0};if(fx.fire){const f=flames(d);if(!f.parent)g.add(f)}
 say(fx.msgs.map(T).join(' '));vib([40,30,60])}
// ---- partikel ----
const bubs=[],smk=[];for(let i=0;i<70;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.007,6,5),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.85}));m.visible=false;S.add(m);bubs.push({m,l:0})}
for(let i=0;i<30;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),new THREE.MeshBasicMaterial({color:0xd8dde0,transparent:true,opacity:0,depthWrite:false}));m.visible=false;S.add(m);smk.push({m,l:0,L:1})}
function spawnB(g,u){const b=bubs.find(b=>b.l<=0);if(!b)return;g.getWorldPosition(b.m.position);b.m.position.x+=(rnd()-.5)*u.v.r;b.m.position.z+=(rnd()-.5)*u.v.r;b.m.position.y+=u.v.h*.3;b.l=1;b.m.visible=true}
function spawnS(g,u){const b=smk.find(b=>b.l<=0);if(!b)return;g.getWorldPosition(b.m.position);b.m.position.y+=u.v.h;b.m.position.x+=(rnd()-.5)*u.v.r;b.m.position.z+=(rnd()-.5)*u.v.r;b.l=b.L=2.2;b.m.visible=true}
const stream=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1,8).translate(0,.5,0),new THREE.MeshBasicMaterial({color:0x7fe9f5,transparent:true,opacity:.85}));stream.visible=false;S.add(stream);
// ================= INTERAKSI =================
let tw=[],pt=0,ptgt=null,hl=null;const pcol=new THREE.Color(),v3a=new THREE.Vector3(),v3b=new THREE.Vector3();
function look(p){rc.setFromCamera(p||{x:0,y:0},C);for(const h of rc.intersectObjects(roots,true)){if(h.distance>3)break;let o=h.object;while(o&&!o.userData.kind)o=o.parent;if(o&&o!==held)return o}return null}
function glow(o,on){o&&o.traverse(m=>{if(m.material&&m.material.emissive&&!m.material.userData.keep)m.material.emissive.setHex(on?0x0b6a78:0)})}
function pick(o){tw=tw.filter(a=>a.o!==o);const u=o.userData;if(u.slot){u.slot.userData.occ=null;u.slot=null}
 if(u.cell){const c=u.cell,cab=cabs[u.cab];u.cell=null;c.obj=null;setTimeout(()=>spawn(cab,c),900)}held=o;HA.attach(o);vib(12)}
function place(s){S.attach(held);tw.push({o:held,p:s.position.clone()});s.userData.occ=held;held.userData.slot=s;held=null;vib(12)}
const nearSlot=()=>slots.filter(s=>!s.userData.occ&&s.position.distanceTo(C.position)<5).sort((a,b)=>a.position.distanceTo(C.position)-b.position.distanceTo(C.position))[0];
function act(o){o=o||look();const k=o&&o.userData.kind;
 if(k=='door'){const op=!o.userData.open;cabs[o.userData.cab].doors.forEach(d=>d.userData.open=op);vib(15)}
 else if(k=='parrot')squawk();
 else if(k=='slot'){if(held&&!o.userData.occ)place(o)}
 else if(!held&&(k=='vessel'||k=='bottle'))pick(o);
 else if(held&&!o){const s=nearSlot();s?place(s):say(T('no_slot'))}}
function pour(o){if(!playing())return;if(!held)return say(T('hand_empty'));o=o||look();if(!o||o.userData.kind!='vessel')return say(T('aim'));const u=held.userData;let ok=false;
 if(u.kind=='bottle'){ok=add(o,u.code,25);pcol.copy(vis(M[u.code].col)).convertSRGBToLinear()}
 else if(o!==held){if(!tot(u))return say(T('empty'));pcol.copy(u.lm.material.color);take(held,25).forEach(x=>add(o,x.code,x.ml));ok=true}
 if(ok){pt=.8;ptgt=o;vib(10)}}
function reactBtn(){if(!playing())return;const o=look(),g=o&&o.userData.kind=='vessel'?o:(held&&held.userData.kind=='vessel'?held:null);if(!g)return say(T('aimv'));reactV(g)}
const nm=o=>o.userData.kind=='bottle'?M[o.userData.code][lang]:T(o.userData.type);
const desc=o=>{const d=o.userData,t=tot(d);return `<b>${nm(o)}</b> · ${Math.round(d.temp)}°C<div class="bar"><u style="width:${Math.min(100,t/d.cap*100)}%"></u></div>`+(d.items.map(i=>`<div><s style="background:${M[i.code].col}"></s>${M[i.code][lang]} ${Math.round(i.ml)}ml</div>`).join('')||'<div>—</div>')};
function updHold(){const h=held,u=h&&h.userData;$('#hold').innerHTML=h?`<b>${ICON[u.kind=='bottle'?'bottle':u.type]}</b>${T('hand')}: ${nm(h)}<br>`+(u.kind=='vessel'?(tot(u)?Math.round(tot(u))+' ml · '+u.items.length+' zat':T('none_h')):M[u.code].f+' · H'+M[u.code].hz):`<b>🤚</b>${T('hand')}: ${T('none_h')}`}
function hud(){const o=look(),k=o&&o.userData.kind;if(o!==hl){glow(hl,false);glow(o,true);hl=o}if(o&&o.userData.cab=='chem')pagerT=performance.now()+4000;
 let p='';if(k=='door')p=T(o.userData.open?'close':'open');else if(k=='slot')p=held?T('place'):'';else if(k=='parrot')p='🦜 '+T('beo');else if(o)p=(held?'':T('pick')+' ')+nm(o);
 $('#pr').textContent=p;$('#pager').hidden=performance.now()>pagerT;const v=k=='vessel'?o:held&&held.userData.kind=='vessel'?held:null;$('#inf').hidden=!v;if(v)$('#inf').innerHTML=desc(v);updHold()}
let lt=0;function say(m){$('#log').textContent=m;clearTimeout(lt);lt=setTimeout(()=>$('#log').textContent='',4000)}
// ================= KONTROL =================
let yaw=0,pitch=0,ty=0,tp=0,vx=0,vz=0,bob=0,mv={x:0,z:0},keys={},lp=null,tap=null,fr=0,last=0,fa=0,fc=0;
const playing=()=>entered&&$('#book').hidden&&$('#menu').hidden;
cv.addEventListener('pointerdown',e=>{lp=[e.clientX,e.clientY];tap={t:performance.now(),m:0}});
cv.addEventListener('pointermove',e=>{if(!lp||!playing())return;const dx=e.clientX-lp[0],dy=e.clientY-lp[1];if(tap)tap.m+=Math.abs(dx)+Math.abs(dy);ty-=dx*.006;tp=Math.max(-1.2,Math.min(1.2,tp-dy*.006));lp=[e.clientX,e.clientY]});
cv.addEventListener('pointerup',e=>{if(tap&&tap.m<12&&performance.now()-tap.t<350&&playing()){const o=look({x:e.clientX/innerWidth*2-1,y:-e.clientY/innerHeight*2+1});if(o){held&&o.userData.kind=='vessel'?pour(o):act(o)}}tap=null});
cv.addEventListener('pointercancel',()=>{tap=null;lp=null});addEventListener('pointerup',()=>lp=null);
const js=$('#js'),kn=$('#kn');
function jm(e){const r=js.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2;const l=Math.hypot(dx,dy),m=46;if(l>m){dx*=m/l;dy*=m/l}mv={x:dx/m,z:dy/m};kn.style.transform=`translate(${dx}px,${dy}px)`}
const je=()=>{js.dataset.a='';mv={x:0,z:0};kn.style.transform=''};
js.addEventListener('pointerdown',e=>{js.setPointerCapture(e.pointerId);js.dataset.a=1;jm(e)});js.addEventListener('pointermove',e=>js.dataset.a&&jm(e));js.addEventListener('pointerup',je);js.addEventListener('pointercancel',je);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=1;if(!playing())return;if(k=='e')act();if(k=='f')pour();if(k=='r')reactBtn()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
$('#act').onclick=()=>playing()&&act();$('#pour').onclick=()=>pour();$('#rx').onclick=reactBtn;
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000||.016);last=t;const k=Math.min(1,dt*12);
 fa+=dt;fc++;if(fa>2){const f=fc/fa;if(f<26&&q>.55){q-=.1;resize()}else if(f>56&&q<1){q+=.05;resize()}fa=fc=0}
 if(playing()){let x=mv.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),z=mv.z+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);const l=Math.hypot(x,z);if(l>1){x/=l;z/=l}
  const a=Math.min(1,dt*9);vx+=(x*2.4-vx)*a;vz+=(z*2.4-vz)*a;const p=C.position;p.x+=(Math.cos(yaw)*vx+Math.sin(yaw)*vz)*dt;p.z+=(-Math.sin(yaw)*vx+Math.cos(yaw)*vz)*dt;
  p.x=Math.max(-5.6,Math.min(5.6,p.x));p.z=Math.max(-5.4,Math.min(5.4,p.z));
  blocks.forEach(b=>{if(p.x>b[0]&&p.x<b[1]&&p.z>b[2]&&p.z<b[3]){const dx=Math.min(p.x-b[0],b[1]-p.x),dz=Math.min(p.z-b[2],b[3]-p.z);if(dx<dz)p.x=(p.x-b[0]<b[1]-p.x)?b[0]:b[1];else p.z=(p.z-b[2]<b[3]-p.z)?b[2]:b[3]}});
  const sp=Math.hypot(vx,vz);bob+=sp*dt*4.2;p.y=1.6+Math.sin(bob)*.022*Math.min(1,sp/2);
  const b=Math.min(1,dt*18);yaw+=(ty-yaw)*b;pitch+=(tp-pitch)*b;C.rotation.set(pitch,yaw,0);if(++fr%5==0)hud()}
 HA.visible=entered;const pr=pt>0;HA.position.x+=(.3-(ty-yaw)*.4-vx*.01-HA.position.x)*k;HA.position.y+=(-.3+(pr?.05:0)-Math.abs(Math.sin(bob))*.01-HA.position.y)*k;
 if(held){const h=held.position,r=held.rotation;h.x-=h.x*k;h.y-=h.y*k;h.z-=h.z*k;r.x*=1-k;r.y*=1-k;r.z+=((pr?-1.05:0)-r.z)*k}else pt=0;
 for(let i=tw.length-1;i>=0;i--){const a=tw[i],o=a.o,kk=Math.min(1,dt*14);o.position.lerp(a.p,kk);o.rotation.x*=1-kk;o.rotation.y*=1-kk;o.rotation.z*=1-kk;if(o.position.distanceTo(a.p)<.004){o.position.copy(a.p);o.rotation.set(0,0,0);tw.splice(i,1)}}
 if(pr&&held&&ptgt){pt-=dt;held.getWorldPosition(v3a);v3a.y+=.06;ptgt.getWorldPosition(v3b);v3b.y+=ptgt.userData.v.h*.8;v3b.sub(v3a);const Ln=v3b.length();stream.visible=true;stream.position.copy(v3a);stream.quaternion.setFromUnitVectors(UP,v3b.normalize());stream.scale.set(1,Ln,1);stream.material.color.copy(pcol)}else stream.visible=false;
 let fi=0;
 vs.forEach(g=>{const u=g.userData,x=u.rx;
  if(u.ppt){u.pm.visible=true;u.pm.material.color.copy(lin(u.ppt.col));u.pm.scale.set(u.v.r*.85,.004+u.ppt.amt*Math.min(.02,u.v.h*.2),u.v.r*.85)}
  if(x){x.t+=dt;const p=Math.min(1,x.t/x.dur),e=Math.sin(Math.PI*p),F=x.fx;u.lm.material.color.copy(x.from).lerp(x.to,p);if(u.ppt)u.ppt.amt=p;u.temp+=F.heat*dt/x.dur;
   if(g!==held)g.rotation.z=(rnd()-.5)*.1*e*(F.fire||F.bub>1?2:1);
   if(rnd()<F.bub*e*1.5)spawnB(g,u);if(rnd()<F.smoke*e*.8)spawnS(g,u);
   if(F.flash){fi=Math.max(fi,e*3);g.getWorldPosition(fl.position);fl.position.y+=.2}
   if(u.fl){u.fl.visible=!!F.fire&&p<.85;u.fl.children.forEach(c=>{c.scale.y=.7+rnd()*.8;c.scale.x=.8+rnd()*.4})}
   if(p>=1){u.col=F.col||(F.ppt?'#E6F5F8':u.col);u.rx=null;if(u.fl)u.fl.visible=false;if(g!==held)g.rotation.z=0;upd(g);u.lm.material.color.copy(liqCol(u))}}
  else u.temp+=(25-u.temp)*dt*.05});
 fl.intensity=fi;
 bubs.forEach(b=>{if(b.l>0){b.l-=dt;b.m.position.y+=dt*.12;if(b.l<=0)b.m.visible=false}});
 smk.forEach(b=>{if(b.l>0){b.l-=dt;const p=1-b.l/b.L;b.m.position.y+=dt*.28;b.m.scale.setScalar(1+p*4);b.m.material.opacity=.35*(1-p);if(b.l<=0)b.m.visible=false}});
 if(pa>0){pa-=dt;beoHead.rotation.z=Math.sin(t*.02)*.4*Math.min(1,pa);beoHead.rotation.x=Math.sin(t*.015)*.2*Math.min(1,pa)}
 doors.forEach(d=>{const u=d.userData;u.t+=((u.open?1:0)-u.t)*Math.min(1,dt*7);d.rotation.y=u.f*u.dz*1.75*(u.t*u.t*(3-2*u.t))});
 R.render(S,C)}
requestAnimationFrame(loop);
// ================= BUKU INDEKS / PILIH ZAT =================
function opts(sel_,arr){sel_.innerHTML=arr.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}
function buildFilters(){const l=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 opts($('#fl'),[['',T('letter')+' ▾'],...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(x=>[x,x])]);
 opts($('#fc'),[['',T('cat')+' ▾'],['chem/acid',T('c_acid')],['chem/base',T('c_base')],['chem/salt',T('c_salt')],['chem/oxide',T('c_oxide')],['chem/organic',T('c_org')],['chem/solvent',T('c_solv')],['chem/indicator',T('c_ind')],['chem/gas',T('c_gas')],['elem',T('c_elem')],['bio',T('c_bio')],['phys',T('c_phys')]]);
 opts($('#fh'),[['',T('hz')+' ▾'],...[0,1,2,3,4].map(x=>[x,'H'+x])]);$('#fl').value=l;$('#fc').value=c;$('#fh').value=h}
const cntText=()=>`${T('selected')}: ${sel.size} / ${MATS.length}`;
function renderBook(){const qq=$('#q').value.toLowerCase(),L=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 const r=sortedAll().filter(m=>{const n=m[lang];return(!qq||n.toLowerCase().includes(qq)||m.f.toLowerCase().includes(qq))&&(!L||n[0].toUpperCase()==L)&&(!c||m.cat.startsWith(c))&&(h===''||m.hz==h)}),N=20,pages=Math.max(1,Math.ceil(r.length/N));page=Math.min(page,pages-1);
 $('#ls').innerHTML=r.slice(page*N,page*N+N).map(m=>{const on=sel.has(m.code);return `<div class="r"><b>${m[lang]}</b><span>${m.f}</span><i class="h${m.hz}">H${m.hz}</i>`+(mode=='load'?`<button data-t="${m.code}" class="${on?'on':''}">${on?'✓':'＋'}</button>`:mode=='play'?`<button data-c="${m.code}">${on?T('fetch'):T('bring')}</button>`:'')+'</div>'}).join('');
 $('#pn').textContent=(page+1)+' / '+pages;$('#cnt').textContent=cntText();$('#cnt').hidden=$('#packs').hidden=$('#startb').hidden=mode!='load'}
function openBook(m){mode=m;$('#menu').hidden=true;$('#book').hidden=false;renderBook()}
['#q','#fl','#fc','#fh'].forEach(s=>$(s).addEventListener('input',()=>{page=0;renderBook()}));
$('#pp').onclick=()=>{if(page>0){page--;renderBook()}};$('#pnx').onclick=()=>{page++;renderBook()};
const PK={basic:()=>BASIC,ab:()=>MATS.filter(m=>/^chem\/(acid|base)/.test(m.cat)).map(m=>m.code),salt:()=>MATS.filter(m=>m.cat=='chem/salt'||m.cat=='chem/oxide').map(m=>m.code),org:()=>MATS.filter(m=>m.cat=='chem/organic').map(m=>m.code),all:()=>MATS.map(m=>m.code),none:()=>[]};
$('#packs').onclick=e=>{const p=e.target.dataset.p;if(!p)return;sel=new Set(PK[p]());saveSel();renderBook()};
$('#startb').onclick=()=>{if(!sel.size)BASIC.forEach(c=>sel.add(c));saveSel();entered=true;$('#book').hidden=true;fillChem();updHold()};
$('#ls').onclick=e=>{const b=e.target.closest('button');if(!b)return;const t=b.dataset.t,c=b.dataset.c;
 if(t){sel.has(t)?sel.delete(t):sel.add(t);saveSel();b.textContent=sel.has(t)?'✓':'＋';b.classList.toggle('on',sel.has(t));$('#cnt').textContent=cntText()}
 else if(c){if(!sel.has(c)){sel.add(c);saveSel();fillChem();say(T('brought')+M[c][lang]);renderBook();return}if(held)return say(T('hand_full'));
  const o=bottle(c);o.position.copy(C.position).add(new THREE.Vector3(0,-.3,-.5));pick(o);$('#book').hidden=true;say(T('fetched')+M[c][lang])}};
// ================= MENU / TEMA / BAHASA =================
function applyI18n(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(e=>e.textContent=T(e.dataset.i));$('#q').placeholder=T('search');$('#bl').textContent=lang.toUpperCase();buildFilters();renderBook();updHold();if(entered)fillChem()}
function applyTheme(){const d=theme=='dark';document.body.dataset.t=theme;S.background=new THREE.Color(d?0x121821:0xffffff);themed.forEach(a=>a[0].material.color.copy(lin(d?a[2]:a[1])));R.toneMappingExposure=d?.8:1.05;hemi.intensity=d?.3:.5;sun.intensity=d?.4:.75}
$('#bl').onclick=()=>{lang=lang=='id'?'en':'id';localStorage.lang=lang;applyI18n()};
$('#bt').onclick=()=>{theme=theme=='dark'?'light':'dark';localStorage.theme=theme;applyTheme()};
$('#bm').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#book').hidden=true};
$('#bb').onclick=()=>{if($('#book').hidden)openBook(entered?'play':'view');else $('#book').hidden=true};
$('#mb').onclick=()=>openBook('view');$('#go').onclick=()=>openBook('load');
applyTheme();applyI18n();
