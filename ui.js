// ===== UI & status (TIDAK bergantung pada 3D, jadi tombol tetap hidup walau 3D gagal) =====
const $=s=>document.querySelector(s);
let lang=localStorage.lang||'id',theme=localStorage.theme||'light',entered=false,page=0,mode='view';
const T=k=>(I18N[lang]&&I18N[lang][k])||k,GAME={};
const byF={};MATS.forEach(m=>{if(!byF[m.f])byF[m.f]=m});
const BASIC=['HCl','H2SO4','HNO3','NaOH','KOH','NaHCO3','CaCO3','NaCl','CuSO4','AgNO3','KMnO4','Zn','Mg','Na','Fe','H2O','H2O2','MnO2','C6H12O6','CH3COOH','Na2CO3','NH3','KI','BaCl2','C2H5OH','C12H22O11','C20H14O4','Pb(NO3)2','FeCl3'].map(f=>byF[f]&&byF[f].code).filter(Boolean);
let sel;try{sel=new Set(JSON.parse(localStorage.sel||'null')||BASIC)}catch(e){sel=new Set(BASIC)}
const saveSel=()=>{try{localStorage.sel=JSON.stringify([...sel])}catch(e){}};
let qual=+(localStorage.qual||1),snd=localStorage.snd!=='0',JOURNAL=[];try{JOURNAL=JSON.parse(localStorage.jr||'[]')}catch(e){}
const uiOpen=()=>!$('#menu').hidden||!$('#book').hidden||!$('#jr').hidden||!$('#mo').hidden;
let lt=0;function say(m){$('#log').textContent=m;clearTimeout(lt);lt=setTimeout(()=>$('#log').textContent='',4000)}
function showErr(m){const l=$('#err');l.hidden=false;l.textContent='⚠ '+m}
window.addEventListener('error',e=>showErr((e.message||'error')+' @'+String(e.filename||'').split('/').pop()+':'+e.lineno));
let sortedC={};const sortedAll=()=>sortedC[lang]||(sortedC[lang]=MATS.slice().sort((a,b)=>a[lang].localeCompare(b[lang])));
function opts(el,arr){el.innerHTML=arr.map(a=>`<option value="${a[0]}">${a[1]}</option>`).join('')}
function buildFilters(){const l=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 opts($('#fl'),[['',T('letter')+' ▾'],...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(x=>[x,x])]);
 opts($('#fc'),[['',T('cat')+' ▾'],['chem/acid',T('c_acid')],['chem/base',T('c_base')],['chem/salt',T('c_salt')],['chem/oxide',T('c_oxide')],['chem/organic',T('c_org')],['chem/solvent',T('c_solv')],['chem/indicator',T('c_ind')],['chem/gas',T('c_gas')],['elem',T('c_elem')],['bio',T('c_bio')],['phys',T('c_phys')]]);
 opts($('#fh'),[['',T('hz')+' ▾'],...[0,1,2,3,4].map(x=>[x,'H'+x])]);$('#fl').value=l;$('#fc').value=c;$('#fh').value=h}
const cntText=()=>`${T('selected')}: ${sel.size} / ${MATS.length}`;
function renderBook(){const qq=$('#q').value.toLowerCase(),L=$('#fl').value,c=$('#fc').value,h=$('#fh').value;
 const r=sortedAll().filter(m=>{const n=m[lang];return(!qq||n.toLowerCase().includes(qq)||m.f.toLowerCase().includes(qq))&&(!L||n[0].toUpperCase()==L)&&(!c||m.cat.startsWith(c))&&(h===''||m.hz==h)}),N=20,pages=Math.max(1,Math.ceil(r.length/N));page=Math.min(page,pages-1);
 $('#ls').innerHTML=r.slice(page*N,page*N+N).map(m=>{const on=sel.has(m.code);return `<div class="r"><b>${m[lang]}</b><span>${m.f}</span><i class="h${m.hz}">H${m.hz}</i>`+(mode=='load'?`<button data-t="${m.code}" class="${on?'on':''}">${on?'✓':'＋'}</button>`:mode=='play'?`<button data-c="${m.code}">${on?T('fetch'):T('bring')}</button>`:'')+'</div>'}).join('');
 $('#pn').textContent=(page+1)+' / '+pages;$('#cnt').textContent=cntText();$('#cnt').hidden=$('#packs').hidden=$('#startb').hidden=mode!='load'}
