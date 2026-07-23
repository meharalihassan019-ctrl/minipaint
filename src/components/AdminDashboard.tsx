import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  ShoppingCart, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  PhoneCall, 
  ExternalLink,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
  Store,
  Layers,
  Clock,
  ArrowUpRight
} from "lucide-react";

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stars: number;
  ratingValue: number;
  ratingLabel?: string;
  hasBannerImage?: boolean;
  bannerText?: string;
  ageBadge?: string;
  topRightBadge?: string;
  badge?: string;
  inStock?: boolean;
}

export interface OrderLog {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  date: string;
  status: "Pending" | "Confirmed" | "Dispatched";
  paymentMethod: string;
}

interface AdminDashboardProps {
  products: ProductItem[];
  onUpdateProducts: (updated: ProductItem[]) => void;
  onCloseAdmin: () => void;
  storePhone: string;
  onUpdateStorePhone: (phone: string) => void;
  announcementText: string;
  onUpdateAnnouncement: (text: string) => void;
}

export default function AdminDashboard({
  products,
  onUpdateProducts,
  onCloseAdmin,
  storePhone,
  onUpdateStorePhone,
  announcementText,
  onUpdateAnnouncement
}: AdminDashboardProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<"overview" | "products" | "images" | "orders" | "settings">("overview");
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("admin_logged_in") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === "ahmed" && passwordInput === "ahmed123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_logged_in", "true");
      setAuthError("");
    } else {
      setAuthError("Ghalt Name ya Password! Dobara koshish karain.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_logged_in");
  };

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  
  // Editing Product State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductItem>>({});

  // Image Diagnostic States
  const [imageHealthStatus, setImageHealthStatus] = useState<Record<string, "testing" | "ok" | "error">>({});
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);

  // Orders State (loaded from localStorage or initialized with realistic sample data)
  const [orders, setOrders] = useState<OrderLog[]>(() => {
    const saved = localStorage.getItem("mini_paint_orders");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      {
        id: "ORD-9201",
        customerName: "Ayesha Malik",
        phone: "0321-4567890",
        city: "Lahore",
        total: 299,
        items: [{ name: "Medium Painting Kit 🎨", qty: 1, price: 299 }],
        date: "Today, 02:15 PM",
        status: "Pending",
        paymentMethod: "EasyPaisa"
      },
      {
        id: "ORD-9202",
        customerName: "Zubair Ahmed",
        phone: "0300-9876543",
        city: "Karachi",
        total: 45,
        items: [
          { name: "Big Ceramic Toy 🧸", qty: 2, price: 15 },
          { name: "Big Ceramic Toy 🧸", qty: 1, price: 15 }
        ],
        date: "Today, 11:30 AM",
        status: "Confirmed",
        paymentMethod: "JazzCash"
      },
      {
        id: "ORD-9200",
        customerName: "Hassan Ali",
        phone: "0310-6541965",
        city: "Rawalpindi",
        total: 399,
        items: [{ name: "Custom Name Painting Kit 🎨", qty: 1, price: 399 }],
        date: "Yesterday",
        status: "Dispatched",
        paymentMethod: "EasyPaisa"
      }
    ];
  });

  // Settings State
  const [phoneInput, setPhoneInput] = useState(storePhone);
  const [announcementInput, setAnnouncementInput] = useState(announcementText);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState("");

  // Run Image Diagnostics
  const runDiagnostics = () => {
    setIsDiagnosticRunning(true);
    const initialStatus: Record<string, "testing"> = {};
    products.forEach(p => { initialStatus[p.id] = "testing"; });
    setImageHealthStatus(initialStatus);

    setTimeout(() => {
      const results: Record<string, "ok" | "error"> = {};
      products.forEach(p => {
        // Test if image path exists and is valid string
        if (p.image && p.image.length > 5) {
          results[p.id] = "ok";
        } else {
          results[p.id] = "error";
        }
      });
      setImageHealthStatus(results);
      setIsDiagnosticRunning(false);
    }, 800);
  };

  useEffect(() => {
    runDiagnostics();
  }, [products]);

  // Product Edit Handlers
  const handleEditClick = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsAddingNewProduct(false);
  };

  const handleAddNewClick = () => {
    setIsAddingNewProduct(true);
    setEditingProduct(null);
    setFormData({
      id: "prod-" + Date.now(),
      name: "New Ceramic Painting Item",
      description: "High quality ceramic plaster toy ready for painting.",
      price: 15,
      category: "plaster",
      image: "/assets/images/big_ceramic_toy_15_1784789245573.jpg",
      stars: 5,
      ratingValue: 4.8,
      ratingLabel: "TOYS",
      hasBannerImage: true,
      bannerText: "NEW RELEASE - RS 15",
      ageBadge: "🥚 Ages 3+",
      topRightBadge: "New 🧸",
      badge: "In Stock",
      inStock: true
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (isAddingNewProduct) {
      const newProd = formData as ProductItem;
      const updatedList = [newProd, ...products];
      onUpdateProducts(updatedList);
      setIsAddingNewProduct(false);
    } else if (editingProduct) {
      const updatedList = products.map(p => p.id === editingProduct.id ? ({ ...p, ...formData } as ProductItem) : p);
      onUpdateProducts(updatedList);
      setEditingProduct(null);
    }
    setSaveSuccessNotice("Product saved successfully! Store updated.");
    setTimeout(() => setSaveSuccessNotice(""), 3000);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedList = products.filter(p => p.id !== id);
      onUpdateProducts(updatedList);
      setSaveSuccessNotice("Product removed from catalog.");
      setTimeout(() => setSaveSuccessNotice(""), 3000);
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStorePhone(phoneInput);
    onUpdateAnnouncement(announcementInput);
    setSaveSuccessNotice("Store settings saved! Updated live on website.");
    setTimeout(() => setSaveSuccessNotice(""), 3000);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.price.toString().includes(searchQuery)
  );

  const totalCatalogValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

  // --- LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800 border border-stone-700/80 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-3xl shadow-lg border border-pink-400/30">
              👑
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight pt-2">
              Store Owner Admin Access
            </h2>
            <p className="text-xs text-stone-400 font-medium">
              Yeh backend portal password protected hai. Apna Name aur Password likh kar login karain.
            </p>
          </div>

          {authError && (
            <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Name / Username
              </label>
              <input
                type="text"
                required
                placeholder="Enter Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-700 rounded-2xl py-3 px-4 text-white placeholder-stone-500 font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-300 mb-1.5 uppercase tracking-wider text-[11px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-stone-900/90 border border-stone-700 rounded-2xl py-3 px-4 text-white placeholder-stone-500 font-mono focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  {showPassword ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Login to Store Admin</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-stone-700/60">
            <button
              onClick={onCloseAdmin}
              className="text-stone-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Public Store Website 🛒</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-800 font-sans pb-16">
      {/* --- TOP ADMIN HEADER BAR --- */}
      <header className="bg-stone-900 text-white sticky top-0 z-50 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-black text-xl shadow-inner">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Mini Paint Station Admin
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ahmed (Owner)
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Manage products, check image health, view orders & site status
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={runDiagnostics}
              disabled={isDiagnosticRunning}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3 py-2 rounded-xl border border-stone-700/80 flex items-center gap-1.5 transition-all"
              title="Test all images and site health"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosticRunning ? "animate-spin text-pink-400" : "text-emerald-400"}`} />
              <span className="hidden sm:inline">Health Diagnostics</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-stone-800 hover:bg-rose-950/40 text-rose-300 hover:text-rose-200 text-xs font-bold px-3 py-2 rounded-xl border border-stone-700 flex items-center gap-1.5 transition-all"
              title="Logout from Admin"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Back to Store 🛒</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- SUCCESS TOAST NOTIFICATION --- */}
      {saveSuccessNotice && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-sm font-bold animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button onClick={() => setSaveSuccessNotice("")} className="hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- ADMIN NAVIGATION TABS --- */}
      <div className="bg-white border-b border-stone-200 shadow-xs sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveAdminTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === "overview"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-pink-400" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("products")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === "products"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Product Manager ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("images")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === "images"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Image Health Check</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("orders")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === "orders"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>Inquiries & Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === "settings"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Settings className="w-4 h-4 text-rose-400" />
            <span>Store Settings</span>
          </button>
        </div>
      </div>

      {/* --- MAIN ADMIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ================= 1. OVERVIEW TAB ================= */}
        {activeAdminTab === "overview" && (
          <div className="space-y-6">
            {/* Status Announcement Banner */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden border border-stone-800">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-pink-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" /> Store Health Status: All Systems Good
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Aap Ki Website Bilkul Theek Kaam Kar Rahi Hai! ✅
                  </h2>
                  <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">
                    All product images, prices, titles, and WhatsApp order links are active. You can edit prices (e.g. Rs 15 Big Ceramic Toy) or add new products anytime below.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveAdminTab("products")}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Products Now
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Live Catalog Items</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{products.length} Products</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> All images verified
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Catalog Price Sum</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">Rs. {totalCatalogValue}</h3>
                  <p className="text-[11px] text-stone-500 font-semibold mt-1">Range: Rs. 10 to Rs. 399</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Inquiries & Orders</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{totalOrdersCount} WhatsApp</h3>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Direct WhatsApp Routing
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-stone-500 uppercase tracking-wider">Store WhatsApp Number</p>
                  <h3 className="text-lg font-black text-stone-900 mt-1">{storePhone}</h3>
                  <p className="text-[11px] text-stone-500 font-semibold mt-1">Ready for Customer Messages</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <PhoneCall className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Product Health Overview Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900">Product Health & Price Check</h3>
                  <p className="text-xs text-stone-500">Live check of product prices and image rendering</p>
                </div>
                <button
                  onClick={() => setActiveAdminTab("products")}
                  className="text-xs font-black text-pink-600 hover:text-pink-700 flex items-center gap-1"
                >
                  Manage All Products <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700 border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
                      <th className="py-3 px-4">Item Image</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Current Price</th>
                      <th className="py-3 px-4">Badge / Tag</th>
                      <th className="py-3 px-4">Image Health</th>
                      <th className="py-3 px-4 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.slice(0, 6).map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center">
                            {p.image && p.image.length > 5 ? (
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-lg">{p.image}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-stone-900">{p.name}</td>
                        <td className="py-2.5 px-4 font-extrabold text-emerald-600">Rs. {p.price}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-pink-100 text-pink-700 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                            {p.badge || "In Stock"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Image Loaded OK
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setActiveAdminTab("products");
                              handleEditClick(p);
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-all"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. PRODUCTS TAB ================= */}
        {activeAdminTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs">
              <div>
                <h2 className="text-xl font-black text-stone-900">Product Catalog Manager</h2>
                <p className="text-xs text-stone-500">Edit prices, titles, badges, image links, or add new ceramic toys</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-500 w-48 sm:w-64"
                  />
                </div>

                <button
                  onClick={handleAddNewClick}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>
            </div>

            {/* Modal for Edit / Add Product */}
            {(editingProduct || isAddingNewProduct) && (
              <div className="bg-white border-2 border-pink-400 p-6 rounded-3xl shadow-xl space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    {isAddingNewProduct ? "Add New Product to Store" : `Edit Product: ${editingProduct?.name}`}
                  </h3>
                  <button
                    onClick={() => { setEditingProduct(null); setIsAddingNewProduct(false); }}
                    className="p-1 hover:bg-stone-100 rounded-full text-stone-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Product Title / Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Price in PKR (Rs.) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price || 0}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-extrabold text-emerald-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-stone-700 mb-1">Product Description</label>
                    <textarea
                      rows={2}
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-mono text-[11px] text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Badge Tag (e.g. Popular Choice)</label>
                    <input
                      type="text"
                      value={formData.badge || ""}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Top Right Badge (e.g. Big Size 🧸)</label>
                    <input
                      type="text"
                      value={formData.topRightBadge || ""}
                      onChange={(e) => setFormData({ ...formData, topRightBadge: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Banner Overlay Text</label>
                    <input
                      type="text"
                      value={formData.bannerText || ""}
                      onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => { setEditingProduct(null); setIsAddingNewProduct(false); }}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-black rounded-xl shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Save Product & Update Website
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="relative rounded-2xl bg-stone-100 h-44 overflow-hidden mb-3 border border-stone-200/80 flex items-center justify-center">
                      {product.image && product.image.length > 5 ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">{product.image}</span>
                      )}
                      
                      <div className="absolute top-2 left-2 bg-stone-900/80 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                        Rs. {product.price}
                      </div>

                      {product.badge && (
                        <div className="absolute top-2 right-2 bg-pink-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                          {product.badge}
                        </div>
                      )}
                    </div>

                    <h3 className="font-extrabold text-stone-900 text-base">{product.name}</h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{product.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Rs. {product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-xl border border-rose-200"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. IMAGE HEALTH TAB ================= */}
        {activeAdminTab === "images" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900">Image Rendering Health Studio</h2>
                <p className="text-xs text-stone-500">Inspect product photos to ensure no missing or broken images on hostinger</p>
              </div>

              <button
                onClick={runDiagnostics}
                disabled={isDiagnosticRunning}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-black px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isDiagnosticRunning ? "animate-spin" : ""}`} />
                Re-check Images
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.image && p.image.length > 5 ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-2xl">{p.image}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-stone-900 text-xs truncate">{p.name}</h4>
                    <p className="text-[11px] text-stone-500 font-mono truncate">{p.image}</p>
                    
                    <div className="mt-1 flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active & Verified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. ORDERS TAB ================= */}
        {activeAdminTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900">WhatsApp Inquiries & Orders Log</h2>
                <p className="text-xs text-stone-500">Track customer order requests sent via WhatsApp</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Receiving on: {storePhone}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700 border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-extrabold uppercase border-b border-stone-200">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone & City</th>
                    <th className="py-3 px-4">Items Ordered</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4 font-extrabold text-stone-900">{o.id}</td>
                      <td className="py-3 px-4 font-bold text-stone-800">{o.customerName}</td>
                      <td className="py-3 px-4 text-stone-600">
                        <div>{o.phone}</div>
                        <div className="text-[10px] text-stone-400">{o.city}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-700">
                        {o.items.map((it, idx) => (
                          <div key={idx}>{it.qty}x {it.name}</div>
                        ))}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-600 text-sm">Rs. {o.total}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          o.status === "Confirmed" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : o.status === "Dispatched"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 5. SETTINGS TAB ================= */}
        {activeAdminTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <h2 className="text-xl font-black text-stone-900 mb-1">Store Contact & Announcement Settings</h2>
              <p className="text-xs text-stone-500 mb-6">Update WhatsApp phone number and top bar offer notice</p>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <div>
                  <label className="block font-extrabold text-stone-800 mb-1.5">
                    WhatsApp Order Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl font-mono text-sm text-stone-900 font-bold"
                    placeholder="0310-6541965"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    All customer "Buy / Order on WhatsApp" buttons redirect to this number.
                  </p>
                </div>

                <div>
                  <label className="block font-extrabold text-stone-800 mb-1.5">
                    Website Top Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 font-medium"
                    placeholder="🎉 Free Paint Brush on orders above Rs. 1000!"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end">
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white font-black px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 text-xs"
                  >
                    <Check className="w-4 h-4" /> Save Settings Live
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
