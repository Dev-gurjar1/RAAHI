import { create } from 'zustand';
import api from '../services/api.js';

const INITIAL_PACKAGES = [
  {
    id: "tp1",
    guideId: "g1",
    guideName: "Vikram Singh Rathore",
    title: "1-Day Royal Forts & Palaces Crawl",
    category: "Heritage",
    duration: "7 Hours",
    price: 1499,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80",
    highlights: ["Amer Fort Underground Passages", "Jaigarh Cannon View", "Nahargarh Sunset Point"],
    included: ["Private Local Host", "Skip-the-line entrance assistance", "Heritage map"],
    meetingPoint: "Amer Fort Entrance Gate",
    description: "Comprehensive royal tour covering Amer Fort, Jaigarh Fort, and Nahargarh sunset views."
  },
  {
    id: "tp2",
    guideId: "g4",
    guideName: "Sunita Kanwar",
    title: "Pink City Sunrise & Photography Trail",
    category: "Photography",
    duration: "4 Hours",
    price: 999,
    rating: 4.95,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500&auto=format&fit=crop&q=80",
    highlights: ["Hawa Mahal Golden Hour Shots", "Patrika Gate Symmetry", "City Palace Courtyard"],
    included: ["Expert Photo Host", "Composition Tips", "Chai at Wind View Cafe"],
    meetingPoint: "Wind View Cafe, Hawa Mahal Road",
    description: "Capture Jaipur's most striking architectural facades during golden hour."
  },
  {
    id: "tp3",
    guideId: "g2",
    guideName: "Priya Sharma",
    title: "Old Jaipur Secret Food & Street Flavors Walk",
    category: "Food",
    duration: "3.5 Hours",
    price: 850,
    rating: 4.92,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
    highlights: ["Rawat Pyaz Kachori", "Lassiwala Original (1944)", "Rabri Ghewar Tasting"],
    included: ["Food Host & Safety Escort", "All Food Tastings Included", "Hygiene Filtered Water"],
    meetingPoint: "MI Road Lassiwala Shop",
    description: "Immerse yourself in Jaipur's authentic culinary heritage with 5+ traditional tastings."
  },
  {
    id: "tp4",
    guideId: "g3",
    guideName: "Rajesh Saini",
    title: "Johari & Bapu Bazaar Crafts & Block Printing",
    category: "Shopping",
    duration: "3 Hours",
    price: 799,
    rating: 4.85,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=80",
    highlights: ["Hand-block printing artisan lab", "Gemstone cutting workshop", "Direct artisan prices"],
    included: ["Artisan Guide", "Anti-Overcharge Shopping Escort"],
    meetingPoint: "Sargasuli Tower, Tripolia Bazaar",
    description: "Explore century-old artisan workshops and learn to negotiate fair local prices."
  }
];

export const useGuideStore = create((set, get) => ({
  online: false,
  isIncomingRequestModalOpen: false,
  requestCountdown: 15,
  packages: INITIAL_PACKAGES,
  isCreatePackageModalOpen: false,

  toggleOnline: async () => {
    const nextState = !get().online;
    set({ online: nextState });
    try {
      await api.guides.updateStatus('g1', { online: nextState });
    } catch (e) {
      console.warn('Guide status sync notice:', e.message);
    }
  },

  openIncomingRequestModal: () => set({ isIncomingRequestModalOpen: true, requestCountdown: 15 }),
  closeIncomingRequestModal: () => set({ isIncomingRequestModalOpen: false }),
  openCreatePackageModal: () => set({ isCreatePackageModalOpen: true }),
  closeCreatePackageModal: () => set({ isCreatePackageModalOpen: false }),

  addPackage: async (pkg) => {
    set((state) => ({ packages: [pkg, ...state.packages], isCreatePackageModalOpen: false }));
    try {
      await api.tours.create(pkg);
    } catch (e) {
      console.warn('Tour package sync notice:', e.message);
    }
  }
}));
