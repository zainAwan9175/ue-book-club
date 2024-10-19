import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, BookOpen, MessageSquare, Send, MoreVertical, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

const Comment = ({ comment }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mb-4">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={comment.avatar} alt={comment.user} />
          <AvatarFallback>{comment.user[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{comment.user}</h4>
            <span className="text-xs text-gray-500">{formatDate(comment.waqt)}</span>
          </div>
          <p className="text-sm text-gray-700">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default function BookDetails({ book }) {
  const { user } = useUser(); // Clerk user hook
  const [bookid, setbookid] = useState(book._id);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      if (!bookid) {
        console.error("Book ID is not available");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/comment/getcommentByBookId/${bookid}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (Array.isArray(response.data.comments)) {
          const sortedComments = response.data.comments.sort((a, b) => new Date(b.waqt) - new Date(a.waqt));
          setComments(sortedComments);
        } else {
          console.error("Fetched data is not an array:", response.data.comments);
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    const intervalId = setInterval(fetchComments, 1000); // Fetch comments every 1 second

    return () => clearInterval(intervalId); // Cleanup the interval when component unmounts
  }, [bookid]); // Include bookid as a dependency

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim()) {
      const now = new Date();

      // Make sure we have user data from Clerk
      if (!user) {
        console.error("User is not logged in.");
        return;
      }

      // Prepare the comment data including the logged-in user's info
      const commentData = {
        user_id: user.id, // Use Clerk's user ID
        book_id: bookid,
        waqt: now.toISOString(), // Use ISO string format for consistent date handling
        user: `${user.firstName} ${user.lastName}`, // Full name of the user
        avatar: user.imageUrl, // User's profile image or a fallback
        content: newComment.trim(),
        likes: 0,
      };

      try {
        const response = await axios.post("http://localhost:3001/comment/createcomment", commentData);

        if (response.status === 200) {
          const updatedComments = [response.data.comment, ...comments].sort((a, b) => new Date(b.waqt) - new Date(a.waqt));
          setComments(updatedComments);
          setNewComment("");
        } else {
          console.error("Error creating comment:", response.data.message);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Book Details for ID: {bookid}</h1>
        
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-8 hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Books
        </Button>
        
        <Card className="overflow-hidden shadow-lg border-none mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 relative h-[400px] md:h-auto">
              <Image
                src={book.imageurls}
                alt={book.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </div>
            <CardContent className="md:w-2/3 p-8 bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-gray-900">{book.name}</h1>
                  <h2 className="text-2xl text-gray-600 mb-4">by {book.author}</h2>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Add to favorites</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Report</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700 font-semibold">{book.genre}</span>
              </div>
              
              <p className="text-gray-700 mb-6 italic">{book.shortdescription}</p>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">About the Book</h3>
                <p className="text-gray-600 leading-relaxed">{book.longdescription}</p>
              </div>
              
              <div className="flex items-center text-gray-500">
                <Eye className="h-5 w-5 mr-2" />
                <span>{book.clicks} views</span>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Discussion
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <Textarea
                placeholder="Share your thoughts on this book..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </form>

            <Separator className="mb-4" />
            
            <div className="space-y-6">
              {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
