import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

import { Button } from "@/components/ui/button";

const Allbooks = () => {
  const trendingBooks = [
    // {
    //   id: 1324324243242,
    //   title: "The Midnight Library",
    //   author: "Matt Haig",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 23242342,
    //   title: "Atomic Habits",
    //   author: "James Clear",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 3,
    //   title: "The Invisible Life ",
    //   author: "V.E. Schwab",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 4,
    //   title: "Project Hail Mary",
    //   author: "Andy Weir",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
    // {
    //   id: 5,
    //   title: "The Four Winds",
    //   author: "Kristin Hannah",
    //   image:
    //     "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // },
  ];

  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };
  return (
    <section className="mb-12 mx-8">
      <h2 className="text-2xl font-bold mb-6 text-center justify-center  text-gray-800 flex items-center">
        Explore All Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {trendingBooks.map((book, index) => (
          <motion.div
            key={book.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Image
              src={book.image}
              alt={book.title}
              width={300}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm">{book.author}</p>
            </div>
            <div className="flex justify-between items-center">
              <Link href={`/dashboard/book-details/${book.id}`}>
                <Button className=" ml-3 mt-5 mb-4 " variant="outline">
                  Read More
                </Button>
              </Link>
              <button
                onClick={() => toggleFavorite(book.id)}
                className=" mr-5 text-green-600 hover:text-green-800 transition-colors duration-300"
              >
                {favorites.includes(book.id) ? (
                  <FaHeart className="text-red-600" />
                ) : (
                  <FaRegHeart className="text-red-600" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
export default Allbooks;
