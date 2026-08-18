import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getDatabase, ref, get, set, update, remove } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js';
import { firebaseConfig, ADMIN_USERNAME, ADMIN_AUTH_EMAIL } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const $ = id => document.getElementById(id);
let selectedDate = null;
let calCursor = new Date();

function toast(msg,bad=false){const t=$('toast');t.textContent=msg;t.className=bad?'bad':'show';clearTimeout(window.__t);window.__t=setTimeout(()=>{t.className='';},2800)}
function msg(id,text,bad=false){$(id).textContent=text;$(id).className='msg '+(bad?'bad':'ok')}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function adminGuard(){ if(!auth.currentUser){toast('Sesi admin tidak valid',true);throw new Error('unauthorized')} }

async function login(){
  const u=$('loginUser').value.trim(), p=$('loginPass').value;
  if(u!==ADMIN_USERNAME){msg('loginMsg','Username admin salah.',true);return}
  try{await signInWithEmailAndPassword(auth,ADMIN_AUTH_EMAIL,p);msg('loginMsg','Berhasil masuk.');}
  catch(e){msg('loginMsg',e.message||'Login gagal.',true)}
}
async function logout(){await signOut(auth)}

function showPage(id){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));$(id).classList.remove('hidden');document.querySelectorAll('.nav[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===id));$('pageTitle').textContent={dashboard:'Dashboard',register:'Register Akun',premium:'Premium'}[id]||'Dashboard';if(id==='dashboard')loadStats();if(id==='premium')loadPremium()}

async function usersData(){adminGuard();const s=await get(ref(db,'users'));return s.exists()?s.val():{}}
async function loadStats(){try{const users=await usersData();let premium=0;const now=Date.now();for(const u of Object.values(users)){if(u?.premium && ((Number(u.premiumExpiresAt)||0)===0 || Number(u.premiumExpiresAt)>now))premium++} $('totalUsers').textContent=Object.keys(users).length;$('totalPremium').textContent=premium}catch(e){toast(e.message,true)}}

async function registerUser(){
 const username=$('regUsername').value.trim(), displayName=$('regDisplay').value.trim()||username, password=$('regPassword').value, nodeId=$('regNode').value.trim();
 if(!username||!password){msg('registerMsg','Username dan password wajib.',true);return}
 try{const users=await usersData();if(users[username])throw Error('Username sudah ada.');for(const [k,u] of Object.entries(users)){if(nodeId&&String(u?.userWajib||'')===nodeId)throw Error(`Node ID sudah dipakai @${k}`)}
  await set(ref(db,`users/${username}`),{username,displayName,userWajib:nodeId,password,role:'user',premium:false,premiumExpiresAt:0,banned:false,banExpiresAt:0});
  await audit('REGISTER_USER',username,'Registered account from GitHub Pages admin panel');
  ['regUsername','regDisplay','regPassword','regNode'].forEach(x=>$(x).value='');msg('registerMsg','Akun berhasil dibuat.');toast('Akun berhasil dibuat');loadStats();
 }catch(e){msg('registerMsg',e.message,true);toast(e.message,true)}
}

async function findUser(target){const users=await usersData();for(const [uname,u] of Object.entries(users)){if(uname===target||String(u?.userWajib||'')===target)return [uname,u]}return [null,null]}
async function setPremium(){
 const target=$('premTarget').value.trim(), date=$('premDate').value, time=$('premTime').value||'23:59'; if(!target||!date){msg('premiumMsg','Isi akun dan pilih tanggal.',true);return}
 try{const [uname,u]=await findUser(target);if(!u)throw Error('Pengguna tidak ditemukan.');const [Y,M,D]=date.split('-').map(Number),[h,m]=time.split(':').map(Number);const exp=new Date(Y,M-1,D,h,m,0,0);if(exp.getTime()<=Date.now())throw Error('Expired harus di masa depan.');
  await update(ref(db,`users/${uname}`),{premium:true,premiumExpiresAt:exp.getTime(),role:u.role==='user'?'premium':u.role});await audit('SET_PREMIUM',uname,`Premium expiry: ${exp.toISOString()}`);msg('premiumMsg',`Premium @${uname} aktif sampai ${formatDate(exp.getTime())}`);toast('Premium berhasil diaktifkan');loadPremium();loadStats();
 }catch(e){msg('premiumMsg',e.message,true);toast(e.message,true)}
}

function formatDate(ms){return new Intl.DateTimeFormat('id-ID',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ms))}
async function loadPremium(){try{const users=await usersData(),now=Date.now(),items=[];for(const [uname,u] of Object.entries(users)){if(!u?.premium)continue;const exp=Number(u.premiumExpiresAt)||0;if(exp===0||exp>now)items.push({username:uname,displayName:u.displayName||uname,nodeId:u.userWajib||'',expiresAt:exp,lifetime:exp===0})}items.sort((a,b)=>a.lifetime?-1:b.lifetime?1:a.expiresAt-b.expiresAt);const wrap=$('premiumList');if(!items.length){wrap.innerHTML='<div class="empty">Belum ada premium aktif.</div>';return}wrap.innerHTML=items.map(x=>`<div class="pRow"><div class="avatar">${esc((x.displayName||x.username)[0].toUpperCase())}</div><div class="pMain"><b>@${esc(x.username)}</b><span>${esc(x.displayName)} · ${esc(x.nodeId||'No Node ID')}</span><small>${x.lifetime?'Lifetime':'Expired: '+esc(formatDate(x.expiresAt))}</small></div><button class="danger" data-user="${esc(x.username)}">Hapus</button></div>`).join('');wrap.querySelectorAll('.danger').forEach(b=>b.onclick=()=>deletePremium(b.dataset.user));}catch(e){toast(e.message,true)}}
async function deletePremium(username){if(!confirm(`Hapus permanen akun @${username}?`))return;try{const [uname,u]=await findUser(username);if(!u||!u.premium)throw Error('Akun premium tidak ditemukan.');await remove(ref(db,`users/${uname}`));await audit('DELETE_PREMIUM_USER',uname,'Permanently deleted premium account from GitHub Pages admin panel');toast('Akun dihapus permanen');loadPremium();loadStats()}catch(e){toast(e.message,true)}}
async function audit(action,target,detail){const id=`log_${Date.now()}`;await set(ref(db,`adminLogs/${id}`),{action,operator:`web:${auth.currentUser?.uid||'unknown'}`,target,detail,timestamp:Date.now()})}

