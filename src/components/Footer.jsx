import { React, useContext } from 'react';
//import { Link } from "react-router-dom";
import Link from 'next/link';
import { AppClientContext } from '../context/ClientDataProvider';

const Footer = () => {
  const appVersion = process.env.APP_VERSION;

  // 🔗 Obtenemos los íconos sociales del contexto del provider
  // por cómo están declarados en el provider, no necesitamso usestate ni nada
  // se usa useMemo para almacenar en memoria
  const { socialIcons2 } = useContext(AppClientContext);

  return (
    <footer className="bg-gray-900 text-gray-300 py-4 px-6 bottom-0 left-0 w-full">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-4 mb-4">
          {socialIcons2.map((icon, index) => (
            <a
              key={index}
              href={icon.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {icon.icon}
            </a>
          ))}
        </div>

        <div className="flex justify-center text-ssm">
          <span className="mx-2 hover:text-white">
            © {new Date().getFullYear()} OwldoTask
          </span>
          <span>|</span>
          <Link href="/privacypolicy" className="mx-2 hover:text-white">
            Privacy
          </Link>
          <span>|</span>
          <Link href="/termsofservice" className="mx-2 hover:text-white">
            T.O.S.
          </Link>
          <span>|</span>
          <Link href="/cookies" className="mx-2 hover:text-white">
            Cookies
          </Link>
          <span>|</span>
          <Link href="/about" className="mx-2 hover:text-white">
            About
          </Link>
        </div>
        {appVersion && (
          <p className="text-ssm italic mb-2 text-gray-300">
            Version: {appVersion}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
