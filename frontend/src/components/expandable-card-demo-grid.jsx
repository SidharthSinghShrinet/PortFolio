"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useSelector } from "react-redux";
import chatapp from "../assets/chatapp.png";
import ecommerce from '../assets/ecommerce.png';
import zomato from '../assets/zomato.png';
import portfolio from '../assets/portfolio.png';

export default function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const toggle = useSelector((state)=>state.global.toggle);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[1200]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className={`w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col ${toggle?"bg-gray-200":"bg-black"}  sm:rounded-3xl overflow-hidden`}
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div className="overflow-y-scroll scroll-smooth">
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className={`font-medium ${toggle?"text-black":"text-white"} text-base lg:text-3xl`}
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`${toggle?"text-black":"text-neutral-300"} text-xs md:text-sm lg:text-base h-full md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]`}
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-full mx-auto w-full grid grid-cols-1 md:grid-cols-3 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className={`p-4 flex flex-col ${toggle?"hover:bg-neutral-800 text-black hover:text-white":"hover:bg-neutral-100 text-white hover:text-black"} rounded-xl cursor-pointer`}
          >
            <div className="flex gap-4 flex-col w-full">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-60 w-full  rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className={`font-medium text-center md:text-left text-base`}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center md:text-left text-base"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "",
    title: "ChatApp",
    src: chatapp,
    ctaText: "Visit",
    ctaLink: "https://chatapp-mern-3xqn.onrender.com/login",
    content: () => {
      return (
        <p>
          Our Real-Time Chat App is a feature-rich messaging platform crafted
          with the power of the MERN stack — MongoDB, Express.js, React.js, and
          Node.js — and seamlessly integrated with Socket.IO for instant
          communication. It is built to deliver not just messages, but an
          experience where conversations flow smoothly and securely across
          devices. <br /> <br />
          At its core, the app offers secure JWT-based authentication and
          bcrypt-hashed passwords to protect user privacy. From signing up to
          logging in, every step ensures data safety while maintaining a
          frictionless experience. Once connected, users can chat in real time,
          send and receive messages instantly, and view timestamps that help
          track conversations without missing a beat. <br /> <br />
          Beyond real-time updates, the app saves every interaction in the
          database, so users can revisit their complete message history anytime.
          Even after refreshing or logging back in, nothing is lost —
          conversations remain intact and accessible. To make communication more
          intuitive, it also highlights online and offline status in real time,
          so users always know who’s available. <br /> <br />
          The interface is designed for clarity and speed, blending responsive
          layouts with a modern design that adapts beautifully to desktops and
          (soon) mobile devices. Group chats and private rooms create a dynamic,
          collaborative space, while the underlying architecture ensures
          performance remains smooth and reliable even as the network grows.{" "}
          <br /> <br />
          This project represents more than just a chat system — it is a
          demonstration of scalable full-stack development, real-time data
          handling, and user-centered design. By merging cutting-edge technology
          with a simple, elegant interface, our Real-Time Chat App establishes
          itself as a secure, interactive, and engaging platform for modern
          communication.
        </p>
      );
    },
  },
  {
    description: "",
    title: "E-Commerce (bitBasket)",
    src: ecommerce,
    ctaText: "Visit",
    ctaLink: "https://github.com/SidharthSinghShrinet/bitBasket",
    content: () => {
      return (
        <p>
          bitBasket is a full-stack e-commerce platform built with the MERN
          stack — MongoDB, Express.js, React.js, and Node.js — enriched with a
          robust admin dashboard. It is designed to provide a seamless shopping
          experience, empowering both shoppers and store managers with speed,
          security, and intuitive design. <br /> <br />
          On the front end, users can browse a well-organized product catalog,
          filter by categories, search for specific items, and explore product
          detail pages with rich descriptions. Cart functionality lets shoppers
          add, remove, or update quantities of products, always seeing live
          pricing and a running subtotal. A streamlined checkout flow guides
          users through entering shipping details, payment information, and
          order confirmation with ease. <br /> <br />
          Behind the scenes, authentication is handled with JSON Web Tokens,
          while passwords are securely hashed using bcrypt. The backend API
          built with Express and Mongoose ensures protected routes for sensitive
          operations, especially for profile, order history, and admin tasks.{" "}
          <br /> <br />
          For the store administrators, the dashboard offers powerful tools: add
          or edit products, manage inventory, view and process orders, and
          oversee registered users. These admin capabilities are guarded by
          role-based authorization, ensuring only those with the right
          permissions can access or modify critical data. <br /> <br />
          The application is styled responsively using utility-first CSS
          (Tailwind), making sure the browsing, shopping, and management
          experience feels excellent across desktop, tablet, or mobile devices.
          On the frontend, React’s Context API manages global state such as user
          session, cart contents, and product data. Axios handles all server
          communication, including secure API calls with authorization headers
          and error feedback for the user. <br /> <br />
          In production, bitBasket unifies backend and frontend: React builds
          are served statically by the Express server, enabling a smooth
          deployment workflow. Environment variables safeguard secrets like
          database URIs and JWT keys, while a clear folder structure
          (components, pages, contexts, routes, controllers, models) keeps the
          codebase maintainable and scalable. <br /> <br />
          bitBasket is more than just a shopping site — it’s a comprehensive
          platform that marries user-focused design, full-stack engineering, and
          secure e-commerce functionality. It stands as a polished, reliable,
          and engaging space where buyers find what they need, and sellers
          manage their storefronts with confidence. <br /> <br />
          To simulate real-world transactions without using actual money, the
          platform integrates PayPal’s Sandbox environment. This allows
          developers and testers to perform end-to-end payment flows — from
          checkout to confirmation — using test accounts and credentials. By
          leveraging the sandbox, payment functionality can be validated for
          accuracy, security, and reliability before going live, ensuring a
          smooth and trustworthy shopping experience for end users.
        </p>
      );
    },
  },
  {
    description: "",
    title: "Personal Portfolio",
    src: portfolio,
    ctaText: "Visit",
    ctaLink: "https://github.com/SidharthSinghShrinet/PortFolio",
    content: () => {
      return (
        <p>
          My Personal Portfolio Website is a modern, interactive space designed
          to showcase my journey as a developer, my technical expertise, and the
          projects I am most proud of. Built with a focus on clean design and
          smooth navigation, it creates a professional yet personal environment
          where visitors can learn about me and my work. <br /> <br />
          The Home section introduces the portfolio with a welcoming interface,
          setting the tone for the visitor’s experience. The About section
          shares my background, career path, and aspirations, giving a glimpse
          into who I am beyond the code. The Skills section highlights my
          technical strengths across web development technologies and tools,
          reflecting my ability to build and deliver robust solutions. <br />{" "}
          <br />
          In the Projects section, each project is presented with detailed
          descriptions, technologies used, and links to live demos or
          repositories. This area serves as a living proof of my hands-on
          experience, creativity, and problem-solving approach. The Education
          section maps out my academic foundation and learning journey,
          emphasizing the knowledge and discipline that shape my professional
          growth. <br /> <br />
          Finally, the Contact section provides visitors with easy ways to reach
          out, whether for collaboration, opportunities, or discussions. It
          ensures that the portfolio is not just a showcase, but also a bridge
          connecting me with peers, mentors, and employers. <br /> <br />
          More than just a website, my portfolio is a reflection of my passion
          for technology, continuous learning, and dedication to creating
          meaningful digital experiences. It serves as a central hub where my
          story, skills, and ambitions come together, offering a complete
          picture of who I am as a developer.
        </p>
      );
    },
  },
  {
    description: "",
    title: "Zomato Clone",
    src: zomato,
    ctaText: "Visit",
    ctaLink: "https://zomato-clone-eta-black.vercel.app/",
    content: () => {
      return (
        <p>
          The Zomato Clone is a front-end project created to replicate the look
          and feel of the popular food discovery and delivery platform. Built
          purely with HTML and CSS, it focuses on showcasing clean layouts,
          styled sections, and static components that capture the essence of
          Zomato’s design. <br /> <br />
          The homepage presents an attractive header, navigation bar, and search
          section where users can explore restaurant themes and categories.
          Sections highlight popular restaurants, featured cuisines, and
          trending food choices, giving the project a realistic appearance
          similar to an actual food app. <br /> <br />
          Since the project is developed without JavaScript or backend
          integration, all data and images are static. It is designed as a
          **UI/UX practice project**, helping strengthen skills in structuring
          web pages, working with typography, colors, and layouts using only
          core HTML and CSS. <br /> <br />
          Currently, the clone is not responsive, meaning it is best viewed on
          desktop screens. However, it stands as a foundation for future
          improvements, where responsiveness, interactivity, and backend
          features can be added to transform it into a complete web application.{" "}
          <br /> <br />
          This Zomato Clone represents a step forward in mastering front-end
          development, showcasing the ability to design real-world inspired
          layouts while focusing on attention to detail and visual consistency.
        </p>
      );
    },
  },
];