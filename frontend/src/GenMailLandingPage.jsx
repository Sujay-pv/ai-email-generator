import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function GenMailLandingPage() {
  const [showResponse, setShowResponse] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState("");

  const handleGenerate = () => {
    // Simulate generation (you'll replace this with real API logic)
    setGeneratedResponse("Thank you for your email. I appreciate your message and will get back to you shortly.");
    setShowResponse(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">GenMail</div>
        <ul className="flex gap-6 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-600 cursor-pointer">Features</li>
          <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
          <li className="hover:text-blue-600 cursor-pointer">About</li>
          <li className="hover:text-blue-600 cursor-pointer">Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get your AI Generated response now</h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
          GenMail helps you craft perfect email replies using AI. Whether you're responding to a boss, client, or friend — we got you.
        </p>

        {/* Input Card */}
        <Card className="max-w-2xl mx-auto p-6 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="emailInput">Enter your email</Label>
              <Textarea id="emailInput" placeholder="Paste the email you received here..." className="mt-1 h-40" />
            </div>

            <div>
              <Label htmlFor="toneSelect">Select Tone</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showResponse && (
              <div>
                <Label htmlFor="responseBox">Generated Response</Label>
                <Textarea
                  id="responseBox"
                  placeholder="Your AI-generated reply will appear here..."
                  className="mt-1 h-40"
                  readOnly
                  value={generatedResponse}
                />
              </div>
            )}

            <Button
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-all"
              onClick={handleGenerate}
            >
              Generate
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
