"use client";

import { motion } from "framer-motion";
import ProjectImage from "@/app/components/ProjectImage";
import styles from "./FounderStory.module.css";

export default function FounderStory() {
  return (
    <section className={styles.founderSection}>
      <div className={styles.founderInner}>
        <motion.div
          className={styles.founderText}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <blockquote className={styles.founderQuote}>
            <p>&#8220;I started Solstice in a home kitchen because I couldn&#8217;t find a candle that respected the silence of a room.&#8221;</p>
            <cite>&#8212; Mara Ellison, Founder</cite>
          </blockquote>
          <p className={styles.founderBody}>Solstice began with an obsession. I spent a year testing wicks and wax blends, looking for a burn that felt as intentional as the objects we choose to keep in our homes. What started as a personal ritual in my kitchen became a studio dedicated to the slow way of making things. We stay small because craft requires a human eye. Every vessel that leaves our studio has been held, inspected, and approved by a person, not a machine.</p>
        </motion.div>
        <motion.div
          className={styles.founderImageWrap}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
        >
          <ProjectImage id="founder" className={styles.founderImage} alt="The Solstice founder at work in the studio" />
        </motion.div>
      </div>
    </section>
  );
}
