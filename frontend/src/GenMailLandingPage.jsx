import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

export default function GenMailLandingPage() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [toneMode, setToneMode] = useState("single"); // 'single' or 'multi'
  const [multiResponses, setMultiResponses] = useState([]); // store 3 responses
  const [showToast, setShowToast] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setShowResponse(false);
    setGeneratedResponse("");
    setMultiResponses([]);
    try {
      if (toneMode === "single") {
        // handle single tone
        const response = await axios.post(
          "http://localhost:8080/api/email/generate",
          {
            emailContent,
            tone,
          }
        );
        setGeneratedResponse(
          typeof response.data === "string"
            ? response.data
            : JSON.stringify(response.data)
        );
      } else {
        // handle multi-tone
        const tones = ["formal", "casual", "friendly"];
        const response = await axios.post(
          "http://localhost:8080/api/email/generate",
          {
            emailContent,
            tones,
          }
        );
        if (Array.isArray(response.data)) {
          const validResponses = response.data.filter(
            (res) =>
              res &&
              typeof res === "object" &&
              typeof res.tone === "string" &&
              typeof res.response === "string"
          );
          setMultiResponses(validResponses);
        } else {
          setMultiResponses([]);
        }
      }
      setShowResponse(true);
    } catch (error) {
      console.error(error);
      setError("Failed to generate response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">GenMail</div>
        <ul className="flex gap-6 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-600 cursor-pointer">Extension</li>
          <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
          <li className="hover:text-blue-600 cursor-pointer" onClick={"/about"}>About</li>
          <li className="hover:text-blue-600 cursor-pointer">Contact</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Get your AI Generated response now
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
          GenMail helps you craft perfect email replies using AI. Whether you're
          responding to a boss, client, or friend — we got you.
        </p>

        {/* Input Card */}
        <Card className="max-w-2xl mx-auto p-6 shadow-lg">
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="emailInput">Enter your email</Label>
              <Textarea
                id="emailInput"
                placeholder="Paste the email you received here..."
                className="mt-1 h-40"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="toneMode">Tone Mode</Label>
              <Select
                value={toneMode}
                onValueChange={(value) => setToneMode(value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Tone</SelectItem>
                  <SelectItem value="multi">Multi Tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {toneMode === "single" && (
              <div>
                <Label htmlFor="toneSelect">Select Tone</Label>
                <Select onValueChange={(value) => setTone(value)}>
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
            )}
            <Button
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 transition-all"
              onClick={handleGenerate}
              disabled={!emailContent || loading}
            >
              Generate
            </Button>
            {showResponse && toneMode === "single" && (
              <div>
                <Label htmlFor="responseBox">Generated Response</Label>
                <Textarea
                  id="responseBox"
                  placeholder="Your AI-generated reply will appear here..."
                  className="mt-1 h-40"
                  readOnly
                  value={generatedResponse}
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedResponse);
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2500);
                  }}
                  className = "mt-5"
                >
                  Copy To Clipboard
                </Button>
              </div>
            )}

            {showResponse && toneMode === "multi" && (
              <div className="flex flex-row gap-4">
                {multiResponses.map((res, index) => (
                  <div key={index}>
                    <Label>
                      {res.tone.charAt(0).toUpperCase() + res.tone.slice(1)}{" "}
                      Tone
                    </Label>
                    <Textarea
                      className="mt-1 h-32"
                      readOnly
                      value={res.response}
                    />
                    <Button
                      className="mt-2"
                      onClick={() => handleCopy(res.response)}
                    >
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      {showToast && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md transition-opacity duration-300 z-50">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
