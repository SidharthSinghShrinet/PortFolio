import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { PERSONAL_INFO } from "../../data/portfolioData";

/**
 * ContactForm Component
 * Live interactive message dispatch powered by Web3Forms API.
 * Features optimistic UI feedback, accessible validation, and frosted glass styling.
 */
export default function ContactForm({ onActionClick }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onActionClick) onActionClick();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setStatusMsg("Please fill in all fields before sending.");
      return;
    }

    const accessKey = PERSONAL_INFO.web3FormsAccessKey || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      setStatusMsg(`Contact key is missing in .env. Please email directly to ${PERSONAL_INFO.email}`);
      return;
    }

    setStatus("submitting");
    setStatusMsg("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: `Portfolio Message from ${formData.name.trim()} (${formData.email.trim()})`,
          from_name: "Portfolio Contact Form",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setStatusMsg("Message delivered! I will reply to your email within 24 hours.");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => {
          setStatus("idle");
          setStatusMsg("");
        }, 8000);
      } else {
        setStatus("error");
        setStatusMsg(data.message || "Failed to deliver message. Please use direct email.");
      }
    } catch (err) {
      console.error("Web3Forms error:", err);
      setStatus("error");
      setStatusMsg(`Network error. Please email directly to ${PERSONAL_INFO.email}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form mt-6">
      <div className="text-xs font-mono uppercase tracking-wider text-orange-600 dark:text-orange-400 font-bold mb-3 flex items-center gap-2">
        <Send className="w-3.5 h-3.5" />
        <span>Direct Dispatch Form // Instant Delivery</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-xs font-mono font-medium text-[var(--ink)]">
            Your Name <span className="text-orange-600 dark:text-orange-400">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Jane Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={status === "submitting"}
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-xs font-mono font-medium text-[var(--ink)]">
            Email Address <span className="text-orange-600 dark:text-orange-400">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            value={formData.email}
            onChange={handleChange}
            disabled={status === "submitting"}
            className="form-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-4">
        <label htmlFor="contact-message" className="text-xs font-mono font-medium text-[var(--ink)]">
          Project or Inquiry Details <span className="text-orange-600 dark:text-orange-400">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder="Hi Sidharth, I'd like to discuss an opportunity or project..."
          value={formData.message}
          onChange={handleChange}
          disabled={status === "submitting"}
          className="form-input resize-y min-h-[90px]"
        />
      </div>

      {/* Submission Status Alerts */}
      {status === "success" && (
        <div className="form-alert success mb-3" role="status">
          <CheckCircle2 className="alert-icon" />
          <span className="font-semibold text-xs sm:text-sm">{statusMsg}</span>
        </div>
      )}

      {status === "error" && (
        <div className="form-alert error mb-3" role="alert">
          <AlertCircle className="alert-icon" />
          <span className="font-semibold text-xs sm:text-sm">{statusMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary w-full sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Direct Message</span>
          </>
        )}
      </button>
    </form>
  );
}
