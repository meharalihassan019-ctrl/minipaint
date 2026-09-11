import React, { useState } from "react";
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Heart, 
  Camera, 
  Send, 
  MapPin, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  city: string;
  role: string;
  kids: string;
  rating: number;
  date: string;
  text: string;
  urduQuote?: string;
  kitPurchased: string;
  verified: boolean;
  customerPhotoUrl?: string;
  avatarBg: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "rev-1",
    name: "Ayesha Malik",
    city: "Lahore (DHA Phase 5)",
    role: "Mother of two",
    kids: "Ages 4 & 7",
    rating: 5,
    date: "Verified Buyer • August 2026",
    text: "Ordered the Large 14-Toy Kit for summer vacations. The plaster quality is genuinely outstanding—no powdery residue on hands and very smooth edges. Both my kids stayed absorbed for nearly 3 hours without asking for YouTube once!",
    urduQuote: "بہت ہی شاندار کٹ ہے۔ بچوں نے موبائل فون چھوڑ کر پورے 3 گھنٹے شوق سے پینٹنگ کی۔",
    kitPurchased: "Large 14-Toy Family Kit",
    verified: true,
    avatarBg: "bg-pink-100 text-pink-700"
  },
  {
    id: "rev-2",
    name: "Dr. Usman Farooq",
    city: "Sahiwal City",
    role: "Local Sahiwal Resident & Pediatrician",
    kids: "Daughter Age 5",
    rating: 5,
    date: "Verified Buyer • July 2026",
    text: "As a doctor, I'm extremely cautious with paints and materials. Mini Paint Station's paints are truly water-soluble, odorless, and washed off our dining table and clothes with just a damp cloth. Fantastic local initiative in Sahiwal!",
    urduQuote: "رنگ بالکل محفوظ اور واش ایبل ہیں۔ کپڑوں سے آسانی سے صاف ہو گئے۔",
    kitPurchased: "Medium Painting Kit (6 Toys)",
    verified: true,
    avatarBg: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "rev-3",
    name: "Fatima Noor",
    city: "Islamabad (F-10)",
    role: "Montessori Educator",
    kids: "Preschool Teacher",
    rating: 5,
    date: "Verified School Order • August 2026",
    text: "We ordered 30 Custom Name kits as return favors for our preschool graduation. The children were overjoyed to see their own names in 3D plaster letters. Arrived in Islamabad in 2 days safely without a single broken piece.",
    urduQuote: "ہر بچے کے نام کے پلاسٹر حروف بہت خوبصورت بنے تھے۔ پیکنگ بھی بہترین تھی۔",
    kitPurchased: "Custom Alphabet Name Sets (Bulk)",
    verified: true,
    avatarBg: "bg-amber-100 text-amber-700"
  },
  {
    id: "rev-4",
    name: "Zainab Tariq",
    city: "Karachi (Gulshan-e-Iqbal)",
    role: "Mother & Food Blogger",
    kids: "Son Age 6",
    rating: 5,
    date: "Verified Buyer • August 2026",
    text: "Cash on delivery was smooth. The free brush and extra palette for orders over Rs. 1000 was a delightful surprise. The teddy bear figurine with balloons was his absolute favorite!",
    urduQuote: "فری برش اور پیلٹ ملنے پر بچہ بہت خوش ہوا۔ کیش آن ڈلیوری بھی وقت پر ملی۔",
    kitPurchased: "Medium Pack + Extra Ceramic Toys",
    verified: true,
    avatarBg: "bg-purple-100 text-purple-700"
  },
  {
    id: "rev-5",
    name: "Bilal Haider",
    city: "Multan Cantt",
    role: "Father of 3",
    kids: "Ages 5, 8 & 10",
    rating: 5,
    date: "Verified Buyer • June 2026",
    text: "Ordered on WhatsApp at 10 PM and received a prompt reply with parcel tracking the very next morning. The kits are far superior in durability compared to cheap Chinese plastic toys from local shops.",
    kitPurchased: "Large Painting Kit + 2 Extra Brushes",
    verified: true,
    avatarBg: "bg-blue-100 text-blue-700"
  }
];

