import { useState } from "react";
import Container from '@mui/material/Container';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import GenMailLandingPage from "./GenMailLandingPage";
import './index.css'; // or './globals.css'




export default function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone: tone === "none" ? "" : tone,
      });
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError("⚠️ Failed to generate reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   return (
   <GenMailLandingPage />
  );
}