function openBook(m){mode=m;$('#menu').hidden=true;$('#jr').hidden=true;$('#mo').hidden=true;$('#book').hidden=false;renderBook()}
['#q','#fl','#fc','#fh'].forEach(s=>$(s).addEventListener('input',()=>{page=0;renderBook()}));
$('#pp').onclick=()=>{if(page>0){page--;renderBook()}};$('#pnx').onclick=()=>{page++;renderBook()};
const PK={basic:()=>BASIC,ab:()=>MATS.filter(m=>/^chem\/(acid|base)/.test(m.cat)).map(m=>m.code),salt:()=>MATS.filter(m=>m.cat=='chem/salt'||m.cat=='chem/oxide').map(m=>m.code),org:()=>MATS.filter(m=>m.cat=='chem/organic').map(m=>m.code),all:()=>MATS.map(m=>m.code),none:()=>[]};
$('#packs').onclick=e=>{const p=e.target.dataset.p;if(!p)return;sel=new Set(PK[p]());saveSel();renderBook()};
$('#startb').onclick=()=>{if(!sel.size)BASIC.forEach(c=>sel.add(c));saveSel();entered=true;$('#rs').hidden=false;$('#book').hidden=true;GAME.start&&GAME.start()};
$('#ls').onclick=e=>{const b=e.target.closest('button');if(!b)return;const t=b.dataset.t,c=b.dataset.c;
 if(t){sel.has(t)?sel.delete(t):sel.add(t);saveSel();b.textContent=sel.has(t)?'✓':'＋';b.classList.toggle('on',sel.has(t));$('#cnt').textContent=cntText()}
 else if(c){if(!sel.has(c)){sel.add(c);saveSel();GAME.fillChem&&GAME.fillChem();say(T('brought')+M[c][lang]);renderBook();return}if(GAME.fetch&&GAME.fetch(c))$('#book').hidden=true}};
