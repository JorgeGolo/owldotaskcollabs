import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const technologies = [
  { name: "React", src: "react.svg", linktitle: "React icon" },
  { name: "Laravel", src: "laravel.svg", linktitle: "Laravel icon" },
  { name: "Firebase", src: "firebase.svg", linktitle: "Firebase icon" },
  { name: "AWS", src: "amazonwebservices.svg", linktitle: "Amazon Web Services icon" },
  { name: "Tailwind", src: "tailwindcss.svg", linktitle: "Tailwind CSS icon" },
  { name: "Next.js", src: "nextdotjs.svg", linktitle: "Next.js icon" },
  { name: "GitHub", src: "github.svg", linktitle: "Github icon" },
  { name: "Docker", src: "docker.svg", linktitle: "Docker icon" },
];

const TechGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-6 mt-6 justify-items-center py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {technologies.map((tech) => (
        <div
          key={tech.name}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <img
            src={`/assets/iconstec/${tech.src}`}
            title ={tech.linktitle}
            alt={tech.name}
            className="w-20 h-20 opacity-40"
          />
          <span className="text-sm mt-1 text-gray-500 font-bold">{tech.name}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default TechGrid;
