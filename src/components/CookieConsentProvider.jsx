import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const COOKIE_NAME = "owldo_consent";

// Recupera el consentimiento desde la cookie
const getConsent = () => {
  const match = document.cookie.match(
    new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return null;

  const raw = decodeURIComponent(match[2]);

  try {
    return JSON.parse(raw);
  } catch {
    return raw; // Para versiones anteriores con 'accepted' o 'rejected'
  }
};

// Guarda el consentimiento (aceptado, rechazado o personalizado)
const setConsent = (value) => {
  let consentValues;

  if (typeof value === "string") {
    consentValues = {
      ad_storage: value === "accepted" ? "granted" : "denied",
      analytics_storage: value === "accepted" ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: value === "accepted" ? "granted" : "denied",
      security_storage: "granted",
    };
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000`;
  } else {
    consentValues = {
      functionality_storage: "granted",
      security_storage: "granted",
      ...value,
    };
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consentValues))}; path=/; max-age=31536000`;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "update_consent", ...consentValues });
};

// Elimina todas las cookies de consentimiento
const clearAllCookies = () => {
  // Lista de posibles nombres de cookies relacionadas con analytics, ads, etc.
  const cookiesToClear = [
    COOKIE_NAME,
    "_ga",
    "_ga_*",
    "_gid",
    "_gat",
    "_gat_*",
    "_fbp",
    "_fbc",
    "__utma",
    "__utmb",
    "__utmc",
    "__utmt",
    "__utmz",
    "_hjid",
    "_hjFirstSeen",
    "_hjIncludedInSessionSample",
    "IDE",
    "DSID",
    "FLC",
    "AID",
    "TAID",
    "_gcl_au",
    "_gcl_aw",
    "_gcl_dc",
  ];

  // Eliminar cookies del dominio actual
  cookiesToClear.forEach((cookieName) => {
    // Para cookies con wildcards como _ga_*, necesitamos buscar todas las que coincidan
    if (cookieName.includes("*")) {
      const prefix = cookieName.replace("*", "");
      const allCookies = document.cookie.split(";");

      allCookies.forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        if (name.startsWith(prefix)) {
          // Eliminar con diferentes combinaciones de path y domain
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        }
      });
    } else {
      // Eliminar cookie específica con diferentes combinaciones de path y domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    }
  });

  // Limpiar localStorage y sessionStorage relacionado con analytics
  const storageKeysToRemove = [
    "_ga",
    "_gid",
    "_gat",
    "ga_sessionToken",
    "ga_userId",
    "_hjTLDTest",
    "_hjUserAttributesHash",
    "_hjCachedUserAttributes",
    "fbp",
    "fbc",
  ];

  storageKeysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (e) {
      // Ignorar errores de acceso a storage
    }
  });

  // Notificar a Google Analytics y otros servicios sobre la revocación
  const revokedConsent = {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "consent_revoked", ...revokedConsent });
};

