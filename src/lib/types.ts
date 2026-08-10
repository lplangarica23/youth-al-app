export type Category = "volunteering" | "erasmus" | "ngo";

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
};

export const CATEGORY_LABELS: Record<Category, { al: string; en: string }> = {
  volunteering: { al: "Vullnetarizëm", en: "Volunteering" },
  erasmus: { al: "Erasmus+", en: "Erasmus+" },
  ngo: { al: "OJQ", en: "NGO" },
};
