import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import backgroundImage from "@/assets/PeopleAtAConcert.jpg"; // Directly importing the image
import { Link } from "react-router-dom";  // Import Link from react-router-dom

export default function HomePage() {
  return (
    <section
      className="relative flex items-center justify-center h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center text-white px-6 md:px-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Elevate Your Events. Join the Movement.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-xl mb-10"
        >
          Create unforgettable experiences with ease.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex justify-center gap-4"
        >
          <Link to="sadasdsa">
            <Button className="py">
              Start Creating
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-[#0d6efd] text-white px-8 py-4 text-lg rounded-full">
              Start Creating
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              className="text-[#0d6efd] border-[#0d6efd] hover:bg-[#0d6efd] hover:text-white px-8 py-4 text-lg rounded-full"
            >
              Browse Events
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
