"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#003366] to-[#004f9e] text-white py-16 px-4 md:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {description && <p className="text-xl md:text-2xl max-w-3xl mx-auto">{description}</p>}
        {children}
      </motion.div>

      {/* Vagues décoratives */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="wave1"
            d="M0 37.7L48 42.5C96 47.2 192 56.7 288 56.5C384 56.3 480 46.7 576 42.5C672 38.3 768 39.7 864 44.8C960 50 1056 59 1152 59.2C1248 59.3 1344 50.7 1392 46.3L1440 42V74H1392C1344 74 1248 74 1152 74C1056 74 960 74 864 74C768 74 672 74 576 74C480 74 384 74 288 74C192 74 96 74 48 74H0V37.7Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  )
}
