"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="waitlist" className="waitlist-section">
      <motion.div
        className="waitlist-inner"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        <h2 className="waitlist-heading">Be first.</h2>
        <p className="waitlist-sub">
          We are pouring our first collection this winter. Join the waitlist for
          early access, behind-the-scenes updates, and a small thank-you from
          the studio.
        </p>

        {status !== "success" && (
          <form
            className="waitlist-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              type="email"
              className="waitlist-input"
              placeholder="Your email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="btn-primary waitlist-btn"
              disabled={status === "loading"}
              aria-disabled={status === "loading"}
            >
              {status === "loading" ? "Joining..." : "Join the waitlist"}
            </button>
            {status === "error" && (
              <p className="waitlist-error" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        {status === "success" && (
          <p className="waitlist-success" role="status">
            {`You're on the list. We'll be in touch before the first pour.`}
          </p>
        )}
      </motion.div>
    </section>
  );
}
