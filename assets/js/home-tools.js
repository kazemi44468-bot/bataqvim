(()=>{"use strict";
const $=s=>document.querySelector(s);
const fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const months=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const weekdays=["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];
function g2j(gy,gm,gd){
  const md=[31,28,31,30,31,30,31,31,30,31,30,31];
  const gy2=gm>2?gy+1:gy;
  let d=355666+365*gy+Math.floor((gy2+3)/4)-Math.floor((gy2+99)/100)+Math.floor((gy2+399)/400)+gd;
  for(let i=0;i<gm-1;i++)d+=md[i];
  let jy=-1595+33*Math.floor(d/12053); d%=12053; jy+=4*Math.floor(d/1461); d%=1461;
  if(d>365){jy+=Math.floor((d-1)/365);d=(d-1)%365}
  return[jy,d<186?1+Math.floor(d/31):7+Math.floor((d-186)/30),1+(d<186?d%31:(d-186)%30)];
}
function renderNow(){
  const n=new Date(),j=g2j(n.getFullYear(),n.getMonth()+1,n.getDate());
  const a=$("#todayJalali"),b=$("#todayWeekday"),c=$("#todayGregorian"),l=$("#todayLunar"),clock=$("#liveClock");
  if(a)a.textContent=fa(j[0]+"/"+String(j[1]).padStart(2,"0")+"/"+String(j[2]).padStart(2,"0"));const jy=$("#todayJalaliYear"),gy=$("#todayGregorianYear");if(jy)jy.textContent=fa(j[0]);if(gy)gy.textContent=fa(n.getFullYear());
  if(b)b.textContent=weekdays[(n.getDay()+1)%7];
  if(c)c.textContent=fa(n.getFullYear()+"/"+String(n.getMonth()+1).padStart(2,"0")+"/"+String(n.getDate()).padStart(2,"0"));
  if(l){try{l.textContent=new Intl.DateTimeFormat("fa-IR-u-ca-islamic-umalqura",{year:"numeric",month:"long",day:"numeric"}).format(n)}catch(e){l.textContent="—"}}
  if(clock)clock.textContent=fa([n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,"0")).join(":"));
  const h=document.querySelector(".hour"),m=document.querySelector(".minute"),s=document.querySelector(".second");
  if(h)h.style.transform="translateX(-50%) rotate("+(n.getHours()%12*30+n.getMinutes()*.5)+"deg)";
  if(m)m.style.transform="translateX(-50%) rotate("+(n.getMinutes()*6+n.getSeconds()*.1)+"deg)";
  if(s)s.style.transform="translateX(-50%) rotate("+(n.getSeconds()*6)+"deg)";
}
function provinceById(id){return (window.BATAQVIM_IRAN_PROVINCES||[]).find(p=>p.id===id)||(window.BATAQVIM_IRAN_PROVINCES||[])[0];}
function fillPrayerCities(){
  const el=$("#prayerCity"); if(!el||el.dataset.provincesReady)return;
  const list=window.BATAQVIM_IRAN_PROVINCES||[];
  el.innerHTML=list.map(p=>'<option value="'+p.id+'">'+p.name+' · '+p.city+'</option>').join('');
  const saved=localStorage.getItem("bataqvim-prayer-province");
  if(saved&&list.some(p=>p.id===saved))el.value=saved;
  else if(list.some(p=>p.id==="tehran"))el.value="tehran";
  el.dataset.provincesReady="1";
}
async function prayer(){
  const cityEl=$("#prayerCity"),box=$("#prayerTimes"); if(!box)return;
  fillPrayerCities();
  const province=provinceById(cityEl?cityEl.value:"tehran"); if(!province)return;
  localStorage.setItem("bataqvim-prayer-province",province.id);
  const n=new Date(),day=String(n.getDate()).padStart(2,"0"),month=String(n.getMonth()+1).padStart(2,"0"),year=n.getFullYear();
  const url="https://api.aladhan.com/v1/timings/"+day+"-"+month+"-"+year+"?latitude="+province.lat+"&longitude="+province.lon+"&method=7&school=0";
  box.innerHTML='<div class="prayer-loading">در حال دریافت اوقات شرعی برای '+province.name+'…</div>';
  try{
    const r=await fetch(url,{cache:"no-store"}); if(!r.ok)throw new Error("HTTP "+r.status);
    const j=await r.json(),t=j&&j.data&&j.data.timings; if(!t)throw new Error("No timings");
    const d=$("#prayerDate"); if(d){const jj=g2j(year,n.getMonth()+1,n.getDate());d.textContent=fa(jj[0]+"/"+String(jj[1]).padStart(2,"0")+"/"+String(jj[2]).padStart(2,"0"))+" · "+province.name;}
    const items=[["اذان صبح",t.Fajr],["طلوع آفتاب",t.Sunrise],["اذان ظهر",t.Dhuhr],["اذان عصر",t.Asr],["غروب آفتاب",t.Sunset],["اذان مغرب",t.Maghrib],["عشاء",t.Isha],["نیمه‌شب",t.Midnight]];
    box.innerHTML=items.map(x=>"<div><span>"+x[0]+"</span><b>"+fa(String(x[1]||"—").replace(/[^0-9:]/g,""))+"</b></div>").join("");
  }catch(e){box.innerHTML='<div class="prayer-loading">دریافت اوقات شرعی انجام نشد؛ اتصال اینترنت و سرویس را بررسی کنید.</div>'}
}
function worldClocks(){
  const city=$("#worldClockCity"),time=$("#worldClockTime");
  if(!city||!time)return;
  const zones={Tehran:"Asia/Tehran",Baku:"Asia/Baku",Baghdad:"Asia/Baghdad",Riyadh:"Asia/Riyadh",Dubai:"Asia/Dubai",Delhi:"Asia/Kolkata",Tokyo:"Asia/Tokyo",Beijing:"Asia/Shanghai",Seoul:"Asia/Seoul",Istanbul:"Europe/Istanbul",Moscow:"Europe/Moscow",London:"Europe/London",Paris:"Europe/Paris",Berlin:"Europe/Berlin",Rome:"Europe/Rome",Madrid:"Europe/Madrid",NewYork:"America/New_York",Ottawa:"America/Toronto",MexicoCity:"America/Mexico_City",Brasilia:"America/Sao_Paulo",Canberra:"Australia/Sydney"};
  const update=()=>{
    try{
      const zone=zones[city.value]||city.value;
      const parts=new Intl.DateTimeFormat("en-GB",{timeZone:zone,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).formatToParts(new Date());
      const get=k=>parts.find(p=>p.type===k)?.value||"00";
      time.textContent=fa(get("hour")+":"+get("minute")+":"+get("second"));
    }catch(e){time.textContent="—"}
  };
  city.addEventListener("change",update);
  update();
  setInterval(update,1000);
}
function normalizeTitle(t){return String(t||"").toLowerCase().replace(/[َُِّْـ]/g,"").replace(/[يى]/g,"ی").replace(/[ك]/g,"ک").replace(/[ۀة]/g,"ه").replace(/[؛،,:()\-–—]/g," ").replace(/\s+/g," ").trim().replace(/روز پژوهش و فناوری/g,"روز پژوهش").replace(/روز کتاب، کتابخوانی و کتابدار/g,"روز کتاب و کتابخوانی").replace(/بزرگداشت خواجه نصیرالدین طوسی؛ روز مهندسی/g,"روز مهندس").replace(/روز ملی شدن صنعت نفت ایران/g,"ملی شدن صنعت نفت").replace(/پیروزی انقلاب اسلامی ایران/g,"پیروزی انقلاب اسلامی").replace(/روز جهانی مقاومت؛ شهادت سردار سپهبد قاسم سلیمانی/g,"شهادت سردار سلیمانی").replace(/شهادت سردار سپهبد قاسم سلیمانی/g,"شهادت سردار سلیمانی").replace(/بزرگداشت ابوعلی سینا؛ روز پزشک/g,"روز پزشک").replace(/بزرگداشت محمدبن زکریای رازی؛ روز داروسازی/g,"روز داروسازی").replace(/روز شعر و ادب فارسی؛ بزرگداشت استاد شهریار/g,"روز شعر و ادب فارسی");}
function dedupeOfficial(list){const map=new Map();for(const e of list){const k=String(e.date)+"|"+normalizeTitle(e.title);const old=map.get(k);if(!old||(!e.recurring&&old.recurring))map.set(k,e)}return [...map.values()]}
function loadEvents(){
  let ev=dedupeOfficial([...(window.OFFICIAL_EVENTS_1404||[]),...(window.OFFICIAL_EVENTS_1405||[]),...(window.OFFICIAL_EVENTS_1406||[]),...(window.BATAQVIM_RECURRING_EVENTS||[])]);
  try{ev=ev.concat(JSON.parse(localStorage.getItem("bataqvim-events")||"[]"))}catch(e){}
  const n=new Date(),j=g2j(n.getFullYear(),n.getMonth()+1,n.getDate()),year=String(j[0]),month=String(j[1]).padStart(2,"0"),day=String(j[2]).padStart(2,"0"),key=year+"/"+month+"/"+day;
  const today=dedupeOfficial(ev.filter(e=>e.date===key)).slice(0,5),todayBox=$("#todayEvents");
  if(todayBox)todayBox.textContent=today.length?today.map(e=>e.title).join(" · "):"رویدادی برای امروز ثبت نشده";
  const me=dedupeOfficial(ev.filter(e=>String(e.date).indexOf(year+"/"+month+"/")===0)).sort((a,b)=>+String(a.date).slice(-2)-+String(b.date).slice(-2)).slice(0,21),agenda=$("#monthAgendaList");
  if(!agenda)return;
  agenda.innerHTML=me.length?me.map(e=>{const d=+String(e.date).slice(-2);return '<a href="day.html?date='+encodeURIComponent(e.date)+'"><b>'+fa(d)+'</b><span>'+String(e.title||"")+'</span><small>'+(e.holiday?"تعطیل · ":"")+(e.type||"رویداد")+"</small></a>"}).join(""):'<div class="empty">برای این ماه رویدادی ثبت نشده است.</div>';
}
renderNow();
setInterval(renderNow,1000);
const city=$("#prayerCity");if(city)city.addEventListener("change",prayer);
prayer();
worldClocks();
loadEvents();
})();