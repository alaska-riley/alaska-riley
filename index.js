// MOCK DATABASE
// This includes the posts from your PDF
const posts = [
  {
    id: 1,
    name: "A24",
    handle: "@A24",
    time: "Nov 25",
    text: "Holding court with the cast of CLUB KID. Now playing nationwide.",
    media: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=800", // Placeholder for the video
    isVerified: true,
    replies: 8,
    reposts: 8,
    likes: 246,
    views: "7.1K",
    liked: false
  },
  {
    id: 2,
    name: "alaska ★彡",
    handle: "@onlinegirlie",
    time: "Nov 25",
    text: "just finished watching the body .....................",
    media: null,
    isVerified: true,
    replies: 2,
    reposts: 0,
    likes: 38,
    views: "4.2K",
    liked: false
  },
  {
    id: 3,
    name: "alaska ★彡",
    handle: "@onlinegirlie",
    time: "Nov 24",
    text: "u and the oomf you subtweeted about",
    media: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800", // Placeholder for the two girls
    isVerified: true,
    replies: 11,
    reposts: 59,
    likes: 1700,
    views: "33K",
    liked: false
  },
  {
    id: 4,
    name: "alaska ★彡",
    handle: "@onlinegirlie",
    time: "Nov 24",
    text: "thangyaaaa 😄",
    media: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", // Placeholder for the dolls
    isVerified: true,
    replies: 0,
    reposts: 0,
    likes: 5,
    views: "100",
    liked: false
  }
];

const feedContainer = document.getElementById('feed-container');
const composeInput = document.getElementById('compose-input');
const composeSubmit = document.getElementById('compose-submit');

// Format numbers (e.g., 1700 -> 1.7K)
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return num;
}

// RENDER FEED
function renderFeed() {
  feedContainer.innerHTML = '';
  
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    
    // Build media HTML if it exists
    let mediaHTML = '';
    if (post.media) {
      mediaHTML = `
        <div class="post-media">
          <img src="${post.media}" alt="Post media" loading="lazy">
        </div>
      `;
    }

    // Build the post HTML
    postEl.innerHTML = `
      <img src="https://ui-avatars.com/api/?name=${post.name.replace(' ', '+')}&background=random&color=fff" alt="${post.name}" class="post-avatar">
      <div class="post-body">
        <div class="post-header">
          <span class="name">${post.name}</span>
          ${post.isVerified ? '<i class="fa-solid fa-circle-check" style="color: #1d9bf0; font-size: 14px;"></i>' : ''}
          <span class="handle">${post.handle}</span>
          <span class="time">· ${post.time}</span>
        </div>
        <div class="post-text">${post.text}</div>
        ${mediaHTML}
        <div class="post-actions">
          <div class="action"><i class="fa-regular fa-comment"></i> <span>${post.replies > 0 ? formatNumber(post.replies) : ''}</span></div>
          <div class="action"><i class="fa-solid fa-retweet"></i> <span>${post.reposts > 0 ? formatNumber(post.reposts) : ''}</span></div>
          <div class="action like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
            <i class="${post.liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
            <span>${post.likes > 0 ? formatNumber(post.likes) : ''}</span>
          </div>
          <div class="action"><i class="fa-solid fa-chart-simple"></i> <span>${post.views}</span></div>
          <div class="action"><i class="fa-regular fa-bookmark"></i></div>
          <div class="action"><i class="fa-solid fa-arrow-up-from-bracket"></i></div>
        </div>
      </div>
    `;
    
    feedContainer.appendChild(postEl);
  });

  attachLikeListeners();
}

// HANDLE LIKES
function attachLikeListeners() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the post click
      const id = parseInt(btn.dataset.id);
      const post = posts.find(p => p.id === id);
      
      if (post.liked) {
        post.likes--;
        post.liked = false;
      } else {
        post.likes++;
        post.liked = true;
      }
      
      // Quick UI update
      const icon = btn.querySelector('i');
      const countSpan = btn.querySelector('span');
      
      if (post.liked) {
        btn.classList.add('liked');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        btn.classList.remove('liked');
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
      
      countSpan.textContent = post.likes > 0 ? formatNumber(post.likes) : '';
    });
  });
}

// HANDLE NEW POSTS
composeInput.addEventListener('input', () => {
  composeSubmit.style.opacity = composeInput.value.trim() ? '1' : '0.5';
});

composeSubmit.addEventListener('click', () => {
  const text = composeInput.value.trim();
  if (!text) return;

  const newPost = {
    id: posts.length + 1,
    name: "alaska ★彡",
    handle: "@onlinegirlie",
    time: "Now",
    text: text,
    media: null,
    isVerified: true,
    replies: 0,
    reposts: 0,
    likes: 0,
    views: "1",
    liked: false
  };

  posts.unshift(newPost); // Add to top
  composeInput.value = '';
  composeSubmit.style.opacity = '0.5';
  renderFeed();
});

// INIT
renderFeed();