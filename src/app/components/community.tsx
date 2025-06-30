"use client"

import { motion } from "framer-motion"

export default function Community() {
  return (
    <section id="community" className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            جامعه طراحان
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            بخشی از جامعه بزرگ معماران و طراحان ایران باشید
          </p>
        </motion.div>
      </div>
    </section>
  );
}