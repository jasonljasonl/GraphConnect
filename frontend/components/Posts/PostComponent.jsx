export default function PostComponent({
  posts,
  users,
  currentUser,
  commentCounts,
  dropdownOpen,
  toggleDropdown,
  handleDeletePost,
}) {
  const getAuthorUsername = (authorId) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.username : "Unknown";
  };

  if (!Array.isArray(posts)) {
    return <p>No posts available</p>;
  }

  return (
    <div className="post_list_div_component">
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post_list_component">
              <div className="author_component" style={{ cursor: "pointer" }}>
                <AuthorInfo username={getAuthorUsername(post.author)} />

                {currentUser && currentUser.id === post.author && (
                  <div className="post-menu">
                    <button
                      className="post-menu-button"
                      onClick={() => toggleDropdown(post.id)}
                    >
                      ...
                    </button>
                    {dropdownOpen === post.id && (
                      <div className="post-menu-dropdown">
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="delete-post-button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {post.image_post && (
                <img
                  src={post.image_post}
                  alt="Post"
                  className="home_post_component"
                />
              )}

              <p className="post_content_component">{post.content}</p>
              <p className="post_upload_date">
                {formatDistanceToNow(new Date(post.upload_date), {
                  locale: enUS,
                })}{" "}
                ago
              </p>

              <div className="post_interactions">
                <Like postId={post.id} initialLikes={post.likes?.length || 0} />
                <ViewPost_CommentsButton
                  postId={post.id}
                  initialComments={commentCounts[post.id] || 0}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
