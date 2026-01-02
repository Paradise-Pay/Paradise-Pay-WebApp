export interface FeatureRow {
  label: string;
  free: boolean;
  plus: boolean;
  x: boolean;
}

export const featureList: FeatureRow[] = [
  { label: "Store & scan tickets", free: true, plus: true, x: true },
  { label: "Access standard bundles", free: true, plus: true, x: true },
  { label: "Join the community", free: true, plus: true, x: true },
  { label: "Early ticket access", free: false, plus: true, x: true },
  { label: "Skip-the-line entry", free: false, plus: true, x: true },
  { label: "Priority seating offers", free: false, plus: true, x: true },
  { label: "Double Paradise Miles", free: false, plus: true, x: true },
  { label: "VIP-only events & lounges", free: false, plus: false, x: true },
  { label: "Meet-and-greet access", free: false, plus: false, x: true },
  { label: "Banking perks & cashback", free: false, plus: false, x: true },
  { label: "All-access bundles", free: false, plus: false, x: true },
];