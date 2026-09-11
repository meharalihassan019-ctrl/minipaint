import React, { useState } from "react";
import { 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Palette, 
  ShieldCheck, 
  Heart, 
  Clock, 
  HelpCircle,
  Share2
} from "lucide-react";

interface ParentResourcesProps {
  onNavigateTab: (tab: string) => void;
  triggerWhatsAppQuery: (msg: string) => void;
}

interface Article {
  id: string;
  title: string;
  urduTitle: string;
  category: string;
  readTime: string;
  summary: string;
  highlights: string[];
  fullContent: {
    intro: string;
    sections: {
      heading: string;
      body: string;
    }[];
    proTip: string;
  };
  recommendedKitId?: string;
  recommendedKitName?: string;
}

const ARTICLES: Article[] = [
  {
    id: "how-to-paint-plaster-toys",
    title: "How to Paint Plaster Toys at Home: Step-by-Step Guide for Parents",
    urduTitle: "گھر پر پلاسٹر کے کھلونوں کو پینٹ کرنے کا آسان طریقہ",
    category: "DIY Painting Guide",
    readTime: "4 min read",
    summary: "Discover the easiest mess-free method to paint 3D plaster figurines with your kids. From surface prep to brush techniques and sealing.",
    highlights: [
      "No prep required: plaster figurines are ready to paint right out of the box",
      "Work from lighter paint tones to darker detail outlines",
      "Washable paints clean off with simple damp cloth before drying",
      "Optional clear varnish or mod-podge preserves colors for years"
    ],
    fullContent: {
      intro: "Plaster figurine painting is one of the most engaging sensory crafts for young children. Unlike flat paper coloring, handling a tactile 3D object teaches spatial awareness, depth perception, and fine motor precision.",
      sections: [
        {
          heading: "Step 1: Set Up an Inviting Mess-Free Station",
          body: "Lay down an old newspaper or plastic placemat. Pour a small cup of water for rinsing brushes and keep a folded tissue paper handy to dab excess moisture off brush bristles."
        },
        {
          heading: "Step 2: Base Coat with Lighter Colors",
          body: "Start with large areas using yellow, sky blue, or white. Teach your child to hold the figurine gently with one hand while applying smooth, light strokes with the brush."
        },
        {
          heading: "Step 3: Fine Details & Contrast",
          body: "Once the base coat is touch-dry (approx 5-10 minutes on porous plaster), switch to the fine-point brush for facial features, eyes, bows, and decorative accents using darker hues like purple, red, or black."
        },
        {
          heading: "Step 4: Display & Keepsake Protection",
          body: "Allow the figurine to dry completely for 15-20 minutes in a well-ventilated room. You can display it on study desks, bedside tables, or glue a magnetic strip to the back for custom fridge art!"
        }
      ],
      proTip: "If your child makes a mistake, gently dab the wet paint with a damp cotton bud to lift off the color without damaging the plaster surface."
    },
    recommendedKitId: "prod-medium-kit",
    recommendedKitName: "Medium Painting Kit (Rs. 299)"
  },
  {
    id: "screen-free-activities-pakistan",
    title: "5 Proven Screen-Free Activities for Kids in Pakistan",
    urduTitle: "بچوں کو اسکرین سے دور رکھنے کے 5 بہترین اور تخلیقی طریقے",
    category: "Parenting & Focus",
    readTime: "5 min read",
    summary: "Practical, budget-friendly indoor and outdoor activities to replace smartphones and tablets with creative tactile play.",
    highlights: [
      "Reduce screen tantrums by swapping passive video watching for active making",
      "Tactile 3D arts activate sensory neural pathways flat screens cannot stimulate",
      "Indoor sensory pottery and kinetic modeling for hot summer afternoons in Pakistan",
      "Family art challenges that build cooperative communication between siblings"
    ],
    fullContent: {
      intro: "With digital screens dominating modern households across Pakistan, parents often struggle to find stimulating, screen-free alternatives that hold a child's attention for more than 10 minutes. Here are 5 tested activities that engage kids for hours.",
      sections: [
        {
          heading: "1. 3D Plaster & Ceramic Painting Kits",
          body: "Handling physical models of cartoon animals, teddy bears, and cupcakes lets kids experience real physical texture. Mini Paint Station kits come with pre-molded non-toxic toys and washable colors so there is zero prep work required by busy parents."
        },
        {
          heading: "2. Color Mixing Chemistry Lab",
          body: "Give children primary colors (Red, Yellow, Blue) and an empty egg carton or palette. Challenge them to discover how green, orange, and purple are born. It feels like real magic to a 4-year-old!"
        },
        {
          heading: "3. Storybook Character Roleplay with Finished Toys",
          body: "After painting their plaster animal figures, encourage your children to invent a story where their painted character goes on an adventure across the living room carpet."
        },
        {
          heading: "4. Custom Alphabet Name Building",
          body: "Spell your child's name using ceramic letter blocks. Painting each letter of their own name builds letter recognition and creates immense pride of ownership when displayed on their bedroom door."
        },
        {
          heading: "5. Sensory Nature Prints & Leaf Rubbings",
          body: "Collect leaves and flowers from the garden, lightly dab them with washable paints, and stamp the intricate leaf veins onto paper planks."
        }
      ],
      proTip: "Dedicate an 'Unplugged Hour' right after school or before bedtime where the whole family engages in a craft or reading activity together."
    },
    recommendedKitId: "prod-name-kit",
    recommendedKitName: "Custom Name Kit (Rs. 399)"
  },
  {
    id: "best-birthday-return-gifts-under-500",
    title: "Best Birthday Return Gifts Under Rs. 500 in Pakistan",
    urduTitle: "پاکستان میں سالگرہ کے لیے بہترین ریٹرن گفٹس - 500 روپے سے کم",
    category: "Party Favors & Gifts",
    readTime: "3 min read",
    summary: "Move beyond cheap plastic throwaway toys and sugary candy packs. Why DIY art favor kits are the #1 trending return gift choice for Pakistani moms.",
    highlights: [
      "High perceived value: kids take home a memorable activity rather than disposable plastic",
      "Budget friendly: individual plaster toys start at just Rs. 10 to Rs. 15, and complete kits at Rs. 199",
      "Custom name kits available under Rs. 400 for close friends and cousins",
      "Safe for toddlers & school-age children with zero battery hazards"
    ],
    fullContent: {
      intro: "Planning a birthday party in Lahore, Karachi, Islamabad, or Sahiwal? Finding meaningful party favors that won't break the bank—or end up broken in the dustbin the next day—is a universal challenge. Here is why creative paint kits are dominating birthday party trends.",
      sections: [
        {
          heading: "Why Disposable Toys Fail",
          body: "Cheap battery-operated plastic toys frequently break within 24 hours and generate electronic waste. Candy bags cause sugar spikes. Thoughtful parents increasingly seek creative activities that children can cherish."
        },
        {
          heading: "Plaster Paint Packs: The Ultimate Favor Bag",
          body: "For just Rs. 199 to Rs. 299, a Mini Paint Station party kit includes multiple figurines, 6 vibrant paints, and a brush in neat gift-ready packaging. Each child goes home with an activity that keeps them happily engaged the next day."
        },
        {
          heading: "Bulk Discounts & Custom Letter Favors",
          body: "For themed parties (Safari, Princess, Superhero, Space), Mini Paint Station creates customized themed batches with the birthday child's initials or guests' individual names at special wholesale rates."
        }
      ],
      proTip: "Contact our Sahiwal workshop via WhatsApp 1-2 weeks before your party date to get custom themed packaging and free party label stickers!"
    },
    recommendedKitId: "prod-large-kit",
    recommendedKitName: "Large 14-Toy Party Kit (Rs. 399)"
  },
  {
    id: "art-and-toddler-brain-development",
    title: "Why Art and Painting Are Crucial for Toddler Brain Development",
    urduTitle: "آرٹ اور مصوری بچوں کی ذہنی نشوونما کے لیے کیوں ضروری ہے؟",
    category: "Child Psychology",
    readTime: "4 min read",
    summary: "Pediatric insights into how grip development, bilateral coordination, and emotional expression flourish through tactile crafts.",
    highlights: [
      "Strengthens the tripod grasp necessary for future pencil holding and handwriting",
      "Encourages bilateral brain integration (logic + creative hemisphere sync)",
      "Provides healthy emotional decompression for overstimulated young minds",
      "Teaches patience and delayed gratification as colors layer and dry"
    ],
    fullContent: {
      intro: "Neuroscientists confirm that early childhood (ages 2 to 7) is the critical window for sensory-motor wiring. Painting on physical objects is far more than entertainment—it is foundational brain architecture.",
      sections: [
        {
          heading: "Bilateral Hand-Eye Coordination",
          body: "When painting a 3D plaster toy, a child must hold and rotate the figurine with their non-dominant hand while manipulating the brush with their dominant hand. This cross-body coordination builds strong neural connections between both brain hemispheres."
        },
        {
          heading: "Pre-Writing Muscle Tone",
          body: "Holding brushes of varied diameters exercises the intrinsic hand muscles (thenar and hypothenar muscles), preventing hand fatigue when children begin formal schooling and handwriting."
        },
        {
          heading: "Healthy Emotional Outlet",
          body: "Children often lack the vocabulary to articulate stress or overstimulation. Colors offer an instinctive emotional language, allowing children to express joy, excitement, and calm through visual art."
        }
      ],
      proTip: "Celebrate your child's effort rather than perfection. Ask 'Tell me about the colors you chose!' instead of asking 'What is that supposed to be?'"
    },
    recommendedKitId: "prod-small-kit",
    recommendedKitName: "Small Starter Kit (Rs. 199)"
  },
  {
    id: "safe-non-toxic-paint-guide",
    title: "Safe, Non-Toxic Paints: What Every Pakistani Parent Needs to Know",
    urduTitle: "بچوں کے محفوظ اور نان ٹاکسک پینٹس: والدین کے لیے اہم رہنمائی",
    category: "Safety & Health",
    readTime: "3 min read",
    summary: "How to identify child-safe water-soluble paints, why chemical enamel paints must be avoided, and how our washable formula protects clothing.",
    highlights: [
      "100% water-soluble acrylic pigments that dissolve with warm water and hand soap",
      "Zero volatile organic compounds (VOCs) and strictly lead-free pigments",
      "Medical-grade plaster of Paris: hypoallergenic, dust-treated, and skin-friendly",
      "Emergency washable on school uniforms, sofas, and dining tables"
    ],
    fullContent: {
      intro: "Many commercial paint sets sold in local bazaars contain unverified heavy metals or toxic solvents. At Mini Paint Station Sahiwal, child safety is our sacred foundation.",
      sections: [
        {
          heading: "The Danger of Industrial Enamels & Uncertified Dyes",
          body: "Never allow toddlers to use solvent-based enamel or oil paints. Inhaling fumes can irritate sensitive bronchial tubes, and accidental ingestion poses serious toxicity risks."
        },
        {
          heading: "Our Certified Safe Washable Formula",
          body: "Our paints use high-purity water dispersion organic pigments. They are completely odorless, skin-safe, and comply with international child toy safety standards. If a child touches their tongue or eye, rinsing with clean water is all that is needed."
        },
        {
          heading: "Easy Fabric Washability",
          body: "Spilled paint on your favorite tablecloth or sofa? Simply wash the area with lukewarm water and regular detergent before the paint cures. No harsh chemical stain removers required!"
        }
      ],
      proTip: "Keep a pack of baby wipes near your craft station for quick hand clean-ups between color switches."
    },
    recommendedKitId: "prod-paint-strip",
    recommendedKitName: "Extra 6-Color Washable Strip (Rs. 80)"
  }
];

