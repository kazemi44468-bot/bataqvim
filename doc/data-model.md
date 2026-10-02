# مدل داده

Calendar: id, title, description, type, owner, visibility, timezone, settings.

Event: id, calendar_id, title, description, type, start_at, end_at, all_day, recurrence, status, visibility, location, owner_id, source, attachments.

Schedule: برنامه، مرحله، فعالیت، موعد و بازه‌های زمانی پروژه.

Reminder: یادآوری پیش از رویداد یا سررسید.

User / Group / Organization: مالکیت، همکاری و سطح دسترسی.

Project: پروژه‌ای که می‌تواند یک یا چند تقویم داشته باشد.

اصل ارتباط: تقویم، رویداد و برنامه‌ریزی ماژولار باشند تا هر پروژه از همان هسته مشترک استفاده کند.