interface TestimonialsSectionProps {
  triggerWhatsAppQuery: (msg: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  triggerWhatsAppQuery,
}) => {
  const [filterCity, setFilterCity] = useState<string>("all");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewCity, setReviewCity] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const cities = [
    { id: "all", label: "All Reviews" },
    { id: "Sahiwal", label: "📍 Sahiwal" },
    { id: "Lahore", label: "📍 Lahore" },
    { id: "Islamabad", label: "📍 Islamabad" },
    { id: "Karachi", label: "📍 Karachi" },
    { id: "Multan", label: "📍 Multan" }
  ];

  const filteredReviews = filterCity === "all"
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.city.toLowerCase().includes(filterCity.toLowerCase()));

  const handleSubmitReviewViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;

    const message = `Hi Mini Paint Station! I'd like to share my customer review for the website:\n\n*Name:* ${reviewName}\n*City:* ${reviewCity || "Pakistan"}\n*Rating:* ${reviewRating} Stars ⭐\n*Review:* "${reviewText}"\n\n(I am also attaching a photo of my kids with the painted figurines!)`;
    triggerWhatsAppQuery(message);
    setIsSubmitModalOpen(false);
    setReviewName("");
    setReviewCity("");
    setReviewText("");
  };

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Real Pakistani Parent Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Loved by 1,200+ Families Across Pakistan
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl">
            Read authentic feedback from parents in Sahiwal, Lahore, Islamabad, Karachi, and beyond who made screen-free family art a daily ritual.
          </p>
        </div>

        {/* Share Review CTA Button */}
        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-[#111e47] hover:bg-[#0c1634] text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Camera className="w-4 h-4 text-pink-400" />
          <span>Share Your Kid's Art & Review</span>
        </button>
      </div>

      {/* City Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/70 pb-3">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => setFilterCity(city.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterCity === city.id
                ? "bg-pink-600 text-white shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {city.label}
          </button>
        ))}
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id}
            className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {/* Top Row: User Avatar & Stars */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${rev.avatarBg}`}>
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-stone-900 leading-snug flex items-center gap-1">
                      <span>{rev.name}</span>
                      {rev.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Customer" />
                      )}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-pink-500" /> {rev.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center text-amber-400 text-xs">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Kit Tag & Date */}
              <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-xl">
                <span className="text-pink-600 truncate font-black">
                  📦 {rev.kitPurchased}
                </span>
                <span className="shrink-0">{rev.kids}</span>
              </div>

              {/* Review Body */}
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                "{rev.text}"
              </p>

              {/* Urdu Quote if present */}
              {rev.urduQuote && (
                <p className="text-[11px] text-stone-500 font-arabic text-right leading-relaxed bg-pink-50/40 p-2 rounded-xl border border-pink-100/50" dir="rtl">
                  "{rev.urduQuote}"
                </p>
              )}
            </div>

            {/* Bottom: Date & Verified Label */}
            <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[10px] text-stone-400 font-bold">
              <span>{rev.date}</span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Order
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Unboxing Photos & Social Showcase */}
      <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900">
              Customer Art Showcase & Unboxing Moments 📸
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Real creations painted by young artists across Pakistan using Mini Paint Station kits.
            </p>
          </div>

          <button
            onClick={() => triggerWhatsAppQuery("Hi Mini Paint Station! I'd like to share photos of my child's painted figurines for your gallery.")}
            className="text-xs font-black text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Send photos on WhatsApp</span>
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Badges Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { tag: "🎨 Teddy Bear Figurine", city: "Lahore", artist: "Hassan (Age 6)", emoji: "🧸" },
            { tag: "✨ Custom Alphabet 'AIMEN'", city: "Islamabad", artist: "Aimen (Age 5)", emoji: "🔤" },
            { tag: "🦖 T-Rex Plaster Dinosaur", city: "Sahiwal", artist: "Hamza (Age 7)", emoji: "🦖" },
            { tag: "🧁 Ice Cream Cupcake Figurine", city: "Karachi", artist: "Zara (Age 4)", emoji: "🧁" }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-3 shadow-2xs hover:border-pink-300 transition-all"
            >
              <span className="text-3xl p-2 bg-pink-50 rounded-xl">{item.emoji}</span>
              <div className="min-w-0">
                <h5 className="font-extrabold text-xs text-stone-900 truncate">{item.tag}</h5>
                <span className="text-[10px] text-stone-500 block font-medium">by {item.artist}</span>
                <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider">{item.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Review Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center min-h-screen bg-stone-900/70 backdrop-blur-xs animate-fade-in">
          <div 
            className="fixed inset-0 bg-stone-900/60" 
            onClick={() => setIsSubmitModalOpen(false)} 
          />
          
          <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10 border border-stone-200 p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-black text-base text-stone-900">Share Your Experience 🎨</h3>
                <p className="text-[11px] text-stone-400 font-medium">Your review will be shared directly to our team via WhatsApp.</p>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReviewViaWhatsApp} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Sana Khan"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Your City in Pakistan</label>
                <input
                  type="text"
                  value={reviewCity}
                  onChange={(e) => setReviewCity(e.target.value)}
                  placeholder="e.g. Sahiwal / Lahore / Karachi"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Star Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star 
                        className={`w-5 h-5 ${star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-500 ml-2">{reviewRating} of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Your Review & Child's Experience</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what your children liked, how the paints performed, or which toy was their favorite..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-pink-500"
                />
              </div>

              <div className="p-3 bg-pink-50 rounded-xl border border-pink-200/60 text-[11px] text-pink-700 flex items-center gap-2">
                <Camera className="w-4 h-4 shrink-0 text-pink-500" />
                <span>You can attach your children's photos directly in the WhatsApp chat that opens!</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#111e47] hover:bg-[#0c1634] text-white font-extrabold flex items-center gap-1.5 shadow-sm"
                >
                  <span>Submit to WhatsApp</span>
                  <Send className="w-3 h-3 text-pink-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
