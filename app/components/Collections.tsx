"use client";
import { motion } from "framer-motion";
import ProjectImage from "@/app/components/ProjectImage";

interface CollectionCard {
  id: "dawn" | "meridian" | "dusk";
  title: string;
  subtitle: string;
  description: string;
  cardClass: string;
}

const cards: CollectionCard[] = [
  {
    id: "dawn",
    title: "Dawn",
    subtitle: "The first light",
    description: "A clean, green-floral opening. Bergamot, white tea, and a trace of morning dew. Burns 45 hours.",
    cardClass: "collection-card card-dawn",
  },
  {
    id: "meridian",
    title: "Meridian",
    subtitle: "The high hour",
    description: "Warm amber, sandalwood, and a thread of smoke. The scent of a room that has been lived in. Burns 55 hours.",
    cardClass: "collection-card card-meridian",
  },
  {
    id: "dusk",
    title: "Dusk",
    subtitle: "The long close",
    description: "Deep oud, vetiver, and dark resin. The hour when the day finally lets go. Burns 60 hours.",
    cardClass: "collection-card card-dusk",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.33, 1, 0.68, 1] as [number, number, number, number],
    },
  },
};

export default function Collections() {
  return (
    <section className="collections-section" aria-labelledby="collections-heading">
      <div className="collections-inner">
        <h2 id="collections-heading" className="collections-heading">
          The Collections
        </h2>
        <motion.div
          className="collections-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((card) => (
            <motion.article
              key={card.id}
              className={card.cardClass}
              variants={itemVariants}
            >
              <div className="card-image-wrap">
                <ProjectImage
                  id={card.id}
                  className="card-image"
                  alt={`${card.title} collection`}
                />
              </div>
              <div className="card-body">
                <span className="card-subtitle">{card.subtitle}</span>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
