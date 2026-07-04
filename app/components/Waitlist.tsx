"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "loading" | "success" | "error";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else if (res.status === 429) {
        setStatus("error");
        setErrorMessage("Too many requests. Please try again in a moment.");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="waitlist" className="waitlist-section">
      <motion.div
        className="waitlist-inner"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      >
        <h2 className="waitlist-heading">The First Pour</h2>
        <p className="waitlist-body">
          Our first collection ships this winter. Join the waitlist for early
          access to the studio and a launch discount on your first vessel.
        </p>

        <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
          <div className="waitlist-field">
            <label htmlFor="email" className="waitlist-label">
              Email address
            </label>
            <div className="waitlist-input-row">
              <input
                id="email"
                type="email"
                name="email"
                className="waitlist-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                aria-describedby="email-error email-helper"
                aria-invalid={status === "error" ? true : undefined}
                disabled={status === "loading" || status === "success"}
                required
              />
              <button
                type="submit"
                className="btn-primary waitlist-submit"
                disabled={status === "loading" || status === "success"}
                aria-disabled={status === "loading" || status === "success"}
              >
                {status === "loading" ? (
                  <span className="waitlist-spinner" aria-label="Submitting" />
                ) : (
                  "Join the waitlist"
                )}
              </button>
            </div>
            <div
              id="email-helper"
              className="waitlist-helper"
              aria-live="polite"
            >
              {status === "success" && (
                <motion.span
                  className="waitlist-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {`You're on the list.`}
                </motion.span>
              )}
              {status === "error" && (
                <span
                  id="email-error"
                  className="waitlist-error"
                  role="alert"
                >
                  {errorMessage}
                </span>
              )}
            </div>
          </div>
        </form>

        <p className="waitlist-privacy">
          No spam. Just the occasional update from the studio.
        </p>
      </motion.div>
    </section>
  );
}
