"use client";
import { useState, useEffect } from "react";
import { ProjectImage } from "@/app/components/ProjectImage";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={scrolled ? "nav-root scrolled" : "nav-root"}>
      <nav className="nav-inner" aria-label="Main navigation">
        <a href="/" aria-label="Solstice home">
          <ProjectImage id="logo" className="nav-logo" alt="Solstice" />
        </a>
        <a href="#waitlist" className="btn-primary">
          Join the waitlist
        </a>
      </nav>
    </header>
  );
}
