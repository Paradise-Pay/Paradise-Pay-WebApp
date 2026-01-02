'use-client'

import React from "react";
import { Box } from "@chakra-ui/react";
import UsersManagementPage from "./UserManagement";

export default function UserManagementScreen() {
    return (
        <Box w="full" bg="white">
            <UsersManagementPage />
        </Box>
      );
}