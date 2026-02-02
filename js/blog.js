/*
========================================
BLOG ENGINE - JavaScript that powers your blog
========================================

This file handles:
1. Loading the list of blog posts from posts.json
2. Displaying post previews on the homepage
3. Loading and displaying full blog posts
4. Converting Markdown to HTML
5. Handling YouTube video embeds

You don't need to modify this file unless you want to
change how the blog works.
*/


/* ========================================
   CONFIGURATION
   ========================================
   Change these if you modify your folder structure
*/
const CONFIG = {
    // Path to the JSON file containing your posts list
    postsJsonPath: 'posts/posts.json',

    // Path to the folder containing your markdown files
    postsFolder: 'posts/',

    // Number of characters to show in post excerpts on homepage
    excerptLength: 200
};


/* ========================================
   MAIN FUNCTIONS
   ========================================
*/

/**
 * DISPLAY POSTS LIST (Homepage)
 *
 * This function:
 * 1. Fetches the list of posts from posts.json
 * 2. Creates HTML cards for each post
 * 3. Inserts them into the homepage
 */
async function displayPostsList() {
    // Find the container where posts will be displayed
    const container = document.getElementById('posts-container');

    try {
        // STEP 1: Fetch the posts list from our JSON file
        const response = await fetch(CONFIG.postsJsonPath);

        // Check if the file was found
        if (!response.ok) {
            throw new Error('Could not load posts. Make sure posts/posts.json exists.');
        }

        // STEP 2: Convert the JSON text into a JavaScript object
        const data = await response.json();
        const posts = data.posts;

        // STEP 3: Check if there are any posts
        if (!posts || posts.length === 0) {
            container.innerHTML = '<p class="loading">No posts yet. Add your first post!</p>';
            return;
        }

        // STEP 4: Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // STEP 5: Create HTML for each post card
        let postsHTML = '<div class="posts-list">';

        for (const post of posts) {
            // Format the date nicely (e.g., "January 15, 2024")
            const formattedDate = formatDate(post.date);

            // Create the card HTML
            postsHTML += `
                <article class="post-card">
                    <h3><a href="post.html?slug=${post.slug}">${escapeHtml(post.title)}</a></h3>
                    <p class="post-date">${formattedDate}</p>
                    <p class="post-excerpt">${escapeHtml(post.description)}</p>
                    <a href="post.html?slug=${post.slug}" class="read-more">Read more &rarr;</a>
                </article>
            `;
        }

        postsHTML += '</div>';

        // STEP 6: Insert the HTML into the page
        container.innerHTML = postsHTML;

    } catch (error) {
        // If something goes wrong, show an error message
        console.error('Error loading posts:', error);
        container.innerHTML = `
            <div class="error">
                <p><strong>Error loading posts</strong></p>
                <p>${error.message}</p>
                <p>If you're running locally, make sure to use a local server (see README).</p>
            </div>
        `;
    }
}


/**
 * DISPLAY SINGLE POST (Post page)
 *
 * This function:
 * 1. Gets the post "slug" from the URL (e.g., ?slug=my-first-post)
 * 2. Finds the post info in posts.json
 * 3. Loads the markdown file
 * 4. Converts markdown to HTML and displays it
 */
