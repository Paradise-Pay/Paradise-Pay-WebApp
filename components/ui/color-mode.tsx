"use client";

import { IconButton, Skeleton, useTheme, Box } from "@mui/material";
import type { IconButtonProps } from "@mui/material/IconButton";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// Define the SpanProps interface for type safety
interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
  display?: string;
  colorPalette?: string;
  colorScheme?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

export interface ColorModeProviderProps extends ThemeProviderProps {}

/**
 * Color mode provider wrapper for next-themes
 * Handles theme persistence and transitions
 */
export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

/**
 * Custom hook for color mode management
 * Provides theme state and toggle functionality
 */
export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useNextTheme();
  const colorMode = (forcedTheme || resolvedTheme || 'light') as ColorMode;
  
  const toggleColorMode = React.useCallback(() => {
    setTheme(colorMode === "dark" ? "light" : "dark");
  }, [colorMode, setTheme]);

  const setColorMode = React.useCallback((mode: ColorMode) => {
    setTheme(mode);
  }, [setTheme]);

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
  };
}

/**
 * Hook for theme-aware values
 * Returns different values based on current color mode
 */
export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

/**
 * Icon component that changes based on current theme
 */
export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuSun /> : <LuMoon />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

/**
 * Toggle button for switching between light and dark modes
 * Includes hydration safety and proper accessibility
 */
export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode, colorMode } = useColorMode();
  const [mounted, setMounted] = React.useState(false);
  const muiTheme = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <Skeleton variant="circular" width={40} height={40} />;
  }

  return (
    <IconButton
      onClick={toggleColorMode}
      aria-label="Toggle color mode"
      size="small"
      ref={ref}
      sx={{
        color: 'text.secondary',
        '&:hover': {
          bgcolor: 'action.hover',
          color: 'text.primary',
        },
        ...props.sx,
      }}
      {...props}
    >
      {colorMode === 'dark' ? <LuSun /> : <LuMoon />}
    </IconButton>
  );
});

/**
 * Light mode wrapper component
 */
export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode({ children, ...props }, ref) {
    return (
      <Box
        component="span"
        className="light-theme"
        ref={ref}
        {...props}
      >
        {children}
      </Box>
    );
  },
);

/**
 * Dark mode wrapper component
 */
export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode({ children, ...props }, ref) {
    return (
      <Box
        component="span"
        className="dark-theme"
        ref={ref}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
