import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPost } from "../slices/Post";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const { createPostResp } = useSelector((state) => state.post);
  const prevState = useRef({
    createPostResp,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (prevState.current.createPostResp !== createPostResp) {
      if (createPostResp) {
        var message = createPostResp.msg;
        if (createPostResp.status) {
          if (createPostResp.response.post_id) {
            const newFormData = {
              title: "",
              content: "",
            };
            setFormData(newFormData);
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
      createPostResp,
    };
  }, [createPostResp]);

  const handleCreatePost = () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill all fields");
      return;
    } else {
      dispatch(createPost({ data: formData, params: {} }));
    }
  };
  return (
    <>
      <div className="container">
        <div className="col-md-6 offset-md-3 mt-5 card card-body">
          <h3 className="text-center">Create Post</h3>
          <form className="form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                maxLength={200}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="content">Content</label>
              <textarea
                className="form-control"
                maxLength={1000}
                rows={10}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                id="content"
              ></textarea>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={handleCreatePost}
            >
              Create Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
