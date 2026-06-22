import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Backend Connection Failed");
        setLoading(false);
      });
  }, []);

  const addPost = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append(
      "authorId",
      "6a301622c24c30857a77dc48"
    );

    if (image) {
      formData.append("image", image);
    }

    const response = await fetch(
      "http://localhost:5000/posts",
      {
        method: "POST",
        body: formData,
      }
    );

    const newPost = await response.json();

    setPosts([...posts, newPost]);

    setTitle("");
    setContent("");
    setImage(null);
  };

  const deletePost = async (id) => {
    await fetch(
      `http://localhost:5000/posts/${id}`,
      {
        method: "DELETE",
      }
    );

    setPosts(
      posts.filter(
        (post) => post._id !== id
      )
    );
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>The Data Hub</h1>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br />
      <br />

      <textarea
        placeholder="Enter Content"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      ></textarea>

      <br />
      <br />

      <input
        type="file"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
      />

      <br />
      <br />

      <button onClick={addPost}>
        Add Post
      </button>

      <hr />

      <p>Total Posts: {posts.length}</p>

      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>

          <p>{post.content}</p>

          <p>
            Author: {post.authorId?.name}
          </p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post"
              width="200"
            />
          )}

          <br />
          <br />

          <button
            onClick={() =>
              deletePost(post._id)
            }
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;