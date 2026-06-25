self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = { title: "Pix.City", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Pix.City";
  const options = {
    body: data.body || "",
    icon: "/icons/android-chrome-192x192.jpeg",
    badge: "/icons/android-chrome-192x192.jpeg",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        const existing = clients.find((client) => client.url === url);

        if (existing) {
          return existing.focus();
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
  );
});
