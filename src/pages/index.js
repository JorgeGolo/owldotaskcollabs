import { React, useState, useEffect, useContext } from 'react';
import StatsSection from '../components/StatsSection';
import Head from 'next/head';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import CategoryMap from '../components/CategoryMap'; // importa el componente
import { AppClientContext } from '../context/ClientDataProvider';
import TechGrid from '../components/TechGrid';

import AdMobBanner1 from '../components/AdMobBanner1'; // Adjust path as needed
import Link from 'next/link';

const Home = ({
  stats = { feathers: 0, quizzes: 0, questions: 0 },
  quizzes,
}) => {
  const { showLevelUpPopup } = useContext(AppClientContext);

  const handleManualLevelUp = () => {
    // Llama a la función del contexto para mostrar el popup con un nivel específico
    showLevelUpPopup(10); // Muestra el popup para el nivel 10
  };

  const { featherIcon } = useContext(AppClientContext);

  const [canonicalUrl, setCanonicalUrl] = useState('');

  // Evento de prueba para GTM
  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        custom_page: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    const url = `https://${window.location.hostname.replace(/^www\./, '')}${window.location.pathname}`;
    setCanonicalUrl(url);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <Head>
        <title>Owldotask - Learn, Play, and Earn</title>
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta
          name="description"
          content="Owldotask - Learn, Play, and Earn with our games and quizzes. Enjoy a platform with a game-like experiencem, and even gain rewards. Play to earn!"
        />
      </Head>
      <div className="p-4 max-w-5xl">
        <div className="mb-6 p-4 md:p-6 bg-white dark:bg-dark-2 rounded-lg shadow hover:shadow-lg transition">
          <h1 className="text-2xl font-bold  mb-6">
            <span className="text-[#214396] dark:text-light-blue">
              Owldotask
            </span>{' '}
            – Learn, Play, and Earn
          </h1>

          <p className="mb-4">
            <span className="font-semibold">Owldotask</span> is a platform
            designed to give users the opportunity to earn profits by doing
            small tasks. Complete quizzes, play games, and earn feathers to
            claim your rewards
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🗂️ Quiz categories on Owldotask
          </h2>

          <p>
            Each quiz isn’t just a chance to test your knowledge—it’s an
            invitation to challenge your assumptions, uncover hidden insights,
            and grow your understanding with every question you face.
          </p>

          <CategoryMap quizzes={quizzes} limit={12} />

          <Link
            href="/quizzes"
            className="text-blue-500 hover:underline dark:text-light-blue"
          >
            See all quizzes and categories
          </Link>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🧮 Owldotask quiz stats
          </h2>
          <p className="mb-4">
            Thanks to our innovative content creation system — powered by data
            storage tools, retrieval technologies, and artificial intelligence —
            we continuously generate new content to keep the platform growing.
            And now, here are the numbers.
          </p>

          <StatsSection
            feathersCount={stats.feathers}
            quizzesCount={stats.quizzes}
            questionsCount={stats.questions}
          />

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🧩 Owldotask games
          </h2>

          <p>
            Games that offer a playful way to practice core skills, challenge
            your thinking, and earn feathers as proof that even a few minutes of
            fun can lead to meaningful learning progress.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🎁 Start earning feathers for every task
          </h2>

          <p className="mb-4">
            Every task you complete earns you points as a reward. These points,
            called <span className="font-semibold">feathers</span>{' '}
            <span className="text-yellow-500 inline-flex items-center ml-1">
              {featherIcon}
            </span>
            , help you climb the leaderboard, unlock perks, and even earn
            real-life rewards. Sing-in with your Google account and click here
            or on the feather icon next to your avatar for more info.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🚀 Powered by modern technologies
          </h2>
          <p className="mb-4">
            Our platform is built with the latest web technologies, delivering a
            fast, smooth, and fully responsive experience. With a friendly and
            intuitive interface, you'll feel at home from the very first click.
          </p>

          <TechGrid />

          <h2 className="text-2xl font-semibold mt-8 mb-2">🌱 Grow with us</h2>
          <p className="mb-4">
            This is just the beginning. We're constantly adding new quizzes,
            games, and platform upgrades. Our goal is to build an user-friendly,
            fun and educational web.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🔒 We take your privacy seriously
          </h2>
          <p className="mb-4">
            We fully comply with data protection laws (including GDPR), and we
            will never share your information without your consent.{' '}
            <span className="font-semibold">Owldotask</span> is a safe and
            trusted space, crafted to offer a fun and secure experience for
            users of all ages.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            📱 Follow us and stay updated
          </h2>
          <p className="mb-6">
            Want to be the first to know about new features, exclusive
            challenges, and giveaways? Follow us on social media and join the{' '}
            <span className="font-semibold">Owldotask</span> community. Because
            learning is better together.
          </p>

          <p className="text-lg font-medium mt-8 text-center">
            <span className="font-bold">Owldotask</span> isn’t just a website.{' '}
            <br />
            It’s your new way to learn, compete, enjoy, and grow. <br />
            <span className="italic">Explore, answer, play and earn.</span>
          </p>

          <div>
            {/*<AdMobBanner1 />*/}
            <div>
              <button
                onClick={handleManualLevelUp}
                className="hidden bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Trigger Level Up Popup (Manually)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const db = getFirestore(app);
  const querySnapshot = await getDocs(collection(db, 'quizzes'));

  // Serializador compatible con Next.js
  const serialize = (obj) => {
    if (obj === undefined) return null;
    if (obj === null) return null;
    if (obj instanceof Date) return obj.toISOString();
    if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
    if (Array.isArray(obj)) return obj.map(serialize);
    if (typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        newObj[key] = serialize(obj[key]);
      }
      return newObj;
    }
    return obj;
  };

  // Obtener y serializar todos los quizzes
  const quizzes = await Promise.all(
    querySnapshot.docs.map(async (quizDoc) => {
      return { id: quizDoc.id, ...serialize(quizDoc.data()) };
    }),
  );

  // Estadísticas basadas en los quizzes
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce(
    (acc, q) => acc + (q.numberOfQuestions || 0),
    0,
  );
  const feathers = totalQuestions + totalQuizzes * 5; // lógica combinada

  return {
    props: {
      quizzes,
      stats: {
        feathers,
        quizzes: totalQuizzes,
        questions: totalQuestions,
      },
    },
    // revalidate: 60, // opcional para habilitar ISR (Incremental Static Regeneration)
  };
}

export default Home;
