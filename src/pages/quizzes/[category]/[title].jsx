// ✅ Página dinámica de cuestionarios con rutas estáticas en Next.js
import { React, useContext } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Breadcrumb from '../../../components/BreadCrumb';
import Test from '../../../components/Test';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { AppClientContext } from '../../../context/ClientDataProvider';

//
import useOnlineStatus from '../../../components/useOnlineStatus'; // Importa el hook de estado de conexión

function serialize(obj) {
  if (obj === undefined || obj === null) return null;
  if (typeof obj.toDate === 'function') return obj.toDate().toISOString();
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = serialize(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collection(db, 'quizzes'));
  const paths = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      params: {
        category: data.category_slug,
        title: data.title_slug,
      },
    };
  });
  return { paths, fallback: false };
}

// Versión con backend Laravel y fallback a Firebase
// delete? poruqe ya no usamos esta función... por lo fallido de intentar la generación incremental de rutas
export async function getStaticPathsPRO() {
  let paths = [];

  try {
    const res = await fetch(
      'https://8txnxmkveg.us-east-1.awsapprunner.com/api/frontend/quizzes-paths',
    );
    if (!res.ok) throw new Error('JSON fetch failed');
    const data = await res.json();

    paths = data.map(({ category, title }) => ({
      params: { category, title },
    }));

    console.log(`✅ ${paths.length} rutas cargadas desde el backend`);
  } catch (err) {
    console.warn('⚠️ Error al leer el JSON, usando Firebase como fallback');

    const snapshot = await getDocs(collection(db, 'quizzes'));
    paths = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        params: {
          category: data.category_slug,
          title: data.title_slug,
        },
      };
    });
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { title, category } = params;

  const q = query(collection(db, 'quizzes'), where('title_slug', '==', title));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { notFound: true };
  }

  const quizDoc = querySnapshot.docs[0];
  const rawQuiz = quizDoc.data();
  const quiz = { id: quizDoc.id, ...serialize(rawQuiz) };

  const chaptersRef = collection(doc(db, 'quizzes', quizDoc.id), 'chapters');
  const chaptersSnapshot = await getDocs(chaptersRef);
  const chapters = chaptersSnapshot.docs
    .map((doc) => serialize({ id: Number(doc.data().id), ...doc.data() }))
    .sort((a, b) => a.id - b.id);

  const fichalibroRef = collection(
    doc(db, 'quizzes', quizDoc.id),
    'fichalibro',
  );
  const fichalibroSnapshot = await getDocs(fichalibroRef);
  const fichalibro = fichalibroSnapshot.empty
    ? null
    : serialize(fichalibroSnapshot.docs[0].data());

  return {
    props: { quiz, chapters, fichalibro, category },
  };
}

const Questionnaire = ({ quiz, chapters, fichalibro, category }) => {
  const { isReliablyOnline } = useOnlineStatus(); // Obtén el estado de conexión

  const currentUrl = `https://owldotask.com/quizzes/${category}/${quiz.title_slug}/`;

  const breadcrumbSegments = [
    { name: 'Home', path: '/' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: quiz.category, path: `/quizzes/${category}` },
    { name: quiz.title, path: currentUrl },
  ];

  const { shareOnSocial, getOfflineMessage } = useContext(AppClientContext);

  const shareMessage =
    'Check out OwldoTask and earn feathers by completing tasks!';

  return (
    <div className="flex flex-col lg:flex-row">
      <Head>
        <title>{`${quiz.title} | Quiz | OwldoTask`}</title>
        <meta
          name="description"
          content={`Discover our ${quiz.title} quiz and earn ${quiz.numberOfQuestions ?? 'a bunch of'} feathers!`}
        />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph / Facebook */}
        <meta
          property="og:title"
          content={`${quiz.title} | Quiz | OwldoTask`}
        />
        <meta
          property="og:description"
          content={`Take the ${quiz.title} quiz on OwldoTask and earn feathers! 🦉✨`}
        />
        <meta
          property="og:image"
          content="https://owldotask.com/assets/images/bpeq.png"
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${quiz.title} | Quiz | OwldoTask`}
        />
        <meta
          name="twitter:description"
          content={`Discover our ${quiz.title} quiz and earn ${quiz.numberOfQuestions ?? 'a bunch of'} feathers!`}
        />
        <meta
          name="twitter:image"
          content="https://owldotask.com/assets/images/bpeq.png"
        />
        <meta name="twitter:url" content={currentUrl} />
      </Head>

      <div className="p-4">
        <Breadcrumb segments={breadcrumbSegments} />
        <h1 className="text-xl font-bold">{quiz.title}</h1>

        <div className="mt-2 mb-2">
          <div className="pl-2 flex items-center bg-[#fef9c3] border border-[#eab308] rounded-md text-[#3f2e1f]">
            {/* Share to get 1 <span className="inline-flex items-center ml-1">{featherIcon}</span> feather */}
            <span className="italic text-sm">Share it!</span>

            <div className="flex items-center space-x-2 p-2">
              {shareOnSocial('facebook', currentUrl, shareMessage)}
              {shareOnSocial('twitter', currentUrl, shareMessage)}
              {shareOnSocial('whatsapp', currentUrl, shareMessage)}
              {shareOnSocial('reddit', currentUrl, shareMessage)}{' '}
              {/* ¡Botón de Reddit aquí! */}
            </div>
          </div>
        </div>

        {!isReliablyOnline ? (
          getOfflineMessage()
        ) : (
          <Test
            chapters={chapters}
            title={quiz.title_slug}
            numberOfQuestions={quiz.numberOfQuestions}
          />
        )}

        {fichalibro && (
          <div className="mt-4 mb-4">
            <motion.div className="border border-1 border-green-200 flex flex-col md:flex-row p-4 mb-2 bg-green-50 rounded-lg shadow hover:shadow-lg transition">
              {fichalibro.Cover && (
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                  <img
                    src={fichalibro.Cover}
                    alt="Cover"
                    className="w-full md:w-48 h-auto rounded"
                  />
                </div>
              )}
              <div className="flex-grow">
                <ul className="text-gray-800">
                  {fichalibro.Title && (
                    <li className="mb-2">
                      <strong>Title:</strong> {fichalibro.Title}
                    </li>
                  )}
                  {fichalibro.Author && (
                    <li className="mb-2">
                      <strong>Author:</strong> {fichalibro.Author}
                    </li>
                  )}
                  {fichalibro.Year && (
                    <li className="mb-2">
                      <strong>Year:</strong> {fichalibro.Year}
                    </li>
                  )}
                  {fichalibro.Pages && (
                    <li className="mb-2">
                      <strong>Pages:</strong> {fichalibro.Pages}
                    </li>
                  )}
                  {fichalibro.Editions && (
                    <li className="mb-2">
                      <strong>Editions:</strong> {fichalibro.Editions}
                    </li>
                  )}
                  {fichalibro.Description && (
                    <li className="mb-2">
                      <strong>Description:</strong> {fichalibro.Description}
                    </li>
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        )}

        {chapters.length > 0 ? (
          <div className="mt-4">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="mb-6">
                <h3>{chapter.titulo}</h3>
                <p>{chapter.contenido}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No content.</p>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
