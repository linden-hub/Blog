# My Personal Blog + Newsletter

A simple, clean blog website with email newsletter functionality that works with GitHub Pages. No coding knowledge required!

**Features:**
- Write blog posts in easy Markdown format
- Embed YouTube videos automatically
- Email newsletter signup with MailerLite (free)
- Automatic emails when you publish new posts
- RSS feed for subscribers who prefer RSS readers
- Responsive design (works on mobile and desktop)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [How to Run Locally](#how-to-run-locally)
3. [How to Add a New Blog Post](#how-to-add-a-new-blog-post)
4. [How to Edit or Delete Posts](#how-to-edit-or-delete-posts)
5. [How to Add Images](#how-to-add-images)
6. [How to Embed YouTube Videos](#how-to-embed-youtube-videos)
7. [Setting Up MailerLite Newsletter](#setting-up-mailerlite-newsletter)
8. [Deploying to GitHub Pages](#deploying-to-github-pages)
9. [Complete Workflow: Publishing a Post with Email](#complete-workflow-publishing-a-post-with-email)
10. [Customizing Your Blog](#customizing-your-blog)
11. [Project Structure](#project-structure)
12. [Markdown Guide](#markdown-guide)
13. [Troubleshooting](#troubleshooting)

---

## Quick Start

1. Create a GitHub account at [github.com](https://github.com)
2. Create a repository and upload these files (see [Deploying to GitHub Pages](#deploying-to-github-pages))
3. Set up MailerLite for newsletter functionality (see [Setting Up MailerLite](#setting-up-mailerlite-newsletter))
4. Start writing blog posts!

---

## How to Run Locally

To preview your blog on your computer before publishing:

### Using Python (Recommended for Mac)

Python comes pre-installed on Mac. Open Terminal and run:

```bash
cd /path/to/your/Blog
python3 -m http.server 8000
```

Then open your browser to: `http://localhost:8000`

Press `Ctrl + C` to stop the server.

### Using VS Code

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the "Live Server" extension
3. Open your Blog folder in VS Code
4. Right-click `index.html` and select "Open with Live Server"

---

## How to Add a New Blog Post

Adding a new post involves 3 simple steps:

### Step 1: Create the Markdown File

1. Go to the `posts/` folder
2. Create a new file named like `my-new-post.md`
   - Use lowercase letters
   - Use hyphens instead of spaces
   - End with `.md`

3. Write your post using Markdown (see [Markdown Guide](#markdown-guide))

### Step 2: Add to posts.json

Open `posts/posts.json` and add a new entry:

```json
{
    "posts": [
        {
            "slug": "my-new-post",
            "title": "My New Post Title",
            "date": "2024-02-01",
            "description": "A short description shown on the homepage."
        },
        ... (other posts)
    ]
}
```

**Fields explained:**
- `slug`: Must match your filename (without `.md`)
- `title`: The title shown on your blog
- `date`: Format as `YYYY-MM-DD`
- `description`: Short summary for the homepage

### Step 3: Generate the RSS Feed (for newsletter)

Run the RSS generator script to automatically create the feed with full post content:

```bash
node scripts/generate-rss.js
```

This script:
- Reads all posts from `posts.json`
- Converts each Markdown file to HTML
- Includes the **full post content** so subscribers can read in their email
- Converts YouTube embeds to clickable thumbnail links (emails can't show iframes)
- Makes all image URLs absolute
- Outputs a properly formatted `rss.xml`

**Run this script every time you add or update a blog post!**

---

## How to Edit or Delete Posts

### Editing a Post

1. Edit the `.md` file in `posts/`
2. If changing the title or description, also update `posts/posts.json`
3. Run `node scripts/generate-rss.js` to regenerate the RSS feed

### Deleting a Post

1. Delete the `.md` file from `posts/`
2. Remove the entry from `posts/posts.json`
3. Run `node scripts/generate-rss.js` to regenerate the RSS feed

---

## How to Add Images

1. Put images in the `images/` folder
2. Reference them in your Markdown:

```markdown
![Description of image](images/my-photo.jpg)
```

**Tips:**
- Use descriptive filenames: `paris-sunset.jpg` not `IMG_1234.jpg`
- Keep images under 500KB for faster loading
- Supported formats: JPG, PNG, GIF, WebP

---

## How to Embed YouTube Videos

Just paste a YouTube URL on its own line:

```markdown
Check out this video:

https://www.youtube.com/watch?v=VIDEO_ID

Pretty cool, right?
```

The URL automatically becomes an embedded video player!

---

## Setting Up MailerLite Newsletter

MailerLite is a free email service that will:
- Collect email signups from your blog
- Automatically send emails when you publish new posts
- Manage your subscriber list

### Step 1: Create a MailerLite Account

1. Go to [mailerlite.com](https://www.mailerlite.com/)
2. Click "Sign Up Free"
3. Enter your email and create a password
4. Verify your email address
5. Complete the account setup (they'll ask about your business/blog)

**Free tier includes:**
- Up to 1,000 subscribers
- 12,000 emails per month
- RSS-to-email automation

### Step 2: Create a Signup Form

1. In MailerLite, go to **Forms** → **Embedded forms**
2. Click **Create embedded form**
3. Choose a template (simple is best)
4. Customize the form:
   - Change the heading to "Subscribe to my newsletter"
   - Keep just the email field (remove name if you want simplicity)
   - Customize the button text (e.g., "Subscribe")
   - Match colors to your blog (primary color: `#2563eb`)
5. Click **Save and publish**

### Step 3: Get the Embed Code

1. After saving, click **Embed form**
2. Select **HTML code**
3. Copy the entire code snippet

It will look something like this:
```html
<div class="ml-embedded" data-form="xxxxxx"></div>
<script>
(function(w,d,e,u,f,l,n){...})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', 'xxxxxx');
</script>
```

### Step 4: Add the Form to Your Blog

1. Open `index.html`
2. Find the section that says `<!-- MAILERLITE FORM PLACEHOLDER -->`
3. Replace the placeholder `<div id="mailerlite-form-placeholder">...</div>` with your MailerLite code
4. Do the same in `post.html`

**Example (in index.html and post.html):**

Replace this:
```html
<div id="mailerlite-form-placeholder" class="form-placeholder">
    <p><strong>Newsletter form will appear here</strong></p>
    ...
</div>
```

With your MailerLite code:
```html
<div class="ml-embedded" data-form="xxxxxx"></div>
<script>
(function(w,d,e,u,f,l,n){...})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
ml('account', 'xxxxxx');
</script>
```

### Step 5: Set Up RSS-to-Email Automation

This makes MailerLite automatically send emails when you publish new posts!

1. In MailerLite, go to **Campaigns** → **RSS campaigns** (or **Automations** depending on your interface)
2. Click **Create RSS campaign**
3. Configure the settings:
   - **RSS feed URL:** `https://linden-hub.github.io/Blog/rss.xml`
   - **Frequency:** Choose how often to check (daily recommended)
   - **Send when:** New items are found
4. Design your email template:
   - Add your blog name as the header
   - Use RSS content blocks to pull in post title, content, and link
   - Add a footer with unsubscribe link
5. Select your subscriber group (all subscribers)
6. Activate the automation

**How it works:**
- MailerLite checks your RSS feed periodically (e.g., daily)
- When it finds a new post, it automatically creates and sends an email
- Subscribers receive the email with your post content and a link to read more

### Alternative: Manual Email Sending

If you prefer more control, you can send emails manually:

1. Write and publish your blog post
2. In MailerLite, go to **Campaigns** → **Create campaign**
3. Design an email with your post content
4. Send to your subscribers

This gives you full control over timing and content but requires more effort.

---

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Name it (e.g., `Blog` or `my-blog`)
4. Make sure it's **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Your Files

**Option A: Using GitHub's web interface**

1. On your repository page, click **uploading an existing file**
2. Drag and drop all your blog files
3. Click **Commit changes**

**Option B: Using Git command line**

```bash
cd /path/to/your/Blog
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **main** branch and **/ (root)**
5. Click **Save**

### Step 4: Update Your URLs

After deploying, update the site URL in the RSS generator:

1. Open `scripts/generate-rss.js`
2. Find the `CONFIG` section at the top
3. Change `siteUrl` to your actual URL (e.g., `https://YOUR-USERNAME.github.io/YOUR-REPO`)
4. Run `node scripts/generate-rss.js` to regenerate the feed
5. Commit and push the changes

Your blog will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO`

---

## Complete Workflow: Publishing a Post with Email

Here's the complete process for publishing a new blog post and having it emailed to subscribers:

### 1. Write Your Post

Create `posts/my-awesome-post.md`:

```markdown
# My Awesome Post

This is my new blog post content...

## Section One

Some text here.

## Section Two

More content here.
```

### 2. Update posts.json

Add to `posts/posts.json`:

```json
{
    "slug": "my-awesome-post",
    "title": "My Awesome Post",
    "date": "2024-02-01",
    "description": "A brief description of what this post is about."
}
```

### 3. Generate the RSS Feed

Run the RSS generator to create the feed with full post content:

```bash
node scripts/generate-rss.js
```

You'll see output like:
```
✓ RSS feed generated: rss.xml
  - 5 post(s) included
  - Full content with HTML formatting
  - YouTube videos converted to clickable thumbnails
```

### 4. Push to GitHub

```bash
git add .
git commit -m "Add new post: My Awesome Post"
git push
```

### 5. Email Gets Sent Automatically!

MailerLite will detect the new RSS item and send an email to your subscribers (usually within a few hours, depending on your settings).

---

## Customizing Your Blog

### Change the Blog Name

1. In `index.html` and `post.html`, find and change:
   - `<title>My Blog</title>`
   - `<a href="index.html" class="logo">My Blog</a>`
2. In `scripts/generate-rss.js`, update `siteTitle` in the CONFIG section
3. Run `node scripts/generate-rss.js` to regenerate the RSS feed

### Change Colors

In `css/style.css`, modify the `:root` section:

```css
:root {
    --color-primary: #2563eb;       /* Accent color */
    --color-text: #1f2937;          /* Text color */
    --color-background: #ffffff;    /* Background */
}
```

### Change the Welcome Message

In `index.html`, find the `<section class="hero">` and edit the text.

### Change the Newsletter Text

In `index.html` and `post.html`, find the `newsletter-section` and edit:
- The heading
- The description text

---

## Project Structure

```
Blog/
├── index.html              # Homepage
├── post.html               # Individual post template
├── rss.xml                 # RSS feed (auto-generated, don't edit manually)
├── css/
│   └── style.css           # All styling
├── js/
│   └── blog.js             # Blog functionality
├── posts/
│   ├── posts.json          # List of posts
│   └── *.md                # Your blog posts
├── scripts/
│   └── generate-rss.js     # RSS feed generator (run after adding posts)
├── images/                 # Your images
├── .nojekyll               # Tells GitHub not to use Jekyll
└── README.md               # This file
```

### How It Works

1. **Homepage:** JavaScript reads `posts.json` and displays post cards
2. **Post page:** JavaScript loads the markdown file and converts it to HTML
3. **Newsletter:** Visitors sign up via the MailerLite form
4. **RSS feed:** Generated by `scripts/generate-rss.js` with full post content; MailerLite reads this to send emails

---

## Markdown Guide

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*

[Link text](https://example.com)

![Image description](images/photo.jpg)

- Bullet point
- Another point

1. Numbered item
2. Another item

> Blockquote for quotes

`inline code`

---
```

---

## Troubleshooting

### Newsletter form not showing

1. Make sure you replaced the placeholder with your MailerLite embed code
2. Check that the script tags are included
3. Test on the live site (some features don't work locally)

### Emails not being sent

1. Verify your RSS feed URL is correct in MailerLite
2. Check that the RSS automation is active
3. Regenerate the RSS feed: `node scripts/generate-rss.js`
4. MailerLite checks feeds periodically, so there may be a delay

### RSS feed errors

1. Make sure you ran `node scripts/generate-rss.js` after adding posts
2. Validate your XML at [validator.w3.org/feed](https://validator.w3.org/feed/)
3. Check that all posts in `posts.json` have matching `.md` files in `posts/`

### Posts not showing

1. Check that `slug` in `posts.json` matches the filename
2. Verify the `.md` file exists in `posts/`
3. Check for JSON syntax errors at [jsonlint.com](https://jsonlint.com)

### Changes not appearing on live site

1. Wait a few minutes for GitHub Pages to update
2. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Check that changes were pushed to GitHub

---

## Need Help?

1. Re-read the relevant section in this guide
2. Check the [Troubleshooting](#troubleshooting) section
3. Search your error message on Google
4. For MailerLite issues, check their [help center](https://www.mailerlite.com/help)

Good luck with your blog and newsletter!