function applyI18n(){document.documentElement.lang=lang;document.querySelectorAll('[data-i]').forEach(e=>e.textContent=T(e.dataset.i));$('#q').placeholder=T('search');$('#bl').textContent=lang.toUpperCase();buildFilters();renderBook();updMenuBtns();GAME.lang&&GAME.lang()}
function applyTheme(){document.body.dataset.t=theme;GAME.theme&&GAME.theme(theme=='dark')}
$('#bl').onclick=()=>{lang=lang=='id'?'en':'id';localStorage.lang=lang;applyI18n()};
$('#bt').onclick=()=>{theme=theme=='dark'?'light':'dark';localStorage.theme=theme;applyTheme()};
$('#bm').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#book').hidden=true;$('#jr').hidden=true;$('#mo').hidden=true};
$('#bb').onclick=()=>{if($('#book').hidden)openBook(entered?'play':'view');else $('#book').hidden=true};
$('#mb').onclick=()=>openBook('view');$('#go').onclick=()=>openBook('load');
function updMenuBtns(){$('#mq').textContent=T('gfx')+': '+T('q'+qual);$('#ms').textContent=T('sound')+': '+T(snd?'on':'off')}
function renderJ(){$('#jl').innerHTML=JOURNAL.length?JOURNAL.map(j=>`<div class="r jr"><div><b>${j.t} · ${T(j.v)}</b><br>${j.a.map(c=>M[c]?M[c][lang]:c).join(' + ')}<br><em>${j.m.map(T).join(' ')}</em><br><small>${j.m.map(k=>T('x_'+k)).join(' ')}</small></div></div>`).join(''):`<p>${T('j_empty')}</p>`}
$('#mj').onclick=()=>{$('#menu').hidden=true;$('#book').hidden=true;$('#mo').hidden=true;$('#jr').hidden=false;renderJ()};
$('#rs').onclick=()=>{$('#menu').hidden=true};
$('#mq').onclick=()=>{qual=(qual+1)%3;localStorage.qual=qual;updMenuBtns();GAME.qual&&GAME.qual(qual)};
$('#ms').onclick=()=>{snd=!snd;localStorage.snd=snd?'1':'0';updMenuBtns()};
const MISI=[
{id:'m1',f:['HCl','NaOH'],k:'neutralize',eq:'HCl + NaOH → NaCl + H₂O',t:['Netralisasi','Neutralization'],g:['Campur asam klorida + natrium hidroksida, lalu tekan Reaksi.','Mix hydrochloric acid + sodium hydroxide, then press React.'],e:['Asam + basa → garam + air, dan panas dilepaskan. Prinsip yang sama dipakai antasida untuk menetralkan asam lambung.','Acid + base → salt + water, with heat released. Antacids use the same principle against stomach acid.']},
{id:'m2',f:['HCl','NaHCO3'],k:'fizz',eq:'HCl + NaHCO₃ → NaCl + H₂O + CO₂↑',t:['Gas karbon dioksida','Carbon dioxide gas'],g:['Campur asam klorida + soda kue, lalu tekan Reaksi.','Mix hydrochloric acid + baking soda, then press React.'],e:['Karbonat dan asam menghasilkan gas CO₂. Gelembung itulah yang membuat adonan kue mengembang.','Carbonates and acids give CO₂ gas. Those bubbles are what makes dough rise.']},
{id:'m3',f:['AgNO3','NaCl'],k:'precipitate',eq:'AgNO₃ + NaCl → AgCl↓ + NaNO₃',t:['Endapan putih','White precipitate'],g:['Campur perak nitrat + natrium klorida, lalu tekan Reaksi.','Mix silver nitrate + sodium chloride, then press React.'],e:['Ion Ag⁺ dan Cl⁻ membentuk AgCl yang tidak larut, sehingga muncul endapan putih. Cara ini dipakai untuk mendeteksi klorida.','Ag⁺ and Cl⁻ form insoluble AgCl, a white solid. This is a classic test for chloride.']},
{id:'m4',f:['CuSO4','NaOH'],k:'precipitate',eq:'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',t:['Endapan biru','Blue precipitate'],g:['Campur tembaga(II) sulfat + natrium hidroksida, lalu tekan Reaksi.','Mix copper(II) sulfate + sodium hydroxide, then press React.'],e:['Ion Cu²⁺ bertemu OH⁻ membentuk Cu(OH)₂ yang berwarna biru dan tidak larut.','Cu²⁺ meets OH⁻ to form blue, insoluble Cu(OH)₂.']},
{id:'m5',f:['C20H14O4','NaOH'],k:'colorchange',eq:'Fenolftalein + OH⁻ → merah muda / pink',t:['Indikator pH','pH indicator'],g:['Campur fenolftalein + natrium hidroksida, lalu tekan Reaksi.','Mix phenolphthalein + sodium hydroxide, then press React.'],e:['Fenolftalein tak berwarna dalam asam dan menjadi merah muda dalam basa.','Phenolphthalein is colorless in acid and turns pink in base.']},
{id:'m6',f:['Zn','CuSO4'],k:'displace',eq:'Zn + CuSO₄ → ZnSO₄ + Cu',t:['Reaksi desak logam','Metal displacement'],g:['Campur seng + tembaga(II) sulfat, lalu tekan Reaksi.','Mix zinc + copper(II) sulfate, then press React.'],e:['Seng lebih reaktif daripada tembaga, jadi seng menggantikan tembaga dalam larutan. Tembaga mengendap berwarna cokelat kemerahan.','Zinc is more reactive than copper, so it takes copper’s place in solution. Reddish-brown copper settles out.']},
{id:'m7',f:['Mg','HCl'],k:'hydrogen',eq:'Mg + 2HCl → MgCl₂ + H₂↑',t:['Gas hidrogen','Hydrogen gas'],g:['Campur magnesium + asam klorida, lalu tekan Reaksi.','Mix magnesium + hydrochloric acid, then press React.'],e:['Logam aktif melepas hidrogen dari asam. Gas H₂ mudah terbakar, jadi jauhkan dari api.','Active metals release hydrogen from acids. H₂ is flammable, so keep flames away.']},
{id:'m8',f:['H2O2','KI'],k:'foam',eq:'2H₂O₂ →(KI) 2H₂O + O₂↑',t:['Busa katalis','Catalyst foam'],g:['Campur hidrogen peroksida + kalium iodida, lalu tekan Reaksi.','Mix hydrogen peroxide + potassium iodide, then press React.'],e:['Katalis tidak habis, tetapi mempercepat reaksi. Peroksida cepat terurai menjadi air dan oksigen, sehingga busa meluap.','A catalyst is not used up but speeds up the reaction. Peroxide breaks down fast into water and oxygen, so foam erupts.']},
{id:'m9',f:['Na','H2O'],k:'alkali',eq:'2Na + 2H₂O → 2NaOH + H₂↑',t:['Logam alkali','Alkali metal'],g:['Campur natrium + air suling, lalu tekan Reaksi.','Mix sodium + distilled water, then press React.'],e:['Natrium sangat reaktif terhadap air; panas dan gas hidrogen yang dihasilkan bisa menyala. Itu sebabnya disimpan dalam minyak.','Sodium is very reactive with water; the heat and hydrogen can ignite. That is why it is stored under oil.']},
{id:'m10',f:['H2SO4','C12H22O11'],k:'carbon',eq:'C₁₂H₂₂O₁₁ →(H₂SO₄ pekat) 12C + 11H₂O',t:['Dehidrasi gula','Sugar dehydration'],g:['Campur asam sulfat + sukrosa, lalu tekan Reaksi.','Mix sulfuric acid + sucrose, then press React.'],e:['Asam sulfat pekat menarik air dari gula dan meninggalkan karbon hitam. Reaksinya sangat panas.','Concentrated sulfuric acid pulls water from sugar and leaves black carbon. The reaction is very hot.']}];
let DONE=new Set();try{DONE=new Set(JSON.parse(localStorage.ms||'[]'))}catch(e){}
const L2=a=>a[lang=='id'?0:1];
function missionCheck(codes,msgs){for(const m of MISI){if(DONE.has(m.id))continue;if(msgs.includes(m.k)&&m.f.every(f=>byF[f]&&codes.includes(byF[f].code))){DONE.add(m.id);try{localStorage.ms=JSON.stringify([...DONE])}catch(e){}return m}}return null}
function showPop(m){const p=$('#pop');p.hidden=false;p.innerHTML=`<h3>🏆 ${L2(m.t)}</h3><p class="eq">${m.eq}</p><p>${L2(m.e)}</p><button id="pok">OK</button>`;$('#pok').onclick=()=>p.hidden=true}
function renderMo(){$('#ml').innerHTML=MISI.map(m=>`<div class="r jr"><div><b>${DONE.has(m.id)?'✅':'⬜'} ${L2(m.t)}</b><br>${L2(m.g)}</div><button data-m="${m.id}">▶</button></div>`).join('')+`<p style="text-align:center">${DONE.size} / ${MISI.length}</p>`}
$('#ml').onclick=e=>{const b=e.target.closest('button');if(!b)return;const m=MISI.find(x=>x.id==b.dataset.m);m.f.forEach(f=>byF[f]&&sel.add(byF[f].code));saveSel();$('#mo').hidden=true;$('#menu').hidden=true;if(entered){GAME.fillChem&&GAME.fillChem()}else $('#startb').onclick();say('🎯 '+L2(m.g))};
$('#mm').onclick=()=>{$('#menu').hidden=true;$('#book').hidden=true;$('#jr').hidden=true;$('#mo').hidden=false;renderMo()};
$('#err').onclick=()=>$('#err').hidden=true;
applyTheme();applyI18n();
