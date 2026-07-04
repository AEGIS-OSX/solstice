"use client";

import { motion } from "framer-motion";

const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const revealTransition = {
  duration: 0.5,
  ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
};

export default function Philosophy() {
  return (
    <section className="philosophy-section" aria-label="Philosophy">
      {/* Sub-section 1: The Ritual */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        transition={revealTransition}
      >
        <div className="philosophy-ritual">
          <div className="philosophy-ritual-inner">
            <h2 className="philosophy-heading">The Ritual</h2>
            <p className="philosophy-body">
              We do not sell moods. We study the arc of the day and the way
              light settles into a room. Every Solstice vessel is a container
              for a specific hour, poured by hand in our studio to help you
              mark the transition from doing to being. Slow craft is not a
              marketing term here. It is the only way we know how to work.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sub-section 2: How It's Made */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={revealVariants}
        transition={{ ...revealTransition, delay: 0.1 }}
      >
        <div className="philosophy-process">
          <div className="philosophy-process-inner">
            <div className="process-step">
              <div className="process-rule" aria-hidden="true" />
              <h3 className="process-title">The Foundation</h3>
              <p className="process-body">
                We blend sustainable soy and coconut waxes with fine fragrance
                oils. No paraffin, no additives, no shortcuts.
              </p>
            </div>
            <div className="process-step">
              <div className="process-rule" aria-hidden="true" />
              <h3 className="process-title">The Pour</h3>
              <p className="process-body">
                Every vessel is filled by hand in small batches. We watch the
                temperature, the pour height, and the cooling rate to ensure a
                clean, even burn.
              </p>
            </div>
            <div className="process-step">
              <div className="process-rule" aria-hidden="true" />
              <h3 className="process-title">The Cure</h3>
              <p className="process-body">
                Patience is an ingredient. Our candles rest for two weeks,
                allowing the fragrance to bind fully with the wax before they
                are finished and labeled.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
