import { BlogPost, RankMathAnalysis } from '../types/blog';

/**
 * Calculates Rank Math SEO score (0 - 100) and provides actionable checklist items
 * matching WordPress Rank Math plugin mechanics.
 */
export function analyzeRankMathSEO(post: Partial<BlogPost>): RankMathAnalysis {
  const title = (post.title || '').trim();
  const seoTitle = (post.seo?.seoTitle || title).trim();
  const metaDesc = (post.seo?.metaDescription || post.excerpt || '').trim();
  const focusKeyword = (post.seo?.focusKeyword || '').trim().toLowerCase();
  const slug = (post.slug || '').toLowerCase();
  const content = (post.content || '').trim();
  const featuredImage = post.featuredImage || '';
  const featuredImageAlt = (post.featuredImageAlt || '').toLowerCase();

  // Strip HTML tags for clean word & text analysis
  const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent ? textContent.split(/\s+/) : [];
  const wordCount = words.length;

  const checks: RankMathAnalysis['checks'] = [];
  let score = 0;

  if (!focusKeyword) {
    return {
      score: 15,
      rating: 'bad',
      checks: [
        {
          id: 'no-keyword',
          category: 'basic',
          title: 'Add a Focus Keyword',
          passed: false,
          message: 'Please set a focus keyword in Rank Math SEO to analyze this post.',
          impact: 'high',
        },
      ],
      wordCount,
      keywordDensity: 0,
      keywordCount: 0,
    };
  }

  // Count keyword occurrences in text content
  const regex = new RegExp(`\\b${focusKeyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}\\b`, 'gi');
  const matches = textContent.match(regex);
  const keywordCount = matches ? matches.length : 0;
  const keywordDensity = wordCount > 0 ? Number(((keywordCount / wordCount) * 100).toFixed(2)) : 0;

  // --- 1. BASIC SEO CHECKS (Total weight: 45) ---

  // 1a. Keyword in SEO Title (12 pts)
  const kwInTitle = seoTitle.toLowerCase().includes(focusKeyword);
  if (kwInTitle) {
    score += 12;
    checks.push({
      id: 'title-keyword',
      category: 'basic',
      title: 'Focus Keyword in SEO Title',
      passed: true,
      message: `Hurray! You are using your focus keyword in the SEO Title.`,
      impact: 'high',
    });
  } else {
    checks.push({
      id: 'title-keyword',
      category: 'basic',
      title: 'Focus Keyword in SEO Title',
      passed: false,
      message: `Focus keyword "${focusKeyword}" does not appear in the SEO Title.`,
      impact: 'high',
    });
  }

  // 1b. Keyword in Meta Description (10 pts)
  const kwInDesc = metaDesc.toLowerCase().includes(focusKeyword);
  if (kwInDesc) {
    score += 10;
    checks.push({
      id: 'desc-keyword',
      category: 'basic',
      title: 'Focus Keyword in Meta Description',
      passed: true,
      message: `Great! The focus keyword is present in the meta description.`,
      impact: 'high',
    });
  } else {
    checks.push({
      id: 'desc-keyword',
      category: 'basic',
      title: 'Focus Keyword in Meta Description',
      passed: false,
      message: `Focus keyword "${focusKeyword}" was not found in the meta description.`,
      impact: 'high',
    });
  }

  // 1c. Keyword in URL / Slug (8 pts)
  const cleanKeywordSlug = focusKeyword.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const kwInSlug = slug.includes(cleanKeywordSlug) || slug.replace(/-/g, ' ').includes(focusKeyword);
  if (kwInSlug) {
    score += 8;
    checks.push({
      id: 'slug-keyword',
      category: 'basic',
      title: 'Focus Keyword in URL / Permalink',
      passed: true,
      message: `Awesome! The focus keyword appears in the URL slug.`,
      impact: 'high',
    });
  } else {
    checks.push({
      id: 'slug-keyword',
      category: 'basic',
      title: 'Focus Keyword in URL / Permalink',
      passed: false,
      message: `Use the focus keyword in the permalink / URL slug.`,
      impact: 'high',
    });
  }

  // 1d. Keyword in first 10% of content (7 pts)
  const first10PercentWords = words.slice(0, Math.max(30, Math.floor(wordCount * 0.15))).join(' ').toLowerCase();
  const kwInIntro = first10PercentWords.includes(focusKeyword);
  if (kwInIntro) {
    score += 7;
    checks.push({
      id: 'intro-keyword',
      category: 'basic',
      title: 'Focus Keyword in First 10% of Content',
      passed: true,
      message: `Your focus keyword appears early in the introduction.`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'intro-keyword',
      category: 'basic',
      title: 'Focus Keyword in First 10% of Content',
      passed: false,
      message: `Add the focus keyword near the beginning of your content.`,
      impact: 'medium',
    });
  }

  // 1e. Content Length (8 pts)
  if (wordCount >= 600) {
    score += 8;
    checks.push({
      id: 'content-length',
      category: 'basic',
      title: 'Content Length is Optimal',
      passed: true,
      message: `Content is ${wordCount} words long. Good job!`,
      impact: 'high',
    });
  } else if (wordCount >= 300) {
    score += 5;
    checks.push({
      id: 'content-length',
      category: 'basic',
      title: 'Content Length is Acceptable',
      passed: true,
      message: `Content is ${wordCount} words. Consider expanding to 600+ words for better rankings.`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'content-length',
      category: 'basic',
      title: 'Content Length is Short',
      passed: false,
      message: `Content is only ${wordCount} words. Search engines prefer at least 300 words.`,
      impact: 'high',
    });
  }

  // --- 2. ADDITIONAL SEO CHECKS (Total weight: 30) ---

  // 2a. Keyword in Subheadings (H2, H3) (8 pts)
  const headingMatches = content.match(/<h[2-4][^>]*>(.*?)<\/h[2-4]>/gi) || [];
  const headingsText = headingMatches.map(h => h.replace(/<[^>]+>/g, '').toLowerCase()).join(' ');
  const kwInHeadings = headingsText.includes(focusKeyword);
  if (kwInHeadings) {
    score += 8;
    checks.push({
      id: 'subheading-keyword',
      category: 'additional',
      title: 'Focus Keyword in Subheadings (H2/H3)',
      passed: true,
      message: `Focus keyword found in subheadings. Great hierarchy!`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'subheading-keyword',
      category: 'additional',
      title: 'Focus Keyword in Subheadings (H2/H3)',
      passed: false,
      message: `Use your focus keyword in at least one H2 or H3 subheading.`,
      impact: 'medium',
    });
  }

  // 2b. Featured Image with Alt Attribute (8 pts)
  const hasFeaturedImage = !!featuredImage;
  const imageAltHasKeyword = featuredImageAlt.includes(focusKeyword);
  if (hasFeaturedImage && imageAltHasKeyword) {
    score += 8;
    checks.push({
      id: 'image-alt',
      category: 'additional',
      title: 'Image Alt Text Contains Focus Keyword',
      passed: true,
      message: `Featured image has proper ALT text containing the focus keyword.`,
      impact: 'medium',
    });
  } else if (hasFeaturedImage) {
    score += 4;
    checks.push({
      id: 'image-alt',
      category: 'additional',
      title: 'Add Focus Keyword to Featured Image Alt',
      passed: false,
      message: `Featured image is set, but the ALT text does not include the focus keyword.`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'image-alt',
      category: 'additional',
      title: 'Add Featured Image (Further Image)',
      passed: false,
      message: `Featured image is missing. Add an eye-catching featured image with ALT text.`,
      impact: 'high',
    });
  }

  // 2c. Keyword Density (7 pts)
  if (keywordDensity >= 0.8 && keywordDensity <= 2.5) {
    score += 7;
    checks.push({
      id: 'keyword-density',
      category: 'additional',
      title: 'Keyword Density is Optimal',
      passed: true,
      message: `Keyword density is ${keywordDensity}% (${keywordCount} times). Perfect balance!`,
      impact: 'medium',
    });
  } else if (keywordDensity > 2.5) {
    score += 3;
    checks.push({
      id: 'keyword-density',
      category: 'additional',
      title: 'Keyword Density is High',
      passed: false,
      message: `Keyword density is ${keywordDensity}% (${keywordCount} times). Avoid keyword stuffing.`,
      impact: 'medium',
    });
  } else if (keywordCount >= 1) {
    score += 4;
    checks.push({
      id: 'keyword-density',
      category: 'additional',
      title: 'Keyword Density is Low',
      passed: false,
      message: `Keyword density is ${keywordDensity}% (${keywordCount} times). Aim for at least 1%.`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'keyword-density',
      category: 'additional',
      title: 'Keyword Not Found in Content',
      passed: false,
      message: `The focus keyword does not appear in the body content.`,
      impact: 'high',
    });
  }

  // 2d. Internal / External Links check (7 pts)
  const hasLinks = /<a\s+[^>]*href=["'][^"']+["'][^>]*>/i.test(content) || /\[.*?\]\(.*?\)/.test(content);
  if (hasLinks) {
    score += 7;
    checks.push({
      id: 'links-check',
      category: 'additional',
      title: 'Has Links / CTAs in Content',
      passed: true,
      message: `Great, your post links to products or external references.`,
      impact: 'low',
    });
  } else {
    checks.push({
      id: 'links-check',
      category: 'additional',
      title: 'Add Internal Links or Product Links',
      passed: false,
      message: `Add links to your painting kits or store pages to keep readers engaged.`,
      impact: 'low',
    });
  }

  // --- 3. TITLE READABILITY (Total weight: 15) ---

  // 3a. Keyword near beginning of title (8 pts)
  const kwIndexInTitle = seoTitle.toLowerCase().indexOf(focusKeyword);
  if (kwIndexInTitle >= 0 && kwIndexInTitle <= 15) {
    score += 8;
    checks.push({
      id: 'title-start',
      category: 'title',
      title: 'Keyword Near Beginning of Title',
      passed: true,
      message: `Focus keyword is placed near the beginning of the SEO Title.`,
      impact: 'medium',
    });
  } else if (kwInTitle) {
    score += 4;
    checks.push({
      id: 'title-start',
      category: 'title',
      title: 'Move Keyword Closer to Beginning',
      passed: false,
      message: `Consider moving the focus keyword closer to the front of the title.`,
      impact: 'low',
    });
  }

  // 3b. Title Length (50 - 60 chars) (7 pts)
  if (seoTitle.length >= 40 && seoTitle.length <= 65) {
    score += 7;
    checks.push({
      id: 'title-length',
      category: 'title',
      title: 'SEO Title Length is Ideal',
      passed: true,
      message: `Title length is ${seoTitle.length} characters (ideal is 40-60 characters).`,
      impact: 'medium',
    });
  } else {
    score += 3;
    checks.push({
      id: 'title-length',
      category: 'title',
      title: 'Optimize Title Length',
      passed: false,
      message: `Title is ${seoTitle.length} chars. Aim for between 40 and 60 characters for Google.`,
      impact: 'low',
    });
  }

  // --- 4. CONTENT READABILITY (Total weight: 10) ---

  // 4a. Short paragraphs / structured content
  const hasHeadings = headingMatches.length >= 2;
  if (hasHeadings) {
    score += 5;
    checks.push({
      id: 'headings-structure',
      category: 'content',
      title: 'Use of Headings & Structure',
      passed: true,
      message: `Your post is well organized with subheadings.`,
      impact: 'medium',
    });
  } else {
    checks.push({
      id: 'headings-structure',
      category: 'content',
      title: 'Add More Subheadings',
      passed: false,
      message: `Break up long text using H2 and H3 headings to improve readability.`,
      impact: 'medium',
    });
  }

  // 4b. Meta Description length (120-160 chars) (5 pts)
  if (metaDesc.length >= 120 && metaDesc.length <= 160) {
    score += 5;
    checks.push({
      id: 'desc-length',
      category: 'content',
      title: 'Meta Description Length is Optimal',
      passed: true,
      message: `Meta description is ${metaDesc.length} characters (120-160 chars).`,
      impact: 'medium',
    });
  } else if (metaDesc.length > 0) {
    score += 2;
    checks.push({
      id: 'desc-length',
      category: 'content',
      title: 'Optimize Meta Description Length',
      passed: false,
      message: `Meta description is ${metaDesc.length} chars. Optimal length is 120-160 characters.`,
      impact: 'low',
    });
  } else {
    checks.push({
      id: 'desc-length',
      category: 'content',
      title: 'Add Meta Description',
      passed: false,
      message: `Meta description is missing. Add a 120-160 character snippet for Google.`,
      impact: 'high',
    });
  }

  // Ensure score is capped at 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  const rating = finalScore >= 80 ? 'good' : finalScore >= 50 ? 'ok' : 'bad';

  return {
    score: finalScore,
    rating,
    checks,
    wordCount,
    keywordDensity,
    keywordCount,
  };
}
