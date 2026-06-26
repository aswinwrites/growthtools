import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  author: string;
  authorTitle?: string;
  coverImage?: string;
  tags?: string[];
  content: string;
}

export interface BlogPostMeta extends Omit<BlogPost, "content"> {}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        category: data.category ?? "",
        readTime: data.readTime ?? "5 min read",
        author: data.author ?? "MarketerTools",
        authorTitle: data.authorTitle,
        coverImage: data.coverImage,
        tags: data.tags ?? [],
      } as BlogPostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    category: data.category ?? "",
    readTime: data.readTime ?? "5 min read",
    author: data.author ?? "MarketerTools",
    authorTitle: data.authorTitle,
    coverImage: data.coverImage,
    tags: data.tags ?? [],
    content,
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Extracts FAQ pairs from article MDX content.
 * Looks for a "## FAQ" section with **Question?** / Answer paragraph format.
 */
export function extractFaqs(
  content: string
): { question: string; answer: string }[] {
  const faqSectionMatch = content.match(/^## FAQ\s*\n([\s\S]*)$/m);
  if (!faqSectionMatch) return [];

  const faqSection = faqSectionMatch[1];
  const faqs: { question: string; answer: string }[] = [];

  // Each Q&A block: **Question text?** \n Answer paragraph(s)
  const pattern = /\*\*(.+?)\*\*\n([\s\S]+?)(?=\n\*\*|\s*$)/g;
  let match;
  while ((match = pattern.exec(faqSection)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/\n+/g, " ").trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}
