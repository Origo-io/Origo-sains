// Tambah bahan: tambahkan baris di RAW. [kode,rumus,kategori,kelas_reaksi,bahaya(0-4),warna,nama_id,nama_en]
const RAW=[
["hcl","HCl","chem/acid","acid",3,"#CFF3F8","Asam Klorida","Hydrochloric Acid"],
["h2so4","H2SO4","chem/acid","acid",4,"#F6F0B0","Asam Sulfat","Sulfuric Acid"],
["hno3","HNO3","chem/acid","acid",4,"#F8EFA0","Asam Nitrat","Nitric Acid"],
["naoh","NaOH","chem/base","base",3,"#D8EEF2","Natrium Hidroksida","Sodium Hydroxide"],
["koh","KOH","chem/base","base",3,"#D8EEF2","Kalium Hidroksida","Potassium Hydroxide"],
["nahco3","NaHCO3","chem/base","carbonate",0,"#E4F4F6","Natrium Bikarbonat","Baking Soda"],
["caco3","CaCO3","chem/salt","carbonate",0,"#EEEEEE","Kalsium Karbonat","Calcium Carbonate"],
["h2o","H2O","chem/solvent","water",0,"#8FDDF0","Air Suling","Distilled Water"],
["ethanol","C2H5OH","chem/solvent","flammable",2,"#BDEFF5","Etanol","Ethanol"],
["cuso4","CuSO4","chem/salt","salt",2,"#2E8BFF","Tembaga(II) Sulfat","Copper(II) Sulfate"],
["nacl","NaCl","chem/salt","salt",0,"#E8E8E8","Natrium Klorida","Sodium Chloride"],
["agno3","AgNO3","chem/salt","silver_salt",3,"#DADADA","Perak Nitrat","Silver Nitrate"],
["phenol","C20H14O4","chem/indicator","indicator",1,"#E3F7FA","Fenolftalein","Phenolphthalein"],
["kmno4","KMnO4","chem/salt","oxidizer",3,"#8B1FA9","Kalium Permanganat","Potassium Permanganate"],
["zn","Zn","phys/metal","metal",1,"#9AA5AD","Seng","Zinc"],
["mg","Mg","phys/metal","metal",1,"#B8C0C6","Magnesium","Magnesium"],
["hg","Hg","phys/metal","metal",4,"#C0C0C0","Raksa","Mercury"],
["glucose","C6H12O6","bio/sugar","sugar",0,"#F2F2E6","Glukosa","Glucose"]];
const MATS=RAW.map(a=>({code:a[0],f:a[1],cat:a[2],cls:a[3],hz:a[4],col:a[5],id:a[6],en:a[7]}));
const M=Object.fromEntries(MATS.map(m=>[m.code,m]));
// Aturan per KELAS: [kelasA,kelasB,panas,warna,gelembung,kunci_pesan]
const RULES=[
["acid","base",18,"#E6FBFF",0,"neutralize"],["acid","carbonate",-2,"#F4FFFF",1,"fizz"],
["acid","water",8,"",0,"dilute"],["base","water",6,"",0,"dissolve"],
["silver_salt","salt",0,"#FAFAFA",0,"precipitate"],["indicator","base",0,"#FF2D95",0,"colorchange"],
["acid","metal",12,"",1,"smoke"]];
const I18N={
id:{title:"Origo Sains",sub:"Simulasi Laboratorium 3D",enter:"Masuk Lab",book:"Buku Indeks",search:"Cari bahan...",all:"Semua",letter:"Abjad",
cat:"Jenis zat",hz:"Bahaya",fetch:"Ambil",prev:"‹",next:"›",open:"Buka",close:"Tutup",place:"Letakkan",pick:"Ambil",act:"Aksi",pour:"Tuang",
hint:"Geser layar = melihat · Joystick = jalan · Aksi = buka/ambil/letakkan · Tuang = tuang isi ke wadah yang dibidik",
hand_empty:"Tangan kosong",aim:"Bidik wadah gelas",full:"Wadah penuh",empty:"Wadah kosong",no_slot:"Tidak ada tempat kosong",fetched:"Diambil: ",
tube:"Tabung Reaksi",beaker:"Gelas Beaker",erlen:"Erlenmeyer",petri:"Cawan Petri",pipette:"Pipet",bottle:"Botol",
c_chem:"Kimia",c_acid:"Asam",c_base:"Basa",c_salt:"Garam",c_solvent:"Pelarut",c_ind:"Indikator",c_bio:"Biologi",c_phys:"Fisika",
neutralize:"Netralisasi: panas dilepaskan.",fizz:"Gelembung gas terbentuk!",dilute:"Larutan diencerkan.",dissolve:"Zat larut.",
precipitate:"Endapan terbentuk.",colorchange:"Warna berubah!",smoke:"Asap & gas keluar. Hati-hati!",gc:"Lemari Gelas",cc:"Lemari Bahan"},
en:{title:"Origo Sains",sub:"3D Laboratory Simulator",enter:"Enter Lab",book:"Index Book",search:"Search materials...",all:"All",letter:"Alphabet",
cat:"Substance type",hz:"Hazard",fetch:"Fetch",prev:"‹",next:"›",open:"Open",close:"Close",place:"Place",pick:"Pick up",act:"Action",pour:"Pour",
hint:"Drag = look · Joystick = move · Action = open/pick/place · Pour = pour into the vessel you aim at",
hand_empty:"Hands empty",aim:"Aim at a glass vessel",full:"Vessel is full",empty:"Vessel is empty",no_slot:"No free slot",fetched:"Fetched: ",
tube:"Test Tube",beaker:"Beaker",erlen:"Erlenmeyer",petri:"Petri Dish",pipette:"Pipette",bottle:"Bottle",
c_chem:"Chemistry",c_acid:"Acid",c_base:"Base",c_salt:"Salt",c_solvent:"Solvent",c_ind:"Indicator",c_bio:"Biology",c_phys:"Physics",
neutralize:"Neutralization: heat released.",fizz:"Gas bubbles form!",dilute:"Solution diluted.",dissolve:"Substance dissolves.",
precipitate:"A precipitate forms.",colorchange:"Color changes!",smoke:"Smoke & gas released. Be careful!",gc:"Glassware Cabinet",cc:"Chemical Cabinet"}};
