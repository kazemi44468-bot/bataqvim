(()=>{"use strict";
const $=s=>document.querySelector(s),fa=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]),en=s=>String(s).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
function g2j(gy,gm,gd){const gdm=[31,28,31,30,31,30,31,31,30,31,30,31];let gy2=gm>2?gy+1:gy,d=355666+365*gy+Math.floor((gy2+3)/4)-Math.floor((gy2+99)/100)+Math.floor((gy2+399)/400)+gd;for(let i=0;i<gm-1;i++)d+=gdm[i];let jy=-1595+33*Math.floor(d/12053);d%=12053;jy+=4*Math.floor(d/1461);d%=1461;if(d>365){jy+=Math.floor((d-1)/365);d=(d-1)%365}return[jy,d<186?1+Math.floor(d/31):7+Math.floor((d-186)/30),1+(d<186?d%31:(d-186)%30)]}
const months=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"],w=["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];
function renderNow(){const n=new Date(),j=g2j(n.getFullYear(),n.getMonth()+1,n.getDate());$("#todayJalali").textContent=fa(j[0]+"/"+String(j[1]).padStart(2,"0")+"/"+String(j[2]).padStart(2,"0"));$("#todayWeekday").textContent=w[(n.getDay()+1)%7];$("#todayGregorian").textContent=fa(n.getFullYear()+"/"+String(n.getMonth()+1).padStart(2,"0")+"/"+String(n.getDate()).padStart(2,"0"));try{$("#todayLunar").textContent=new Intl.DateTimeFormat("fa-IR-u-ca-islamic-umalqura",{year:"numeric",month:"long",day:"numeric"}).format(n)}catch{$("#todayLunar").textContent="—"}const h=n.getHours(),m=n.getMinutes(),s=n.getSeconds();$("#liveClock").textContent=fa([h,m,s].map(x=>String(x).padStart(2,"0")).join(":"));document.querySelector(".hour").style.transform="translateX(-50%) rotate("+(h%12*30+m*.5)+"deg)";document.querySelector(".minute").style.transform="translateX(-50%) rotate("+(m*6+s*.1)+"deg)";document.querySelector(".second").style.transform="translateX(-50%) rotate("+(s*6)+"deg")}
renderNow();setInterval(renderNow,1000);
async function prayer(){
  const city=$("#prayerCity")?.value||"Tehran", n=new Date(), day=String(n.getDate()).padStart(2,"0"), month=String(n.getMonth()+1).padStart(2,"0"), year=n.getFullYear(), box=$("#prayerTimes");
  if(!box)return;
  box.innerHTML='<div class="prayer-loading">در حال دریافت…</div>';
  const url="https://api.aladhan.com/v1/timingsByCity/"+day+"-"+month+"-"+year+"?city="+encodeURIComponent(city)+"&country=Iran&method=7";
  try{
    const r=await fetch(url,{cache:"no-store"}); if(!r.ok)throw new Error("HTTP "+r.status);
    const j=await r.json(),t=j?.data?.timings;if(!t)throw new Error("No timings");
    $("#prayerDate").textContent=fa(day+"/"+month+"/"+year);
    const items=[["اذان صبح",t.Fajr],["طلوع آفتاب",t.Sunrise],["اذان ظهر",t.Dhuhr],["اذان عصر",t.Asr],["غروب آفتاب",t.Sunset],["اذان مغرب",t.Maghrib],["عشاء",t.Isha],["نیمه‌شب",t.Midnight]];
    box.innerHTML=items.map(x=>"<div><span>"+x[0]+"</span><b>"+fa(String(x[1]||"—").replace(/[^0-9:]/g,""))+"</b></div>").join("");
  }catch(e){
    box.innerHTML='<div class="prayer-loading">دریافت دوباره…</div>';
    setTimeout(async()=>{try{const r=await fetch(url,{cache:"reload"}),j=await r.json(),t=j?.data?.timings;if(!t)throw 0;const items=[["اذان صبح",t.Fajr],["طلوع آفتاب",t.Sunrise],["اذان ظهر",t.Dhuhr],["اذان عصر",t.Asr],["غروب آفتاب",t.Sunset],["اذان مغرب",t.Maghrib],["عشاء",t.Isha],["نیمه‌شب",t.Midnight]];box.innerHTML=items.map(x=>"<div><span>"+x[0]+"</span><b>"+fa(String(x[1]||"—").replace(/[^0-9:]/g,""))+"</b></div>").join("")}catch{box.innerHTML='<div class="prayer-loading">اتصال به سرویس اوقات شرعی برقرار نشد.</div>'}},1200);
  }
}
$("#prayerCity")?.addEventListener("change",prayer);prayer();
const ev=[...(window.OFFICIAL_EVENTS_1404||[]),...(window.OFFICIAL_EVENTS_1405||[]) ,...(window.OFFICIAL_EVENTS_1406||[])];try{ev.push(...JSON.parse(localStorage.getItem("bataqvim-events")||"[]"))}catch{}const n=new Date(),j=g2j(n.getFullYear(),n.getMonth()+1,n.getDate()),k=j[0]+"/"+String(j[1]).padStart(2,"0")+"/"+String(j[2]).padStart(2,"0");const today=ev.filter(e=>e.date===k).slice(0,5);$("#todayEvents").textContent=today.length?today.map(e=>e.title).join(" · "):"رویدادی برای امروز ثبت نشده";const me=ev.filter(e=>e.date.startsWith(j[0]+"/"+String(j[1]).padStart(2,"0")+"/")).sort((a,b)=>+a.date.slice(-2)-+b.date.slice(-2)).slice(0,21);$("#monthAgendaList").innerHTML=me.length?me.map(e=>{const d=+e.date.slice(-2);return `<a href="day.html?date=${encodeURIComponent(e.date)}"><b>${fa(d)}</b><span>${e.title}</span><small>${e.holiday?"تعطیل · ":""}${e.type||"رویداد"}</small></a>`}).join(""):'<div class="empty">برای این ماه رویدادی ثبت نشده است.</div>';
})();