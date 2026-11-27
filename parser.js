
const TWEETS_URL = "tweets.txt";
const DEFAULT_AVATAR = "/lasker.jpg";
const FORCED_HANDLE = "@alaskariley";


const MULTILINE_FIELDS = new Set(["text"]);

function parse_tweets(raw) {
  const posts = [];
  
  const blocks = raw.split(/^\s*---\s*$/m);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const post = {};
    let current_key = null;

    for (const line of lines) {
      
      if (!line.trim() || line.trim().startsWith("#")) continue;

      const match = line.match(/^([a-z_]+):\s?(.*)$/i);
      if (match) {
        current_key = match[1].toLowerCase();
        const value = match[2];
        if (MULTILINE_FIELDS.has(current_key) && post[current_key] !== undefined) {
          post[current_key] += "\n" + value;
        } else {
          post[current_key] = value;
        }
      } else if (current_key && MULTILINE_FIELDS.has(current_key)) {
        
        post[current_key] += "\n" + line;
      }
    }

    if (post.name && post.text) {
      posts.push({
        name: post.name.trim(),
        handle: FORCED_HANDLE,
        avatar: post.avatar ? post.avatar.trim() : DEFAULT_AVATAR,
        time: (post.time || "now").trim(),
        text: post.text.trim(),
        replies: post.replies || "0",
        reposts: post.reposts || "0",
        likes: post.likes || "0",
        views: post.views || "0",
        verified: /^(yes|true|1)$/i.test((post.verified || "").trim()),
      });
    }
  }

  return posts;
}


async function load_tweets() {
  const res = await fetch(TWEETS_URL);
  if (!res.ok) throw new Error(`tweets.txt fetch failed: ${res.status}`);
  const raw = await res.text();
  return parse_tweets(raw);
}