import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Clock, Calendar, BookOpen } from "lucide-react";
import { BlogPost } from "../types/blog";

interface BlogPreviewHomeProps {
  onViewAllBlogs: () => void;
  onReadPost: (slug: string) => void;
}

export const BlogPreviewHome: React.FC<BlogPreviewHomeProps> = ({
  onViewAllBlogs,
  onReadPost
}) => {
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blogs?status=published")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.blogs)) {
          setRecentBlogs(data.blogs.slice(0, 3));
        }
      })
      .catch(err => console.error("Error fetching homepage blogs:", err));
  }, []);

  if (recentBlogs.length === 0) return null;

  return (
    <section className="space-y-6 pt-12 border-t border-rose-100/50">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-pink-600 bg-pink-50 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Art & Craft Guides</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Latest from Our Crafts Journal 📝
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mt-1">
            Tips, step-by-step painting guides, and creative screen-free ideas to inspire children at home.
          </p>
        </div>

        <button
          onClick={onViewAllBlogs}
          className="inline-flex items-center gap-2 text-xs font-black text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>View All Articles</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recentBlogs.map(blog => (
          <div
            key={blog.id}
            onClick={() => onReadPost(blog.slug)}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="aspect-video bg-stone-100 overflow-hidden relative">
                <img
                  src={blog.featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                  {blog.category}
                </span>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                  <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{blog.readTimeMinutes || 4} min read</span>
                </div>
                <h3 className="text-base font-black text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-2 tracking-tight">
                  {blog.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
              <span className="text-[11px] font-bold text-stone-600">
                By {blog.author?.name}
              </span>
              <span className="text-xs font-black text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
