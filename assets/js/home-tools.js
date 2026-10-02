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
  if(a)a.textContent=fa(j[0]+"/"+String(j[1]).padStart(2,"0")+"/"+String(j[2]).padStart(2,"0"));
  if(b)b.textContent=weekdays[(n.getDay()+1)%7];
  if(c)c.textContent=fa(n.getFullYear()+"/"+String(n.getMonth()+1).padStart(2,"0")+"/"+String(n.getDate()).padStart(2,"0"));
  if(l){try{l.textContent=new Intl.DateTimeFormat("fa-IR-u-ca-islamic-umalqura",{year:"numeric",month:"long",day:"numeric"}).format(n)}catch(e){l.textContent="—"}}
  if(clock)clock.textContent=fa([n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,"0")).join(":"));
  const h=document.querySelector(".hour"),m=document.querySelector(".minute"),s=document.querySelector(".second");
  if(h)h.style.transform="translateX(-50%) rotate("+(n.getHours()%12*30+n.getMinutes()*.5)+"deg)";
  if(m)m.style.transform="translateX(-50%) rotate("+(n.getMinutes()*6+n.getSeconds()*.1)+"deg)";
  if(s)s.style.transform="translateX(-50%) rotate("+(n.getSeconds()*6)+"deg)";
}
async function prayer(){
  const cityEl=$("#prayerCity"),box=$("#prayerTimes");
  if(!box)return;
  const city=cityEl?cityEl.value:"Tehran",n=new Date();
  const day=String(n.getDate()).padStart(2,"0"),month=String(n.getMonth()+1).padStart(2,"0"),year=n.getFullYear();
  const url="https://api.aladhan.com/v1/timingsByCity/"+day+"-"+month+"-"+year+"?city="+encodeURIComponent(city)+"&country=Iran&method=7";
  box.innerHTML='<div class="prayer-loading">در حال دریافت…</div>';
  try{
    const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);
    const j=await r.json(),t=j&&j.data&&j.data.timings;if(!t)throw new Error("No timings");
    const d=$("#prayerDate");if(d)d.textContent=fa(day+"/"+month+"/"+year);
    const items=[["اذان صبح",t.Fajr],["طلوع آفتاب",t.Sunrise],["اذان ظهر",t.Dhuhr],["اذان عصر",t.Asr],["غروب آفتاب",t.Sunset],["اذان مغرب",t.Maghrib],["عشاء",t.Isha],["نیمه‌شب",t.Midnight]];
    box.innerHTML=items.map(x=>"<div><span>"+x[0]+"</span><b>"+fa(String(x[1]||"—").replace(/[^0-9:]/g,""))+"</b></div>").join("");
  }catch(e){box.innerHTML='<div class="prayer-loading">اتصال به سرویس اوقات شرعی برقرار نشد.</div>'}
}
function worldClocks(){
  const city=$("#worldClockCity"),time=$("#worldClockTime");
  if(!city||!time)return;
  const update=()=>{try{time.textContent=new Intl.DateTimeFormat("fa-IR",{timeZone:city.value,hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date())}catch(e){time.textContent="—"}};
  city.addEventListener("change",update);update();setInterval(update,1000);
}
function loadEvents(){
  let ev=[].concat(window.OFFICIAL_EVENTS_1404||[],window.OFFICIAL_EVENTS_1405||[],window.OFFICIAL_EVENTS_1406||[]);
  try{ev=ev.concat(JSON.parse(localStorage.getItem("bataqvim-events")||"[]"))}catch(e){}
  const n=new Date(),j=g2j(n.getFullYear(),n.getMonth()+1,n.getDate()),year=String(j[0]),month=String(j[1]).padStart(2,"0"),day=String(j[2]).padStart(2,"0"),key=year+"/"+month+"/"+day;
  const today=ev.filter(e=>e.date===key).slice(0,5),todayBox=$("#todayEvents");
  if(todayBox)todayBox.textContent=today.length?today.map(e=>e.title).join(" · "):"رویدادی برای امروز ثبت نشده";
  const me=ev.filter(e=>String(e.date).indexOf(year+"/"+month+"/")===0).sort((a,b)=>+String(a.date).slice(-2)-+String(b.date).slice(-2)).slice(0,21),agenda=$("#monthAgendaList");
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