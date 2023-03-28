// public/sw.js
self.addEventListener("push", (event) => {
    const data = event.data.json();

    const options = {
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        image: data.image,
        vibrate: data.vibrate,
        actions: data.actions,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});
