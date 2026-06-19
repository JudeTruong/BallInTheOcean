const fs = require("fs");
const path = require("path");

const postsDir = path.join(__dirname, "posts");

console.log("Looking for posts in:", postsDir);

function getMeta(html) {
  const commentBlock = html.match(/<!--([\s\S]*?)-->/);
  const meta = {};

  if (!commentBlock) {
    return meta;
  }

  const lines = commentBlock[1].split("\n");

  lines.forEach(line => {
    const [key, ...valueParts] = line.split(":");

    if (!key || valueParts.length === 0) {
      return;
    }

    meta[key.trim()] = valueParts.join(":").trim();
  });

  return meta;
}

function fileToSlug(fileName) {
  return fileName.replace(".html", "");
}

function slugToTitle(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

if (!fs.existsSync(postsDir)) {
  console.error("ERROR: posts folder does not exist.");
  process.exit(1);
}

const files = fs
  .readdirSync(postsDir)
  .filter(file => file.endsWith(".html"));

console.log("Found post files:", files);

const posts = files.map(file => {
  const filePath = path.join(postsDir, file);
  const html = fs.readFileSync(filePath, "utf8");
  const meta = getMeta(html);
  const slug = fileToSlug(file);

  return {
    title: meta.title || slugToTitle(slug),
    date: meta.date || "No date",
    category: meta.category || "Uncategorized",
    description: meta.description || "",
    slug: slug,
    file: `posts/${file}`
  };
});

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

console.log(`Generated posts.json with ${posts.length} post(s).`);