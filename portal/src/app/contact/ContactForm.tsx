"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-3xl mx-auto text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80 mb-4">
            Contact
          </p>
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6">
            Request the prospectus.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Send your details and we&apos;ll share the full Oyarifa model, the live capsule plan, and
            the subscription steps.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-4 max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 border border-border lg:gap-16">
            <div className="p-7 sm:p-10 bg-card border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+233 544 101016"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Tell us what you&apos;re looking for..."
                    rows={5}
                  />
                </div>

                <Button type="submit" disabled={status === "submitting"} className="w-full">
                  {status === "submitting" ? "Sending..." : "Send request"}
                </Button>

                {status === "error" && (
                  <p className="text-sm text-destructive text-center">{errorMessage}</p>
                )}
              </form>
            </div>

            <div className="border-l border-border lg:border-t-0 lg:border-l p-7 sm:p-10 bg-card">
              <h3 className="text-xl font-semibold text-foreground mb-5">Direct</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>info@swiftholdings.org</p>
                <p>+233 544 101016</p>
                <p>+1 437 421 0963</p>
                <p>20 Edmonton St, Madina, Accra</p>
              </div>
              <p className="mt-8 text-sm text-muted-foreground/70">
                Private placement for eligible investors only. Not a regulated securities offering in
                every jurisdiction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}