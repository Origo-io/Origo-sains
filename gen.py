import re,json,math
L=[];seen=set()
def slug(s):return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
def add(en,idn,f,cat,cls,hz,col,x=''):
    b=k=slug(en);n=2
    while k in seen:k=f"{b}_{n}";n+=1
    seen.add(k);L.append([k,f,cat,cls,hz,col,idn,en,x])
def Cn(n):return 'C' if n==1 else f'C{n}'
# ---------- unsur ----------
SY="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split()
EN="Hydrogen,Helium,Lithium,Beryllium,Boron,Carbon,Nitrogen,Oxygen,Fluorine,Neon,Sodium,Magnesium,Aluminium,Silicon,Phosphorus,Sulfur,Chlorine,Argon,Potassium,Calcium,Scandium,Titanium,Vanadium,Chromium,Manganese,Iron,Cobalt,Nickel,Copper,Zinc,Gallium,Germanium,Arsenic,Selenium,Bromine,Krypton,Rubidium,Strontium,Yttrium,Zirconium,Niobium,Molybdenum,Technetium,Ruthenium,Rhodium,Palladium,Silver,Cadmium,Indium,Tin,Antimony,Tellurium,Iodine,Xenon,Caesium,Barium,Lanthanum,Cerium,Praseodymium,Neodymium,Promethium,Samarium,Europium,Gadolinium,Terbium,Dysprosium,Holmium,Erbium,Thulium,Ytterbium,Lutetium,Hafnium,Tantalum,Tungsten,Rhenium,Osmium,Iridium,Platinum,Gold,Mercury,Thallium,Lead,Bismuth,Polonium,Astatine,Radon,Francium,Radium,Actinium,Thorium,Protactinium,Uranium,Neptunium,Plutonium,Americium,Curium,Berkelium,Californium,Einsteinium,Fermium,Mendelevium,Nobelium,Lawrencium,Rutherfordium,Dubnium,Seaborgium,Bohrium,Hassium,Meitnerium,Darmstadtium,Roentgenium,Copernicium,Nihonium,Flerovium,Moscovium,Livermorium,Tennessine,Oganesson".split(',')
ID=dict(Hydrogen='Hidrogen',Beryllium='Berilium',Carbon='Karbon',Oxygen='Oksigen',Fluorine='Fluor',Sodium='Natrium',Silicon='Silikon',Phosphorus='Fosfor',Sulfur='Belerang',Chlorine='Klorin',Potassium='Kalium',Calcium='Kalsium',Scandium='Skandium',Chromium='Kromium',Manganese='Mangan',Iron='Besi',Nickel='Nikel',Copper='Tembaga',Zinc='Seng',Gallium='Galium',Arsenic='Arsen',Bromine='Bromin',Krypton='Kripton',Strontium='Stronsium',Yttrium='Itrium',Zirconium='Zirkonium',Molybdenum='Molibdenum',Technetium='Teknesium',Ruthenium='Rutenium',Rhodium='Rodium',Palladium='Paladium',Silver='Perak',Tin='Timah',Antimony='Antimon',Tellurium='Telurium',Iodine='Iodin',Caesium='Sesium',Lanthanum='Lantanum',Cerium='Serium',Praseodymium='Praseodimium',Neodymium='Neodimium',Promethium='Prometium',Dysprosium='Disprosium',Ytterbium='Iterbium',Lutetium='Lutesium',Tungsten='Wolfram',Rhenium='Renium',Platinum='Platina',Gold='Emas',Mercury='Raksa',Thallium='Talium',Lead='Timbal',Bismuth='Bismut',Astatine='Astatin',Francium='Fransium',Actinium='Aktinium',Thorium='Torium',Protactinium='Protaktinium',Americium='Amerisium',Curium='Kurium',Californium='Kalifornium',Lawrencium='Lawrensium',Rutherfordium='Ruterfordium',Copernicium='Kopernisium',Tennessine='Tenesin',Oganesson='Oganeson',Thulium='Tulium')
AKL={3,11,19,37,55,87};AKE={4,12,20,38,56,88};NOB={2,10,18,36,54,86,118};HAL={9,17,35,53,85,117};NM={1,6,7,8,15,16,34};MD={5,14,32,33,51,52}
ECOL=dict(H='#EFEFEF',C='#2B2B2B',N='#EFEFEF',O='#DDEFF5',S='#E6D84A',P='#C94A3A',Cl='#C9E26B',Br='#8B3A1D',I='#5A3A7A',Cu='#B87333',Au='#FFD700',Fe='#7A7F85',Zn='#9AA5AD',Pb='#6E7176',Na='#D5D9DD',K='#D0D3D6',F='#E8F5B0',Si='#6B7280')
EHZ={'Hg':4,'Tl':4,'As':3,'Cd':3,'Be':3,'Pb':3,'Se':2,'P':3,'F':3,'Cl':3,'Br':3,'I':2,'Ba':2,'Sb':2,'Os':2,'H':1,'O':1,'Ni':1,'Co':1,'Cr':1,'C':0}
for i,(s,e) in enumerate(zip(SY,EN)):
    z=i+1;t='metal'
    if z in AKL:t='metal active_metal alkali_metal'
    elif z in AKE or z in(13,26,30):t='metal active_metal'
    elif z in NOB:t='inert'
    elif z in HAL:t='halogen oxidizer'
    elif z==1:t='nonmetal flammable'
    elif z==8:t='nonmetal oxidizer'
    elif z in(6,15,16):t='nonmetal flammable'
    elif z in NM or z in MD:t='nonmetal'
    hz=EHZ.get(s,3 if z in AKL else (4 if z>=84 or z in(43,61) else 0))
    add(e,ID.get(e,e),s,'elem/'+('nonmetal' if z in NM|NOB|HAL else 'metal'),t,hz,ECOL.get(s,'#B8C0C6'))
