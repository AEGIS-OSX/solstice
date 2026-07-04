"use client";

import Nav from "@/app/components/Nav";
import Hero from "@/app/components/Hero";
import Philosophy from "@/app/components/Philosophy";
import Collections from "@/app/components/Collections";
import FounderStory from "@/app/components/FounderStory";
import Waitlist from "@/app/components/Waitlist";

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Philosophy />
      <Collections />
      <FounderStory />
      <Waitlist />
    </main>
  );
}
