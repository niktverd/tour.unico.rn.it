import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "Egypt Escape Countdown",
  title: "Egypt Escape Countdown",
  description:
    "A one-screen PWA that counts down to the next stop on the Egypt vacation plan.",
  manifest: "/manifest.webmanifest",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Egypt Countdown",
  },
  icons: {
    icon: [
      { url: "/icon-192.svg", type: "image/svg+xml" },
      { url: "/icon-512.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f2b24c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV !== "production" ? (
          <Script id="dev-sw-reset" strategy="beforeInteractive">
            {`(function () {
  if (!("serviceWorker" in navigator) || !("caches" in window)) {
    return;
  }

  navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      if (!registrations.length) {
        return false;
      }

      return Promise.all(
        registrations.map(function (registration) {
          return registration.unregister();
        }),
      )
        .then(function () {
          return caches.keys().then(function (keys) {
            return Promise.all(
              keys
                .filter(function (key) {
                  return key.indexOf("egypt-escape-") === 0;
                })
                .map(function (key) {
                  return caches.delete(key);
                }),
            );
          });
        })
        .then(function () {
          return true;
        });
    })
    .then(function (didReset) {
      if (didReset) {
        window.location.reload();
      }
    })
    .catch(function () {});
})();`}
          </Script>
        ) : null}
        {children}
      </body>
    </html>
  );
}