function renderCalendar(){
 const y=calCursor.getFullYear(),m=calCursor.getMonth();$('monthLabel').textContent=new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric'}).format(calCursor);const grid=$('calendar');grid.innerHTML='';const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();for(let i=0;i<first;i++){const e=document.createElement('span');e.className='day blank';grid.appendChild(e)}for(let d=1;d<=days;d++){const b=document.createElement('button');b.className='day';b.textContent=d;const dt=new Date(y,m,d);const today=new Date();if(dt.toDateString()===today.toDateString())b.classList.add('today');if(selectedDate&&dt.toDateString()===selectedDate.toDateString())b.classList.add('selected');b.onclick=()=>{selectedDate=dt;$('premDate').value=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;renderCalendar()};grid.appendChild(b)}}
$('prevMonth').onclick=()=>{calCursor.setMonth(calCursor.getMonth()-1);renderCalendar()};$('nextMonth').onclick=()=>{calCursor.setMonth(calCursor.getMonth()+1);renderCalendar()};
$('loginBtn').onclick=login;$('loginPass').onkeydown=e=>{if(e.key==='Enter')login()};$('logoutBtn').onclick=logout;$('registerBtn').onclick=registerUser;$('premiumBtn').onclick=setPremium;$('refreshPremium').onclick=loadPremium;document.querySelectorAll('.nav[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page));renderCalendar();

onAuthStateChanged(auth,user=>{if(user){$('login').classList.add('hidden');$('app').classList.remove('hidden');$('who').textContent=ADMIN_USERNAME;showPage('dashboard');}else{$('login').classList.remove('hidden');$('app').classList.add('hidden')}});