// Inicializa valores por defecto si no hay consentimiento
const initializeDefaultConsent = () => {
  const defaultConsent = {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  };

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(defaultConsent))}; path=/; max-age=31536000`;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "default_consent", ...defaultConsent });
};

export const CookieConsentProvider = () => {
  const [visible, setVisible] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    ad_storage: false,
    analytics_storage: false,
    personalization_storage: false,
  });

  useEffect(() => {
    const storedConsent = getConsent();

    if (!storedConsent) {
      initializeDefaultConsent();
      setVisible(true);
    } else {
      if (typeof storedConsent === "string") {
        setConsent(storedConsent); // reenviar a dataLayer
      } else {
        // Si ya hay preferencias personalizadas, reflejarlas en el estado local
        setConfig({
          ad_storage: storedConsent.ad_storage === "granted",
          analytics_storage: storedConsent.analytics_storage === "granted",
          personalization_storage:
            storedConsent.personalization_storage === "granted",
        });
        setConsent(storedConsent); // reenviar por si refresca la página
      }
    }
  }, []);

  const accept = () => {
    setConsent("accepted");
    setConfig({
      ad_storage: true,
      analytics_storage: true,
      personalization_storage: true,
    });
    setVisible(false);
    setForceVisible(false);
  };

  const reject = () => {
    // Primero eliminar todas las cookies existentes
    clearAllCookies();

    // Luego establecer el estado como rechazado
    setConsent("rejected");
    setConfig({
      ad_storage: false,
      analytics_storage: false,
      personalization_storage: false,
    });
    setVisible(false);
    setForceVisible(false);
  };

  const saveCustomConfig = () => {
    setConsent({
      ad_storage: config.ad_storage ? "granted" : "denied",
      analytics_storage: config.analytics_storage ? "granted" : "denied",
      functionality_storage: "granted",
      personalization_storage: config.personalization_storage
        ? "granted"
        : "denied",
      security_storage: "granted",
    });
    setVisible(false);
    setForceVisible(false);
    setShowConfig(false);
  };

  return (
    <>
      {visible || forceVisible ? (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 shadow-md">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <p className="text-sm">
              We use cookies to personalize content and analyze traffic. By
              clicking "Accept", you consent to our use of cookies. Read our{" "}
              <a href="/cookies" className="underline">
                cookie policy
              </a>
              .
            </p>

            {showConfig ? (
              <div className="bg-gray-700 p-3 rounded-md space-y-3 text-sm text-white">
                <p>
                  Some cookies are necessary for the proper functioning of the
                  site and are always active.
                </p>
                <p>
                  By checking the boxes, you consent to the use of cookies for
                  analytics, advertising, and/or personalization, according to
                  your selection.
                </p>

                <div className="flex flex-col gap-1 pl-1">
                  <label className="opacity-60 cursor-not-allowed">
                    <input type="checkbox" checked disabled className="mr-2" />
                    Functionality Cookies (Required)
                  </label>
                  <label className="opacity-60 cursor-not-allowed">
                    <input type="checkbox" checked disabled className="mr-2" />
                    Security Cookies (Required)
                  </label>
                </div>

                <div className="flex flex-col gap-1 pt-2 pl-1">
                  <label>
                    <input
                      type="checkbox"
                      checked={config.analytics_storage}
                      onChange={() =>
                        setConfig((prev) => ({
                          ...prev,
                          analytics_storage: !prev.analytics_storage,
                        }))
                      }
                      className="mr-2"
                    />
                    Analytics Cookies
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={config.ad_storage}
                      onChange={() =>
                        setConfig((prev) => ({
                          ...prev,
                          ad_storage: !prev.ad_storage,
                        }))
                      }
                      className="mr-2"
                    />
                    Advertising Cookies
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={config.personalization_storage}
                      onChange={() =>
                        setConfig((prev) => ({
                          ...prev,
                          personalization_storage:
                            !prev.personalization_storage,
                        }))
                      }
                      className="mr-2"
                    />
                    Personalization Cookies
                  </label>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={saveCustomConfig}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={() => setShowConfig(false)}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={accept}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-600 rounded text-sm"
                >
                  Accept All
                </button>
                <button
                  onClick={reject}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm"
                >
                  Reject All
                </button>

                <button
                  onClick={() => setShowConfig(true)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-sm"
                >
                  Configure
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          aria-label="Cookie preferences"
          onClick={() => setForceVisible(true)}
          className="opacity-50 fixed bottom-2 left-6 z-50 bg-white text-gray-700 shadow-lg p-3 rounded-full hover:bg-yellow-100 border-2 border-blue-500"
        >
          <Cookie className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

// Helpers externos
export const acceptConsent = () => setConsent("accepted");
export const rejectConsent = () => {
  clearAllCookies();
  setConsent("rejected");
};
export const getStoredConsent = () => getConsent();
export const clearAllConsentCookies = () => clearAllCookies();
