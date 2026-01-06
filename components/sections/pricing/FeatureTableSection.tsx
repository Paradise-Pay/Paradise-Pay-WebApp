'use client';

import { 
  Box, 
  Container, 
  Table, 
  Circle
} from '@chakra-ui/react';
import { featureList } from '@/public/data/FeatureData';

// Custom Check Icon
const CheckCircle = () => (
  <Circle size="24px" bg="white" color="black">
    <svg 
      width="14px" 
      height="14px" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      style={{ display: 'block' }} 
    >
      <path
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
      />
    </svg>
  </Circle>
);

export default function FeatureTableSection() {
  return (
    <Box bg="black" minH="50vh" py={16} px={4}>
      <Container maxW="6xl">
        <Box overflowX="auto">
          <Table.Root variant="outline" size="lg" interactive={false}>
            <Table.Header>
              <Table.Row bg={"black"} borderBottom="1px solid" borderColor="gray.700">
                <Table.ColumnHeader 
                  color="white" 
                  fontSize="2xl" 
                  textTransform="none" 
                  py={6}
                  width="40%"
                  border="none" 
                >
                  Features
                </Table.ColumnHeader>

                <Table.ColumnHeader color="white" fontSize="2xl" textTransform="none" textAlign="center" py={6} border="none">
                  Free
                </Table.ColumnHeader>
                <Table.ColumnHeader color="white" fontSize="2xl" textTransform="none" textAlign="center" py={6} border="none">
                  Paradise +
                </Table.ColumnHeader>
                <Table.ColumnHeader color="white" fontSize="2xl" textTransform="none" textAlign="center" py={6} border="none">
                  Paradise X
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {featureList.map((row, index) => (
                <Table.Row key={index} _hover={{ bg: 'whiteAlpha.50' }}>
                  <Table.Cell 
                    color="white" 
                    fontSize="lg" 
                    fontWeight="medium" 
                    py={5}
                    borderBottom="1px solid" 
                    borderColor="whiteAlpha.100"
                  >
                    {row.label}
                  </Table.Cell>

                  <Table.Cell textAlign="center" py={5} borderBottom="1px solid" borderColor="whiteAlpha.100">
                    <Box display="flex" justifyContent="center">
                      {row.free && <CheckCircle />}
                    </Box>
                  </Table.Cell>

                  <Table.Cell textAlign="center" py={5} borderBottom="1px solid" borderColor="whiteAlpha.100">
                     <Box display="flex" justifyContent="center">
                      {row.plus && <CheckCircle />}
                    </Box>
                  </Table.Cell>

                  <Table.Cell textAlign="center" py={5} borderBottom="1px solid" borderColor="whiteAlpha.100">
                     <Box display="flex" justifyContent="center">
                      {row.x && <CheckCircle />}
                    </Box>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Container>
    </Box>
  );
}