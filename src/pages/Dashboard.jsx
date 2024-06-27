import React, { useState, useEffect } from "react";
import api from "./api.jsx";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaThumbsUp, FaThumbsDown, FaTrash, FaPlus, FaCommentDots, FaEdit } from 'react-icons/fa';
import "./Dashboard.css";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleCreatePost = async () => {
    try {
      const response = await api.post("/posts", { content: newPostContent });
      setPosts([response.data, ...posts]);
      setNewPostContent("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const handleEditPost = (postId, content) => {
    setCurrentPostId(postId);
    setEditPostContent(content);
    setShowEditModal(true);
  };

  const handleUpdatePostSubmit = async () => {
    try {
      const response = await api.put(`/posts/${currentPostId}`, { content: editPostContent });
      const updatedPosts = posts.map(post =>
        post._id === currentPostId ? response.data : post
      );
      setPosts(updatedPosts);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await api.post(`/posts/${postId}/dislike`);
      fetchPosts();
    } catch (err) {
      console.error("Failed to dislike post:", err);
    }
  };

  const handleAddComment = async (postId, commentContent) => {
    try {
      await api.post(`/posts/${postId}/comments`, { content: commentContent });
      fetchPosts();
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full bg-white shadow-md py-4 mb-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-800">
          Dashboard
        </h1>
      </header>
      <main className="max-w-3xl w-full mx-auto space-y-6">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center ml-4 py-2 px-3 mb-4 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition duration-300"
        >
          <FaPlus className="mr-2" /> Create Post
        </Button>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create a Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                required
                className="resize-none"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreatePost}>
              Post
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Edit your post"
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                required
                className="resize-none"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdatePostSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <p className="mb-4 text-gray-800">{post.content}</p>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center bg-green-500 text-white py-1 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 mr-2"
                  >
                    <FaThumbsUp className="mr-1" /> Like ({post.likes})
                  </Button>
                  <Button
                    onClick={() => handleDislike(post._id)}
                    className="flex items-center bg-red-500 text-white py-1 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300 mr-2"
                  >
                    <FaThumbsDown className="mr-1" /> Dislike ({post.dislikes})
                  </Button>
                  <Button
                    onClick={() => handleDeletePost(post._id)}
                    className="flex items-center bg-gray-500 text-white py-1 px-4 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mr-2"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </Button>
                  <Button
                    onClick={() => handleEditPost(post._id, post.content)}
                    className="flex items-center bg-yellow-500 text-white py-1 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </Button>
                </div>
                <p className="text-gray-500 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{marginRight:"500px"}}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const commentContent =
                      e.target.elements.commentContent.value;
                    handleAddComment(post._id, commentContent);
                    e.target.reset();
                  }}
                  className="mb-4 "
                  style={{marginLeft:"10px"}}
                >
                  <Form.Group>
                    <Form.Control
                      name="commentContent"
                      as="textarea"
                      rows={2}
                      placeholder="Add a comment"
                      required
                      className="resize-none"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    className="flex items-center mt-3 bg-blue-500 text-white py-1 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                  >
                    <FaCommentDots className="mr-1" /> Comment
                  </Button>
                </Form>
                <div className="space-y-2">
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-100 p-2 rounded-lg shadow-sm"
                    >
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
