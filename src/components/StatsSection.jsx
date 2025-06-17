// components/StatsSection.tsx
import CountUp from "react-countup";

const StatsSection = ({ feathersCount, quizzesCount, questionsCount }) => {
  const stats = [
    {
<<<<<<< HEAD
      label: "Quizzes available",
      value: quizzesCount,
      color: "bg-blue-50 dark:bg-[#2382ff]",
    },
    {
      label: "Questions created",
      value: questionsCount,
      color: "bg-red-50 dark:bg-[#ef7e44]",
    },
    {
      label: "Feathers from quizzes",
      value: feathersCount,
      color: "bg-yellow-50 dark:bg-[#a69b28]",
=======
      label: 'Quizzes available',
      value: quizzesCount,
      color: 'bg-blue-50 dark:bg-[#2382ff]',
    },
    {
      label: 'Questions created',
      value: questionsCount,
      color: 'bg-red-50 dark:bg-[#ef7e44]',
    },
    {
      label: 'Feathers from quizzes',
      value: feathersCount,
      color: 'bg-yellow-50 dark:bg-[#a69b28]',
>>>>>>> main
    },
  ];

  return (
    <div>
      <section className="grid md:grid-cols-3 gap-6 text-center py-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`shadow-lg shadow-gray-500/50 dark:shadow-black p-6 rounded-2xl ${stat.color}`}
          >
            <span className="text-4xl font-bold text-primary dark:text-white">
              <CountUp
                end={stat.value}
                duration={3}
                enableScrollSpy
                scrollSpyOnce
              />
            </span>
            <p className="mt-2 text-lg text-gray-600 dark:text-white">
              {stat.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default StatsSection;
