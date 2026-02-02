#!/usr/bin/env node
/**
 * RSS Feed Generator
 *
 * Generates an RSS feed with full blog post content from Markdown files.
 *
 * Usage: node scripts/generate-rss.js
 *
 * This script:
 * 1. Reads posts from posts/posts.json
 * 2. Converts each Markdown file to HTML
 * 3. Converts YouTube embeds to clickable links (for email compatibility)
 * 4. Makes image URLs absolute
 * 5. Generates rss.xml with full content
 */

const fs = require('fs');
const path = require('path');

// Configuration - Update these to match your blog
const CONFIG = {
    siteUrl: 'https://linden-hub.github.io/Blog',
    siteTitle: 'My Blog',
    siteDescription: 'Thoughts, stories, and ideas worth sharing',
    language: 'en-us',
    postsJsonPath: path.join(__dirname, '..', 'posts', 'posts.json'),
    postsFolder: path.join(__dirname, '..', 'posts'),
    outputPath: path.join(__dirname, '..', 'rss.xml')
};

/**
 * Simple Markdown to HTML converter
 * Handles common Markdown syntax without external dependencies
 */
function markdownToHtml(markdown) {
    let html = markdown;

    // Escape HTML entities first (except for our conversions)
    // We'll handle this carefully to not double-escape

    // Code blocks (``` ... ```) - must be done before other processing
    // Use placeholder to prevent further processing
    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code>${escapedCode.trim()}</code></pre>`);
        return placeholder;
    });

    // Inline code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers (# to ######)
    html = html.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Images - convert to absolute URLs
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        // Make relative URLs absolute
        if (!src.startsWith('http://') && !src.startsWith('https://')) {
            src = `${CONFIG.siteUrl}/${src}`;
        }
        return `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;" />`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Blockquotes
    html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr />');
    html = html.replace(/^\*\*\*+$/gm, '<hr />');

    // Unordered lists
    html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

    // Paragraphs - wrap remaining text blocks
    const lines = html.split('\n');
    const result = [];
    let inParagraph = false;
    let paragraphContent = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) {
            if (inParagraph && paragraphContent.length > 0) {
                result.push(`<p>${paragraphContent.join(' ')}</p>`);
                paragraphContent = [];
                inParagraph = false;
            }
            continue;
        }

        // Check if this line is already wrapped in HTML or is a code block placeholder
        const isHtmlBlock = /^<(h[1-6]|ul|ol|li|pre|blockquote|hr|img|div|p)[\s>]/i.test(trimmed) ||
                           /^<\/(h[1-6]|ul|ol|li|pre|blockquote|div|p)>/i.test(trimmed) ||
                           /^__CODE_BLOCK_\d+__$/.test(trimmed);

        if (isHtmlBlock) {
            if (inParagraph && paragraphContent.length > 0) {
                result.push(`<p>${paragraphContent.join(' ')}</p>`);
                paragraphContent = [];
                inParagraph = false;
            }
            result.push(trimmed);
        } else {
            inParagraph = true;
            paragraphContent.push(trimmed);
        }
    }

    // Don't forget the last paragraph
    if (paragraphContent.length > 0) {
        result.push(`<p>${paragraphContent.join(' ')}</p>`);
    }

    let finalHtml = result.join('\n');

    // Restore code blocks
    codeBlocks.forEach((block, index) => {
        finalHtml = finalHtml.replace(`__CODE_BLOCK_${index}__`, block);
    });

    return finalHtml;
}

/**
 * Convert YouTube embeds/links to clickable links for email compatibility
 * Emails can't display iframes, so we convert to thumbnail + link
 */
function processYouTubeForEmail(html) {
    // Match YouTube URLs in paragraphs (standalone links)
    const youtubeRegex = /<p>\s*(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)\s*<\/p>/gi;

    return html.replace(youtubeRegex, (match, protocol, www, path, videoId) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        return `
<div style="margin: 20px 0; text-align: center;">
    <a href="${videoUrl}" style="display: inline-block; text-decoration: none;">
        <img src="${thumbnailUrl}" alt="YouTube Video" style="max-width: 100%; height: auto; border-radius: 8px;" />
        <p style="margin-top: 8px; color: #818cf8;">▶ Watch on YouTube</p>
    </a>
</div>`;
    });
}

/**
 * Format date for RSS pubDate field
 * RSS requires format: "Day, DD Mon YYYY HH:MM:SS GMT"
 */
function formatRssDate(dateString) {
    const date = new Date(dateString);
    return date.toUTCString();
}

/**
 * Escape special XML characters
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Generate the RSS feed
 */
function generateRssFeed() {
    // Read posts.json
    let postsData;
    try {
        const postsJson = fs.readFileSync(CONFIG.postsJsonPath, 'utf8');
        postsData = JSON.parse(postsJson);
    } catch (error) {
        console.error('Error reading posts.json:', error.message);
        process.exit(1);
    }

    const posts = postsData.posts || [];

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Generate items for each post
    const items = posts.map(post => {
        // Read the markdown file
        const mdPath = path.join(CONFIG.postsFolder, `${post.slug}.md`);
        let markdownContent;

        try {
            markdownContent = fs.readFileSync(mdPath, 'utf8');
        } catch (error) {
            console.warn(`Warning: Could not read ${mdPath}, skipping post.`);
            return null;
        }

        // Convert markdown to HTML
        let htmlContent = markdownToHtml(markdownContent);

        // Process YouTube links for email compatibility
        htmlContent = processYouTubeForEmail(htmlContent);

        // Generate the item
        const postUrl = `${CONFIG.siteUrl}/post.html?slug=${post.slug}`;

        return `        <item>
            <title>${escapeXml(post.title)}</title>
            <link>${postUrl}</link>
            <guid isPermaLink="true">${postUrl}</guid>
            <pubDate>${formatRssDate(post.date)}</pubDate>
            <description>${escapeXml(post.description || '')}</description>
            <content:encoded><![CDATA[
${htmlContent}

<p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
    <a href="${postUrl}" style="color: #818cf8;">Read this post on the blog →</a>
</p>
            ]]></content:encoded>
        </item>`;
    }).filter(item => item !== null);

    // Generate the full RSS feed
    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>${escapeXml(CONFIG.siteTitle)}</title>
        <description>${escapeXml(CONFIG.siteDescription)}</description>
        <link>${CONFIG.siteUrl}</link>
        <language>${CONFIG.language}</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>

${items.join('\n\n')}

    </channel>
</rss>
`;

    // Write the RSS feed
    try {
        fs.writeFileSync(CONFIG.outputPath, rssFeed);
        console.log(`✓ RSS feed generated: ${CONFIG.outputPath}`);
        console.log(`  - ${posts.length} post(s) included`);
        console.log(`  - Full content with HTML formatting`);
        console.log(`  - YouTube videos converted to clickable thumbnails`);
    } catch (error) {
        console.error('Error writing RSS feed:', error.message);
        process.exit(1);
    }
}

// Run the generator
generateRssFeed();