# ---------- garam ionik ----------
CA=[('Li','Li',1,'Litium','Lithium'),('Na','Na',1,'Natrium','Sodium'),('K','K',1,'Kalium','Potassium'),('Rb','Rb',1,'Rubidium','Rubidium'),('Cs','Cs',1,'Sesium','Cesium'),('NH4','NH4',1,'Amonium','Ammonium'),('Ag','Ag',1,'Perak','Silver'),('Tl','Tl',1,'Talium(I)','Thallium(I)'),
('Be','Be',2,'Berilium','Beryllium'),('Mg','Mg',2,'Magnesium','Magnesium'),('Ca','Ca',2,'Kalsium','Calcium'),('Sr','Sr',2,'Stronsium','Strontium'),('Ba','Ba',2,'Barium','Barium'),('Zn','Zn',2,'Seng','Zinc'),('Cd','Cd',2,'Kadmium','Cadmium'),
('Hg','Hg',2,'Raksa(II)','Mercury(II)'),('Hg2','Hg2',2,'Raksa(I)','Mercury(I)'),('Cu','Cu',2,'Tembaga(II)','Copper(II)'),('Cu1','Cu',1,'Tembaga(I)','Copper(I)'),('Fe2','Fe',2,'Besi(II)','Iron(II)'),('Fe3','Fe',3,'Besi(III)','Iron(III)'),
('Co','Co',2,'Kobalt(II)','Cobalt(II)'),('Ni','Ni',2,'Nikel(II)','Nickel(II)'),('Mn','Mn',2,'Mangan(II)','Manganese(II)'),('Cr','Cr',3,'Kromium(III)','Chromium(III)'),('Al','Al',3,'Aluminium','Aluminium'),('Ga','Ga',3,'Galium','Gallium'),('In','In',3,'Indium','Indium'),
('Pb','Pb',2,'Timbal(II)','Lead(II)'),('Sn','Sn',2,'Timah(II)','Tin(II)'),('Bi','Bi',3,'Bismut(III)','Bismuth(III)'),('Sb','Sb',3,'Antimon(III)','Antimony(III)')]
AN=[('F','F',1,'Fluorida','Fluoride'),('Cl','Cl',1,'Klorida','Chloride'),('Br','Br',1,'Bromida','Bromide'),('I','I',1,'Iodida','Iodide'),('OH','OH',1,'Hidroksida','Hydroxide'),('NO3','NO3',1,'Nitrat','Nitrate'),('NO2','NO2',1,'Nitrit','Nitrite'),
('SO4','SO4',2,'Sulfat','Sulfate'),('HSO4','HSO4',1,'Hidrogen Sulfat','Hydrogen Sulfate'),('SO3','SO3',2,'Sulfit','Sulfite'),('S2O3','S2O3',2,'Tiosulfat','Thiosulfate'),('S','S',2,'Sulfida','Sulfide'),
('CO3','CO3',2,'Karbonat','Carbonate'),('HCO3','HCO3',1,'Hidrogen Karbonat','Bicarbonate'),('PO4','PO4',3,'Fosfat','Phosphate'),('H2PO4','H2PO4',1,'Dihidrogen Fosfat','Dihydrogen Phosphate'),('HPO4','HPO4',2,'Hidrogen Fosfat','Hydrogen Phosphate'),
('O','O',2,'Oksida','Oxide'),('O2','O2',2,'Peroksida','Peroxide'),('CH3COO','CH3COO',1,'Asetat','Acetate'),('HCOO','HCOO',1,'Format','Formate'),('C2O4','C2O4',2,'Oksalat','Oxalate'),('C4H4O6','C4H4O6',2,'Tartrat','Tartrate'),
('C6H5O7','C6H5O7',3,'Sitrat','Citrate'),('C6H5COO','C6H5COO',1,'Benzoat','Benzoate'),('C3H5O3','C3H5O3',1,'Laktat','Lactate'),('C17H35COO','C17H35COO',1,'Stearat','Stearate'),('C15H31COO','C15H31COO',1,'Palmitat','Palmitate'),
('C17H33COO','C17H33COO',1,'Oleat','Oleate'),('C2H5COO','C2H5COO',1,'Propionat','Propionate'),('C3H7COO','C3H7COO',1,'Butirat','Butyrate'),('C7H5O3','C7H5O3',1,'Salisilat','Salicylate'),('C6H11O7','C6H11O7',1,'Glukonat','Gluconate'),
('C4H4O4','C4H4O4',2,'Suksinat','Succinate'),('C3H2O4','C3H2O4',2,'Malonat','Malonate'),('ClO','ClO',1,'Hipoklorit','Hypochlorite'),('ClO3','ClO3',1,'Klorat','Chlorate'),('ClO4','ClO4',1,'Perklorat','Perchlorate'),
('BrO3','BrO3',1,'Bromat','Bromate'),('IO3','IO3',1,'Iodat','Iodate'),('MnO4','MnO4',1,'Permanganat','Permanganate'),('CrO4','CrO4',2,'Kromat','Chromate'),('Cr2O7','Cr2O7',2,'Dikromat','Dichromate'),
('SiO3','SiO3',2,'Silikat','Silicate'),('B4O7','B4O7',2,'Tetraborat','Tetraborate'),('SCN','SCN',1,'Tiosianat','Thiocyanate'),('CN','CN',1,'Sianida','Cyanide'),('MoO4','MoO4',2,'Molibdat','Molybdate'),('WO4','WO4',2,'Tungstat','Tungstate')]
OXI={'MnO4','ClO3','ClO4','BrO3','IO3','ClO','Cr2O7','CrO4','NO3','O2'}
RED={'Sn','Fe2','Cu1','Hg2','Tl','Sb','Mn','I'}
ALK={'Li','Na','K','Rb','Cs'};AKE_={'Mg','Ca','Sr','Ba','Be'};MONO={'Li','Na','K','Rb','Cs','NH4'}
ONLY={'HCO3':MONO|{'Ca','Mg','Ba'},'HSO4':MONO,'H2PO4':MONO|{'Ca','Mg'},'HPO4':MONO|{'Ca','Mg'},'NO2':MONO|{'Ag','Ba','Ca','Sr','Mg'},'O2':ALK|AKE_|{'Zn','Cd'},
'SO3':MONO|{'Ca','Mg','Ba','Ag','Zn','Cu','Pb','Mn','Fe2'},'S2O3':MONO|{'Ca','Mg','Ba','Ag','Pb','Cu','Fe3','Zn'},'B4O7':MONO|{'Ca','Mg','Zn','Cu'},'SiO3':MONO|{'Ca','Mg','Ba','Zn','Pb','Cu','Al','Fe2'},'MoO4':MONO|{'Ca','Mg','Ba','Ag','Pb','Zn','Cu','Fe3'},'WO4':MONO|{'Ca','Mg','Ba','Ag','Pb','Zn','Cu'},
'C17H35COO':MONO-{'NH4','Rb','Cs'}|{'Ca','Mg','Zn','Al','Ba','Pb','Cu','Ag'},'C15H31COO':MONO-{'NH4','Rb','Cs'}|{'Ca','Mg','Zn','Al','Ba','Pb','Cu'},'C17H33COO':MONO-{'NH4','Rb','Cs'}|{'Ca','Mg','Zn','Al','Pb','Cu'}}
HGO={'F','Cl','Br','I','NO3','SO4','CO3','CrO4'}
def ok(c,a):
    k,ak=c[0],a[0]
    if ak in ONLY and k not in ONLY[ak]:return False
    if ak in OXI and ak not in('NO3','O2') and k in RED:return False
    if ak in('I','S') and k in('Fe3','Cu','Cr'):return False
    if ak in('OH',) and k in('Ag','Hg2','Cu1','Tl') and k!='Tl':return False
    if ak=='O' and k in('NH4',):return False
    if k=='Cu1' and ak not in('Cl','Br','I','O','S','CN','SCN'):return False
    if k=='Hg2' and ak not in HGO:return False
    if k in('Sb','Bi') and ak not in('Cl','Br','I','F','NO3','SO4','O','S','OH','CH3COO','C4H4O6','C6H5O7'):return False
    if k=='NH4' and ak in('O','OH','CrO4') and ak!='OH':return False
    if k=='Tl' and ak in OXI and ak not in('NO3',):return False
    if ak in('CN',) and k in('Hg2','Bi','Sb','Be','Ga','In','Cr','Al'):return False
    return True
