import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { editPost, fetchPostDetail } from "../slices/Post";
import { toast } from "react-toastify";

const EditPost = () => {
  const { postid } = useParams();

  const [post, setPost] = useState(null);
  const { fetchPostDetailResp, editPostResp } = useSelector(
    (state) => state.post
  );
  const prevState = useRef({
    fetchPostDetailResp,
    editPostResp,
  });
  const initialRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if (prevState.current.editPostResp !== editPostResp) {
      if (editPostResp) {
        var message = editPostResp.msg;
        if (editPostResp.status) {
          if (editPostResp.response.post_id) {
            toast.success(message);
            navigate("/home");
          }
        } else {
          toast.error(message);
        }
      }
    }

    // Update previous state after checks
    prevState.current = {
      fetchPostDetailResp,
      editPostResp,
    };
  }, [fetchPostDetailResp, editPostResp]);

  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      console.log(postid);
      dispatch(fetchPostDetail(postid));
    }
  }, [postid]);

  const handleUpdatePost = () => {
    if (!post.title || !post.content) {
      toast.error("Please fill all fields");
      return;
    } else {
      const formData = {
        post_id: postid,
        title: post.title,
        content: post.content,
      };
      dispatch(editPost({ data: formData, params: {} }));
    }
  };
  return (
    <>
      <div className="container">
        <div className="col-md-6 offset-md-3 mt-5 card card-body">
          <h3 className="text-center">Edit Post</h3>
          <form className="form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                maxLength={200}
                value={post ? post.title : ""}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="content">Content</label>
              <textarea
                className="form-control"
                maxLength={1000}
                rows={10}
                value={post ? post.content : ""}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                id="content"
              ></textarea>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleUpdatePost}
            >
              Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
