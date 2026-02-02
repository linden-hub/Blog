# My Personal Blog

A simple, clean blog website that works with GitHub Pages. No coding knowledge required to add and manage posts!

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How to Run Locally](#how-to-run-locally)
3. [How to Add a New Blog Post](#how-to-add-a-new-blog-post)
4. [How to Edit or Delete Posts](#how-to-edit-or-delete-posts)
5. [How to Add Images](#how-to-add-images)
6. [How to Embed YouTube Videos](#how-to-embed-youtube-videos)
7. [Deploying to GitHub Pages](#deploying-to-github-pages)
8. [Customizing Your Blog](#customizing-your-blog)
9. [Project Structure](#project-structure)
10. [Markdown Guide](#markdown-guide)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

If you just want to get your blog online quickly:

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository named `yourusername.github.io`
3. Upload all these files to that repository
4. Your blog will be live at `https://yourusername.github.io`!

Keep reading for detailed instructions.

---

## How to Run Locally

To preview your blog on your computer before publishing, you need to run a local server. Here's why: browsers have security restrictions that prevent loading local files directly. A local server bypasses this.

### Option 1: Using Python (Recommended)

Python comes pre-installed on Mac. Open Terminal and run:

```bash
# Navigate to your blog folder
cd /path/to/your/Blog

# Start the server
python3 -m http.server 8000
```

Then open your browser and go to: `http://localhost:8000`

To stop the server, press `Ctrl + C` in Terminal.

### Option 2: Using VS Code

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the "Live Server" extension
3. Open your Blog folder in VS Code
4. Right-click `index.html` and select "Open with Live Server"

### Option 3: Using Node.js

If you have Node.js installed:

```bash
# Install serve globally (only need to do this once)
npm install -g serve

# Navigate to your blog folder and start
cd /path/to/your/Blog
serve
```

---

## How to Add a New Blog Post

Adding a new post is a 2-step process:

### Step 1: Create the Markdown File

1. Go to the `posts/` folder
2. Create a new file with a name like `my-new-post.md`
   - Use lowercase letters
   - Use hyphens instead of spaces
   - End with `.md`

3. Write your post using Markdown (see [Markdown Guide](#markdown-guide) below)

**Example filename:** `my-trip-to-paris.md`

### Step 2: Add the Post to posts.json

1. Open `posts/posts.json`
2. Add a new entry to the `"posts"` array

Here's the structure:

```json
{
    "posts": [
        {
            "slug": "my-trip-to-paris",
            "title": "My Amazing Trip to Paris",
            "date": "2024-02-15",
            "description": "Sharing photos and stories from my recent adventure in the City of Light."
        }
    ]
}
```

**Important fields:**
- `slug`: Must match your filename (without `.md`)
- `title`: The title shown on your blog
- `date`: Format as `YYYY-MM-DD` (year-month-day)
- `description`: A short summary shown on the homepage

### Complete Example

Let's say you want to add a post about your favorite recipes.

**Step 1:** Create `posts/favorite-recipes.md`:

```markdown
# My Favorite Recipes

Here are some recipes I love to make...

## Chocolate Chip Cookies

These are the best cookies ever!

### Ingredients
- 2 cups flour
- 1 cup sugar
- 1 cup chocolate chips

### Instructions
1. Mix dry ingredients
2. Add wet ingredients
3. Bake at 350°F for 12 minutes

## Pasta Carbonara

A classic Italian dish...
```

**Step 2:** Update `posts/posts.json`:

```json
{
    "posts": [
        {
            "slug": "favorite-recipes",
            "title": "My Favorite Recipes",
            "date": "2024-02-20",
            "description": "A collection of my go-to recipes including cookies and pasta carbonara."
        },
        {
            "slug": "welcome-to-my-blog",
            "title": "Welcome to My Blog!",
            "date": "2024-01-15",
            "description": "Hello and welcome! This is my first blog post."
        }
    ]
}
```

**Note:** Posts are automatically sorted by date (newest first), so the order in the JSON file doesn't matter.

---

## How to Edit or Delete Posts

### Editing a Post

1. Open the `.md` file in the `posts/` folder
2. Make your changes
3. Save the file

The changes will appear immediately (refresh your browser).

To update the title, date, or description shown on the homepage, also edit `posts/posts.json`.

### Deleting a Post

1. Delete the `.md` file from the `posts/` folder
2. Remove the corresponding entry from `posts/posts.json`

---

## How to Add Images

### Step 1: Add Images to the Images Folder

1. Put your image files in the `images/` folder
2. Use descriptive filenames: `paris-eiffel-tower.jpg` (not `IMG_1234.jpg`)

### Step 2: Reference Images in Your Posts

In your Markdown file, use this format:

```markdown
![Description of image](images/your-image-name.jpg)
```

**Example:**

```markdown
Here's a photo from my trip:

![The Eiffel Tower at sunset](images/paris-eiffel-tower.jpg)

It was absolutely beautiful!
```

### Image Tips

- **Supported formats:** JPG, PNG, GIF, WebP
- **Optimize file size:** Large images slow down your site. Aim for under 500KB per image.
- **Use descriptive alt text:** The text in brackets helps with accessibility and SEO

---

## How to Embed YouTube Videos

Adding YouTube videos is super easy! Just paste the YouTube URL on its own line.

### Example

In your Markdown file:

```markdown
Check out this great video:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

What do you think?
```

The URL will automatically become an embedded video player!

### Supported URL Formats

All of these work:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Important

- The URL must be on its own line (not mixed with other text)
- Leave blank lines before and after the URL

---

## Deploying to GitHub Pages

Follow these steps to publish your blog online for free!

### Step 1: Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign Up" and create an account
3. Verify your email address

### Step 2: Create a New Repository

1. Click the "+" icon in the top right corner
2. Select "New repository"
3. Name it exactly: `yourusername.github.io` (replace `yourusername` with your GitHub username)
4. Make sure it's set to "Public"
5. Click "Create repository"

### Step 3: Upload Your Files

**Option A: Using GitHub's Web Interface (Easiest)**

1. On your new repository page, click "uploading an existing file"
2. Drag and drop ALL your blog files and folders
3. Click "Commit changes"

**Option B: Using GitHub Desktop**

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Copy your blog files into the cloned folder
4. Commit and push

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (tab at the top)
3. Click "Pages" (in the left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

### Step 5: Visit Your Site!

After a few minutes, your blog will be live at:

`https://yourusername.github.io`

### Updating Your Blog

After initial setup, to add new posts:

1. Make changes locally (add posts, etc.)
2. Upload/push the changed files to GitHub
3. Changes go live automatically!

---

## Customizing Your Blog

### Change the Blog Name

1. Open `index.html`
2. Find `<title>My Blog</title>` and change "My Blog"
3. Find `<a href="index.html" class="logo">My Blog</a>` and change "My Blog"
4. Do the same in `post.html`

### Change Colors

1. Open `css/style.css`
2. Find the `:root` section at the top
3. Change the color values:

```css
:root {
    --color-primary: #2563eb;       /* Main accent color */
    --color-text: #1f2937;          /* Text color */
    --color-background: #ffffff;    /* Background color */
    /* ... etc */
}
```

**Color picker tip:** Search "color picker" on Google to find colors you like!

### Change the Welcome Message

1. Open `index.html`
2. Find the `<section class="hero">` section
3. Edit the text inside

### Change Fonts

1. Go to [fonts.google.com](https://fonts.google.com)
2. Find a font you like
3. Copy the embed code
4. Replace the Google Fonts link in `index.html` and `post.html`
5. Update the font name in `css/style.css` under `--font-family`

---

## Project Structure

Here's what each file and folder does:

```
Blog/
├── index.html          # Homepage - lists all your posts
├── post.html           # Template for viewing individual posts
├── css/
│   └── style.css       # All the styling (colors, fonts, layout)
├── js/
│   └── blog.js         # JavaScript that makes the blog work
├── posts/
│   ├── posts.json      # List of all your posts (you edit this!)
│   ├── welcome-to-my-blog.md        # Example post
│   └── how-to-embed-youtube.md      # Example post
├── images/             # Put your images here
└── README.md           # This file!
```

### How It Works (Simple Explanation)

1. When someone visits your homepage, JavaScript reads `posts.json` to get the list of posts
2. It creates a card for each post and displays them
3. When someone clicks a post, they go to `post.html?slug=post-name`
4. JavaScript loads the matching `.md` file and converts it to HTML
5. The post is displayed!

---

## Markdown Guide

Markdown is a simple way to format text. Here's a quick reference:

### Headings

```markdown
# Biggest Heading (H1)
## Second Level (H2)
### Third Level (H3)
```

### Text Formatting

```markdown
**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
```

### Links

```markdown
[Click here](https://example.com)
```

### Images

```markdown
![Alt text](images/photo.jpg)
```

### Lists

```markdown
Bullet points:
- Item one
- Item two
- Item three

Numbered list:
1. First
2. Second
3. Third
```

### Blockquotes

```markdown
> This is a quote
> It can span multiple lines
```

### Code

```markdown
Inline `code` looks like this.

Code blocks:
```
function hello() {
    console.log("Hello!");
}
```
```

### Horizontal Line

```markdown
---
```

---

## Troubleshooting

### "Loading posts..." never goes away

- **If running locally:** Make sure you're using a local server (see [How to Run Locally](#how-to-run-locally))
- **Check `posts.json`:** Make sure it's valid JSON (no missing commas, brackets, etc.)

### Post not showing up

1. Check that the `slug` in `posts.json` exactly matches the filename (without `.md`)
2. Make sure the `.md` file exists in the `posts/` folder
3. Check for typos!

### Images not loading

1. Make sure the image is in the `images/` folder
2. Check that the path in your Markdown is correct
3. Check for typos in the filename (it's case-sensitive!)

### YouTube video not embedding

1. Make sure the URL is on its own line
2. Leave blank lines before and after the URL
3. Check that it's a valid YouTube URL

### Changes not showing on GitHub Pages

- Wait a few minutes - it can take up to 10 minutes to update
- Try a hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Check the repository to make sure your files were uploaded

### JSON Syntax Errors

Common issues in `posts.json`:
- Missing comma between posts
- Missing quotation marks around strings
- Extra comma after the last post

Use [jsonlint.com](https://jsonlint.com) to validate your JSON!

---

## Need Help?

If you get stuck:

1. Re-read the relevant section of this guide
2. Check the [Troubleshooting](#troubleshooting) section
3. Make sure you followed each step exactly
4. Try searching your error message on Google

Good luck with your blog! 🎉