CH={'Cu':3,'Ni':2,'Co':2,'Cr':2,'Pb':3,'Hg':4,'Hg2':4,'Cd':3,'Tl':4,'Be':3,'Sb':3,'Ag':2,'Ba':2,'Zn':1,'Fe2':1,'Fe3':1,'Mn':1,'Sn':1,'Bi':1,'Ga':1,'In':1,'Li':1,'Rb':1,'Cs':1,'Cu1':2}
AH={'CN':4,'ClO3':3,'ClO4':3,'ClO':2,'BrO3':3,'IO3':2,'MnO4':3,'CrO4':3,'Cr2O7':3,'O2':3,'F':2,'OH':2,'NO3':1,'NO2':2,'S':1,'SCN':1,'SO3':1,'HSO4':2,'MoO4':1,'S2O3':0}
CCOL={'Cu':'#2E8BFF','Cu1':'#C9A86A','Fe2':'#8FBF88','Fe3':'#D2691E','Ni':'#4CAF50','Co':'#E75480','Mn':'#F0D0D6','Cr':'#2E8B57','Hg':'#E8C84A','Pb':'#EEEEEE','Cd':'#EEEEEE'}
ACOL={'MnO4':'#8B1FA9','CrO4':'#E5C100','Cr2O7':'#FF7F00','I':'#F0F0E0','S':'#C8C890','O2':'#F6F6D8'}
def lcm(a,b):return a*b//math.gcd(a,b)
def part(s,n,poly):return s if n==1 else (f"({s}){n}" if poly else f"{s}{n}")
polyre=re.compile(r'[A-Z].*[A-Z]|\d')
SALTS={}
for c in CA:
    for a in AN:
        if not ok(c,a):continue
        l=lcm(c[2],a[2]);nc,na=l//c[2],l//a[2]
        f=part(c[1],nc,c[0]=='NH4')+part(a[1],na,bool(polyre.search(a[1])) and a[0]!='O2')
        tags=['salt'];cat='chem/salt';ak=a[0]
        if ak=='OH':tags=['base'];cat='chem/base'
        elif ak in('CO3','HCO3'):tags=['carbonate','salt']
        elif ak=='S':tags=['sulfide','salt']
        elif ak=='SO3':tags=['sulfite','salt']
        elif ak=='O':tags=(['base','oxide'] if c[0] in ALK|AKE_ else ['oxide']);cat='chem/oxide'
        if ak in OXI:tags.append('oxidizer')
        if c[0]=='Ag':tags.append('silver_salt')
        if c[0]=='K' and ak=='I':tags.append('catalyst')
        hz=max(CH.get(c[0],0),AH.get(ak,0))
        if ak=='OH' and c[0] in ALK|{'Ba'}:hz=3
        col=ACOL.get(ak) or CCOL.get(c[0]) or '#ECECEC'
        add(f"{c[4]} {a[4]}",f"{c[3]} {a[3]}",f,cat,' '.join(tags),hz,col,f"{c[0]}:{ak}")
        SALTS[(c[0],ak)]=L[-1]
