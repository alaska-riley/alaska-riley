let POSTS = [];

function build_post_element(post) {
  const el = document.createElement("article");
  el.className = "post";

  const safe_text = post.text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  el.innerHTML = `
    <img class="post-avatar" src="${post.avatar}" alt="avatar">
    <div class="post-body">
      <div class="post-head">
        <span class="post-name">${post.name}</span>
        ${post.verified ? '<i class="fa-solid fa-circle-check verified"></i>' : ""}
        <span class="post-handle">${post.handle}</span>
        <span class="post-dot">·</span>
        <span class="post-time">${post.time}</span>
      </div>
      <p class="post-text">${safe_text}</p>
      <div class="post-actions">
        <span><i class="fa-regular fa-comment"></i> ${post.replies}</span>
        <span><i class="fa-solid fa-retweet"></i> ${post.reposts}</span>
        <span><i class="fa-regular fa-heart"></i> ${post.likes}</span>
        <span><i class="fa-solid fa-chart-simple"></i> ${post.views}</span>
      </div>
    </div>
  `;

  return el;
}

function render_feed() {
  const container = document.getElementById("feed-container");
  container.innerHTML = "";
  POSTS.forEach((post) => container.appendChild(build_post_element(post)));
}

function handle_compose() {
  const input = document.getElementById("compose-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  POSTS.unshift({
    name: "alaska ★彡",
    handle: "@alaskariley",
    avatar: "/lasker.jpg",
    time: "now",
    text: text,
    replies: "0",
    reposts: "0",
    likes: "0",
    views: "0",
    verified: true,
  });

  input.value = "";
  render_feed();
}

// Compose guard
const compose_submit = document.getElementById("compose-submit");
const compose_input = document.getElementById("compose-input");
if (compose_submit && compose_input) {
  compose_submit.addEventListener("click", handle_compose);
  compose_input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handle_compose();
  });
}

// Follow Button Toggle
const follow_btn = document.getElementById("follow-btn");
if (follow_btn) {
  follow_btn.addEventListener("click", () => {
    if (follow_btn.textContent === "Follow") {
      follow_btn.textContent = "Following";
      follow_btn.style.background = "transparent";
      follow_btn.style.color = "var(--text-main)";
      follow_btn.style.borderColor = "var(--border-color)";
    } else {
      follow_btn.textContent = "Follow";
      follow_btn.style.background = "var(--text-main)";
      follow_btn.style.color = "var(--bg-color)";
      follow_btn.style.borderColor = "var(--text-main)";
    }
  });
}

// Load Feed
load_tweets()
  .then((posts) => {
    POSTS = posts;
    render_feed();
  })
  .catch((err) => {
    console.error(err);
    const container = document.getElementById("feed-container");
    if (container) {
      container.innerHTML =
        '<p style="padding:16px;color:#71767b">could not load tweets.txt — check the path and that you\'re not opening index.html via file:// (fetch is blocked there).</p>';
    }
  });

// Sidebar nav (no-op placeholder for single-page setup)
document.querySelectorAll(".nav-links li").forEach((li) => {
  const label = li.querySelector("span")?.textContent?.trim();
  if (label === "Home" || label === "Profile") {
    li.addEventListener("click", () => { window.location.href = "index.html"; });
  }
});