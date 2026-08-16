export type Category = "volunteering" | "erasmus" | "ngo";

export type VerificationStatus = "verified" | "needs_verification" | "expired" | "community_reported";

export type Opportunity = {
  id: string;
  category: Category;
  title_al: string;
  title_en: string;
  org: string;
  location_al: string;
  location_en: string;
  deadline: string | null;
  description_al: string;
  description_en: string;
  link: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  min_age: number | null;
  max_age: number | null;
  requires_experience: boolean;
  travel_funded: boolean;
  accommodation_funded: boolean;
  food_funded: boolean;
  participation_fee: string | null;
  verification_status: VerificationStatus;
  last_verified_at: string | null;
};

export const CATEGORY_LABELS: Record<Category, { al: string; en: string }> = {
  volunteering: { al: "Vullnetarizëm", en: "Volunteering" },
  erasmus: { al: "Erasmus+", en: "Erasmus+" },
  ngo: { al: "OJQ", en: "NGO" },
};
