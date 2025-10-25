'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Text,
  VStack,
  HStack,
  Image,
  IconButton,
  Link as ChakraLink,
  Field,
  Heading,
  Flex,
} from '@chakra-ui/react';
import Link from 'next/link';
import { signup } from '@/lib/api';
import { ColorModeButton, useColorModeValue } from '@/components/ui/color-mode';

/**
 * Signup page component with comprehensive form validation
 * Features: Multi-field form, password strength validation, responsive design
 */
export default function SignupPage() {
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nickname: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Theme-aware color values
  const textColor = useColorModeValue('gray.800', 'white');
  const inputBg = useColorModeValue('white', 'gray.800');
  const logoSrc = '/logos/Paradise Pay_Yellow.png';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission with validation and API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password strength validation
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(formData);
      alert('Account created successfully! Please log in.');
      
      // Redirect to login page after successful signup
      window.location.href = '/auth/login';
    } catch (error: any) {
      alert(error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="#2f89ff"
      position="relative"
      overflow="hidden"
    >
      {/* Enhanced Background Effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="linear-gradient(135deg, rgba(47, 137, 255, 0.1) 0%, rgba(47, 137, 255, 0.3) 100%)"
        backdropFilter="blur(10px)"
        pointerEvents="none"
      />
      
      {/* Main Container */}
      <Container maxW="lg" py={12} position="relative" zIndex={1}>
        <VStack gap={8}>
          {/* Clean Header - Logo Far Left, Theme Switcher Far Right */}
          <Flex justify="space-between" w="full" align="center" mb={8} px={4}>
            <Box>
              <Link href="/">
                <Image
                  src={logoSrc}
                  alt="Paradise Pay"
                  h="40px"
                  objectFit="contain"
                  cursor="pointer"
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s"
                />
              </Link>
            </Box>
            <Box>
              <ColorModeButton />
            </Box>
          </Flex>

          {/* Signup Form Card with Beautiful Borders */}
          <Box
            bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)')}
            p={8}
            rounded="2xl"
            shadow="2xl"
            w="full"
            maxW="sm"
            position="relative"
            backdropFilter="blur(20px)"
            border="2px"
            borderColor={useColorModeValue('rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)')}
            _hover={{
              shadow: '3xl',
              transform: 'translateY(-4px)',
              bg: useColorModeValue('rgba(255, 255, 255, 0.98)', 'rgba(26, 32, 44, 0.98)'),
              borderColor: useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)'),
            }}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <VStack gap={6} align="stretch">
              {/* Form Title */}
              <Box textAlign="center">
                <Heading 
                  fontSize="xl" 
                  fontWeight="bold" 
                  color={textColor}
                  mb={2}
                >
                  Create your account
                </Heading>
              </Box>

              {/* Signup Form */}
              <form onSubmit={handleSubmit}>
                <VStack gap={4}>
                  {/* Full Name Field */}
                  <Field.Root>
                    <Field.Label 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      color={textColor}
                      mb={2}
                    >
                      Full Name
                    </Field.Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      bg={inputBg}
                      borderColor="#2f89ff"
                      borderWidth="1px"
                      h="44px"
                      fontSize="sm"
                      rounded="lg"
                      _focus={{
                        borderColor: '#2f89ff',
                        boxShadow: '0 0 0 3px rgba(47, 137, 255, 0.1)',
                      }}
                      color={textColor}
                      _placeholder={{
                        color: useColorModeValue('gray.400', 'gray.500'),
                        fontSize: 'sm',
                      }}
                      required
                    />
                  </Field.Root>

                  {/* Email Field */}
                  <Field.Root>
                    <Field.Label 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      color={textColor}
                      mb={2}
                    >
                      Email
                    </Field.Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      bg={inputBg}
                      borderColor="#2f89ff"
                      borderWidth="1px"
                      h="44px"
                      fontSize="sm"
                      rounded="lg"
                      _focus={{
                        borderColor: '#2f89ff',
                        boxShadow: '0 0 0 3px rgba(47, 137, 255, 0.1)',
                      }}
                      color={textColor}
                      _placeholder={{
                        color: useColorModeValue('gray.400', 'gray.500'),
                        fontSize: 'sm',
                      }}
                      required
                    />
                  </Field.Root>

                  {/* Phone Field */}
                  <Field.Root>
                    <Field.Label 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      color={textColor}
                      mb={2}
                    >
                      Phone Number
                    </Field.Label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="1234567890"
                      bg={inputBg}
                      borderColor="#2f89ff"
                      borderWidth="1px"
                      h="44px"
                      fontSize="sm"
                      rounded="lg"
                      _focus={{
                        borderColor: '#2f89ff',
                        boxShadow: '0 0 0 3px rgba(47, 137, 255, 0.1)',
                      }}
                      color={textColor}
                      _placeholder={{
                        color: useColorModeValue('gray.400', 'gray.500'),
                        fontSize: 'sm',
                      }}
                      required
                    />
                  </Field.Root>

                  {/* Nickname Field */}
                  <Field.Root>
                    <Field.Label 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      color={textColor}
                      mb={2}
                    >
                      Nickname
                    </Field.Label>
                    <Input
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      bg={inputBg}
                      borderColor="#2f89ff"
                      borderWidth="1px"
                      h="44px"
                      fontSize="sm"
                      rounded="lg"
                      _focus={{
                        borderColor: '#2f89ff',
                        boxShadow: '0 0 0 3px rgba(47, 137, 255, 0.1)',
                      }}
                      color={textColor}
                      _placeholder={{
                        color: useColorModeValue('gray.400', 'gray.500'),
                        fontSize: 'sm',
                      }}
                      required
                    />
                  </Field.Root>

                  {/* Password Field */}
                  <Field.Root>
                    <Field.Label 
                      fontSize="sm" 
                      fontWeight="semibold" 
                      color={textColor}
                      mb={2}
                    >
                      Password
                    </Field.Label>
                    <Box position="relative">
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="StrongPass123"
                        bg={inputBg}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        borderWidth="1px"
                        h="44px"
                        fontSize="sm"
                        rounded="lg"
                        _focus={{
                          borderColor: '#2f89ff',
                          boxShadow: '0 0 0 3px rgba(47, 137, 255, 0.1)',
                        }}
                        _placeholder={{
                          color: 'gray.400',
                          fontSize: 'sm',
                        }}
                        required
                        pr="50px"
                      />
                      <IconButton
                        position="absolute"
                        right="2"
                        top="50%"
                        transform="translateY(-50%)"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        color="gray.500"
                        _hover={{ bg: 'gray.100' }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </IconButton>
                    </Box>
                  </Field.Root>

                  {/* Signup Button */}
                  <Button
                    type="submit"
                    w="full"
                    bg="#ffc03a"
                    color="white"
                    h="44px"
                    fontSize="sm"
                    fontWeight="semibold"
                    rounded="lg"
                    _hover={{
                      bg: '#e6ac00',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(255, 192, 58, 0.4)',
                    }}
                    _active={{
                      bg: '#cc9900',
                      transform: 'translateY(0)',
                    }}
                    loading={isLoading}
                    loadingText="Creating Account..."
                    transition="all 0.3s ease"
                    mt={2}
                  >
                    Create Account
                  </Button>
                </VStack>
              </form>

              {/* Login Link */}
              <Box textAlign="center" pt={2}>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  Already Have An Account?{' '}
                  <ChakraLink 
                    as={Link} 
                    href="/auth/login" 
                    color="#ffc03a" 
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline', color: '#e6ac00' }}
                  >
                    Sign In
                  </ChakraLink>
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}