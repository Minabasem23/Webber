// تعريف الخيارات الخاصة بالخدمة
self.options = {
    "domain": "3nbf4.com", // النطاق
    "zoneId": 10591415 // ID الخاص بالمنطقة
};

// متغير إضافي يمكن استخدامه للـ Logic الخاص بك
self.lary = "";

// تحميل السكربت الخارجي
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw');

// التأكد من أن الخدمة تم تحميلها بشكل صحيح
self.addEventListener('install', event => {
    console.log('Service Worker installed');
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                // أضف أي ملفات أخرى تحتاجها هنا
            ]);
        })
    );
});

// تفعيل السرفيس ووركر
self.addEventListener('activate', event => {
    console.log('Service Worker activated');
    return self.clients.claim();  // التأكد من أن السرفيس ووركر يدير جميع الطلبات
});

// التعامل مع الطلبات الواردة
self.addEventListener('fetch', event => {
    console.log('Fetch event for: ', event.request.url);
    // يمكنك تخصيص كيفية معالجة الطلبات، مثل تخصيص الإعلانات أو تقديم تخزين البيانات
    event.respondWith(fetch(event.request));  // إرجاع الاستجابة الطبيعية للطلب
});