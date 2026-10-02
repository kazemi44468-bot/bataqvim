/* باتقویم — legacy calendar compatibility layer
 * موتور فعال تقویم در صفحه نخست در index.html قرار دارد.
 * این فایل عمداً هیچ رندر یا listenerی روی #calendarView اعمال نمی‌کند
 * تا موتور قدیمی نتواند با موتور فعلی ماه/هفته/سال تداخل ایجاد کند.
 */
(()=>{"use strict";
  const hasModernCalendar=!!document.querySelector("#calendarView");
  if(hasModernCalendar) return;
  // صفحات قدیمی که احتمالاً این فایل را صدا می‌زنند، بدون خطا ادامه می‌دهند.
})();