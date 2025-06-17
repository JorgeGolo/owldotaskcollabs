import React, { useRef, useContext } from "react";
import * as LucideIcons from "lucide-react";
import { AppClientContext } from "../context/ClientDataProvider"; // Asegúrate de usar el contexto correcto

import Link from "next/link";

import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CategoryItem = ({ category, categoryName, quizCount, questionCount }) => {
  const { iconCategories } = useContext(AppClientContext);

  const iconName =
    iconCategories.find(
      (item) => item.name.toLowerCase() === categoryName.toLowerCase(), // Use categoryName to match with the name in the array
    )?.iconcategory || "Layers";

  const IconComponent = LucideIcons[iconName];
  const iconcolor = "#1e2a47";

  return (
    <motion.div
      className="w-full"
      variants={itemVariants}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        href={`/quizzes/${encodeURIComponent(category)}`}
        className="p-2 md:p-4 bg-blue-50 text-gray text-center rounded-lg shadow hover:bg-yellow-100 transition flex flex-col items-center
        dark:bg-strong-blue dark:hover:bg-[#ef7e44]
        "
      >
        {IconComponent && <IconComponent size={32} color={iconcolor} />}
        <span className="mt-2 text-ssm md:text-sm font-semibold">
          {categoryName}
        </span>
        <div
          className="mt-1 text-[11px] text-gray-600
        dark:text-white
        "
        >
          <p>{quizCount} quizzes</p>
          <p>{questionCount} questions</p>
        </div>
      </Link>
    </motion.div>
  );
};

const CategoryMap = ({ quizzes, limit = null }) => {
  const categoryDataMap = quizzes.reduce((acc, quiz) => {
    const slug = quiz.category_slug;
    if (!acc[slug]) {
      acc[slug] = {
        category: quiz.category,
        quizCount: 0,
        questionCount: 0,
      };
    }
    acc[slug].quizCount += 1;
    acc[slug].questionCount += quiz.numberOfQuestions || 0;
    return acc;
  }, {});

  // Convertimos a array para poder ordenar
  let categoryEntries = Object.entries(categoryDataMap);

  if (limit !== null) {
    // Ordenar por mayor cantidad de quizzes y limitar
    categoryEntries = categoryEntries
      .sort((a, b) => b[1].quizCount - a[1].quizCount)
      .slice(0, limit);
  }

  const categoryCount = categoryEntries.length;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-2 py-4 ${
        categoryCount < 8 ? "justify-center" : ""
      }`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {categoryEntries.map(([slug, data]) => (
        <CategoryItem
          key={slug}
          category={slug}
          categoryName={data.category}
          quizCount={data.quizCount}
          questionCount={data.questionCount}
        />
      ))}
    </motion.div>
  );
};

export default CategoryMap;
