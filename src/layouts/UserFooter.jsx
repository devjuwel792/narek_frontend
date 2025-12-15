"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UserFooter() {
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6">Contact</h3>
            <div className="space-y-3">
              <p className="font-semibold text-white">DRANKHANDEL</p>
              <p className="text-gray-400">Antwerp Province, Belgium</p>
              <p className="text-gray-400">+32 489 39 17 12</p>
              <p className="text-gray-400">info@sipbite.be</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    
                  <label htmlFor="firstName" >First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="First Name"
                    value={contactForm.firstName}
                    onChange={handleContactChange}
                    className="bg-white text-gray-900 border-0"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Last Name"
                    value={contactForm.lastName}
                    onChange={handleContactChange}
                    className="bg-white text-gray-900 border-0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="bg-white text-gray-900 border-0"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="How can we help?"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full p-3 rounded text-gray-900 border-0 resize-none h-32"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-green-400 text-white"
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
