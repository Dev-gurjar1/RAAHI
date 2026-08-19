import React, { useState } from 'react';
import { useGuideStore } from '../../store/useGuideStore';

export const PackageCreatorModal: React.FC = () => {
  const { isCreatePackageModalOpen, closeCreatePackageModal, addPackage } = useGuideStore();

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Heritage' | 'Food' | 'Culture' | 'Shopping' | 'Photography'>('Heritage');
  const [desc, setDesc] = useState('');

  if (!isCreatePackageModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage({
      id: `tp_${Date.now()}`,
      guideId: 'g1',
      guideName: 'Vikram Singh Rathore',
      title,
      category,
      duration,
      price: parseFloat(price) || 999,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80',
      highlights: [desc.substring(0, 30) || 'Custom heritage walk'],
      included: ['Private Host Escort', 'Heritage Map'],
      meetingPoint: 'Amer Fort Entrance',
      description: desc
    });
    alert("🎉 Experience Package Published!");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 relative shadow-2xl">
        <button onClick={closeCreatePackageModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Publish New Tour Package</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Create a custom heritage experience to showcase to travelers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Package Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Amer Fort Secret Passages Walk"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="4 Hours"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Price Per Person (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="899"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Heritage">Heritage & Forts</option>
              <option value="Food">Food Crawl</option>
              <option value="Culture">Culture & Arts</option>
              <option value="Shopping">Shopping & Crafts</option>
              <option value="Photography">Photography</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Highlights & Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the highlights included in this experience..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white focus:outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition shadow-md shadow-amber-500/20"
          >
            Publish Experience Package
          </button>
        </form>
      </div>
    </div>
  );
};
