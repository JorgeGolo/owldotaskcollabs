import { React, useState, useEffect } from 'react';
import SwiperGallery from '../../components/SwiperGallery';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';

const about = () => {
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    const url = `https://${window.location.hostname.replace(/^www\./, '')}${window.location.pathname}`;
    setCanonicalUrl(url);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      <Head>
        <title>About Us | OwldoTask</title>
        <meta
          name="description"
          content="Learn more about the OwldoTask platform and how we combine learning with gamification and rewards."
        />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content="About OwldoTask" />
        <meta
          property="og:description"
          content="Discover how OwldoTask helps you learn and earn through fun quizzes and tasks."
        />
        <meta
          property="og:image"
          content="https://owldotask.com/assets/images/bpeq.png"
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About OwldoTask" />
        <meta
          name="twitter:description"
          content="Discover how OwldoTask helps you learn and earn through fun quizzes and tasks."
        />
        <meta
          name="twitter:image"
          content="https://owldotask.com/assets/images/bpeq.png"
        />
      </Head>
      <div className="p-4 max-w-5xl">
        <div className="mb-6 p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h1 className="text-2xl font-bold mb-6">
            <span className="text-[#214396]">OwldoTask</span> – About Us
          </h1>

          <h2 className="text-2xl font-semibold mt-8 mb-2">🤝 The team</h2>

          <p className="mb-4">
            <span className="font-semibold">OwldoTask</span> is a project born
            from the passion of a group of friends who wanted to create a
            platform that combines learning with fun and rewards. Our goal is to
            provide a space where users can test their knowledge, discover new
            topics, and earn rewards in the form of{' '}
            <span className="italic">feathers</span> for their achievements. We
            believe that learning should be an enjoyable experience, and we
            strive to make that a reality with every quiz and task we offer.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            ⚙️ Some technical stuff
          </h2>

          <p className="mb-4">
            <span className="font-semibold">OwldoTask</span> is built using a
            combination of modern technologies to ensure a smooth and efficient
            user experience.
          </p>

          <ul className="mb-4 ml-ml-2 list-disc">
            <li>Developed in React for interactive and dynamic interfaces.</li>
            <li>
              Migrated from Vite to Next.js to leverage Static Site Generation
              (SSG) for pre-rendering.
            </li>
            <li>
              Frontend content is fetched from Firestore Database collections
              and documents.
            </li>
            <li>Authentication is managed with Firebase Auth.</li>
            <li>Tailwind CSS for responsive and modern design.</li>
            <li>Utilized `react-pwa` library for app functionality.</li>
            <li>
              The Laravel backend is designed for content generation via CRUD
              operations and user management.
            </li>
            <li>Generated data is sent to the frontend's database.</li>
            <li>
              User data is stored in PostgreSQL and exposed via RESTful
              endpoints for frontend interaction.
            </li>
            <li>
              Connects with Artificial Intelligence APIs to automatically create
              text with specific formatting.
            </li>
            <li>
              Connects with Artificial Intelligence APIs using special prompts
              with JSON responses to ensure correct interpretation of answers.
            </li>
            <li>
              Integration and consumption of proprietary RESTful APIs for
              efficient communication between frontend and backend.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            🚀 Promotion and marketing
          </h2>

          <ul className="mb-4">
            <li>
              We are active on Reddit to create community and get good feedback
            </li>
            <li>
              We post about new content on the platform on our social networks -
              links in the footer.
            </li>
            <li>
              We hang out on Discord to chat with users and developers:{' '}
              <Link
                href="https://discord.gg/ZkFUudxw"
                className="text-blue-500 hover:underline"
              >
                Join us!
              </Link>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-2">
            💰 Financial aspects and rewards
          </h2>

          <p className="mb-4">
            We have developed a system that allows users to earn real-life
            rewards for their achievements on the platform. This includes POL
            transfers to wallet users. We believe that by rewarding our users
            for their hard work, we can create a more engaging and enjoyable
            experience for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // No necesitas pasar props si no hay datos dinámicos
  };
}

export default about;
