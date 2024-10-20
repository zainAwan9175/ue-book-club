"use client"; // This makes it a Client Component

import { useState, useEffect } from "react";
import BookDetailsPage from "@/components/book-details-page/BookDetailsPage";
import { useParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";

const BookDetails = () => {
  const { user } = useUser();
  const params = useParams();
  const { id } = params; // Access the dynamic id from the URL
  const [book, setBook] = useState(null); // State to hold book details
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // First useEffect to fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/admin/getBookById/${id}`);
        setBook(response.data.book); // Update book state with the fetched book object
      } catch (err) {
        console.error("Error fetching book details:", err);  // Log the error for debugging
        setError("Error fetching book details");
      }
    };

    if (id) {
      fetchBookDetails();
    }

    // Ensure loader shows for at least 2 seconds
    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(loaderTimeout); // Cleanup timeout if component unmounts
  }, [id]);

  // Second useEffect to handle click tracking (runs only on mount)
  useEffect(() => {
    const trackClick = async () => {
      try {
        if (user && user.id) {
          await axios.put(`http://localhost:3001/admin/clicks/${id}`, { userId: user.id });
        }
      } catch (err) {
        console.error("Error tracking click:", err);  // Log the error for debugging
      }
    };

    if (id && user && user.id) {
      trackClick();
    }
  }, [id, user]);





  // Show loading state
  if (loading) {
    return <div><Loader /></div>;
  }

  // Show error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Pass the fetched book details to the BookDetailsPage component */}
      {book && <BookDetailsPage book={book} />}
    </div>
  );
};

export default BookDetails;
