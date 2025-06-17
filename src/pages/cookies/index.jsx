import React from "react";

const cookies = () => {
  return (
    <div className="mt-4 p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg cookiescontent">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">
        OwldoTask Cookie Policy
      </h1>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4 border-b border-gray-200 pb-2">
        Introduction
      </h2>
      <p className="text-gray-700 mb-6 leading-relaxed">
        This Cookie Policy explains how OwldoTask ("we," "us," or "our") uses
        cookies and similar technologies on our website. This policy provides
        you with clear and comprehensive information about the cookies we use
        and the purposes for which we use them in compliance with EU regulations
        (including the GDPR and ePrivacy Directive) and international privacy
        laws.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4 border-b border-gray-200 pb-2">
        What Are Cookies?
      </h2>
      <p className="text-gray-700 mb-6 leading-relaxed">
        Cookies are small text files that are stored on your device (computer,
        tablet, or mobile) when you visit our website. They allow us to
        recognize your device and remember certain information about your visit,
        such as your preferences and actions on our site. Cookies are widely
        used to make websites work more efficiently and provide valuable
        information to website owners.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4 border-b border-gray-200 pb-2">
        Types of Cookies We Use
      </h2>

      <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-3">
        1. Essential Cookies
      </h3>
      <p className="text-gray-700 mb-6 leading-relaxed">
        These cookies are necessary for the functioning of our website and
        cannot be switched off in our systems. They are usually only set in
        response to actions made by you which amount to a request for services,
        such as setting your privacy preferences, logging in, or filling in
        forms. You can set your browser to block or alert you about these
        cookies, but some parts of the site will not then work.
      </p>

      <h3>2. Performance Cookies</h3>
      <p>
        These cookies allow us to count visits and traffic sources so we can
        measure and improve the performance of our site. They help us to know
        which pages are the most and least popular and see how visitors move
        around the site. All information these cookies collect is aggregated and
        therefore anonymous. If you do not allow these cookies we will not know
        when you have visited our site.
      </p>

      <h3>3. Functionality Cookies</h3>
      <p>
        These cookies enable the website to provide enhanced functionality and
        personalization. They may be set by us or by third-party providers whose
        services we have added to our pages. If you do not allow these cookies,
        then some or all of these services may not function properly.
      </p>

      <p>
        Our site uses Firebase Authentication to enable login and registration
        via Google. This process requires the installation of cookies managed by
        Google LLC. If the user does not provide consent for the use of
        third-party cookies, login or registration via Google will not be
        available.
      </p>
      <p>
        The cookies used by Google include, among others: SID, HSID, SSID,
        SAPISID, APISID, NID, AEC, and secure variants such as _Secure-1PAPISID,
        etc. You can view Google’s cookie policy here.
      </p>

      <h3>4. Targeting/Advertising Cookies</h3>
      <p>
        These cookies may be set through our site by our advertising partners
        (such as Google AdSense). They may be used by those companies to build a
        profile of your interests and show you relevant adverts on other sites.
        They do not directly store personal information but are based on
        uniquely identifying your browser and internet device. If you do not
        allow these cookies, you will experience less targeted advertising.
      </p>

      <h2>Specific Cookies Used on Our Website</h2>

      <div className="cookies-grid-container">
        {/* Encabezados */}
        <div className="grid-header dark:bg-dark-1 p-2 border-b-2">
          <div className="grid-cell font-semibold">Cookie Name</div>
          <div className="grid-cell font-semibold">Provider</div>
          <div className="grid-cell font-semibold">Purpose</div>
          <div className="grid-cell font-semibold">Type</div>
          <div className="grid-cell font-semibold">Expiry</div>
        </div>

        {/* Filas de datos */}

        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            owldo_consent
          </div>
          <div class="grid-cell" data-label="Provider:">
            owldotask.com
          </div>
          <div class="grid-cell" data-label="Purpose:">
            To manage cookies
          </div>
          <div class="grid-cell" data-label="Type:">
            Functionality
          </div>
          <div class="grid-cell" data-label="Expiry:">
            1 year
          </div>
        </div>

        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            _ga
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google Analytics
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Used to distinguish unique users
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            2 years
          </div>
        </div>
        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            _ga_[ID]
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google Analytics
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Persists session state
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            2 years
          </div>
        </div>
        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            _gid
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google Analytics
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Used to distinguish users
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            24 hours
          </div>
        </div>
        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            _gat
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google Analytics
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Used to throttle request rate
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            1 minute
          </div>
        </div>

        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            _dc_gtm_[ID]
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google Tag Manager
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Used to control script loading
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            1 minute
          </div>
        </div>

        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            __gads, __gac_[ID]
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google AdMob
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Ad targeting and campaign measurement
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            Up to 13 months
          </div>
        </div>
        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            IDE
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google AdMob (DoubleClick)
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Ad personalization and frequency capping
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            13 months
          </div>
        </div>
        <div class="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div class="grid-cell" data-label="Cookie Name:">
            DSID, FLC, AID, TAID
          </div>
          <div class="grid-cell" data-label="Provider:">
            Google AdMob
          </div>
          <div class="grid-cell" data-label="Purpose:">
            Ad targeting and user identification
          </div>
          <div class="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div class="grid-cell" data-label="Expiry:">
            Up to 2 years
          </div>
        </div>

        <div className="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div className="grid-cell" data-label="Cookie Name:">
            SID, HSID, SSID, SAPISID, APISID
          </div>
          <div className="grid-cell" data-label="Provider:">
            Google (Firebase Auth)
          </div>
          <div className="grid-cell" data-label="Purpose:">
            Authenticate users and maintain session security
          </div>
          <div className="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div className="grid-cell" data-label="Expiry:">
            Up to 2 years
          </div>
        </div>

        <div className="grid-row p-2 border-b-2 dark:bg-dark-1">
          <div className="grid-cell" data-label="Cookie Name:">
            _Secure-*, AEC, NID
          </div>
          <div className="grid-cell" data-label="Provider:">
            Google
          </div>
          <div className="grid-cell" data-label="Purpose:">
            Enhanced security and personalization during login
          </div>
          <div className="grid-cell" data-label="Type:">
            Third-party / Consent required
          </div>
          <div className="grid-cell" data-label="Expiry:">
            Up to 13 months
          </div>
        </div>
      </div>

      <h2>Third-Party Cookies</h2>
      <p>
        Our website includes content and services from third parties that may
        place cookies on your device. These include:
      </p>
      <ul className="list-disc pl-8 mb-6">
        <li className="mb-2">
          Google Firebase Authentication: Authentication and user management
          services
        </li>
        <li className="mb-2">Google Analytics: Web analytics service</li>
        <li className="mb-2">Google Adsense: Advertising services</li>
      </ul>
      <p>
        Please note that we do not have control over cookies set by these third
        parties. We recommend reviewing their respective privacy and cookie
        policies for more information.
      </p>

      <h2>Cookie Management</h2>

      <h3>Your Consent</h3>
      <p>
        When you first visit our website, you will be presented with a cookie
        banner giving you the option to accept or decline non-essential cookies.
        You can change your preferences at any time by clicking on the "Cookie
        Preferences" link at the bottom of our website.
      </p>

      <h3>Browser Settings</h3>
      <p>
        Most web browsers allow some control of cookies through browser
        settings. To find out more about cookies, including how to see what
        cookies have been set and how to manage and delete them, visit{" "}
        <a
          href="http://www.allaboutcookies.org"
          className="text-blue-600 hover:underline"
        >
          www.allaboutcookies.org
        </a>
        .
      </p>
      <p>
        You can prevent the setting of cookies by adjusting the settings on your
        browser:
      </p>
      <ul className="list-disc pl-8 mb-6">
        <li className="mb-2">
          Chrome: Settings &gt; Privacy and security &gt; Cookies and other site
          data
        </li>
        <li className="mb-2">
          Firefox: Options &gt; Privacy &amp; Security &gt; Cookies and Site
          Data
        </li>
        <li className="mb-2">
          Safari: Preferences &gt; Privacy &gt; Cookies and website data
        </li>
        <li className="mb-2">
          Microsoft Edge: Settings &gt; Cookies and site permissions &gt;
          Cookies and site data
        </li>
      </ul>
      <p>
        Please note that by disabling certain cookies, you may not be able to
        use all the features of our website.
      </p>

      <h2>Ad-Blocker Detection</h2>
      <p>
        Our website uses technology to detect if you are using an ad-blocker.
        This detection is necessary to inform authenticated users about our
        advertising-supported business model. The ad-blocker detection does not
        collect personal information but identifies if ad-blocking software is
        being used.
      </p>

      <h2>Updates to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        technology, regulation, or our business practices. Any changes will be
        posted on this page and, where appropriate, notified to you by email or
        a prominent notice on our website.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about our use of cookies or this Cookie
        Policy, please contact us at:
      </p>
      <p>
        Email: <strong>info@owldotask.com</strong>
      </p>

      <p className="mb-6 italic">Last updated: 09-06-2025</p>
    </div>
  );
};

//
export async function getStaticProps() {
  return {
    props: {}, // No necesitas pasar props si no hay datos dinámicos
  };
}

export default cookies;
