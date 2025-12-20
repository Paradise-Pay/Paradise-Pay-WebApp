export type Category = 'Arts, Theater & Comedy' | 'Movies' | 'Music Concerts' | 'Sports';

export const categories: Category[] = [
  'Arts, Theater & Comedy',
  'Movies',
  'Music Concerts',
  'Sports'
];

export interface BundleItem {
  id: string; // Good practice to have an ID for React keys
  title: string;
  image: string;
  bgImage: string;
  features: string[];
  price: number;
}

export const bundles: Record<Category, BundleItem[]> = {
  'Arts, Theater & Comedy': [
    {
      id: 'arts-1',
      title: "Uncle Ebo Festival of 5 Plays Bundle",
      image: "/assets/images/uncle_ebo_plays_feature.png",
      bgImage: "/assets/images/uncle_ebo_plays_bg.png",
      features: ["5 Plays", "VIP Access", "Priority Seating", "Reserved Parking"],
      price: 1200
    }
  ],
  'Movies': [
    {
      id: 'mov-1',
      title: "Stranger Things Season 5: Vol 2 & 3 Bundle",
      image: "/assets/images/stranger_things_feature.png",
      bgImage: "/assets/images/stranger_things_bg.png",
      features: ["2 Movies", "Priority Seating", "Free Popcorn"],
      price: 2000,
    },
    {
      id: 'mov-2',
      title: "Christmas Movies Bundle",
      image: "/assets/images/xmas_feature.png",
      bgImage: "/assets/images/xmas_bg.png",
      features: ["5 Movies", "Exclusive Merchandise", "Meet & Greet"],
      price: 2500,
    }
  ],
  'Music Concerts': [
    {
      id: 'mus-1',
      title: "Detty December Bundle",
      image: "/assets/images/detty_dec_feature.png",
      bgImage: "/assets/images/detty_dec_bg.png",
      features: ["5 Concerts", "VIP Access", "Priority Seating", "Reserved Parking"],
      price: 2000,
    },
    {
      id: 'mus-2',
      title: "Afrochella & Bloombar Exclusive Pass",
      image: "/assets/images/holiday_festival_feature.png",
      bgImage: "/assets/images/holiday_festival_bg.png",
      features: ["2 Day Access", "Backstage Pass", "Free Drinks"],
      price: 1500,
    }
  ],
  'Sports': [
    {
      id: 'spt-1',
      title: "Premier League Matchday Bundle",
      image: "/assets/images/gpl_feature.png",
      bgImage: "/assets/images/gpl_bg.png",
      features: ["3 Matches", "VVIP Box", "Meet & Greet", "Jersey Included"],
      price: 3500,
    }
  ]
};