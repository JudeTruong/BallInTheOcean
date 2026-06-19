async function loadPosts() {
  const postsContainer = document.getElementById("posts");

  try {
    const response = await fetch("posts.json");
    const posts = await response.json();

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    postsContainer.innerHTML = posts.map(post => `
      <article class="post-card">
        <div class="post-top">
          <span>${post.category}</span>
          <span>${formatDate(post.date)}</span>
        </div>

        <h3>${post.title}</h3>
        <p>${post.description}</p>

        <a href="post.html?slug=${post.slug}" class="read-more">
          Read more →
        </a>
      </article>
    `).join("");
  } catch (error) {
    postsContainer.innerHTML = "<p>Could not load posts.</p>";
    console.error(error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

loadPosts();