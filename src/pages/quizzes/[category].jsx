import { React, useContext } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Breadcrumb from '../../components/BreadCrumb';
import { FaFeather } from 'react-icons/fa';
import Head from 'next/head';
import { AppClientContext } from '../../context/ClientDataProvider'; // Asegúrate de que la ruta sea la correcta

// ✅ Genera todas las rutas de categorías con slug
export async function getStaticPaths() {
  const snapshot = await getDocs(collection(db, 'quizzes'));
  const categories = new Set();

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.category_slug) {
      categories.add(data.category_slug);
    }
  });

  const paths = Array.from(categories).map((category) => ({
    params: { category },
  }));

  return {
    paths,
    fallback: false, // Solo las rutas disponibles al build
  };
}
function serialize(obj) {
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
}
export async function getStaticProps({ params }) {
  const { category } = params;

  const q = query(
    collection(db, 'quizzes'),
    where('category_slug', '==', category),
  );
  const querySnapshot = await getDocs(q);

  const quizzes = await Promise.all(
    querySnapshot.docs.map(async (quizDoc) => {
      const rawData = quizDoc.data();

      const quizData = {
        id: quizDoc.id,
        ...serialize(rawData),
      };

      const chaptersRef = collection(
        doc(db, 'quizzes', quizDoc.id),
        'chapters',
      );
      const chaptersSnapshot = await getDocs(chaptersRef);
      const chapters = chaptersSnapshot.docs.map((chapterDoc) =>
        serialize({ id: chapterDoc.id, ...chapterDoc.data() }),
      );

      const fichalibroRef = collection(
        doc(db, 'quizzes', quizDoc.id),
        'fichalibro',
      );
      const fichalibroSnapshot = await getDocs(fichalibroRef);
      let fichalibro = null;
      if (!fichalibroSnapshot.empty) {
        const fichalibroDoc = fichalibroSnapshot.docs[0];
        fichalibro = serialize(fichalibroDoc.data());
      }

      return { ...quizData, chapters, fichalibro };
    }),
  );

  return {
    props: {
      quizzes,
      category,
      categoryName: quizzes.length > 0 ? quizzes[0].category : category,
    },
  };
}

const category = ({ quizzes, category, categoryName }) => {
  const { bebasNeueClass } = useContext(AppClientContext);

  const canonicalUrl = `https://owldotask.com/quizzes/${category}/`;

  const breadcrumbSegments = [
    { name: 'Home', path: '/' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: categoryName, path: `/quizzes/${category}` },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <title>Quizzes of {categoryName} | OwldoTask</title>
        <meta
          name="description"
          content={`Explore quizzes in the ${categoryName} category on OwldoTask and earn feathers while you learn.`}
        />
      </Head>

      <div className="p-4 w-full">
        <Breadcrumb segments={breadcrumbSegments} />
        <h1 className="text-xl font-bold">Quizzes of {categoryName}</h1>

        {quizzes.length > 0 ? (
          <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
            <table className="w-full bg-white rounded-md text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left justify-center flex">
                    Feathers
                  </th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-100 border-b">
                    <td>
                      <Link
                        href={`/quizzes/${encodeURIComponent(category)}/${quiz.title_slug}`}
                        className="block w-full p-4 text-blue-600 hover:underline"
                      >
                        {quiz.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-center h-full">
                        <span className={`text-lg ${bebasNeueClass}`}>
                          {quiz.numberOfQuestions}
                        </span>
                        <FaFeather className="w-5 h-5 text-yellow-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">
            There are no quizzes in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default category;
