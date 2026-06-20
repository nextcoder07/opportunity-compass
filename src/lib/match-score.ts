// Pure function — computes a 0-100 match score between user profile and an opportunity item.
// Domain-agnostic: each item passes a set of optional matchable fields.

export type ProfileLike = {
  education_level?: string | null;
  state?: string | null;
  category?: string | null;
  income_range?: string | null;
  gender?: string | null;
  career_interests?: string[] | null;
};

export type MatchableItem = {
  education_levels?: string[] | null;
  state?: string | null;
  categories?: string[] | null;
  income_max?: number | null;
  gender?: string | null;
  fields?: string[] | null;
  tags?: string[] | null;
  domain?: string | null;
  subject?: string | null;
};

const incomeNumber = (range?: string | null): number | null => {
  if (!range) return null;
  // ranges like "<2L", "2-5L", "5-8L", "8L+"
  const m = range.match(/(\d+)/);
  return m ? parseInt(m[1], 10) * 100000 : null;
};

export type MatchResult = { score: number; reasons: string[] };

export function matchScore(profile: ProfileLike | null | undefined, item: MatchableItem): MatchResult {
  if (!profile) return { score: 50, reasons: ["Complete your profile for personalized matches"] };

  let score = 50;
  const reasons: string[] = [];

  // Education level
  if (profile.education_level && item.education_levels?.length) {
    if (item.education_levels.includes(profile.education_level)) {
      score += 15;
      reasons.push(`Education level: ${profile.education_level}`);
    } else {
      score -= 10;
    }
  }

  // State
  if (profile.state && item.state) {
    if (item.state === "All India" || item.state === profile.state) {
      score += 10;
      reasons.push(item.state === "All India" ? "Available all India" : `State: ${profile.state}`);
    } else score -= 15;
  } else if (item.state === "All India") {
    score += 5;
  }

  // Category
  if (profile.category && item.categories?.length) {
    if (item.categories.includes(profile.category)) {
      score += 10;
      reasons.push(`Category: ${profile.category}`);
    }
  }

  // Income
  const userIncome = incomeNumber(profile.income_range);
  if (userIncome != null && item.income_max != null) {
    if (userIncome <= item.income_max) {
      score += 10;
      reasons.push("Income eligible");
    } else score -= 15;
  }

  // Gender
  if (profile.gender && item.gender && item.gender !== "Any") {
    if (item.gender === profile.gender) {
      score += 8;
      reasons.push(`Gender: ${profile.gender}`);
    } else score -= 20;
  }

  // Career interests vs tags/fields/domain/subject
  const interests = (profile.career_interests || []).map((s) => s.toLowerCase());
  const bag = [
    ...(item.fields || []),
    ...(item.tags || []),
    item.domain || "",
    item.subject || "",
  ].map((s) => (s || "").toLowerCase());
  const hit = interests.some((i) => bag.some((b) => b.includes(i) || i.includes(b)));
  if (hit) {
    score += 12;
    reasons.push("Matches your interests");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  return { score, reasons };
}

export const matchColor = (score: number) =>
  score >= 90 ? "text-emerald-600 bg-emerald-50 border-emerald-200"
  : score >= 70 ? "text-amber-600 bg-amber-50 border-amber-200"
  : "text-slate-500 bg-slate-50 border-slate-200";
