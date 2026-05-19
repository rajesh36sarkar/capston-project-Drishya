import React from 'react';
import { motion } from 'framer-motion';

const categories = ['All', 'Music', 'Gaming', 'Coding', 'Comedy', 'Sports', 'Education', 'News'];

const FilterButtons = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar flex items-center py-1 px-1">
      <div className="flex gap-2.5 pb-1">
        {categories.map((category) => {
          const isSelected = activeCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`relative px-5 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all duration-300 select-none whitespace-nowrap active:scale-95 ${
                isSelected
                  ? 'text-white'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-[var(--text-primary)]'
              }`}
            >
              {/* Sliding background pill for the active tab */}
              {isSelected && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-xl z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterButtons;