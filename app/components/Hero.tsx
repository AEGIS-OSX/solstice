"use client";

import { motion } from "framer-motion";
import ProjectImage from "@/app/components/ProjectImage";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  return (
    <section className="hero-section" aria-label="Hero">
      <div className="hero-inner">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-eyebrow" variants={itemVariants}>
            Small-batch. Hand-poured.
          </motion.span>

          <motion.h1 className="hero-headline" variants={itemVariants}>
            Solstice
          </motion.h1>

          <motion.p className="hero-sub" variants={itemVariants}>
            A studio that understands time. Hand-poured candles for the unhurried home.
          </motion.p>

          <motion.a
            href="#waitlist"
            className="btn-primary hero-cta"
            variants={itemVariants}
          >
            Join the waitlist
          </motion.a>
        </motion.div>

        <motion.div
          className="hero-image-wrap"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
        >
          <ProjectImage
            id="hero"
            className="hero-image"
            alt="A matte ceramic Solstice candle vessel on linen"
          />
        </motion.div>
      </div>
    </section>
  );
}