async function displaySinglePost() {
    // Find the elements where we'll display content
    const titleElement = document.getElementById('post-title');
    const dateElement = document.getElementById('post-date');
    const contentElement = document.getElementById('post-content');

    try {
        // STEP 1: Get the slug from the URL
        // URL looks like: post.html?slug=my-first-post
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');

        if (!slug) {
            throw new Error('No post specified. Go back to the homepage and click on a post.');
        }

        // STEP 2: Fetch the posts list to get post info
        const response = await fetch(CONFIG.postsJsonPath);
        if (!response.ok) {
            throw new Error('Could not load posts list.');
        }

        const data = await response.json();

        // STEP 3: Find the specific post by its slug
        const postInfo = data.posts.find(p => p.slug === slug);

        if (!postInfo) {
            throw new Error(`Post "${slug}" not found. Check that it exists in posts.json.`);
        }

        // STEP 4: Update the page title and header
        document.title = `${postInfo.title} | My Blog`;
        titleElement.textContent = postInfo.title;
        dateElement.textContent = formatDate(postInfo.date);

        // STEP 5: Load the markdown file
        const markdownResponse = await fetch(`${CONFIG.postsFolder}${slug}.md`);

        if (!markdownResponse.ok) {
            throw new Error(`Could not load post file: ${slug}.md`);
        }

        const markdownContent = await markdownResponse.text();

        // STEP 6: Convert markdown to HTML
        // The 'marked' library (loaded in the HTML) does this conversion
        let htmlContent = marked.parse(markdownContent);

        // STEP 7: Process YouTube links to make them embedded videos
        htmlContent = processYouTubeLinks(htmlContent);

        // STEP 8: Display the content
        contentElement.innerHTML = htmlContent;

    } catch (error) {
        // Show error message
        console.error('Error loading post:', error);
        titleElement.textContent = 'Error';
        dateElement.textContent = '';
        contentElement.innerHTML = `
            <div class="error">
                <p><strong>Error loading post</strong></p>
                <p>${error.message}</p>
                <p><a href="index.html">&larr; Back to homepage</a></p>
            </div>
        `;
    }
}


/* ========================================
   HELPER FUNCTIONS
   ========================================
*/

/**
 * FORMAT DATE
 * Converts a date string like "2024-01-15" to "January 15, 2024"
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


/**
 * ESCAPE HTML
 * Prevents XSS attacks by escaping special characters
 * This is a security measure - always use this when displaying user content
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


/**
 * PROCESS YOUTUBE LINKS
 *
 * Finds YouTube URLs in the content and converts them to embedded videos.
 *
 * Supports these formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 *
 * How to use in your posts:
 * Just paste a YouTube URL on its own line, and it will become an embedded video!
 *
 * Example in your markdown:
 *   Check out this video:
 *
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *
 *   Pretty cool, right?
 */
function processYouTubeLinks(html) {
    // Regular expression to match YouTube URLs
    // This looks complicated, but it's just pattern matching for different YouTube URL formats
    const youtubeRegex = /<p>\s*(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)\s*<\/p>/gi;

    // Replace each YouTube URL with an embedded video player
    return html.replace(youtubeRegex, function(match, protocol, www, path, videoId) {
        return `
            <div class="video-container">
                <iframe
                    src="https://www.youtube.com/embed/${videoId}"
                    title="YouTube video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        `;
    });
}


/**
 * CREATE EXCERPT
 * Shortens text to a specified length for post previews
 * (Currently not used, but available if you want to auto-generate excerpts from content)
 */
function createExcerpt(text, maxLength = CONFIG.excerptLength) {
    // Remove HTML tags
    const plainText = text.replace(/<[^>]*>/g, '');

    // Shorten if needed
    if (plainText.length <= maxLength) {
        return plainText;
    }

    // Cut at the last space before the limit (don't cut words in half)
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return truncated.substring(0, lastSpace) + '...';
}


/* ========================================
   MARKDOWN REFERENCE (for writing posts)
   ========================================

   Here's a quick reference for Markdown syntax you can use in your posts:

   # Heading 1
   ## Heading 2
   ### Heading 3

   Regular paragraph text.

   **bold text**
   *italic text*
   ***bold and italic***

   [Link text](https://example.com)

   ![Image alt text](images/my-image.jpg)

   - Bullet point 1
   - Bullet point 2
   - Bullet point 3

   1. Numbered item 1
   2. Numbered item 2
   3. Numbered item 3

   > This is a blockquote
   > Great for highlighting quotes or important notes

   `inline code`

   ```
   Code block
   Multiple lines of code
   ```

   ---  (horizontal line)

   YouTube video (just paste the URL on its own line):
   https://www.youtube.com/watch?v=VIDEO_ID

*/