# hidrat
PRE={2:('di','di'),4:('tetra','tetra'),5:('penta','penta'),6:('hexa','heksa'),7:('hepta','hepta'),10:('deca','deka')}
HN={'Cu':5,'Ni':6,'Co':6,'Fe2':7,'Fe3':6,'Zn':7,'Mg':6,'Mn':4,'Cr':6,'Al':6,'Ca':2,'Ba':2,'Na':10}
for c,n in HN.items():
    for ak in('SO4','Cl','NO3','CH3COO'):
        s=SALTS.get((c,ak))
        if s:L.append(None);L.pop();add(f"{s[7]} {PRE[n][0].capitalize()}hydrate",f"{s[6]} {PRE[n][1].capitalize()}hidrat",f"{s[1]}·{n}H2O",s[2],s[3],s[4],s[5],s[8])
# ---------- asam ----------
ACIDS=[('Hydrochloric Acid','Asam Klorida','HCl','Cl',3,'#CFF3F8'),('Hydrobromic Acid','Asam Bromida','HBr','Br',3,'#EFE6C8'),('Hydroiodic Acid','Asam Iodida','HI','I',3,'#EFE6C8'),('Hydrofluoric Acid','Asam Fluorida','HF','F',4,'#E6F5F8'),
('Nitric Acid','Asam Nitrat','HNO3','NO3',4,'#F8EFA0'),('Nitrous Acid','Asam Nitrit','HNO2','NO2',2,'#DDEEF8'),('Sulfuric Acid','Asam Sulfat','H2SO4','SO4',4,'#F6F0B0'),('Sulfurous Acid','Asam Sulfit','H2SO3','SO3',2,'#E6F5F8'),
('Phosphoric Acid','Asam Fosfat','H3PO4','PO4',2,'#EEF5F8'),('Carbonic Acid','Asam Karbonat','H2CO3','CO3',0,'#E6F5F8'),('Acetic Acid','Asam Asetat','CH3COOH','CH3COO',2,'#EAF7FA'),('Formic Acid','Asam Format','HCOOH','HCOO',3,'#EAF7FA'),
('Oxalic Acid','Asam Oksalat','H2C2O4','C2O4',2,'#F2F2F2'),('Perchloric Acid','Asam Perklorat','HClO4','ClO4',4,'#E6F5F8'),('Chloric Acid','Asam Klorat','HClO3','ClO3',3,'#E6F5F8'),('Hypochlorous Acid','Asam Hipoklorit','HClO','ClO',2,'#F0F8E0'),
('Boric Acid','Asam Borat','H3BO3','B4O7',1,'#F6F6F6'),('Hydrogen Sulfide Solution','Larutan Hidrogen Sulfida','H2S','S',3,'#E8EDC0'),('Tartaric Acid','Asam Tartrat','C4H6O6','C4H4O6',1,'#F6F6F6'),('Citric Acid','Asam Sitrat','C6H8O7','C6H5O7',1,'#F6F6F6'),
('Benzoic Acid','Asam Benzoat','C6H5COOH','C6H5COO',1,'#F6F6F6'),('Lactic Acid','Asam Laktat','C3H6O3','C3H5O3',1,'#F2EEE0'),('Salicylic Acid','Asam Salisilat','C7H6O3','C7H5O3',2,'#F6F6F6'),('Chromic Acid','Asam Kromat','H2CrO4','CrO4',4,'#E5A800'),
('Permanganic Acid','Asam Permanganat','HMnO4','MnO4',4,'#8B1FA9'),('Silicic Acid','Asam Silikat','H2SiO3','SiO3',0,'#F2F2F2'),('Thiocyanic Acid','Asam Tiosianat','HSCN','SCN',2,'#EAF7FA'),('Succinic Acid','Asam Suksinat','C4H6O4','C4H4O4',1,'#F6F6F6'),('Malonic Acid','Asam Malonat','C3H4O4','C3H2O4',1,'#F6F6F6'),('Gluconic Acid','Asam Glukonat','C6H12O7','C6H11O7',0,'#F2EEE0')]
for e,i,f,a,h,c in ACIDS:add(e,i,f,'chem/acid','acid dehydrating' if f=='H2SO4' else 'acid',h,c,'H:'+a)
# ---------- larutan 0,1 M & 1 M ----------
sol=[m for m in L if m[2] in('chem/acid',) or m[1] in('NaOH','KOH','Ca(OH)2','Ba(OH)2','LiOH','NaCl','KCl','NaNO3','AgNO3','CuSO4','Na2CO3','NaHCO3','BaCl2','CaCl2','KI','FeCl3','KMnO4','Na2SO4','ZnSO4','MgSO4','NaBr','KBr','Pb(NO3)2','CuCl2','FeSO4','NH4Cl','K2CrO4','K2Cr2O7','Na2S2O3','NaClO','Al2(SO4)3','NiSO4','CoCl2','KSCN','Na3PO4','CH3COONa','Na2C2O4','(NH4)2SO4','KNO3','NH4OH')]
for m in sol:
    for c,ce in(('0,1','0.1'),('1','1')):
        add(f"{m[7]} {ce} M Solution",f"Larutan {m[6]} {c} M",m[1]+'(aq)',m[2],m[3],m[4],m[5],m[8])
