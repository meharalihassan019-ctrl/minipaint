import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Upload,
  Globe,
  Share2,
  Smartphone,
  Monitor,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Folder,
  Layers,
  HelpCircle,
  Copy,
  Save,
  RefreshCw,
  Sliders,
  Image as ImageIcon
} from "lucide-react";
import { BlogPost, BlogPostSEO, RankMathAnalysis } from "../../types/blog";
import { analyzeRankMathSEO } from "../../utils/rankMathScorer";

interface BlogManagerProps {
  onNotification?: (msg: string) => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ onNotification }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "editor">("list");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // List view filters
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Editor State
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("Painting Guides");
  const [postTags, setPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [authorName, setAuthorName] = useState("Mini Paint Station Team");
  const [authorRole, setAuthorRole] = useState("Art & Craft Specialists");
  const [postStatus, setPostStatus] = useState<"published" | "draft">("published");

  // Rank Math SEO State
  const [focusKeyword, setFocusKeyword] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [schemaType, setSchemaType] = useState<"BlogPosting" | "Article" | "NewsArticle">("BlogPosting");
  
  // Rank Math UI tabs
  const [seoActiveTab, setSeoActiveTab] = useState<"general" | "checklist" | "social" | "advanced">("general");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  
  // Storage & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [autoSaveNotice, setAutoSaveNotice] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Categories list
  const categories = ["Painting Guides", "Kids Activities", "Gift Ideas", "Parenting Tips", "Craft Ideas"];

  // Fetch blogs on load
  const loadBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Compute live Rank Math Analysis
  const currentPostDraft: Partial<BlogPost> = {
    title: postTitle,
    slug: postSlug,
    excerpt: postExcerpt,
    content: postContent,
    featuredImage,
    featuredImageAlt,
    seo: {
      focusKeyword,
      seoTitle: seoTitle || postTitle,
      metaDescription: metaDescription || postExcerpt,
      canonicalUrl,
      robotsIndex,
      robotsFollow,
      schemaType
    }
  };
  const rankMathAnalysis: RankMathAnalysis = analyzeRankMathSEO(currentPostDraft);

  // Auto-slug generator when title changes (unless editing existing post slug)
  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    if (!selectedPost) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setPostSlug(generated);
      if (!seoTitle) {
        setSeoTitle(val);
      }
    }
  };

  // Open New Post Editor
  const handleNewPost = () => {
    setSelectedPost(null);
    setPostTitle("");
    setPostSlug("");
    setPostExcerpt("");
    setPostContent("<h2>Introduction</h2>\n<p>Start writing your engaging article here...</p>\n\n<h2>Key Tips & Fun Ideas</h2>\n<ul>\n  <li>Tip 1: Use vibrant non-toxic paints</li>\n  <li>Tip 2: Allow 15 minutes drying time</li>\n</ul>");
    setPostCategory("Painting Guides");
    setPostTags(["Plaster Painting", "Kids Activities", "Pakistan"]);
    setFeaturedImage("/assets/images/medium_paint_kit_1784789218683.jpg");
    setFeaturedImageAlt("");
    setAuthorName("Mini Paint Station Team");
    setAuthorRole("Art & Craft Specialists");
    setPostStatus("published");
    setFocusKeyword("");
    setSeoTitle("");
    setMetaDescription("");
    setCanonicalUrl("");
    setRobotsIndex(true);
    setRobotsFollow(true);
    setSchemaType("BlogPosting");
    setSaveSuccessMsg("");
    setActiveTab("editor");
  };

  // Open Existing Post Editor
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setPostTitle(post.title || "");
    setPostSlug(post.slug || "");
    setPostExcerpt(post.excerpt || "");
    setPostContent(post.content || "");
    setPostCategory(post.category || "Painting Guides");
    setPostTags(post.tags || []);
    setFeaturedImage(post.featuredImage || "");
    setFeaturedImageAlt(post.featuredImageAlt || "");
    setAuthorName(post.author?.name || "Mini Paint Station Team");
    setAuthorRole(post.author?.role || "Art & Craft Specialists");
    setPostStatus(post.status || "published");
    setFocusKeyword(post.seo?.focusKeyword || "");
    setSeoTitle(post.seo?.seoTitle || post.title || "");
    setMetaDescription(post.seo?.metaDescription || post.excerpt || "");
    setCanonicalUrl(post.seo?.canonicalUrl || "");
    setRobotsIndex(post.seo?.robotsIndex !== false);
    setRobotsFollow(post.seo?.robotsFollow !== false);
    setSchemaType(post.seo?.schemaType || "BlogPosting");
    setSaveSuccessMsg("");
    setActiveTab("editor");
  };

  // Local Storage Safety Draft (Auto-save in browser so work is never lost!)
  useEffect(() => {
    if (activeTab === "editor" && postTitle) {
      const draft = {
        title: postTitle,
        slug: postSlug,
        content: postContent,
        focusKeyword,
        savedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem("mps_blog_autosave_draft", JSON.stringify(draft));
      setAutoSaveNotice(`Draft auto-saved at ${draft.savedAt}`);
    }
  }, [postTitle, postContent, postSlug, focusKeyword, activeTab]);

  // Featured Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/upload-blog-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Data,
            filename: file.name
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFeaturedImage(data.url);
          if (!featuredImageAlt && focusKeyword) {
            setFeaturedImageAlt(focusKeyword);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!postTags.includes(tagInput.trim())) {
      setPostTags([...postTags, tagInput.trim()]);
    }
    setTagInput("");
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setPostTags(postTags.filter(t => t !== tagToRemove));
  };

  // Save Blog Post (Atomic Server write with Automatic .bak Backup)
  const handleSavePost = async () => {
    if (!postTitle.trim()) {
      alert("Please provide a post title.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccessMsg("");

      const payload: Partial<BlogPost> = {
        id: selectedPost ? selectedPost.id : undefined,
        title: postTitle.trim(),
        slug: postSlug.trim() || undefined,
        excerpt: postExcerpt.trim(),
        content: postContent,
        featuredImage,
        featuredImageAlt: featuredImageAlt || focusKeyword || postTitle,
        category: postCategory,
        tags: postTags,
        author: {
          name: authorName,
          role: authorRole,
          avatar: "🎨"
        },
        status: postStatus,
        seo: {
          focusKeyword: focusKeyword.trim(),
          seoTitle: seoTitle.trim() || postTitle.trim(),
          metaDescription: metaDescription.trim() || postExcerpt.trim(),
          canonicalUrl: canonicalUrl.trim() || `https://minipaintstation.shop/blog/${postSlug}`,
          robotsIndex,
          robotsFollow,
          schemaType,
          socialTitle: seoTitle.trim() || postTitle.trim(),
          socialDescription: metaDescription.trim() || postExcerpt.trim(),
          socialImage: featuredImage
        }
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.blog) {
        setSaveSuccessMsg("✅ محفوظ کر لیا گیا! (Saved safely with zero data loss!)");
        setSelectedPost(data.blog);
        await loadBlogs();
        if (onNotification) {
          onNotification("Blog post saved with Rank Math SEO successfully!");
        }
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      } else {
        alert(data.error || "Failed to save blog post.");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error while saving post. Please retry.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await loadBlogs();
        if (activeTab === "editor" && selectedPost?.id === id) {
          setActiveTab("list");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Formatting helper buttons for content editor
  const insertFormatting = (tagStart: string, tagEnd: string) => {
    setPostContent(prev => prev + `\n${tagStart}Your text here${tagEnd}\n`);
  };

  // Filtered blogs for list view
  const filteredBlogs = blogs.filter(b => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterCategory !== "All" && b.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.seo?.focusKeyword?.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-md">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                WordPress & Rank Math Blog Studio
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                Data Backup Protected 🔒
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              Create, edit, optimize and publish SEO-ranked blogs with featured image and permanent storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "editor" ? (
            <button
              onClick={() => setActiveTab("list")}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Posts</span>
            </button>
          ) : (
            <button
              onClick={handleNewPost}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-xs px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* --- TAB 1: POSTS LIST VIEW --- */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Controls / Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[220px]">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts or focus keywords..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-pink-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-stone-700 focus:outline-pink-500 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Status Filter */}
              <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1">
                {(["all", "published", "draft"] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      filterStatus === st
                        ? "bg-white text-stone-900 shadow-xs font-black"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Posts Table / Cards */}
          {isLoading ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-pink-500 mb-2" />
              <p className="text-xs font-bold">Loading blogs from database...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-500 space-y-3">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-2xl">
                📝
              </div>
              <h3 className="text-base font-black text-stone-800">No blog posts found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No posts match your filters. Click below to write your first SEO-optimized blog!
              </p>
              <button
                onClick={handleNewPost}
                className="bg-pink-500 hover:bg-pink-600 text-white font-black text-xs px-4 py-2 rounded-xl transition-all"
              >
                + Create Blog Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredBlogs.map(post => {
                const analysis = analyzeRankMathSEO(post);
                return (
                  <div
                    key={post.id}
                    className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Post Thumbnail & Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-16 h-16 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={post.featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {post.status.toUpperCase()}
                          </span>
                          <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                            {post.category}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-stone-900 tracking-tight truncate max-w-lg">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-stone-500 font-medium">
                          <span>Focus KW: <strong className="text-stone-800">{post.seo?.focusKeyword || "None"}</strong></span>
                          <span>•</span>
                          <span>Views: <strong>{post.views || 0}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Rank Math SEO Score Badge */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-2xl border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500">Rank Math:</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                          analysis.score >= 80 
                            ? "bg-emerald-500 text-white" 
                            : analysis.score >= 50 
                            ? "bg-amber-500 text-white" 
                            : "bg-rose-500 text-white"
                        }`}>
                          {analysis.score}/100
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditPost(post)}
                          className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer transition-all"
                          title="Edit Post"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer transition-all"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: WORDPRESS & RANK MATH EDITOR --- */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 8 COLS: WordPress Title, Excerpt, Content & Rank Math SEO Box */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Title & Permalink Input */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <input
                type="text"
                placeholder="Add title (WordPress Headline)..."
                value={postTitle}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full text-2xl font-black text-stone-900 border-none outline-none placeholder:text-stone-300 tracking-tight"
              />
              
              {/* Permalink Display & Edit */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                <Globe className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="font-semibold text-stone-400">Permalink:</span>
                <span className="text-stone-500 font-mono text-[11px]">https://minipaintstation.shop/blog/</span>
                <input
                  type="text"
                  value={postSlug}
                  onChange={e => setPostSlug(e.target.value)}
                  placeholder="custom-slug"
                  className="font-mono text-[11px] font-bold text-pink-600 bg-white border border-stone-200 rounded px-1.5 py-0.5 flex-1 focus:outline-pink-500"
                />
              </div>

              {/* Excerpt / Summary */}
              <div className="space-y-1 pt-2">
                <label className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider">
                  Post Excerpt / Short Summary
                </label>
                <textarea
                  rows={2}
                  value={postExcerpt}
                  onChange={e => setPostExcerpt(e.target.value)}
                  placeholder="Write a brief teaser for the blog card and social shares..."
                  className="w-full text-xs p-3 rounded-2xl border border-stone-200 focus:outline-pink-500"
                />
              </div>
            </div>

            {/* Content Editor with Formatting Toolbar */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="bg-stone-50 border-b border-stone-200 p-2.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black text-stone-600 px-2">Format:</span>
                <button
                  type="button"
                  onClick={() => insertFormatting("<h2>", "</h2>")}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<h3>", "</h3>")}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<strong>", "</strong>")}
                  className="text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<em>", "</em>")}
                  className="text-xs italic px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  Italic
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<ul>\n  <li>", "</li>\n</ul>")}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting("<a href=\"#products\">", "</a>")}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                >
                  Product Link
                </button>
              </div>

              <textarea
                rows={14}
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                placeholder="Write your rich blog article content in standard formatted HTML or text..."
                className="w-full p-5 text-sm leading-relaxed border-none outline-none font-sans"
              />

              <div className="bg-stone-50 border-t border-stone-200 px-5 py-2 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span>Words: <strong>{rankMathAnalysis.wordCount}</strong></span>
                <span>Keyword density: <strong>{rankMathAnalysis.keywordDensity}%</strong></span>
              </div>
            </div>

            {/* --- RANK MATH SEO METABOX (Exact WordPress Experience) --- */}
            <div className="bg-white rounded-3xl border-2 border-indigo-200/80 shadow-md overflow-hidden">
              {/* Rank Math Header with Score Gauge */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center font-black text-sm text-white">
                    RM
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight">Rank Math SEO</h3>
                    <p className="text-[10px] text-indigo-200 font-medium">Real-Time Search Engine Optimization</p>
                  </div>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-indigo-200 font-bold">SEO Score:</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5 ${
                    rankMathAnalysis.score >= 80
                      ? "bg-emerald-500 text-white"
                      : rankMathAnalysis.score >= 50
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}>
                    <span>{rankMathAnalysis.score}</span>
                    <span className="text-[10px] opacity-80">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Rank Math Navigation Tabs */}
              <div className="bg-indigo-50/50 border-b border-indigo-100 px-4 flex items-center gap-2">
                {[
                  { id: "general", label: "General & Snippet" },
                  { id: "checklist", label: `Tests & Checklist (${rankMathAnalysis.checks.filter(c => c.passed).length}/${rankMathAnalysis.checks.length})` },
                  { id: "social", label: "Social Preview" },
                  { id: "advanced", label: "Advanced Meta" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSeoActiveTab(tab.id as any)}
                    className={`py-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                      seoActiveTab === tab.id
                        ? "border-indigo-600 text-indigo-900 font-black"
                        : "border-transparent text-stone-500 hover:text-indigo-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT: General */}
              {seoActiveTab === "general" && (
                <div className="p-6 space-y-5">
                  {/* Focus Keyword Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-stone-800 flex items-center justify-between">
                      <span>Focus Keyword (فوکس کی ورڈ)</span>
                      <span className="text-[11px] text-stone-400 font-normal">e.g. plaster painting for kids</span>
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={e => setFocusKeyword(e.target.value)}
                      placeholder="Enter the main target keyword for this post..."
                      className="w-full text-xs font-bold p-3 rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-indigo-500"
                    />
                  </div>

                  {/* Google Search Snippet Preview (Mobile & Desktop) */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-stone-800">
                        Google Search Preview
                      </label>
                      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${
                            previewDevice === "mobile" ? "bg-white text-indigo-900 shadow-xs" : "text-stone-500"
                          }`}
                        >
                          <Smartphone className="w-3 h-3" />
                          <span>Mobile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${
                            previewDevice === "desktop" ? "bg-white text-indigo-900 shadow-xs" : "text-stone-500"
                          }`}
                        >
                          <Monitor className="w-3 h-3" />
                          <span>Desktop</span>
                        </button>
                      </div>
                    </div>

                    {/* Google Snippet Card Box */}
                    <div className={`bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1.5 ${
                      previewDevice === "mobile" ? "max-w-md mx-auto" : "w-full"
                    }`}>
                      <div className="flex items-center gap-2 text-xs text-stone-600">
                        <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center text-[10px]">
                          🎨
                        </div>
                        <div className="flex flex-col text-[11px] leading-tight">
                          <span className="font-bold text-stone-800">Mini Paint Station</span>
                          <span className="text-[10px] text-stone-400 truncate">
                            https://minipaintstation.shop &gt; blog &gt; {postSlug || "post-url"}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-2">
                        {seoTitle || postTitle || "Example Title - Mini Paint Station"}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {metaDescription || postExcerpt || "Add a descriptive meta description to attract organic visitors from Google search results."}
                      </p>
                    </div>
                  </div>

                  {/* SEO Title Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                      <span>SEO Title</span>
                      <span className={`text-[10px] ${
                        seoTitle.length >= 40 && seoTitle.length <= 65 ? "text-emerald-600" : "text-stone-400"
                      }`}>
                        {seoTitle.length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={e => setSeoTitle(e.target.value)}
                      placeholder="Title tag displayed in Google results..."
                      className="w-full text-xs p-3 rounded-2xl border border-stone-200 focus:outline-indigo-500"
                    />
                  </div>

                  {/* Meta Description Input */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                      <span>Meta Description</span>
                      <span className={`text-[10px] ${
                        metaDescription.length >= 120 && metaDescription.length <= 160 ? "text-emerald-600" : "text-stone-400"
                      }`}>
                        {metaDescription.length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={e => setMetaDescription(e.target.value)}
                      placeholder="Compelling 120-160 character summary containing focus keyword..."
                      className="w-full text-xs p-3 rounded-2xl border border-stone-200 focus:outline-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Tests & Checklist */}
              {seoActiveTab === "checklist" && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-900">Rank Math SEO Tests Breakdown</span>
                    <span className="text-xs font-black text-indigo-900">
                      {rankMathAnalysis.checks.filter(c => c.passed).length} of {rankMathAnalysis.checks.length} Passed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {rankMathAnalysis.checks.map(chk => (
                      <div
                        key={chk.id}
                        className={`p-3 rounded-2xl border flex items-start gap-3 transition-all ${
                          chk.passed
                            ? "bg-emerald-50/50 border-emerald-200/80 text-emerald-950"
                            : "bg-rose-50/50 border-rose-200/80 text-rose-950"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {chk.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-black leading-tight">{chk.title}</h5>
                          <p className="text-[11px] opacity-80 mt-0.5">{chk.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Social Preview */}
              {seoActiveTab === "social" && (
                <div className="p-6 space-y-4">
                  <p className="text-xs text-stone-500">
                    This preview shows how this article appears when shared on WhatsApp, Facebook, or Twitter.
                  </p>
                  
                  {/* Social Share Card Preview */}
                  <div className="max-w-md mx-auto rounded-2xl border border-stone-200 overflow-hidden shadow-md bg-white">
                    <div className="aspect-video bg-stone-100 relative">
                      <img
                        src={featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
                        alt="Social Card Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        minipaintstation.shop
                      </span>
                      <h4 className="text-sm font-black text-stone-900 line-clamp-1">
                        {seoTitle || postTitle || "Mini Paint Station Guide"}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2">
                        {metaDescription || postExcerpt || "Explore kids plaster painting and creative crafts in Pakistan."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: Advanced */}
              {seoActiveTab === "advanced" && (
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Canonical URL</label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={e => setCanonicalUrl(e.target.value)}
                      placeholder={`https://minipaintstation.shop/blog/${postSlug}`}
                      className="w-full text-xs p-3 rounded-2xl border border-stone-200 focus:outline-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={robotsIndex}
                        onChange={e => setRobotsIndex(e.target.checked)}
                        className="rounded text-pink-500 focus:ring-pink-400 w-4 h-4"
                      />
                      <span>Robots: Index (Google me show ho)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={robotsFollow}
                        onChange={e => setRobotsFollow(e.target.checked)}
                        className="rounded text-pink-500 focus:ring-pink-400 w-4 h-4"
                      />
                      <span>Robots: Follow Links</span>
                    </label>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-stone-700">Schema Markup Type</label>
                    <select
                      value={schemaType}
                      onChange={e => setSchemaType(e.target.value as any)}
                      className="w-full text-xs p-3 rounded-2xl border border-stone-200 bg-stone-50 font-bold"
                    >
                      <option value="BlogPosting">BlogPosting (Recommended)</option>
                      <option value="Article">General Article</option>
                      <option value="NewsArticle">News Article</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 4 COLS: Publish Controls, Featured Image (Further Image), Categories, Tags */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Publish & Status Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h4 className="text-sm font-black text-stone-900">Publish Settings</h4>
                <span className="text-[10px] text-stone-400">{autoSaveNotice}</span>
              </div>

              {/* Status Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostStatus("published")}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      postStatus === "published"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostStatus("draft")}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      postStatus === "draft"
                        ? "bg-amber-500 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Author Settings */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200"
                />
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                onClick={handleSavePost}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{selectedPost ? "Update Post (اپڈیٹ کریں)" : "Publish Post (شائع کریں)"}</span>
                  </>
                )}
              </button>
            </div>

            {/* --- FEATURED IMAGE (FURTHER IMAGE) OPTION --- */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-500" />
                  <h4 className="text-sm font-black text-stone-900">Featured Image (فیچرڈ امیج)</h4>
                </div>
                <span className="text-[10px] bg-pink-100 text-pink-700 font-bold px-1.5 py-0.5 rounded">
                  Required
                </span>
              </div>

              {/* Image Preview Box */}
              {featuredImage ? (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 group">
                    <img
                      src={featuredImage}
                      alt={featuredImageAlt || "Featured Image Preview"}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-2 right-2 bg-stone-900/80 text-white p-1.5 rounded-full hover:bg-rose-600 transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center text-stone-400 space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs font-bold text-stone-600">Upload or Select Featured Image</p>
                  <p className="text-[10px] text-stone-400">PNG, JPG, WebP supported</p>
                </div>
              )}

              {/* Upload Input */}
              <div className="space-y-2">
                <label className="block">
                  <span className="sr-only">Upload Featured Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="block w-full text-xs text-stone-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 cursor-pointer"
                  />
                </label>
                {uploadingImage && (
                  <p className="text-[10px] text-pink-600 font-bold animate-pulse">Uploading image to server...</p>
                )}

                {/* Or Custom URL */}
                <input
                  type="text"
                  placeholder="Or paste direct image URL (/assets/...)"
                  value={featuredImage}
                  onChange={e => setFeaturedImage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 font-mono text-[11px]"
                />
              </div>

              {/* Alt Text (Crucial for Rank Math!) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>Image ALT Attribute</span>
                  <span className="text-[10px] text-pink-600 font-semibold">Rank Math Boost</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. plaster painting for kids set"
                  value={featuredImageAlt}
                  onChange={e => setFeaturedImageAlt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-pink-500"
                />
              </div>
            </div>

            {/* Category Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-2">Category</h4>
              <div className="space-y-1.5">
                {categories.map(cat => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer hover:text-pink-600"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={postCategory === cat}
                      onChange={() => setPostCategory(cat)}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-2">Tags</h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag (e.g. DIY, Kids)..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 text-xs p-2 rounded-xl border border-stone-200"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-stone-800 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {postTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-100 text-stone-700 px-2 py-1 rounded-lg"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
