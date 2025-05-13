import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import {
  deletePost,
  fetchComments,
  fetchPostDetail,
  saveComment,
} from "../slices/Post";
import { toast } from "react-toastify";

const Post = () => {
  const { postid } = useParams();
  const {
    fetchPostDetailResp,
    deletePostResp,
    fetchCommentsResp,
    saveCommentResp,
  } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const prevState = useRef({
    fetchPostDetailResp,
    deletePostResp,
    fetchCommentsResp,
    saveCommentResp,
  });
  const initialRef = useRef(false);
  const commentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (prevState.current.fetchPostDetailResp !== fetchPostDetailResp) {
      if (fetchPostDetailResp) {
        var message = fetchPostDetailResp.msg;
        if (fetchPostDetailResp.status) {
          if (fetchPostDetailResp.response.post) {
            setPost(fetchPostDetailResp.response.post);
          }
        } else {
          toast.error(message);
        }
      }
    }
    if (prevState.current.deletePostResp !== deletePostResp) {
      if (deletePostResp) {
        var message = deletePostResp.msg;
        if (deletePostResp.status) {
          if (deletePostResp.response.post_id) {
            toast.success(message);
            navigate("/home");
          }
        } else {
          toast.error(message);
        }
      }
    }
    if (prevState.current.fetchCommentsResp !== fetchCommentsResp) {
      if (fetchCommentsResp) {
        var message = fetchCommentsResp.msg;
        if (fetchCommentsResp.status) {
          if (fetchCommentsResp.response.comments) {
            setComments(fetchCommentsResp.response.comments);
          }
        } else {
          toast.error(message);
        }
      }
    }

    if (prevState.current.saveCommentResp !== saveCommentResp) {
      if (saveCommentResp) {
        var message = saveCommentResp.msg;
        if (saveCommentResp.status) {
          if (saveCommentResp.response.comment) {
            const newComment = saveCommentResp.response.comment;
            setPost((prevPost) => ({
              ...prevPost,
              comment_count: prevPost.comment_count + 1,
            }));
            setComments((prevComments) => [...prevComments, newComment]);
            toast.success(message);
            setComment("");
            commentRef.current.value = "";
          }
        } else {
          toast.error(message);
        }
      }
    }

    // Update previous state after checks
    prevState.current = {
      fetchPostDetailResp,
      deletePostResp,
      fetchCommentsResp,
      saveCommentResp,
    };
  }, [fetchPostDetailResp, deletePostResp, fetchCommentsResp, saveCommentResp]);
  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      dispatch(fetchPostDetail(postid));
      dispatch(fetchComments(postid));
    }
  }, []);

  const handleDelete = () => {
    if (post.user_id == user.id) {
      // Call delete post API
      dispatch(deletePost({ data: { post_id: postid }, params: {} }));
    } else {
      toast.error("You are not authorized to delete this post");
    }
  };

  const saveCommentApi = () => {
    if (!comment) {
      toast.error("Please write a comment");
      return;
    } else {
      const formData = {
        post_id: postid,
        content: comment,
      };
      dispatch(saveComment({ data: formData, params: {} }));
      setComment("");
    }
  };

  const commentChange = (e) => {
    const { value } = e.target;
    setComment(value);
  };

  return (
    <div className="container">
      {/* Post Details */}
      {post && (
        <div className="mt-5">
          <div className="text-end">
            {post.user_id == user.id && (
              <Link
                to={`/edit-post/${post.id}`}
                className="btn btn-secondary btn-sm me-3 px-3"
              >
                Edit
              </Link>
            )}
            {post.user_id == user.id && (
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                Delete
              </button>
            )}
          </div>
          <h2>{post.title}</h2>
          <div className="d-flex gap-5">
            <p>Author: {post.author_name}</p>
            <p>
              Posted on:{" "}
              {new Date(post.created_on).toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>Comments: {post.comment_count}</p>
          </div>
          <hr />
          <div className="text-pre-line mt-3 fs-6">{post.content}</div>
        </div>
      )}
      {/* Comments Section */}
      <div className="mt-5">
        <h4 className="">Comments</h4>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div className="comment mb-3" key={index}>
              <div className="d-flex gap-2">
                <strong>{comment.author_name}:</strong>{" "}
                <div className="pre-text-line">{comment.content}</div>
              </div>
              <div>
                <small>
                  {new Date(comment.created_on).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
      {/* Add Comment Form */}
      <div className="">
        <form>
          <div className="form-group">
            <textarea
              ref={commentRef}
              className="form-control"
              id="comment"
              rows="3"
              placeholder="Write your comment here..."
              onChange={(e) => {
                commentChange(e);
              }}
            ></textarea>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={saveCommentApi}
          >
            Save Comment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
