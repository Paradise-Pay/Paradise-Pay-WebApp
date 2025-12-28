// pricingData.ts

export type PlanVariant = 'outline-purple' | 'solid-yellow' | 'solid-black';

export interface PricingPlan {
  id: string;
  title: string;
  subtitle: string;
  badge?: string; // Optional badge like "Most Popular"
  annualPrice: string;
  monthlyPrice: string;
  buttonText: string;
  variant: PlanVariant;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    title: 'Free',
    subtitle: 'Basic Passport',
    annualPrice: 'GH₵0',
    monthlyPrice: 'GH₵0',
    buttonText: 'Get Started For Free',
    variant: 'outline-purple',
  },
  {
    id: 'paradise-plus',
    title: 'Paradise +',
    subtitle: 'For The Fans',
    badge: 'Most Popular',
    annualPrice: 'GH₵100',
    monthlyPrice: 'GH₵10',
    buttonText: 'Get Started',
    variant: 'solid-yellow',
  },
  {
    id: 'paradise-x',
    title: 'Paradise X',
    subtitle: 'For The VIPs',
    annualPrice: 'GH₵300',
    monthlyPrice: 'GH₵30',
    buttonText: 'Go Premium',
    variant: 'solid-black',
  },
];