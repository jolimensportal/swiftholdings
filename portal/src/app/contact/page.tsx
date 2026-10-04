import { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact | Swift Horizon",
  description: "Talk to Swift Holdings about the Oyarifa prefab village. Request the prospectus or join the investor list.",
};

export default function ContactPage() {
  return <ContactForm />;
}