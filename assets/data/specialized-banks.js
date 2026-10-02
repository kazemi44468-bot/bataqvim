/* بانک‌های تخصصی باتقویم
   این لایه، رویدادهای موجود در سالنامه‌ها را بدون ساختن مناسبت جعلی،
   بر اساس موضوع به بانک تخصصی مربوط می‌کند. داده‌های ایرانی تا زمان
   اتصال مستقیم به منبع رسمی دستگاه مربوط، با وضعیت «نیازمند تطبیق منبع»
   باقی می‌مانند. */
window.BATAQVIM_SPECIALIZED_RULES=[
 {bankId:"health-iran",keys:["پزشک","داروساز","داروسازی","پرستار","بهداشت","سلامت","دندانپزشک","اهدای خون","هلال احمر","بیمار","سرطان","دیابت","ایدز","سل","مالاریا","اوتیسم","پزشکی","دامپزشکی"]},
 {bankId:"education",keys:["معلم","دانش‌آموز","دانش آموز","مدرسه","آموزش و پرورش","کتاب، کتابخوانی","کودک و نوجوان","سواد","دانش‌آموزی"]},
 {bankId:"higher-education",keys:["دانشجو","دانشگاه","پژوهش","پژوهشگر","فناوری","مهندسی","مهندس","علم","خوارزمی","ابوریحان","فارابی","فناوری اطلاعات","فناوری هسته‌ای","استاد"]},
 {bankId:"agriculture",keys:["کشاورزی","کشاورز","دامپزشکی","دام","طیور","شیلات","غذا","زنبور","محصولات کشاورزی","امنیت غذایی","منابع طبیعی"]},
 {bankId:"environment",keys:["محیط زیست","محیط‌بان","زمین پاک","درخت","درختکاری","جنگل","تالاب","تنوع زیستی","حیات وحش","هوا","آب","اقیانوس","پسماند","آلودگی","یخچال","کویر"]},
 {bankId:"industry",keys:["صنعت","معدن","تجارت","استاندارد","تولید","ساختمان","صنایع دستی","فرش","کارآفرینی صنعتی"]},
 {bankId:"labor-social",keys:["کارگر","کار و کارگر","تعاون","تأمین اجتماعی","تامین اجتماعی","بازنشستگان","بازنشسته","بهزیستی","رفاه اجتماعی","کارآفرینی","فنی و حرفه‌ای","اشتغال"]},
 {bankId:"judiciary-law",keys:["قضا","قضایی","قوه قضاییه","دادگستری","حقوق","قانون","وکالت","قاضی","حقوق بشر"]},
 {bankId:"defense-veterans",keys:["ارتش","شهدا","شهادت","دفاع مقدس","دفاعی","ایثار","ایثارگران","نیروی دریایی","نیروی زمینی","نیروی هوایی","آزادگان","مدافع حرم","بسیج","مقاومت"]},
 {bankId:"sports",keys:["ورزش","ورزش زورخانه‌ای","ورزشکار","فوتبال","المپیک","تربیت بدنی","المپیک","بازی‌های ورزشی"]},
 {bankId:"media-communications",keys:["خبرنگار","رسانه","ارتباطات","مخابرات","اینترنت","پست","رادیو","تلویزیون","مطبوعات","اطلاعات","سواد رسانه‌ای"]},
 {bankId:"transport",keys:["حمل‌ونقل","حمل و نقل","راه‌آهن","راه آهن","هواپیمایی","دریانورد","دریا","جاده","راننده","ترافیک","سوانح رانندگی"]},
 {bankId:"heritage-tourism",keys:["میراث فرهنگی","گردشگری","گردشگر","صنایع دستی","موزه","میراث","حافظ","سعدی","فردوسی","خیام","مولوی","حافظ","نظامی","پروین","عطار","شهریار","ادبیات","شعر","کتاب","زبان فارسی"]},
 {bankId:"economy-finance",keys:["بانک","بانکداری","اقتصاد","مالیات","بورس","بازار سرمایه","حسابداری","پول","مالی","تعاون"]},
 {bankId:"culture-literature",keys:["سعدی","فردوسی","خیام","حافظ","مولوی","نظامی","پروین","عطار","شهریار","ادبیات","شعر","زبان فارسی","کتاب","فرهنگ","سینما","هنر","تئاتر","موسیقی","قلم"]},
 {bankId:"food-agriculture-global",keys:["FAO","World Food","World Bee","World Tuna","World Potato","World Food Safety"]},
 {bankId:"health-who",keys:["WHO","World Health","World TB","World Malaria","World No-Tobacco","World Blood Donor","World Hepatitis","World Patient Safety","World AIDS","World Chagas"]},
 {bankId:"unesco",keys:["UNESCO","World Poetry","World Book","World Press Freedom","World Teachers","International Literacy","World Philosophy","World Heritage","International Mother Language","International Jazz"]},
 {bankId:"un",keys:["سازمان ملل","UN","International Day","World Day","International Week"]}
];
window.bataqvimInferSpecializedBank=function(e){
 const explicit=e&&e.bankId;
 if(explicit&&window.BATAQVIM_EVENT_BANKS?.some(b=>b.id===explicit)) return explicit;
 const text=String((e&&e.title)||"")+" "+String((e&&e.source)||"");
 const source=String((e&&e.source)||"");
 if(/WHO/i.test(source+" "+text)) return "health-who";
 if(/FAO/i.test(source+" "+text)) return "food-agriculture-global";
 if(/یونسکو|UNESCO/i.test(source+" "+text)) return "unesco";
 if(/سازمان ملل|United Nations|\bUN\b/i.test(source+" "+text)) return "un";
 if(e?.type==="religious") return "religious-islamic";
 for(const rule of window.BATAQVIM_SPECIALIZED_RULES||[]){
   if(rule.keys.some(k=>text.toLowerCase().includes(k.toLowerCase()))) return rule.bankId;
 }
 if(e?.type==="iranian") return "culture-literature";
 if(e?.type==="international") return "un";
 if(e?.type==="historical") return "iran-official";
 return "iran-official";
};
