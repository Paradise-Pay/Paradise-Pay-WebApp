"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  TextField,
  Typography,
  Box,
  Link as MuiLink,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Handle URL messages
  useEffect(() => {
    const message = searchParams.get("message");
    const status = searchParams.get("status");

    if (message && status) {
      const toastFn = status === "success" ? toast.success : toast.error;
      toastFn(message, { position: "top-center" });
      window.history.replaceState({}, "", "/auth/login");
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Login successful", { position: "top-center" });
      router.push(redirect);
    } catch (err) {
      toast.error(
        "Login failed, User not found",
        { position: "top-center" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#ffc03a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 2 }}>
              <AccountBalanceWalletIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              Sign in to your account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>OR</Divider>

            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
              Continue with Google
            </Button>

            <Typography align="center" mt={2}>
              Don’t have an account?{" "}
              <MuiLink component={Link} href="/auth/signup">
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