# ---------- organik ----------
P="meth eth prop but pent hex hept oct non dec undec dodec tridec tetradec pentadec hexadec heptadec octadec nonadec eicos heneicos docos tricos tetracos".split()
Q="Met Et Prop But Pent Heks Hept Okt Non Dek Undek Dodek Tridek Tetradek Pentadek Heksadek Heptadek Oktadek Nonadek Eikos Heneikos Dokos Trikos Tetrakos".split()
cap=lambda s:s.capitalize()
OC='#EAF7FA'
for n in range(1,25):
    add(cap(P[n-1])+'ane',Q[n-1]+'ana',Cn(n)+f'H{2*n+2}','chem/organic','flammable hydrocarbon',2 if n<=8 else 1,OC)
    if 2<=n<=24:
        add(cap(P[n-1])+'ene',Q[n-1]+'ena',Cn(n)+f'H{2*n}','chem/organic','flammable hydrocarbon',2 if n<=8 else 1,OC)
        add(cap(P[n-1])+'yne',Q[n-1]+'una',Cn(n)+f'H{2*n-2}','chem/organic','flammable hydrocarbon',2 if n<=6 else 1,OC)
    add(cap(P[n-1])+'anol',Q[n-1]+'anol',Cn(n)+f'H{2*n+1}OH','chem/organic','flammable',3 if n==1 else (2 if n<=8 else 1),OC)
    if n<=24:add(cap(P[n-1])+'anal',Q[n-1]+'anal',Cn(n)+f'H{2*n-1}CHO'.replace('CH0','CHO') if False else Cn(n)+f'H{2*n}O','chem/organic','flammable',3 if n<=3 else 1,OC)
    if 3<=n<=24:add(cap(P[n-1])+'anone',Q[n-1]+'anon',Cn(n)+f'H{2*n}O','chem/organic','flammable',2,OC)
    add(cap(P[n-1])+'anoic Acid','Asam '+Q[n-1]+'anoat',Cn(n)+f'H{2*n}O2','chem/acid','acid',3 if n<=2 else (2 if n<=6 else 1),'#F6F6F0')
    if n<=24:add(cap(P[n-1])+'ylamine',Q[n-1]+'ilamina',Cn(n)+f'H{2*n+3}N','chem/organic','base flammable',2,OC)
    if 2<=n<=14:add(cap(P[n-1])+'anamide',Q[n-1]+'anamida',Cn(n)+f'H{2*n+1}NO','chem/organic','organic',1,'#F6F6F6')
    if 2<=n<=12:add(cap(P[n-1])+'anenitrile',Q[n-1]+'anitril',Cn(n)+f'H{2*n-1}N','chem/organic','flammable',3,OC)
    if n<=12:
        for X,Xi,s in(('Chloro','Kloro','Cl'),('Bromo','Bromo','Br'),('Iodo','Iodo','I')):
            add(X+P[n-1]+'ane',Xi+Q[n-1].lower()+'ana',Cn(n)+f'H{2*n+1}'+s,'chem/organic','organic',2,OC)
        add(cap(P[n-1])+'anethiol',Q[n-1]+'anatiol',Cn(n)+f'H{2*n+1}SH','chem/organic','flammable',2,'#F4F0C0')
    if n<=8:add('Di'+P[n-1]+'yl Ether','Di'+Q[n-1].lower()+'il Eter',Cn(2*n)+f'H{4*n+2}O','chem/organic','flammable',3 if n<=4 else 2,OC)
    if 3<=n<=12:add('Cyclo'+P[n-1]+'ane','Siklo'+Q[n-1].lower()+'ana',Cn(n)+f'H{2*n}','chem/organic','flammable hydrocarbon',2,OC)
    if 2<=n<=10:add(cap(P[n-1])+'anedioic Acid','Asam '+Q[n-1]+'andioat',Cn(n)+f'H{2*n-2}O4','chem/acid','acid',1,'#F6F6F6')
    if 2<=n<=12:add(cap(P[n-1])+'ane-1,2-diol',Q[n-1]+'ana-1,2-diol',Cn(n)+f'H{2*n+2}O2','chem/organic','flammable',1,OC)
for a in range(1,11):
    for b in range(1,11):
        add(f"{cap(P[b-1])}yl {P[a-1]}anoate",f"{Q[b-1]}il {Q[a-1].lower()}anoat",Cn(a+b)+f'H{2*(a+b)}O2','chem/organic','flammable',2,OC)
