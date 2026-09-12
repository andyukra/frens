"use client";

import { motion } from "framer-motion";

const pathVariants = {
  hidden: {
    pathLength: 0,
    fill: '#fff0',
  },
  visible: {
    pathLength: 1,
    fill: '#fafafa',
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: 'mirror'
    },
  },
}; 

export default function loading() {
  return (
    <section className="flex justify-center items-center h-[100dvh] bg-orange-400 fixed top-0 left-0 w-full z-[500]">
      <motion.svg 
      initial="hidden"
      animate="visible"
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51 81" width="200px" height="200px">
        <motion.path
          variants={pathVariants}
          style={{ stroke: "#fafafa", strokeMiterlimit: 10 }}
          d="m3.49,78.06c-1.99-1.63-2.99-3.7-2.99-6.21,0-2.3.62-4.19,1.85-5.69,1.24-1.5,2.84-2.68,4.81-3.56,1.97-.88,4.58-1.8,7.84-2.76L25.21,14.11c1.12-5.13,3.11-8.68,5.94-10.65,2.84-1.97,5.97-2.96,9.4-2.96,2.64,0,4.96.81,6.96,2.44,1.99,1.63,2.99,3.7,2.99,6.21,0,1.23-.08,2.32-.25,3.28h-3.96c.11-1.17.17-1.89.17-2.16,0-.85-.31-1.52-.93-2-.62-.48-1.38-.72-2.28-.72-1.18,0-2.33.49-3.46,1.48-1.12.99-1.94,2.68-2.44,5.09l-1.43,6.33h6.15l-.59,3.2h-6.24l-9.7,43.24c-1.12,5.18-3.06,8.74-5.82,10.69-2.75,1.95-5.85,2.92-9.27,2.92-2.64,0-4.96-.81-6.96-2.44Zm9.82-10.93l1.1-4.64c-2.98.96-5.27,2.07-6.87,3.32-1.6,1.25-2.4,2.9-2.4,4.93,0,.64.34,1.24,1.01,1.8.68.56,1.46.84,2.36.84,2.25,0,3.85-2.08,4.81-6.25Z"
        />
      </motion.svg>
    </section>
  );
}