// pages/quizzes/index.jsx
import { React, useMemo, useState, useContext } from "react";
import Link from "next/link";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase";
import * as LucideIcons from "lucide-react";
import { FaFeather } from "react-icons/fa";
import Breadcrumb from "../components/BreadCrumb";
import Head from "next/head";
import CategoryMap from "../components/CategoryMap"; // importa el componente
import { AppClientContext } from "../context/ClientDataProvider"; // Asegúrate de que la ruta sea la correcta

const categoryIcons = {
  computing: "Cpu",
  work: "Briefcase",
  music: "Music",
  noticias: "Newspaper",
  fitness: "Dumbbell",
  health: "Heart",
  viajes: "Globe",
  sports: "Dribbble",
  psychology: "Brain",
  books: "Book",
  celebrities: "Star",
};

// ✅ Para evitar problemas de serialización en Next.js
function serialize(obj) {
  if (obj === undefined) return null;
  if (obj === null) return null;
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj.toDate === "function") return obj.toDate().toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = serialize(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// 🔁 SSG
export async function getStaticProps() {
  const querySnapshot = await getDocs(collection(db, "quizzes"));

  const quizzesRaw = await Promise.all(
    querySnapshot.docs.map(async (quizDoc) => {
      const quizData = { id: quizDoc.id, ...serialize(quizDoc.data()) };

      const chaptersRef = collection(
        doc(db, "quizzes", quizDoc.id),
        "chapters",
      );
      const chaptersSnapshot = await getDocs(chaptersRef);
      const chapters = chaptersSnapshot.docs.map((chapterDoc) =>
        serialize({ id: chapterDoc.id, ...chapterDoc.data() }),
      );

      const fichalibroRef = collection(
        doc(db, "quizzes", quizDoc.id),
        "fichalibro",
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

  // ✅ Validar que tengan slugs correctos
  const quizzes = quizzesRaw.filter(
    (q) =>
      typeof q.category_slug === "string" &&
      typeof q.title_slug === "string" &&
      q.category_slug.trim() !== "" &&
      q.title_slug.trim() !== "",
  );

  return {
    props: {
      quizzes,
    },
  };
}

const Questionnaires = ({ quizzes }) => {
  const { bebasNeueClass } = useContext(AppClientContext);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key, direction: "asc" };
      }
    });
  };

  const sortedQuizzes = useMemo(() => {
    let sorted = [...quizzes];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  }, [quizzes, sortConfig]);

  const breadcrumbSegments = [
    { name: "Home", path: "/" },
    { name: "Quizzes", path: "/quizzes" },
  ];

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <Head>
        <title>All Quizzes fron all categories | OwldoTask</title>
        <meta
          name="description"
          content="Explore all quizzes and categories on OwldoTask and earn feathers."
        />
        <link rel="canonical" href="https://owldotask.com/quizzes" />
      </Head>

      <div className="p-4 w-full">
        <Breadcrumb segments={breadcrumbSegments} />

        <CategoryMap quizzes={quizzes} />

        <h1>All Quizzes</h1>

        {quizzes.length > 0 ? (
          <div className="overflow-x-auto mt-4 rounded-lg shadow-lg">
            <table className="w-full bg-white rounded-md">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  <th
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort("title")}
                  >
                    Name{" "}
                    {sortConfig.key === "title"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                  <th className="p-4 text-left">Category</th>
                  <th
                    className="p-4 text-left cursor-pointer text-center"
                    onClick={() => handleSort("numberOfQuestions")}
                  >
                    Feathers{" "}
                    {sortConfig.key === "numberOfQuestions"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedQuizzes.map((quiz) => (
                  <tr
                    key={quiz.id}
                    className="hover:bg-gray-100 dark:bg-dark-2"
                  >
                    <td>
                      <Link
                        href={`/quizzes/${encodeURIComponent(quiz.category_slug)}/${encodeURIComponent(quiz.title_slug)}`}
                        className="block w-full p-4 text-blue-600 hover:underline 
                        dark:text-light-blue"
                      >
                        {quiz.title}
                      </Link>
                    </td>
                    <td className="p-4">{quiz.category}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-center h-full">
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
          <p className="text-gray-600">No quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default Questionnaires;
