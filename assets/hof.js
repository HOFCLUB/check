// HOF shared script (v5.5): API calls, badges, ranks and the card designs. Used by the card, team, PIN and print pages.
var API_URL = 'https://script.google.com/macros/s/AKfycbzHBD01gUyM6oNEaT3wwxbyH5_n4590y8AdHduJ-TRCKZXuKxFt-5qaOXFMQ6krSAFNVQ/exec';
var CHECK_PAGE = 'https://hofclub.github.io/check/';
var BASE = (function () { var s = document.currentScript && document.currentScript.src || ''; return s.replace(/assets\/hof\.js.*$/, ''); })();
var FLAME = BASE + 'assets/flame-white.png', WM = BASE + 'assets/wordmark-chrome.png';
// POST keeps PINs and passwords out of links. Plain text avoids a CORS preflight.
// The button that started a request shows a spinner until it finishes, so every tap gets a visible response.
var HOF_LASTBTN = null;
document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button'); HOF_LASTBTN = b; setTimeout(function () { if (HOF_LASTBTN === b) HOF_LASTBTN = null; }, 0); }, true);
function hofApi(action, data) {
  var body = Object.assign({ action: action }, data || {});
  var btn = HOF_LASTBTN && !HOF_LASTBTN.closest('.acts') ? HOF_LASTBTN : null;
  if (btn) btn.classList.add('hofbusy');
  var done = function () { if (btn) btn.classList.remove('hofbusy'); };
  return fetch(API_URL, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
    .then(function (r) { return r.json(); })
    .then(function (d) { done(); if (!d || !d.ok) throw new Error((d && d.error) || 'Something went wrong. Please try again.'); return d; }, function (e) { done(); throw e; });
}
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
const $ = id => document.getElementById(id);
const R='#E8382A',C='#C9CED6';
const ROM=['I','II','III','IV','V','VI','VII'];const TIERS={b:3,i:5,a:7,h:0};
const RANKS=[...[1,2,3].map(t=>['b',t,'Beginner '+ROM[t-1]]),...[1,2,3,4,5].map(t=>['i',t,'Intermediate '+ROM[t-1]]),...[1,2,3,4,5,6,7].map(t=>['a',t,'Advanced '+ROM[t-1]]),['h',0,'Heart of Fire']];
const LAD={sprint:'Sprint',middle:'Middle distance',long:'Long distance'};
const LADSHORT={sprint:'SPRINT',middle:'MIDDLE',long:'LONG'};
const ring=(t,col=C)=>`<circle cx="17" cy="17" r="14" fill="none" stroke="${col}" stroke-width="3"/><text x="17" y="21.5" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="${t.length>2?10:12}" fill="#fff">${t}</text>`;
const medal=(n,fill,stroke)=>`<path d="M10 2l4 9M24 2l-4 9" stroke="${C}" stroke-width="2.5"/><circle cx="17" cy="21" r="11" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><text x="17" y="25.5" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="12" fill="${fill===C?'#0B0B0B':'#fff'}">${n}</text>`;
const ICON={
 first_session:`<path d="M9 30V6l18 7-18 7" fill="none" stroke="${C}" stroke-width="3" stroke-linejoin="round"/>`,
 s10:ring('10'),s25:ring('25'),s50:ring('50',R),s100:ring('100',R),
 full_month:`<rect x="4" y="6" width="26" height="24" rx="4" fill="none" stroke="${C}" stroke-width="3"/><path d="M11 18l4 4 8-8" stroke="${R}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
 three_full:`<rect x="3" y="9" width="18" height="18" rx="3" fill="none" stroke="#5b6068" stroke-width="2.5"/><rect x="8" y="6" width="18" height="18" rx="3" fill="#0B0B0B" stroke="#8a8f96" stroke-width="2.5"/><rect x="13" y="3" width="18" height="18" rx="3" fill="#0B0B0B" stroke="${C}" stroke-width="2.5"/><path d="M17 12l3 3 6-6" stroke="${R}" stroke-width="2.5" fill="none"/>`,
 first_bm:`<circle cx="17" cy="19" r="12" fill="none" stroke="${C}" stroke-width="3"/><path d="M17 19V12M14 4h6" stroke="${R}" stroke-width="3" stroke-linecap="round"/>`,
 new_pb:`<path d="M17 3 21 13l10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1Z" fill="${R}"/>`,
 pb_streak:`<path d="M5 26l8-8 6 6 10-12" stroke="${R}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 12h6v6" stroke="${R}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
 most_improved:`<path d="M17 31V5M8 14l9-9 9 9" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="17" cy="17" r="15.5" fill="none" stroke="${R}" stroke-width="2"/>`,
 level_up:`<path d="M6 28h22M10 22h14M14 16h6" stroke="${C}" stroke-width="3" stroke-linecap="round"/><path d="M17 3l5 6H12Z" fill="${R}"/>`,
 ch_done:`<path d="M17 3l12 5v9c0 8-5 12-12 15C10 29 5 25 5 17V8Z" fill="none" stroke="${C}" stroke-width="3"/><path d="M11 17l4 4 8-8" stroke="${R}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
 ch_1:medal('1',R,R),ch_2:medal('2',C,C),ch_3:medal('3','#3a3c40',C),
 ch_5:`<path d="M17 3l12 5v9c0 8-5 12-12 15C10 29 5 25 5 17V8Z" fill="none" stroke="${C}" stroke-width="3"/><text x="17" y="22" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="12" fill="#fff">5</text>`,
 race_first:`<path d="M6 31V4" stroke="${C}" stroke-width="3" stroke-linecap="round"/><path d="M6 5h22l-4 6 4 6H6" fill="none" stroke="#fff" stroke-width="2.5"/>`,
 race_5:`<path d="M6 31V4" stroke="${C}" stroke-width="3" stroke-linecap="round"/><path d="M6 5h22l-4 6 4 6H6" fill="none" stroke="${C}" stroke-width="2.5"/><text x="17" y="14.5" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="9" fill="#fff">5</text>`,
 race_pb:`<circle cx="17" cy="19" r="12" fill="none" stroke="#fff" stroke-width="3"/><path d="M17 19l5-5M14 4h6" stroke="${R}" stroke-width="3" stroke-linecap="round"/>`,
 race_podium:`<rect x="12" y="10" width="10" height="20" fill="${R}"/><rect x="3" y="16" width="9" height="14" fill="${C}"/><rect x="22" y="20" width="9" height="10" fill="#5b6068"/>`,
 founding:`<path d="M17 2C11 12 6 17 6 25a11 11 0 0 0 22 0c0-5-3-8-5-11 0 4-2 6-4 7 1-7-1-13-2-19Z" fill="none" stroke="${C}" stroke-width="2.5"/><text x="17" y="28" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="9" fill="#fff">20</text>`,
 one_year:`<circle cx="17" cy="17" r="14" fill="none" stroke="${R}" stroke-width="3" stroke-dasharray="70 18" transform="rotate(-90 17 17)"/><text x="17" y="21.5" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="11" fill="#fff">1Y</text>`,
 duty_first:`<rect x="5" y="9" width="24" height="18" rx="3" fill="none" stroke="${C}" stroke-width="3"/><path d="M12 9V5h10v4" stroke="${C}" stroke-width="3" fill="none"/><path d="M5 17h24" stroke="${R}" stroke-width="3"/>`,
 duty10:ring('10','#fff'),duty50:ring('50','#fff'),duty100:ring('100',R),
 duty_full:`<circle cx="17" cy="17" r="14" fill="none" stroke="#fff" stroke-width="3"/><path d="M11 17l4 4 8-8" stroke="${R}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
 trail:`<path d="M2 30l10-16 6 8 5-6 9 14Z" fill="none" stroke="${C}" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 14V5l7 3-7 3" fill="${R}"/>`
};
const NAME={first_session:'First session',s10:'10 sessions',s25:'25 sessions',s50:'50 sessions',s100:'100 sessions',full_month:'Full month',three_full:'Three full months',first_bm:'First benchmark',new_pb:'New PB',pb_streak:'PB streak',most_improved:'Most Improved',level_up:'Level up',ch_done:'Challenge complete',ch_1:'Challenge winner',ch_2:'Challenge 2nd',ch_3:'Challenge 3rd',ch_5:'5 challenges',race_first:'First race day',race_5:'5 race days',race_pb:'Race PB',race_podium:'Race podium',founding:'Founding 20',one_year:'One year',trail:'Trail finisher',duty_first:'First duty',duty10:'10 times helped',duty50:'50 times helped',duty_full:'Full duty month',duty100:'100 times helped'};
const SHORT={race_podium:'PODIUM',ch_1:'CHAMP',most_improved:'MIP',race_pb:'RACE PB',ch_2:'2ND',pb_streak:'PB ×3',s100:'100 SESS',ch_3:'3RD',level_up:'LEVEL UP',new_pb:'PB',three_full:'3 FULL',s50:'50 SESS',founding:'F20',full_month:'FULL MONTH',race_5:'5 RACES',ch_5:'5 CHALL',one_year:'1 YEAR',race_first:'RACER',s25:'25 SESS',ch_done:'FINISHER',first_bm:'BENCH',s10:'10 SESS',trail:'TRAIL',first_session:'DAY ONE',duty_first:'ON DUTY',duty10:'10 HELPED',duty50:'50 HELPED',duty_full:'FULL DUTY',duty100:'100 HELPED'};
const FLEX=['race_podium','ch_1','most_improved','race_pb','ch_2','pb_streak','s100','ch_3','level_up','new_pb','three_full','s50','founding','full_month','race_5','ch_5','one_year','race_first','s25','ch_done','first_bm','s10','trail','first_session','duty100','duty50','duty_full','duty10','duty_first'];
const HOW={first_session:'Sign in at your first session',s10:'10 sessions signed in',s25:'25 sessions',s50:'50 sessions',s100:'100 sessions',full_month:'Every session in a month',three_full:'Three full months in a row',first_bm:'Run your first benchmark',new_pb:'Beat your best benchmark time',pb_streak:'A new PB three months running',most_improved:'Biggest benchmark improvement in your level that month',level_up:'Move up a rank',ch_done:'Finish a Challenge Day',ch_1:'1st at a Challenge Day',ch_2:'2nd at a Challenge Day',ch_3:'3rd at a Challenge Day',ch_5:'Finish 5 Challenge Days',race_first:'Finish your first race with the HOF team',race_5:'Finish 5 races with the HOF team',race_pb:'Your fastest official race time',race_podium:'1st to 3rd overall or in your age group, from the official results',founding:'Founding members only',one_year:'One year as a member',trail:'Finish an Escapaid hike',duty_first:'Help out for the first time',duty10:'Help out 10 times',duty50:'Help out 50 times',duty_full:'Help out 4 or more times in a month',duty100:'Help out 100 times'};
Object.assign(ICON,{
 lead_first:`<path d="M17 4l3 7h7l-6 5 2 8-6-4-6 4 2-8-6-5h7Z" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`,
 lead10:`<path d="M17 3l3 7h7l-6 5 2 8-6-4-6 4 2-8-6-5h7Z" fill="#fff"/><text x="17" y="33" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="8" fill="#fff">10</text>`,
 event_lead:`<rect x="5" y="9" width="24" height="20" rx="3" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M5 15h24M11 5v7M23 5v7" stroke="#fff" stroke-width="2.5"/><path d="M13 22l3 3 6-6" stroke="${R}" stroke-width="2.5" fill="none"/>`,
 founding_exec:`<path d="M17 2C11 12 6 17 6 25a11 11 0 0 0 22 0c0-5-3-8-5-11 0 4-2 6-4 7 1-7-1-13-2-19Z" fill="#fff"/><text x="17" y="28" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="8" fill="#0B0B0B">EX</text>`,
 exec_year:`<circle cx="17" cy="17" r="14" fill="none" stroke="#fff" stroke-width="3"/><text x="17" y="21.5" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="11" fill="#fff">1Y</text>`});
Object.assign(NAME,{lead_first:'First session led',lead10:'10 sessions led',event_lead:'Event lead',founding_exec:'Founding exec',exec_year:'One year exec'});
Object.assign(SHORT,{lead_first:'LED',lead10:'LED 10',event_lead:'EVENT LEAD',founding_exec:'FOUNDING EXEC',exec_year:'1 YEAR EXEC'});
Object.assign(HOW,{lead_first:'Lead your first session',lead10:'Lead 10 sessions',event_lead:'Run a special Sunday or race day',founding_exec:'On the exec team before launch. Never reissued',exec_year:'One year on the exec team'});
FLEX.splice(FLEX.indexOf('race_podium'),0,'founding_exec');FLEX.splice(FLEX.indexOf('s100'),0,'event_lead','lead10');FLEX.push('exec_year','lead_first');
Object.assign(ICON,{hottest:`<path d="M17 2C10 14 4 20 4 30a13 13 0 0 0 26 0c0-6-3-10-6-14 0 5-2 8-5 9 2-8-1-15-2-23Z" fill="#E8382A"/><path d="M17 24c-3 5-5 7-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11Z" fill="#fff"/><text x="17" y="46" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="7" fill="#fff">1</text>`,inferno:`<path d="M17 2C10 14 4 20 4 30a13 13 0 0 0 26 0c0-6-3-10-6-14 0 5-2 8-5 9 2-8-1-15-2-23Z" fill="#ffd9c9"/><path d="M17 20c-4 6-6 9-6 13a6 6 0 0 0 12 0c0-4-2-7-6-13Z" fill="#E8382A"/>`});
Object.assign(NAME,{hottest:'Hottest',inferno:'Inferno month'});Object.assign(SHORT,{hottest:'HOTTEST',inferno:'INFERNO'});
Object.assign(HOW,{hottest:'Most Heat in the club that month',inferno:'Reach Inferno (240 Heat) in a month'});
FLEX.splice(FLEX.indexOf('most_improved'),0,'hottest');FLEX.splice(FLEX.indexOf('new_pb'),0,'inferno');
const CATS=[['Training',['first_session','s10','s25','s50','s100','full_month','three_full']],['Progress',['first_bm','new_pb','pb_streak','most_improved','level_up']],['Heat',['inferno','hottest']],['Challenge Days',['ch_done','ch_1','ch_2','ch_3','ch_5']],['Race days',['race_first','race_5','race_pb','race_podium']],['Club',['founding','one_year','trail']],['Team',['duty_first','duty10','duty50','duty100','duty_full']],['Leadership',['founding_exec','lead_first','lead10','event_lead','exec_year']]];

const HEATLV=[['Spark',0],['Ember',60],['Flame',120],['Blaze',180],['Inferno',240]];
const heatLv=h=>{let i=0;HEATLV.forEach((l,j)=>{if(h>=l[1])i=j});return i};
const HCOL=['#5b6068','#9a3a30','#E8382A','#ff6a3d','#ffd9c9'];
const flameSvg=(i,sz=26)=>`<svg viewBox="0 0 34 48" width="${sz}" height="${sz*48/34}" aria-hidden="true"><path d="M17 2C10 14 4 20 4 30a13 13 0 0 0 26 0c0-6-3-10-6-14 0 5-2 8-5 9 2-8-1-15-2-23Z" fill="${HCOL[i]}"/>${i>=3?'<path d="M17 24c-3 5-5 7-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11Z" fill="#fff" opacity=".85"/>':''}</svg>`;
const pipsHtml=(k,t)=>k==='h'?'':Array.from({length:TIERS[k]},(_,i)=>`<i class="${i<t?'on':''}"></i>`).join('');
const chip=k=>ICON[k]?`<span class="chip"><svg viewBox="0 0 34 34">${ICON[k]}</svg>${SHORT[k]}</span>`:'';
function chips(list,max=5){const o=[...list].filter(k=>ICON[k]).sort((a,b)=>FLEX.indexOf(a)-FLEX.indexOf(b));const shown=o.slice(0,max).map(chip).join('');return shown+(o.length>max?`<span class="chip more">+${o.length-max}</span>`:'')}
function setFin(el,k){el.classList.remove('lv-b','lv-i','lv-a','lv-h');el.classList.add('lv-'+k);}
const rankKey=i=>i<0?'b':RANKS[i][0];
// Card designs. d: {type, first, num, photo, founding, role, rank (index or -1), id}. opt.print = no rank, printed look.
function hofCard(d,opt){opt=opt||{};const t=String(d.type||'MEMBER').toUpperCase();const ri=d.rank;
 const showRank=!opt.print&&ri!=null&&ri>=0&&!d.hideRank;const r=showRank?RANKS[ri]:null;
 const rk=r?`<div class="rk"><span>${r[2]}</span><span class="pips">${pipsHtml(r[0],r[1])}</span></div>`:'';
 const ph=d.photo?`<img class="photo" src="${esc(d.photo)}" alt="Member photo">`:'<div class="photo"><svg viewBox="0 0 60 70"><circle cx="30" cy="24" r="14" fill="#3a3c40"/><path d="M4 70c2-18 12-26 26-26s24 8 26 26Z" fill="#3a3c40"/></svg></div>';
 const HID='<span hidden></span>';const FOOT='<div class="row foot"><div>BELIEVE · BEGIN · BURN · BECOME</div><div>POWERED BY ESCAPAID</div></div>';
 const BRAND=`<div class="brand"><img src="${FLAME}" alt=""><div><div class="hof">HEART OF FIRE</div><div class="club">RUN CLUB</div></div></div>`;
 const f=String(d.founding||'').replace(/^#/,'');
 let front='',cls='',bpre='';
 if(t==='FOUNDING'){front=`<div class="face founding">${HID}<div class="frame"><img class="wfl" src="${FLAME}" alt=""><div class="ghost">${esc(f)}</div><div class="row"><img class="wordmark" src="${WM}" alt="Heart of Fire"><div><div class="club">RUN CLUB</div><div class="label" style="text-align:right;color:#C9CED6">FOUNDING 20</div></div></div><div class="mid">${ph}<div class="info"><div class="small" style="color:#C9CED6">FOUNDING MEMBER</div><div class="name">${esc(d.first)}</div><div class="nums"><div class="num">${esc(d.num)}</div><div class="fnum">${f?'FOUNDING #'+esc(f):'FOUNDING'}</div></div>${rk}<div class="solid">ONE OF TWENTY</div></div></div>${FOOT}</div></div>`;}
 else if(t==='VOLUNTEER'){front=`<div class="face front std vol">${HID}<img class="wfl" src="${FLAME}" alt=""><div class="vband"><span>VOLUNTEER</span></div><div class="row">${BRAND}<div class="label">VOLUNTEER CARD</div></div><div class="mid">${ph}<div class="info"><div class="small">TEAM</div><div class="name">${esc(d.first)}</div><div class="num">${esc(d.num)}</div>${rk}<div class="badge">TEAM · VOLUNTEER</div></div></div>${FOOT}</div>`;bpre='<div class="vband"><span>VOLUNTEER</span></div>';cls='vol';}
 else if(t==='EXEC'){front=`<div class="face front std ex">${HID}<img class="wfl" src="${FLAME}" alt=""><div class="xsheen"></div><div class="xbar"><span>EXECUTIVE</span></div><div class="xframe"></div><div class="row"><img class="wordmark" src="${WM}" alt="Heart of Fire"><div class="label">EXECUTIVE CARD</div></div><div class="mid">${ph}<div class="info"><div class="small" style="color:#fff">EXECUTIVE TEAM</div><div class="name">${esc(d.first)}</div>${d.role?`<div class="role">${esc(d.role)}</div>`:''}<div class="num">${esc(d.num)}</div>${rk}<div class="badge">TEAM · EXECUTIVE</div></div></div>${FOOT}</div>`;bpre='<div class="xbar"><span>EXECUTIVE</span></div><div class="xframe"></div>';cls='ex';}
 else{front=`<div class="face front std ${opt.print?'':'lvfin'}">${HID}<img class="wfl" src="${FLAME}" alt=""><div class="row">${BRAND}<div class="label">MEMBER CARD</div></div><div class="mid">${ph}<div class="info"><div class="small">MEMBER</div><div class="name">${esc(d.first)}</div><div class="num">${esc(d.num)}</div>${rk}<div class="badge">MEMBER</div></div></div>${FOOT}</div>`;}
 const qr='https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=12&data='+encodeURIComponent(CHECK_PAGE+'?id='+d.id);
 const back=`<div class="lc"><div class="face back ${cls}">${bpre}<img class="flame" src="${FLAME}" alt=""><div class="qr"><img src="${qr}" alt="Member QR code" style="width:100%;height:100%;display:block"></div><div class="copy"><div class="headline">Scan at every session.</div><div class="body">This card is personal to its holder. The team scans it to check your membership is active.</div><div class="meta"><div>HEART OF FIRE · TRINIDAD AND TOBAGO</div><div>FOUND THIS CARD? MESSAGE @HOFCLUB.OFFICIAL</div></div><div class="rule"></div></div></div></div>`;
 const fin=(t==='MEMBER'&&!opt.print&&r)?' lv-'+r[0]:'';
 return {front:`<div class="card fin${fin}${opt.print?' print':''}"><div class="lc">${front}</div></div>`,back:`<div class="card fin print">${back}</div>`};
}

// Time standards (seconds), men and women, index 1..15 = Beginner II..Heart of Fire
var SP_RANKS = ["Beginner I", "Beginner II", "Beginner III", "Intermediate I", "Intermediate II", "Intermediate III", "Intermediate IV", "Intermediate V", "Advanced I", "Advanced II", "Advanced III", "Advanced IV", "Advanced V", "Advanced VI", "Advanced VII", "Heart of Fire"];
var SP_STD = {"M":{"100 m":[null,14.6,13.8,13.0,12.8,12.6,12.4,12.2,12.0,11.9,11.7,11.6,11.5,11.3,11.2,10.9],"200 m":[null,30.5,28.6,27.0,26.5,26.0,25.5,25.0,24.6,24.2,23.9,23.6,23.2,22.9,22.6,22.0],"400 m":[null,102.0,94.5,88.0,84.3,80.8,77.6,74.7,72.0,68.7,65.7,63.0,60.5,58.2,56.0,53.0],"1.6 km":[null,505.0,460.0,425.0,405.0,390.0,375.0,360.0,350.0,335.0,325.0,315.0,305.0,295.0,285.0,280.0],"3 km":[null,995.0,910.0,840.0,805.0,775.0,745.0,720.0,695.0,670.0,645.0,625.0,610.0,590.0,575.0,555.0],"5 km":[null,1700.0,1560.0,1445.0,1390.0,1335.0,1285.0,1240.0,1195.0,1155.0,1120.0,1085.0,1055.0,1025.0,995.0,965.0],"10K":[null,3535.0,3245.0,3000.0,2880.0,2765.0,2665.0,2570.0,2480.0,2400.0,2320.0,2250.0,2185.0,2120.0,2065.0,2010.0],"Half":[null,7830.0,7195.0,6655.0,6380.0,6130.0,5900.0,5690.0,5490.0,5310.0,5135.0,4980.0,4830.0,4690.0,4555.0,4435.0],"Marathon":[null,16115.0,14850.0,13775.0,13235.0,12730.0,12270.0,11840.0,11440.0,11070.0,10720.0,10395.0,10090.0,9800.0,9530.0,9275.0]},"W":{"100 m":[null,16.0,15.1,14.3,14.1,13.9,13.7,13.5,13.3,13.1,13.0,12.8,12.7,12.5,12.4,12.0],"200 m":[null,33.5,31.7,30.0,29.5,28.9,28.4,28.0,27.5,27.1,26.7,26.4,26.0,25.6,25.3,24.6],"400 m":[null,112.0,104.0,97.0,93.0,89.4,86.0,82.9,80.0,76.6,73.4,70.5,67.8,65.3,63.0,59.0],"1.6 km":[null,555.0,510.0,470.0,450.0,430.0,415.0,400.0,385.0,370.0,360.0,350.0,340.0,330.0,320.0,310.0],"3 km":[null,1095.0,1005.0,930.0,890.0,855.0,825.0,795.0,765.0,740.0,715.0,695.0,675.0,655.0,635.0,620.0],"5 km":[null,1875.0,1725.0,1595.0,1530.0,1470.0,1420.0,1370.0,1320.0,1280.0,1235.0,1200.0,1165.0,1130.0,1100.0,1070.0],"10K":[null,3900.0,3580.0,3315.0,3180.0,3055.0,2940.0,2835.0,2740.0,2650.0,2565.0,2485.0,2415.0,2345.0,2280.0,2220.0],"Half":[null,8625.0,7935.0,7345.0,7050.0,6775.0,6525.0,6290.0,6070.0,5870.0,5680.0,5505.0,5340.0,5185.0,5040.0,4905.0],"Marathon":[null,17685.0,16320.0,15155.0,14565.0,14020.0,13515.0,13050.0,12615.0,12205.0,11825.0,11470.0,11135.0,10820.0,10525.0,10245.0]}};

var LAD_EV={sprint:['100 m','200 m','400 m'],middle:['1.6 km','3 km','5 km'],long:['10K','Half','Marathon']};
function fmtT(s,ev){if(s==null)return '';if(ev==='100 m'||ev==='200 m')return (Math.round(s*10)/10).toFixed(1);
 if(ev==='400 m'){if(s<60)return (Math.round(s*10)/10).toFixed(1);const m=Math.floor(s/60),r=Math.round((s-m*60)*10)/10;return m+':'+(r<10?'0':'')+r.toFixed(1);}
 const t=Math.round(s),h=Math.floor(t/3600),m=Math.floor(t%3600/60),x=t%60,p=n=>String(n).padStart(2,'0');return (LAD_EV.long.indexOf(ev)>-1||h)?h+':'+p(m)+':'+p(x):m+':'+p(x);}
function fmtDiff(d,ev){if(!d)return '';const sg=d<0?'−':'+',a=Math.abs(d);if(LAD_EV.sprint.indexOf(ev)>-1&&a<60)return sg+(Math.round(a*10)/10).toFixed(1);
 const t=Math.round(a),h=Math.floor(t/3600),m=Math.floor(t%3600/60),x=t%60;return sg+(h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0');}
const middleEv=i=>i<=2?'1.6 km':i<=7?'3 km':'5 km';
const sexKey=s=>/^f/i.test(String(s||''))?'W':'M';
