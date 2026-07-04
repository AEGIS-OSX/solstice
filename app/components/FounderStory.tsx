"use client";

import { motion } from "framer-motion";
import ProjectImage from "@/app/components/ProjectImage";

export default function FounderStory() {
  return (
    <section className="founder-section">
      <div className="founder-inner">
        <motion.div
          className="founder-text"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <blockquote className="founder-quote">
            <p>"I started pouring candles because I needed to slow down. I did not expect it to become a studio."</p>
            <cite>— Founder, Solstice</cite>
          </blockquote>
          <p className="founder-body">Solstice began in a kitchen in 2021. I was a product designer by trade, and I had spent years optimizing for speed. One winter, I started pouring candles as a way to do something with my hands that could not be rushed. The first batch was terrible. The second was worse. By the third, I understood why patience is an ingredient.</p>
          <p className="founder-body">Every candle we make is still poured by hand, in small batches, in the same studio where I made that first terrible batch. We are not trying to scale. We are trying to get better.</p>
        </motion.div>
        <motion.div
          className="founder-image-wrap"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
        >
          <ProjectImage id="founder" className="founder-image" alt="The Solstice founder at work in the studio" />
        </motion.div>
      </div>
    </section>
  );
}
