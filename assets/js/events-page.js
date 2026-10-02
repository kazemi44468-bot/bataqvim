(()=>{"use strict";
const $=s=>document.querySelector(s),fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const months=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const typeLabel=t=>({project:"پروژه",public:"عمومی",personal:"شخصی",religious:"مذهبی",national:"ملی",iranian:"ایرانی و فرهنگی",historical:"تاریخی",international:"بین‌المللی",special:"تخصصی و ویژه"})[t]||t||"رویداد";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inferBank=e=>window.bataqvimInferSpecializedBank?window.bataqvimInferSpecializedBank(e):((e&&e.bankId)||"iran-official");
const yearOf=e=>String(e.date||"").split("/")[0],monthOf=e=>+String(e.date||"").split("/")[1];
function normalizeTitle(t){return String(t||"").toLowerCase().replace(/[َُِّْـ]/g,"").replace(/[يى]/g,"ی").replace(/[ك]/g,"ک").replace(/[ۀة]/g,"ه").replace(/[؛،,:()\-–—]/g," ").replace(/\s+/g," ").trim().replace(/روز پژوهش و فناوری/g,"روز پژوهش").replace(/روز کتاب، کتابخوانی و کتابدار/g,"روز کتاب و کتابخوانی").replace(/بزرگداشت خواجه نصیرالدین طوسی؛ روز مهندسی/g,"روز مهندس").replace(/روز ملی شدن صنعت نفت ایران/g,"ملی شدن صنعت نفت").replace(/پیروزی انقلاب اسلامی ایران/g,"پیروزی انقلاب اسلامی").replace(/روز جهانی مقاومت؛ شهادت سردار سپهبد قاسم سلیمانی/g,"شهادت سردار سلیمانی").replace(/شهادت سردار سپهبد قاسم سلیمانی/g,"شهادت سردار سلیمانی").replace(/بزرگداشت ابوعلی سینا؛ روز پزشک/g,"روز پزشک").replace(/بزرگداشت محمدبن زکریای رازی؛ روز داروسازی/g,"روز داروسازی").replace(/روز شعر و ادب فارسی؛ بزرگداشت استاد شهریار/g,"روز شعر و ادب فارسی");}
function dedupeOfficial(list){const map=new Map();for(const e of list){const k=String(e.date)+"|"+normalizeTitle(e.title);const old=map.get(k);if(!old||(!e.recurring&&old.recurring))map.set(k,e)}return [...map.values()]}
const banks=window.BATAQVIM_EVENT_BANKS||[],bankSelect=$("#allEventsBank");
let events=dedupeOfficial([...(window.OFFICIAL_EVENTS_1404||[]),...(window.OFFICIAL_EVENTS_1405||[]),...(window.OFFICIAL_EVENTS_1406||[]),...(window.BATAQVIM_RECURRING_EVENTS||[])]).map(e=>({...e,official:true,bankId:inferBank(e)}));
try{const local=JSON.parse(localStorage.getItem("bataqvim-events")||"[]");events=events.concat(local.map(e=>({...e,official:false,bankId:inferBank(e)})))}catch{}
if(bankSelect)bankSelect.innerHTML='<option value="all">همه بانک‌ها</option>'+banks.map(b=>'<option value="'+esc(b.id)+'">'+esc(b.name)+'</option>').join("");
function render(){
 const year=$("#allEventsYear").value,month=$("#allEventsMonth").value,filter=$("#allEventsFilter").value,bank=bankSelect?bankSelect.value:"all",q=$("#allEventsSearch").value.trim().toLowerCase(),holiday=$("#allEventsHoliday").checked;
 let list=events.filter(e=>(!year||yearOf(e)===year)&&(month==="all"||monthOf(e)===+month)&&(filter==="all"||e.type===filter)&&(bank==="all"||e.bankId===bank)&&(!holiday||!!e.holiday)&&(!q||String(e.title||"").toLowerCase().includes(q)||String(e.source||"").toLowerCase().includes(q)));
 list.sort((a,b)=>{const [ay,am,ad]=String(a.date).split("/").map(Number),[by,bm,bd]=String(b.date).split("/").map(Number);return ay-by||am-bm||ad-bd});
 const officialCount=list.filter(e=>e.official).length,holidayCount=list.filter(e=>e.holiday).length;
 $("#eventsStats").innerHTML=`<span><b>${fa(list.length)}</b><small>رویداد</small></span><span><b>${fa(officialCount)}</b><small>در سالنامه</small></span><span><b>${fa(holidayCount)}</b><small>تعطیل رسمی</small></span>`;
 const groups=[];
 for(const ev of list){const [y,m,d]=String(ev.date).split("/").map(Number),key=String(ev.date);let g=groups.find(x=>x.key===key);if(!g){g={key,y,m,d,items:[]};groups.push(g)}g.items.push(ev)}
 $("#allEventsList").innerHTML=groups.length?groups.map(g=>{
   const items=g.items.map(e=>{const bankName=banks.find(b=>b.id===e.bankId)?.name||"";return `<a class="all-event-row ${e.official?"official-event":""}" href="day.html?date=${encodeURIComponent(e.date)}"><span class="all-event-mark"></span><span class="all-event-content"><b>${esc(e.title)}</b><small>${typeLabel(e.type)}${e.time?" · "+fa(e.time):""}${e.holiday?" · تعطیل رسمی":""}${bankName?" · "+esc(bankName):""}</small></span><span class="all-event-arrow">←</span></a>`}).join("");
   return `<section class="event-day-group"><header><div><b>${fa(g.d)}</b><span>${months[g.m-1]} ${fa(g.y)}</span></div><small>${fa(g.items.length)} رویداد</small></header><div class="event-day-items">${items}</div></section>`;
 }).join(""):'<div class="events-empty"><b>رویدادی پیدا نشد</b><span>فیلترها یا عبارت جست‌وجو را تغییر دهید.</span></div>';
}
const years=[...new Set(events.map(yearOf).filter(Boolean))].sort((a,b)=>+b-+a);
$("#allEventsYear").innerHTML='<option value="">همه سالنامه‌ها</option>'+years.map(y=>'<option value="'+y+'">سالنامه '+fa(y)+'</option>').join("");
$("#allEventsMonth").innerHTML='<option value="all">همه ماه‌ها</option>'+months.map((m,i)=>'<option value="'+(i+1)+'">'+m+'</option>').join("");
["#allEventsYear","#allEventsMonth","#allEventsFilter","#allEventsBank","#allEventsHoliday"].forEach(s=>$(s)?.addEventListener("change",render));
$("#allEventsSearch").addEventListener("input",render);
$("#clearEventsFilters").addEventListener("click",()=>{$("#allEventsYear").value="";$("#allEventsMonth").value="all";$("#allEventsFilter").value="all";if(bankSelect)bankSelect.value="all";$("#allEventsHoliday").checked=false;$("#allEventsSearch").value="";render()});
render();
})();