import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, BookOpen, MessageSquare, Send, MoreVertical, Eye, ThumbsUp, Reply, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

const Comment = ({ comment, onReply, onLike, onEdit, onDelete, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleEdit = () => {
    onEdit(comment._id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    onReply(comment._id, replyContent);
    setIsReplying(false);
    setReplyContent('');
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(comment.waqt)}
                </DropdownMenuItem>
                {comment.user_id === currentUserId && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(comment._id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            {isEditing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="mb-2"
              />
            ) : (
              <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onLike(comment._id)}>
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {comment.likes}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
                  <Reply className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
            <span className="text-xs text-gray-500 self-end mt-1">
              <Clock className="h-3 w-3 inline mr-1" />
              {formatTime(comment.waqt)}
            </span>
          </div>
          {isEditing && (
            <Button onClick={handleEdit} className="mt-2">
              Save Edit
            </Button>
          )}
          {isReplying && (
            <div className="mt-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="mb-2"
              />
              <Button onClick={handleReply}>Post Reply</Button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default function BookDetails({ book }) {
  const { user } = useUser();
  const [bookid, setbookid] = useState(book._id);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    if (!bookid) {
      console.error("Book ID is not available");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/comment/getcommentByBookId/${bookid}`);
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
  }, [bookid]);

  useEffect(() => {
    fetchComments();
    const intervalId = setInterval(fetchComments, 1000);
    return () => clearInterval(intervalId);
  }, [fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (newComment.trim() && user) {
      const commentData = {
        user_id: user.id,
        book_id: bookid,
        waqt: new Date().toISOString(),
        user: `${user.firstName} ${user.lastName}`,
        avatar: user.imageUrl,
        content: newComment.trim(),
        likes: 0,
      };

      try {
        const response = await axios.post("http://localhost:3001/comment/createcomment", commentData);
        if (response.status === 200) {
          fetchComments();
          setNewComment("");
        } else {
          console.error("Error creating comment:", response.data.message);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleReply = async (parentId, content) => {
    if (content.trim() && user) {
      const replyData = {
        user_id: user.id,
        book_id: bookid,
        waqt: new Date().toISOString(),
        user: `${user.firstName} ${user.lastName}`,
        avatar: user.imageUrl,
        content: content.trim(),
        likes: 0,
        parent_id: parentId,
      };

      try {
        const response = await axios.post("http://localhost:3001/comment/createreply", replyData);
        if (response.status === 200) {
          fetchComments();
        } else {
          console.error("Error creating reply:", response.data.message);
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await axios.post(`http://localhost:3001/comment/like/${commentId}`);
      if (response.status === 200) {
        fetchComments();
      } else {
        console.error("Error liking comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleEdit = async (commentId, newContent) => {
    try {
      const response = await axios.put(`http://localhost:3001/comment/editCommentById/${commentId}`, { content: newContent });
      if (response.status === 200) {
        fetchComments();
      } else {
        console.error("Error editing comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/comment/deletecomment/${commentId}`);
      if (response.status === 200) {
        fetchComments();
      } else {
        console.error("Error deleting comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
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
                <Comment
                  key={comment._id}
                  comment={comment}
                  onReply={handleReply}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}