export const ParentResources: React.FC<ParentResourcesProps> = ({
  onNavigateTab,
  triggerWhatsAppQuery,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Guides" },
    { id: "DIY Painting Guide", label: "Painting Guides" },
    { id: "Parenting & Focus", label: "Screen-Free Play" },
    { id: "Party Favors & Gifts", label: "Birthday Gifts" },
    { id: "Child Psychology", label: "Child Development" },
    { id: "Safety & Health", label: "Safety & Non-Toxic" },
  ];

  const filteredArticles = activeCategory === "all" 
    ? ARTICLES 
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6 py-4 animate-fade-in">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200/80 text-pink-600 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Parent Resources & Creative Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Nurturing Creative, Screen-Free Kids
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed">
          Helpful tips, craft guides, and expert advice for parents in Pakistan looking for safe, joyful, and educational activities.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-[#111e47] text-white shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article 
            key={article.id}
            className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                <span className="bg-pink-50 text-pink-600 px-2.5 py-0.5 rounded-lg border border-pink-100 font-extrabold">
                  {article.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="text-lg font-black text-stone-900 leading-snug group-hover:text-pink-600 transition-colors">
                {article.title}
              </h2>

              <p className="text-xs font-semibold text-stone-400 font-arabic text-right leading-relaxed" dir="rtl">
                {article.urduTitle}
              </p>

              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                {article.summary}
              </p>

              {/* Bullet highlights */}
              <ul className="space-y-1 pt-2 border-t border-stone-100">
                {article.highlights.slice(0, 2).map((item, i) => (
                  <li key={i} className="text-[11px] text-stone-600 flex items-start gap-1.5 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(article)}
                className="text-xs font-black text-[#111e47] hover:text-pink-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-pink-500" />
              </button>

              <button
                onClick={() => triggerWhatsAppQuery(`Hi Mini Paint Station! I was reading "${article.title}" and would like to ask a question.`)}
                className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1 transition-all"
              >
                <span>Ask on WA</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Free Printable Downloads Section */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-pink-50/60 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md">
              Free Community Printables
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Printable Outlines, Coloring Stencils & Storybooks
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Download free high-resolution PDFs for at-home coloring or classroom crafts.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("stencil")}
            className="bg-[#111e47] hover:bg-[#0c1634] text-white font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generate AI Stencils</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Safari Animal Figures Guide", format: "High-Res PDF", icon: "🦁" },
            { title: "Alphabet Coloring Book (A-Z)", format: "Printable PDF", icon: "🔤" },
            { title: "Dinosaur Kingdom Mandala", format: "Activity Sheet", icon: "🦖" },
            { title: "Step-by-Step Color Mixing Chart", format: "Poster PDF", icon: "🎨" }
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => triggerWhatsAppQuery(`Hi Mini Paint Station! Please send me the free printable PDF for "${item.title}".`)}
              className="bg-white border border-stone-200 p-4 rounded-2xl hover:border-pink-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-stone-50 rounded-xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-black text-stone-800 leading-snug">{item.title}</h4>
                  <span className="text-[10px] text-stone-400 font-bold">{item.format}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black text-pink-600 border-t border-stone-100 pt-2">
                <span>Free on WhatsApp</span>
                <Download className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Internal Navigation Quick Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-pink-400 font-black text-xs uppercase tracking-wider">
            Ready to start crafting?
          </span>
          <h3 className="text-xl sm:text-2xl font-black">
            Explore Handcrafted Plaster Kits & Free Online Games
          </h3>
          <p className="text-xs text-stone-400 max-w-lg">
            Choose from individual toys starting at Rs. 10 or complete gift-box painting sets with free delivery perks across Pakistan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab("products")}
            className="bg-pink-600 hover:bg-pink-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Shop Plaster Kits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab("games")}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs px-4 py-3 rounded-2xl border border-stone-700 transition-all cursor-pointer"
          >
            <span>Play Kids Games Zone 🎮</span>
          </button>
        </div>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center min-h-screen bg-stone-900/70 backdrop-blur-xs animate-fade-in">
          <div 
            className="fixed inset-0 bg-stone-900/60" 
            onClick={() => setSelectedArticle(null)} 
          />
          
          <div className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-10 border border-stone-200 my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 bg-stone-50 flex items-start justify-between gap-4 sticky top-0 z-20">
              <div>
                <span className="text-[10px] font-black uppercase text-pink-600 tracking-wider">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1 leading-snug">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-stone-500 font-arabic mt-1 font-semibold" dir="rtl">
                  {selectedArticle.urduTitle}
                </p>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 p-2 rounded-full font-bold text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
              
              <div className="bg-pink-50/60 border-l-4 border-pink-500 p-4 rounded-r-xl">
                <p className="font-semibold text-stone-800">
                  {selectedArticle.fullContent.intro}
                </p>
              </div>

              {selectedArticle.fullContent.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-sm sm:text-base font-black text-stone-900">
                    {sec.heading}
                  </h4>
                  <p className="text-stone-600 font-normal leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <h5 className="font-black text-amber-900 text-xs">Parent Pro-Tip:</h5>
                  <p className="text-amber-800 text-[11px] font-medium mt-0.5">
                    {selectedArticle.fullContent.proTip}
                  </p>
                </div>
              </div>

              {/* Recommended Product Box */}
              {selectedArticle.recommendedKitName && (
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-400">Featured Activity Kit</span>
                    <h5 className="font-black text-stone-900 text-sm">{selectedArticle.recommendedKitName}</h5>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      onNavigateTab("products");
                    }}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    View in Shop
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Close Article
              </button>

              <button
                onClick={() => triggerWhatsAppQuery(`Hi Mini Paint Station! I read the article "${selectedArticle.title}" and would like to order the recommended kit.`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs"
              >
                <span>Order on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
