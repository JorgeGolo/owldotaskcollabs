import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tags esenciales */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />

        {/* Google Tag Manager */}
         <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=GTM-K3N55PGV'+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K3N55PGV');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Verificación de Google */}
        <meta
          name="google-site-verification"
          content="mQkjgG7LpJRhl-RdTExmcZxS6mXAjwxeLk4kh5qsgLo"
        />

        {/* Favicons y manifiesto */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/*<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />*/}
        {/*<link rel="manifest" href="/site.webmanifest" />*/}
        <link rel="manifest" href="/manifest.json" />
       

      </Head>
      <body>

        {/* Google Tag Manager (noscript)*/}
        <noscript>
        <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K3N55PGV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
