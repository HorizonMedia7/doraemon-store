import React from 'react';
import { motion } from 'framer-motion';
import InstagramIcon from './InstagramIcon';

export default function Hero() {
  return (
    <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 border-b border-slate-100 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center">
          
          {/* Logo Brand Avatar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-3.5 relative"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 shadow-sm">
              <img
                src="/logo.jpg"
                alt="Doraemon Gadget Store Avatar"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
          </motion.div>

          {/* Minimal Headline */}
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-slate-900 dark:text-white leading-tight">
            Doraemon <span className="text-sky-600 dark:text-sky-400">Gadget Store</span>
          </h1>

          {/* Clean Subtitle */}
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Direct buy links & reviews for viral gadgets featured on{' '}
            <a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 dark:text-white font-semibold underline decoration-slate-300 dark:decoration-slate-700 hover:text-sky-600"
            >
              @doraemon_gadgets7
            </a>
          </p>

          {/* Minimal Follow Action */}
          <div className="mt-3.5">
            <a
              href="https://www.instagram.com/doraemon_gadgets7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-xs hover:opacity-95 transition-opacity"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow on Instagram</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
