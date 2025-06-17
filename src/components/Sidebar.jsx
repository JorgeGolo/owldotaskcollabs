<<<<<<< HEAD
import { React, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
=======
import { React, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
>>>>>>> main
///import { Link } from "react-router-dom";
import Link from 'next/link';

import {
  faTasks,
  faUserCircle,
  faCog,
  faGamepad,
  faFeather,
<<<<<<< HEAD
} from "@fortawesome/free-solid-svg-icons";

const menuItems = [
  { icon: faTasks, label: "Quizzes", path: "/quizzes" },
  { icon: faGamepad, label: "Games", path: "/games" },
  { icon: faFeather, label: "Feathers", path: "/feathers" },
  { icon: faUserCircle, label: "You", path: "/profile" },
=======
} from '@fortawesome/free-solid-svg-icons';

const menuItems = [
  { icon: faTasks, label: 'Quizzes', path: '/quizzes' },
  { icon: faGamepad, label: 'Games', path: '/games' },
  { icon: faFeather, label: 'Feathers', path: '/feathers' },
  { icon: faUserCircle, label: 'You', path: '/profile' },
>>>>>>> main
];

const Sidebar = memo(() => {
  return (
    <div
      id="leftcolumn"
      className="pb-0 w-full p-4 md:w-sidewidth h-auto max-h-fit overflow-y-auto"
    >
      <ul className="flex flex-row md:flex-col md:ml-4 overflow-x-auto whitespace-nowrap">
        {menuItems.map((item, index) => (
          <li key={index} className="md:mb-2 inline-block md:inline">
            {item.children ? (
              <div className="relative group inline-block">
                <span className="cursor-pointer hover:text-blue-500 flex items-center gap-2 px-2">
                  {item.icon && (
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="inline w-16 h-16"
                    />
<<<<<<< HEAD
                  )}{" "}
=======
                  )}{' '}
>>>>>>> main
                  {item.label}
                </span>
                <ul className="hidden group-hover:block absolute z-10 bg-white shadow-lg md:static md:shadow-none md:ml-4">
                  {item.children.map((child, childIndex) => (
                    <li
                      key={childIndex}
                      className="mb-1 px-2 py-1 hover:bg-gray-100"
                    >
                      <Link
                        href={child.path}
                        className="cursor-pointer hover:text-blue-500 flex items-center gap-2"
                      >
                        {child.icon && (
                          <FontAwesomeIcon
                            icon={child.icon}
                            className="inline w-16 h-16"
                          />
<<<<<<< HEAD
                        )}{" "}
=======
                        )}{' '}
>>>>>>> main
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                href={item.path}
                className="block mt-1 cursor-pointer hover:text-blue-500 px-2"
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className="inline w-16 h-16"
<<<<<<< HEAD
                />{" "}
=======
                />{' '}
>>>>>>> main
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});
export default Sidebar;
