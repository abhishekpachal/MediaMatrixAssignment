import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../slices/Post";
import { toast } from "react-toastify";
import { getHtmlExcerpt } from "../service/Util";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fetchPostsResp } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const prevState = useRef({
    fetchPostsResp,
  });
  const initialRef = useRef(false);

  useEffect(() => {
    if (prevState.current.fetchPostsResp !== fetchPostsResp) {
      if (fetchPostsResp) {
        var message = fetchPostsResp.msg;
        if (fetchPostsResp.status && fetchPostsResp.response.posts) {
          const postSet = fetchPostsResp.response.posts;
          setPosts(postSet);
        } else {
          if (message) {
            toast.error(message);
          }
        }
      }
    }

    // Update previous state after checks
    prevState.current = {
      fetchPostsResp,
    };
  }, [fetchPostsResp]);

  useEffect(() => {
    if (!initialRef.current) {
      initialRef.current = true;
      dispatch(fetchPosts({ params: {} }));
    }
  }, []);

  return (
    <>
      <div>
        <div className="container">
          <div className="text-end mt-3">
            <Link to="/create-post" className="btn btn-primary">
              Create Post
            </Link>
          </div>
          <div>
            {posts &&
              posts.map((post, index) => (
                <div key={index} className="card mt-3 shadow">
                  <div className="card-body">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="mb-3">
                        <h5 className="card-title">{post.title}</h5>
                        <div className="text-pre-line">
                          {getHtmlExcerpt(post.content)}
                        </div>
                        <div className="card-text fw-medium mt-3">
                          <span className="text-dark">{post.author_name}</span>
                        </div>
                        <p className="card-text">
                          <small className="text-muted">
                            {new Date(post.created_on).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                          <small className="text-dark ms-5">
                            {post.comment_count} Comments
                          </small>
                        </p>
                      </div>
                    </Link>
                    <div>
                      {post.user_id == user.id && (
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="btn btn-secondary btn-sm me-3 px-3"
                        >
                          Edit
                        </Link>
                      )}
                      <Link
                        to={`/post/${post.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
