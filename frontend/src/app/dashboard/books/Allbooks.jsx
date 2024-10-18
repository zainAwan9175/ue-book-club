import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import axios from "axios"; // Import Axios

const Allbooks = () => {
  const [allbooks, setAllBooks] = useState([]); // Initialize state for books
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  // Fetch books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin/getAllBooks", {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        console.log("Response data:", response.data); // Log the fetched data
        
        // Check if books are present in the response
        if (Array.isArray(response.data.books)) {
          setAllBooks(response.data.books); // Set fetched data to allbooks
        } else {
          console.error("Fetched data is not an array:", response.data.books);
          setAllBooks([]); // Optionally reset to an empty array
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setAllBooks([]); // Optionally reset to an empty array on error
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Log when allbooks changes
  useEffect(() => {
    console.log(allbooks);
  }, [allbooks]); // This runs every time allbooks changes

  return (
    <section className="mb-12 mx-8">
      <h2 className="text-2xl font-bold mb-6 text-center justify-center text-gray-800 flex items-center">
        Explore All Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Check if allbooks is an array before mapping */}
        {Array.isArray(allbooks) && allbooks.length > 0 ? (
          allbooks.map((book, index) => (
            <motion.div
              key={book._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Image
                src={book.imageurls} // Use the correct property for image URLs
                alt={book.name}
                width={300}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{book.name}</h3>
                <p className="text-gray-600 text-sm">{book.author}</p>
              </div>
              <div className="flex justify-between items-center">
                <Link href={`/dashboard/book-details/${book._id}`}>
                  <Button className="ml-3 mt-5 mb-4" variant="outline">
                    Read More
                  </Button>
                </Link>
                <button
                  onClick={() => toggleFavorite(book._id)}
                  className="mr-5 text-green-600 hover:text-green-800 transition-colors duration-300"
                >
                  {favorites.includes(book._id) ? (
                    <FaHeart className="text-red-600" />
                  ) : (
                    <FaRegHeart className="text-red-600" />
                  )}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600">No books available</p>
        )}
      </div>
    </section>
  );
};

export default Allbooks;