for n in range(1,17):
    add(f"{cap(P[n-1])}yl Acetate",f"{Q[n-1]}il Asetat",Cn(n+2)+f'H{2*n+4}O2','chem/organic','flammable',2,OC)
# ---------- daftar manual ----------
TXT="""Distilled Water|Air Suling|H2O|chem/solvent|water|0|#8FDDF0
Tap Water|Air Keran|H2O|chem/solvent|water|0|#A5DCEB
Seawater|Air Laut|H2O(NaCl)|chem/solvent|water|0|#6EC6D9
Heavy Water|Air Berat|D2O|chem/solvent|water|0|#8FDDF0
Hydrogen Peroxide|Hidrogen Peroksida|H2O2|chem/solvent|peroxide oxidizer|2|#E6F8FF
Manganese(IV) Oxide|Mangan(IV) Oksida|MnO2|chem/oxide|catalyst|1|#3A3A3A
Ammonia|Amonia|NH3|chem/base|base|3|#EAF7FA
Acetone|Aseton|C3H6O|chem/solvent|flammable|2|#EAF7FA
Isopropanol|Isopropanol|C3H7OH|chem/solvent|flammable|2|#EAF7FA
Chloroform|Kloroform|CHCl3|chem/solvent|organic|3|#EAF7FA
Dichloromethane|Diklorometana|CH2Cl2|chem/solvent|organic|3|#EAF7FA
Carbon Tetrachloride|Karbon Tetraklorida|CCl4|chem/solvent|organic|3|#EAF7FA
Ethyl Acetate|Etil Asetat|C4H8O2|chem/solvent|flammable|2|#EAF7FA
DMSO|DMSO|C2H6OS|chem/solvent|organic|1|#EAF7FA
Glycerol|Gliserol|C3H8O3|chem/solvent|flammable|0|#F2F6E8
Ethylene Glycol|Etilena Glikol|C2H6O2|chem/solvent|flammable|2|#EAF7FA
Tetrahydrofuran|Tetrahidrofuran|C4H8O|chem/solvent|flammable|3|#EAF7FA
Benzene|Benzena|C6H6|chem/organic|flammable|3|#EAF7FA
Toluene|Toluena|C7H8|chem/organic|flammable|2|#EAF7FA
Xylene|Xilena|C8H10|chem/organic|flammable|2|#EAF7FA
Phenol|Fenol|C6H5OH|chem/organic|acid|3|#F4E8E8
Aniline|Anilina|C6H5NH2|chem/organic|base|3|#F4E8C8
Naphthalene|Naftalena|C10H8|chem/organic|flammable|2|#F6F6F6
Styrene|Stirena|C8H8|chem/organic|flammable|2|#EAF7FA
Benzaldehyde|Benzaldehida|C7H6O|chem/organic|flammable|1|#F4F0C8
Nitrobenzene|Nitrobenzena|C6H5NO2|chem/organic|organic|3|#F4E8A0
Pyridine|Piridina|C5H5N|chem/organic|base flammable|3|#EAF7FA
Sucrose|Sukrosa|C12H22O11|bio/sugar|sugar|0|#F6F6F0
Glucose|Glukosa|C6H12O6|bio/sugar|sugar|0|#F6F6F0
Fructose|Fruktosa|C6H12O6|bio/sugar|sugar|0|#F6F6F0
Galactose|Galaktosa|C6H12O6|bio/sugar|sugar|0|#F6F6F0
Lactose|Laktosa|C12H22O11|bio/sugar|sugar|0|#F6F6F0
Maltose|Maltosa|C12H22O11|bio/sugar|sugar|0|#F6F6F0
Ribose|Ribosa|C5H10O5|bio/sugar|sugar|0|#F6F6F0
Starch|Pati|(C6H10O5)n|bio/sugar|sugar|0|#F6F6F0
Cellulose|Selulosa|(C6H10O5)n|bio/sugar|sugar|0|#F6F6F0
Glycogen|Glikogen|(C6H10O5)n|bio/sugar|sugar|0|#F6F6F0
Ascorbic Acid (Vitamin C)|Asam Askorbat (Vitamin C)|C6H8O6|bio/vitamin|acid|0|#F6F6E0
Retinol (Vitamin A)|Retinol (Vitamin A)|C20H30O|bio/vitamin|organic|1|#F4E070
Thiamine (Vitamin B1)|Tiamin (Vitamin B1)|C12H17N4OS|bio/vitamin|organic|0|#F6F6F0
Riboflavin (Vitamin B2)|Riboflavin (Vitamin B2)|C17H20N4O6|bio/vitamin|organic|0|#E8D800
Niacin (Vitamin B3)|Niasin (Vitamin B3)|C6H5NO2|bio/vitamin|acid|0|#F6F6F0
Cobalamin (Vitamin B12)|Kobalamin (Vitamin B12)|C63H88CoN14O14P|bio/vitamin|organic|0|#C03050
Cholecalciferol (Vitamin D3)|Kolekalsiferol (Vitamin D3)|C27H44O|bio/vitamin|organic|0|#F6F6F0
Tocopherol (Vitamin E)|Tokoferol (Vitamin E)|C29H50O2|bio/vitamin|organic|0|#F4E8A0
Yeast|Ragi|Saccharomyces|bio/culture|catalyst|0|#E8D8A8
Catalase|Katalase|enzim|bio/enzyme|catalyst|0|#F0E0C0
Amylase|Amilase|enzim|bio/enzyme|organic|0|#F0F0E0
Pepsin|Pepsin|enzim|bio/enzyme|organic|0|#F0F0E0
Trypsin|Tripsin|enzim|bio/enzyme|organic|0|#F0F0E0
Agar|Agar|(C12H18O9)n|bio/culture|organic|0|#F2E8C8
Nutrient Broth|Kaldu Nutrien|campuran|bio/culture|organic|0|#E8C888
Gelatin|Gelatin|protein|bio/protein|organic|0|#F4E8C8
Albumin|Albumin|protein|bio/protein|organic|0|#F8F4E0
Hemoglobin|Hemoglobin|protein|bio/protein|organic|0|#B01C2E
Chlorophyll|Klorofil|C55H72MgN4O5|bio/pigment|organic|0|#2E8B2E
DNA|DNA|(C10H12N5O6P)n|bio/protein|organic|0|#F0F0FA
Collagen|Kolagen|protein|bio/protein|organic|0|#F6F0E0
Casein|Kasein|protein|bio/protein|organic|0|#F8F8F0
Lugol's Iodine|Iodium Lugol|I2/KI|chem/indicator|indicator|2|#8B4A1D
Benedict's Reagent|Pereaksi Benedict|campuran|chem/indicator|indicator|1|#3A8FE0
Biuret Reagent|Pereaksi Biuret|campuran|chem/indicator|indicator|2|#4A9FE8
Methylene Blue|Metilen Biru|C16H18ClN3S|chem/indicator|stain|1|#1F4FD8
Crystal Violet|Kristal Violet|C25H30ClN3|chem/indicator|stain|2|#5B2A9E
Safranin|Safranin|C20H19ClN4|chem/indicator|stain|1|#D02850
Eosin|Eosin|C20H8Br4O5|chem/indicator|stain|1|#E8407A
Phenolphthalein|Fenolftalein|C20H14O4|chem/indicator|indicator|1|#F4FBFC
Methyl Orange|Metil Jingga|C14H14N3NaO3S|chem/indicator|indicator|2|#FF9A2E
Methyl Red|Metil Merah|C15H15N3O2|chem/indicator|indicator|2|#E03030
Bromothymol Blue|Bromotimol Biru|C27H28Br2O5S|chem/indicator|indicator|1|#48B060
Litmus|Lakmus|campuran|chem/indicator|indicator|0|#8A4FB0
Universal Indicator|Indikator Universal|campuran|chem/indicator|indicator|1|#6CC05A
Phenol Red|Fenol Merah|C19H14O5S|chem/indicator|indicator|1|#F0603A
Thymol Blue|Timol Biru|C27H30O5S|chem/indicator|indicator|1|#E8C830
Congo Red|Kongo Merah|C32H22N6Na2O6S2|chem/indicator|indicator|2|#C02020
Carbon Dioxide|Karbon Dioksida|CO2|chem/gas|inert|1|#EEEEEE
Carbon Monoxide|Karbon Monoksida|CO|chem/gas|flammable|4|#EEEEEE
Methane Gas|Gas Metana|CH4|chem/gas|flammable|2|#EEEEEE
Sulfur Dioxide|Belerang Dioksida|SO2|chem/gas|acid|3|#EEEEEE
Nitrogen Dioxide|Nitrogen Dioksida|NO2|chem/gas|oxidizer|4|#C86A2A
Hydrogen Sulfide|Hidrogen Sulfida|H2S|chem/gas|acid|4|#EEEEEE
Ozone|Ozon|O3|chem/gas|oxidizer|3|#C8E8F8
Steam|Uap Air|H2O|chem/gas|water|1|#F4F4F4
Dry Ice|Es Kering|CO2|chem/gas|inert|2|#F0F4F6
Liquid Nitrogen|Nitrogen Cair|N2|chem/gas|inert|3|#E8F4FA
Liquid Helium|Helium Cair|He|chem/gas|inert|2|#F0F8FF
Steel|Baja|Fe-C|phys/alloy|metal|0|#8A9096
Stainless Steel|Baja Tahan Karat|Fe-Cr-Ni|phys/alloy|metal|0|#B8BEC4
Brass|Kuningan|Cu-Zn|phys/alloy|metal|0|#D8B050
Bronze|Perunggu|Cu-Sn|phys/alloy|metal|0|#B88838
Solder|Solder|Sn-Pb|phys/alloy|metal|2|#A8AEB4
Duralumin|Duralumin|Al-Cu|phys/alloy|metal|0|#C4CAD0
Nichrome|Nikrom|Ni-Cr|phys/alloy|metal|0|#9AA0A6
Graphite|Grafit|C|phys/material|nonmetal|0|#3A3A40
Diamond|Berlian|C|phys/material|inert|0|#E8F4FF
Quartz Glass|Kaca Kuarsa|SiO2|phys/material|inert|0|#E6F4F8
Borosilicate Glass|Kaca Borosilikat|SiO2-B2O3|phys/material|inert|0|#E6F4F8
Natural Rubber|Karet Alam|(C5H8)n|phys/material|flammable|0|#4A4038
Polyethylene|Polietilena|(C2H4)n|phys/material|flammable|0|#F4F4F4
PVC|PVC|(C2H3Cl)n|phys/material|flammable|1|#F0F0F0
PTFE (Teflon)|PTFE (Teflon)|(C2F4)n|phys/material|inert|0|#FAFAFA
Nylon|Nilon|(C12H22N2O2)n|phys/material|flammable|0|#F4F4EC
Polystyrene|Polistirena|(C8H8)n|phys/material|flammable|0|#F8F8F8
Silicon Wafer|Wafer Silikon|Si|phys/semiconductor|inert|0|#6B7280
Gallium Arsenide|Galium Arsenida|GaAs|phys/semiconductor|inert|3|#5A5F66
Neodymium Magnet|Magnet Neodimium|Nd2Fe14B|phys/magnet|metal|0|#8C9298
Mineral Oil|Minyak Mineral|campuran|phys/fluid|flammable|1|#F4EEC8
Vegetable Oil|Minyak Sayur|campuran|phys/fluid|flammable|0|#F2D860
Paraffin Wax|Lilin Parafin|CnH2n+2|phys/material|flammable|0|#F8F4E0
Epoxy Resin|Resin Epoksi|polimer|phys/material|flammable|1|#E8EEF2
Aerogel|Aerogel|SiO2|phys/material|inert|0|#DCE8F4
Carbon Fiber|Serat Karbon|C|phys/material|inert|0|#2A2A2E
Calcite|Kalsit|CaCO3|phys/mineral|carbonate|0|#F4F0E4
Quartz|Kuarsa|SiO2|phys/mineral|inert|0|#EEE8F0
Halite|Halit|NaCl|phys/mineral|salt|0|#F4F4F4
Gypsum|Gipsum|CaSO4·2H2O|phys/mineral|salt|0|#F8F8F4
Pyrite|Pirit|FeS2|phys/mineral|metal|1|#D8C040
Galena|Galena|PbS|phys/mineral|metal|2|#6E7480
Hematite|Hematit|Fe2O3|phys/mineral|oxide|0|#8A3A28
Magnetite|Magnetit|Fe3O4|phys/mineral|oxide|0|#2A2A2E
Malachite|Malakit|Cu2CO3(OH)2|phys/mineral|carbonate|1|#2E9E6E
Azurite|Azurit|Cu3(CO3)2(OH)2|phys/mineral|carbonate|1|#2A4FC0
Fluorite|Fluorit|CaF2|phys/mineral|salt|0|#A8D8C8
Apatite|Apatit|Ca5(PO4)3F|phys/mineral|salt|0|#6AC0A0
Talc|Talek|Mg3Si4O10(OH)2|phys/mineral|inert|0|#E8F0E8
Mica|Mika|KAl2(AlSi3O10)(OH)2|phys/mineral|inert|0|#C8C0B0
Feldspar|Feldspar|KAlSi3O8|phys/mineral|inert|0|#E8B8A0
Olivine|Olivin|(Mg,Fe)2SiO4|phys/mineral|inert|0|#8AB040
Bauxite|Bauksit|Al(OH)3|phys/mineral|oxide|0|#B87858
Cinnabar|Sinabar|HgS|phys/mineral|metal|4|#C02828
Sphalerite|Sfalerit|ZnS|phys/mineral|metal|1|#8A7A50
Chalcopyrite|Kalkopirit|CuFeS2|phys/mineral|metal|1|#C8B038"""
AMI="Glycine Glisin C2H5NO2|Alanine Alanin C3H7NO2|Valine Valin C5H11NO2|Leucine Leusin C6H13NO2|Isoleucine Isoleusin C6H13NO2|Proline Prolin C5H9NO2|Phenylalanine Fenilalanin C9H11NO2|Tryptophan Triptofan C11H12N2O2|Methionine Metionin C5H11NO2S|Serine Serin C3H7NO3|Threonine Treonin C4H9NO3|Cysteine Sistein C3H7NO2S|Tyrosine Tirosin C9H11NO3|Asparagine Asparagin C4H8N2O3|Glutamine Glutamin C5H10N2O3|Aspartic_Acid Asam_Aspartat C4H7NO4|Glutamic_Acid Asam_Glutamat C5H9NO4|Lysine Lisin C6H14N2O2|Arginine Arginin C6H14N4O2|Histidine Histidin C6H9N3O2"
for l in TXT.split('\n'):
    e,i,f,c,t,h,col=l.split('|');add(e,i,f,c,t,int(h),col)
for a in AMI.split('|'):
    e,i,f=a.split();add(e.replace('_',' '),i.replace('_',' '),f,'bio/amino','amino',0,'#F6F6F0')
print(len(L),len({m[0] for m in L}))
ps=sorted({m[2].split('/')[0] for m in L});print(ps)
out="const RAW="+json.dumps(L,ensure_ascii=False,separators=(',',':'))+";\nconst MATS=RAW.map(a=>({code:a[0],f:a[1],cat:a[2],cls:a[3],hz:a[4],col:a[5],id:a[6],en:a[7],x:a[8]}));\nconst M=Object.fromEntries(MATS.map(m=>[m.code,m]));\n"
open('materials.js','w').write(out);print(len(out))
for m in L[118:125]+L[400:403]+[x for x in L if x[1]in('Al2(SO4)3','Ca(OH)2','(NH4)2SO4','CuSO4','AgNO3','KMnO4','HCl','C2H5OH')][:10]:print(m[:8])
