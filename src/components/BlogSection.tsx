import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Tag,
  ArrowLeft,
  ChevronRight,
  Search,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  User,
  Bookmark,
  MessageCircle,
  Facebook,
  Twitter,
  Link2
} from "lucide-react";
import { BlogPost } from "../types/blog";

interface BlogSectionProps {
  onSelectProduct?: (productId: string) => void;
  onOpenWhatsApp?: (msg: string) => void;
  initialPostSlug?: string | null;
  onClearPostSlug?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onSelectProduct,
  onOpenWhatsApp,
  initialPostSlug,
  onClearPostSlug
}) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ["All", "Painting Guides", "Kids Activities", "Gift Ideas", "Parenting Tips"];

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/blogs?status=published");
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);

        // If an initial slug was requested, automatically select it
        if (initialPostSlug) {
          const match = data.blogs.find(
            (b: BlogPost) => b.slug === initialPostSlug || b.id === initialPostSlug
          );
          if (match) {
            setCurrentPost(match);
            trackView(match.id);
          }
        }
      }
    } catch (err) {
      console.error("Error loading blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [initialPostSlug]);

  // Track view when opening a post
  const trackView = async (id: string) => {
    try {
      await fetch(`/api/blogs/${id}/view`, { method: "POST" });
    } catch (e) {
      // benign
    }
  };

  const handleOpenPost = (post: BlogPost) => {
    setCurrentPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackView(post.id);
  };

  const handleBackToList = () => {
    setCurrentPost(null);
    if (onClearPostSlug) {
      onClearPostSlug();
    }
  };

  // Like a post
  const handleLike = async (post: BlogPost) => {
    if (likedPosts[post.id]) return;
    setLikedPosts(prev => ({ ...prev, [post.id]: true }));
    post.likes = (post.likes || 0) + 1;
    try {
      await fetch(`/api/blogs/${post.id}/like`, { method: "POST" });
    } catch (e) {
      // benign
    }
  };

  // Share handlers
  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://minipaintstation.shop/blog";
  const shareTitle = currentPost?.title || "Mini Paint Station Blog";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${shareTitle}*\nRead on Mini Paint Station: ${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`, "_blank");
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter(b => {
    if (activeCategory !== "All" && b.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.content.toLowerCase().includes(q) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Featured post (first post)
  const featuredHeroPost = blogs[0];

  // --- SINGLE POST READER VIEW ---
  if (currentPost) {
    const relatedPosts = blogs.filter(b => b.id !== currentPost.id).slice(0, 3);

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <button
            onClick={handleBackToList}
            className="hover:text-pink-600 transition-colors cursor-pointer flex items-center gap-1 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Blog</span>
          </button>
          <ChevronRight className="w-3 h-3 text-stone-300" />
          <span className="text-pink-600 font-bold">{currentPost.category}</span>
          <ChevronRight className="w-3 h-3 text-stone-300 hidden sm:inline" />
          <span className="text-stone-400 truncate max-w-xs hidden sm:inline">{currentPost.title}</span>
        </nav>

        {/* Post Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-pink-100 text-pink-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {currentPost.category}
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(currentPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentPost.readTimeMinutes || 4} min read</span>
            </span>
            <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
              <Eye className="w-3.5 h-3.5" />
              <span>{currentPost.views || 0} views</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            {currentPost.title}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
            {currentPost.excerpt}
          </p>

          {/* Author & Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-stone-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl shadow-xs">
                {currentPost.author?.avatar || "🎨"}
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900">
                  {currentPost.author?.name || "Mini Paint Station Team"}
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">
                  {currentPost.author?.role || "Art & Craft Specialists"}
                </p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-stone-500 mr-1">Share:</span>
              <button
                onClick={handleWhatsAppShare}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={handleFacebookShare}
                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all cursor-pointer"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={handleTwitterShare}
                className="p-2 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all cursor-pointer"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all cursor-pointer"
                title="Copy Link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleLike(currentPost)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ml-2 ${
                  likedPosts[currentPost.id]
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-white border-stone-200 text-stone-600 hover:text-rose-600"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedPosts[currentPost.id] ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{currentPost.likes || 0}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image (Further Image) */}
        {currentPost.featuredImage && (
          <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
            <img
              src={currentPost.featuredImage}
              alt={currentPost.featuredImageAlt || currentPost.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Main Formatted Blog Content */}
        <div
          className="prose prose-stone max-w-none text-stone-800 text-sm sm:text-base leading-relaxed space-y-4
            [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-black [&>h2]:text-stone-900 [&>h2]:pt-4 [&>h2]:border-b [&>h2]:border-stone-100 [&>h2]:pb-2
            [&>h3]:text-lg [&>h3]:font-black [&>h3]:text-stone-900 [&>h3]:pt-2
            [&>p]:text-stone-700 [&>p]:leading-relaxed
            [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
            [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
            [&>strong]:font-black [&>strong]:text-stone-900
            [&>a]:text-pink-600 [&>a]:underline [&>a]:font-bold"
          dangerouslySetInnerHTML={{ __html: currentPost.content }}
        />

        {/* Tags */}
        {currentPost.tags && currentPost.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-stone-200">
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-bold text-stone-500">Tags:</span>
            {currentPost.tags.map(tag => (
              <span
                key={tag}
                className="text-xs font-semibold bg-stone-100 text-stone-600 px-2.5 py-1 rounded-xl"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA Banner: Buy Painting Kits Directly from Blog */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              DIY Kids Kits
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              Ready to start painting with your kids?
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 max-w-md">
              Order our handcrafted ceramic plaster kits packed with brushes and non-toxic paints. Cash on Delivery across Pakistan!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onSelectProduct) {
                  onSelectProduct("prod-medium-kit");
                }
              }}
              className="bg-white hover:bg-stone-100 text-pink-600 font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Kits (Rs 299)</span>
            </button>
            {onOpenWhatsApp && (
              <button
                onClick={() => onOpenWhatsApp("Hi! I was reading your blog article and want to order painting kits for kids.")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-stone-200">
            <h3 className="text-lg font-black text-stone-900">Related Art & Activity Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => handleOpenPost(rel)}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="aspect-video bg-stone-100 overflow-hidden">
                    <img
                      src={rel.featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-black text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-stone-400 block font-medium">
                      {rel.readTimeMinutes || 4} min read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // --- BLOGS LISTING DIRECTORY VIEW ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mini Paint Station Crafts Journal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Kids Art, DIY Crafts & Parenting Guides
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-medium">
          Expert tips on plaster painting, sensory play, birthday party return gifts, and screen-free activities for kids in Pakistan.
        </p>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-stone-200 shadow-xs">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-black px-4 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides & tips..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-pink-500"
          />
        </div>
      </div>

      {/* Hero Featured Article (Only if no active search or specific filter) */}
      {featuredHeroPost && activeCategory === "All" && !searchQuery && (
        <div
          onClick={() => handleOpenPost(featuredHeroPost)}
          className="bg-white rounded-3xl border border-stone-200 shadow-md hover:shadow-xl transition-all overflow-hidden cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0"
        >
          <div className="lg:col-span-7 aspect-video lg:aspect-auto overflow-hidden bg-stone-100 relative">
            <img
              src={featuredHeroPost.featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
              alt={featuredHeroPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-pink-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Featured Guide ⭐
            </span>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                <span className="text-pink-600 font-extrabold">{featuredHeroPost.category}</span>
                <span>•</span>
                <span>{featuredHeroPost.readTimeMinutes || 4} min read</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-pink-600 transition-colors tracking-tight leading-tight">
                {featuredHeroPost.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                {featuredHeroPost.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm">
                  {featuredHeroPost.author?.avatar || "🎨"}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{featuredHeroPost.author?.name}</h4>
                  <span className="text-[10px] text-stone-400">{new Date(featuredHeroPost.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <span className="text-xs font-black text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Blog Posts */}
      {isLoading ? (
        <div className="py-20 text-center text-stone-400">
          <p className="text-sm font-bold">Loading articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-2">
          <p className="text-sm font-black text-stone-800">No articles found in this category</p>
          <p className="text-xs text-stone-500">Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map(post => (
            <div
              key={post.id}
              onClick={() => handleOpenPost(post)}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-stone-100 overflow-hidden relative">
                  <img
                    src={post.featuredImage || "/assets/images/medium_paint_kit_1784789218683.jpg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{post.readTimeMinutes || 4} min read</span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 group-hover:text-pink-600 transition-colors line-clamp-2 tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs">
                    {post.author?.avatar || "🎨"}
                  </div>
                  <span className="text-[11px] font-bold text-stone-700">{post.author?.name}</span>
                </div>

                <span className="text-xs font-black text-pink-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
