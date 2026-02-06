"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Assuming this provides the current user
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Avatar,
  Fade,
} from "@mui/material";
import {
  EventSeat as EventSeatIcon, 
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { updateUserDetails } from "@/lib/api";

export default function OrganizerApplyPage() {
  const router = useRouter();
  const { user } = useAuth(); 

  const [organizerName, setOrganizerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if not logged in (since we need userId)
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login");
    }
  }, [user, router, isLoading]);

  // Handle Success Redirect
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/"); // Redirect to homepage
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error("You must be logged in to apply.");
      return;
    }

    if (!organizerName.trim()) {
      toast.warning("Please enter an organizer name.");
      return;
    }

    setIsLoading(true);

    try {
      // Call the API to update the user's name/nickname
      const response = await updateUserDetails(user.id, {
        nickname: organizerName,
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success("Application successful!");
      } else {
        throw new Error(response.message || "Failed to update details");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: { xs: "100vh", sm: "100vh", md: "120vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        backgroundImage: "url('/assets/images/organizer-apply-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* The Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "black",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {isSuccess ? (
            // SUCCESS STATE
            <Fade in={isSuccess}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CheckCircleIcon
                  color="success"
                  sx={{ fontSize: 80, mb: 2 }}
                />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Your application was successful!
                </Typography>
                <Typography color="text.secondary" paragraph>
                  You will receive an email once approved.
                  <br />
                  Redirecting you to the homepage...
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/")}
                  sx={{ mt: 2 }}
                >
                  Go to Homepage Now
                </Button>
              </Box>
            </Fade>
          ) : (
            // APPLICATION FORM STATE
            <>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    mx: "auto",
                    mb: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  <EventSeatIcon fontSize="large" />
                </Avatar>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight={800}
                  gutterBottom
                  sx={{ color: "#1a1a1a" }}
                >
                  Take the Stage.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Become an Organizer and manage your events like a pro.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Organizer / Organization Name"
                  variant="outlined"
                  placeholder="e.g. Paradise Events Co."
                  value={organizerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizerName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: 4,
                  }}
                >
                  {isLoading ? "Processing..." : "Apply as Organizer"}
                </Button>

                <Button
                  fullWidth
                  startIcon={<ArrowBackIcon />}
                  sx={{ mt: 2, color: "text.secondary" }}
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}