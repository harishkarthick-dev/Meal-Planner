if (!self.define) {
  let e,
    a = {};
  const s = (s, n) => (
    (s = new URL(s + ".js", n).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[t]) return;
    let c = {};
    const f = (e) => s(e, t),
      r = { module: { uri: t }, exports: c, require: f };
    a[t] = Promise.all(n.map((e) => r[e] || f(e))).then((e) => (i(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/46Cvmc05qkvN_l_eEOme4/_buildManifest.js",
          revision: "be8c6c0f395e5deecccbaf7087851f2b",
        },
        {
          url: "/_next/static/46Cvmc05qkvN_l_eEOme4/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/235-573fe591e54f09cd.js",
          revision: "573fe591e54f09cd",
        },
        {
          url: "/_next/static/chunks/429-4fdb1251d77353a9.js",
          revision: "4fdb1251d77353a9",
        },
        {
          url: "/_next/static/chunks/430-e70b8fc8a3fc535b.js",
          revision: "e70b8fc8a3fc535b",
        },
        {
          url: "/_next/static/chunks/431-60a1eaa91116eb12.js",
          revision: "60a1eaa91116eb12",
        },
        {
          url: "/_next/static/chunks/471-c17f0232487199f9.js",
          revision: "c17f0232487199f9",
        },
        {
          url: "/_next/static/chunks/4bd1b696-67e30520d621c4dd.js",
          revision: "67e30520d621c4dd",
        },
        {
          url: "/_next/static/chunks/500-b84d19d842172eba.js",
          revision: "b84d19d842172eba",
        },
        {
          url: "/_next/static/chunks/5b86099a-cbe04194a5f28cc9.js",
          revision: "cbe04194a5f28cc9",
        },
        {
          url: "/_next/static/chunks/60-ae5689d6b0834e32.js",
          revision: "ae5689d6b0834e32",
        },
        {
          url: "/_next/static/chunks/72-af85ba33c5b84863.js",
          revision: "af85ba33c5b84863",
        },
        {
          url: "/_next/static/chunks/7508b87c-9f8cd049c131aefd.js",
          revision: "9f8cd049c131aefd",
        },
        {
          url: "/_next/static/chunks/762-651306d1599dc270.js",
          revision: "651306d1599dc270",
        },
        {
          url: "/_next/static/chunks/899.1813981119fa1f8a.js",
          revision: "1813981119fa1f8a",
        },
        {
          url: "/_next/static/chunks/928-9092f8175d6408b6.js",
          revision: "9092f8175d6408b6",
        },
        {
          url: "/_next/static/chunks/966.1775eb621d8d3e09.js",
          revision: "1775eb621d8d3e09",
        },
        {
          url: "/_next/static/chunks/app/(onboarding)/get-started/page-164861e3ee9b3d13.js",
          revision: "164861e3ee9b3d13",
        },
        {
          url: "/_next/static/chunks/app/(routes)/calendar/page-4303737e7605ffb9.js",
          revision: "4303737e7605ffb9",
        },
        {
          url: "/_next/static/chunks/app/(routes)/grocery/page-b21c786176a651be.js",
          revision: "b21c786176a651be",
        },
        {
          url: "/_next/static/chunks/app/(routes)/layout-688498435760a527.js",
          revision: "688498435760a527",
        },
        {
          url: "/_next/static/chunks/app/(routes)/meals/page-4f9e3e29fbd99a38.js",
          revision: "4f9e3e29fbd99a38",
        },
        {
          url: "/_next/static/chunks/app/(routes)/settings/page-afd60e9ff955784c.js",
          revision: "afd60e9ff955784c",
        },
        {
          url: "/_next/static/chunks/app/(routes)/today/page-86e4cb97f8a63853.js",
          revision: "86e4cb97f8a63853",
        },
        {
          url: "/_next/static/chunks/app/(routes)/week/page-fe8b5e5efb6879ac.js",
          revision: "fe8b5e5efb6879ac",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-669ff21d4052f3ff.js",
          revision: "669ff21d4052f3ff",
        },
        {
          url: "/_next/static/chunks/app/dashboard/page-bb03526d76105137.js",
          revision: "bb03526d76105137",
        },
        {
          url: "/_next/static/chunks/app/features/page-7c9f1f811f8ffa44.js",
          revision: "7c9f1f811f8ffa44",
        },
        {
          url: "/_next/static/chunks/app/layout-93cfa1aafb41e456.js",
          revision: "93cfa1aafb41e456",
        },
        {
          url: "/_next/static/chunks/app/login/page-f2e490a2e60c9e90.js",
          revision: "f2e490a2e60c9e90",
        },
        {
          url: "/_next/static/chunks/app/offline/page-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/app/page-ab15d5ab8e355a62.js",
          revision: "ab15d5ab8e355a62",
        },
        {
          url: "/_next/static/chunks/app/robots.txt/route-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/app/sitemap.xml/route-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/framework-d7de93249215fb06.js",
          revision: "d7de93249215fb06",
        },
        {
          url: "/_next/static/chunks/main-76435924e79614c3.js",
          revision: "76435924e79614c3",
        },
        {
          url: "/_next/static/chunks/main-app-3b5e662062eb6d98.js",
          revision: "3b5e662062eb6d98",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-9ea367e325213f64.js",
          revision: "9ea367e325213f64",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-6afa18d74ad6f4ff.js",
          revision: "6afa18d74ad6f4ff",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-66762e64fe37b381.js",
          revision: "66762e64fe37b381",
        },
        {
          url: "/_next/static/css/4b38f8a81c6e371a.css",
          revision: "4b38f8a81c6e371a",
        },
        {
          url: "/_next/static/media/19cfc7226ec3afaa-s.woff2",
          revision: "9dda5cfc9a46f256d0e131bb535e46f8",
        },
        {
          url: "/_next/static/media/21350d82a1f187e9-s.woff2",
          revision: "4e2553027f1d60eff32898367dd4d541",
        },
        {
          url: "/_next/static/media/8e9860b6e62d6359-s.woff2",
          revision: "01ba6c2a184b8cba08b0d57167664d75",
        },
        {
          url: "/_next/static/media/ba9851c3c22cd980-s.woff2",
          revision: "9e494903d6b0ffec1a1e14d34427d44d",
        },
        {
          url: "/_next/static/media/c5fe6dc8356a8c31-s.woff2",
          revision: "027a89e9ab733a145db70f09b8a18b42",
        },
        {
          url: "/_next/static/media/df0a9ae256c0569c-s.woff2",
          revision: "d54db44de5ccb18886ece2fda72bdfe0",
        },
        {
          url: "/_next/static/media/e4af272ccee01ff0-s.p.woff2",
          revision: "65850a373e258f1c897a2b3d75eb74de",
        },
        {
          url: "/avatar-emily.png",
          revision: "9973e583acb79459fc7daede6c7e096a",
        },
        {
          url: "/avatar-jessica.png",
          revision: "82b8886da64a4e361eeeb648526ee6ce",
        },
        {
          url: "/avatar-sarah.png",
          revision: "66b2b4e72fc2dd87f12c9933c99e6de5",
        },
        { url: "/favicon.svg", revision: "87c31c7fee25b4d10030803df10edbcb" },
        {
          url: "/feature-groceries.png",
          revision: "57c1be6956f101938aefb302e51debc7",
        },
        {
          url: "/feature-import.png",
          revision: "0511b6421e3296a63f459a4a38f810d2",
        },
        {
          url: "/feature-mom.png",
          revision: "32fec02653bd65156809b00830d347f5",
        },
        {
          url: "/feature-sharing.png",
          revision: "7cf306fae26c540f402e4d9abeece2ac",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        { url: "/hero-mom.png", revision: "9833867e41fd38fc331618f109f5636d" },
        {
          url: "/icon-192x192.png",
          revision: "55b14c5a4be45a05654de34eb968aa84",
        },
        { url: "/manifest.json", revision: "7e8b89c3c8a7b820b6927fd8a6fff00e" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/step-1.png", revision: "320ede17bb6a49ec22905ef5faf74980" },
        { url: "/step-2.png", revision: "33d29ce55cd0a7e75ad75570c1731639" },
        { url: "/step-3.png", revision: "b91868aceaae19b28a75ba471364fc93" },
        { url: "/step-4.png", revision: "378fff91ed56c7a4283ebc62bc0a6b37" },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "76fdd3369f623a3edcf74ce2200bfdd0",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: a } }) =>
        !(!e || a.startsWith("/api/auth/callback") || !a.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: s }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        s &&
        !a.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: a }, sameOrigin: s }) =>
        "1" === e.headers.get("RSC") && s && !a.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: a }) => a && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0));
});
