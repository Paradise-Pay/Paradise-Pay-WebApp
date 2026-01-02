'use client';

import { useState } from 'react';
import {
  Box, Table, Badge, Button, IconButton, Heading, Text, Flex, 
  Select, SimpleGrid, Card, Stat, HStack, Stack, Separator, Icon, createListCollection, Menu
} from '@chakra-ui/react';
import { Toaster, toaster } from '@/components/ui/toaster';
import { 
  BsDownload, BsFileEarmarkPdf, BsFileEarmarkExcel, BsFileEarmarkSpreadsheet,
  BsGraphUp, BsPeople, BsExclamationTriangle, BsLightningCharge, BsCreditCard
} from 'react-icons/bs';
import { 
  mockAlerts, salesTrendData, demographicsData, tableData, ChartDataPoint 
} from '@/public/data/ReportsData';

// --- VISUAL COMPONENT: SIMPLE CSS BAR CHART ---
// Creates a visual graph using Flexbox and percentages
const SimpleBarChart = ({ data, color }: { data: ChartDataPoint[], color: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Flex align="flex-end" justify="space-between" height="200px" width="100%" pt={4}>
      {data.map((point, i) => (
        <Stack key={i} align="center" gap={2} flex={1}>
          <Box 
            width="30px" 
            bg={`${color}.500`} 
            borderRadius="sm"
            height={`${(point.value / maxValue) * 100}%`}
            _hover={{ bg: `${color}.400`, transform: 'scaleY(1.05)' }}
            transition="all 0.2s"
          />
          <Text fontSize="xs" color="gray.500">{point.label}</Text>
        </Stack>
      ))}
    </Flex>
  );
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState('Sales');
  const [dateRange, setDateRange] = useState('Last 7 Days');

  // --- ACTIONS ---
  const handleExport = (format: string) => {
    toaster.create({ 
      title: `Exporting ${reportType} Report`, 
      description: `Downloading as ${format}...`,
      type: 'info' 
    });
  };

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      
      {/* 1. Header & Controls */}
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Box>
          <Heading size="lg">Reports & Analytics</Heading>
          <Text color="gray.600">Deep dive into performance, demographics, and system health.</Text>
        </Box>
        
        <HStack>
          <Select.Root 
            collection={createListCollection({ items: [{label:'Last 7 Days', value:'7d'}, {label:'Last 30 Days', value:'30d'}, {label:'This Year', value:'1y'}] })}
            width="150px"
            value={[dateRange]}
            onValueChange={(e) => setDateRange(e.value[0])}
          >
            <Select.Trigger>
              <Select.ValueText placeholder="Date Range" />
            </Select.Trigger>
          </Select.Root>

          <Menu.Root>
            <Menu.Trigger asChild>
              <Button colorPalette="blue" variant="solid">
                <BsDownload style={{ marginRight: '8px' }} /> Export Data
              </Button>
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item value="pdf" onClick={() => handleExport('PDF')}>
                <BsFileEarmarkPdf style={{ marginRight: '8px' }} /> Export as PDF
              </Menu.Item>
              <Menu.Item value="excel" onClick={() => handleExport('Excel')}>
                <BsFileEarmarkExcel style={{ marginRight: '8px' }} /> Export as Excel
              </Menu.Item>
              <Menu.Item value="csv" onClick={() => handleExport('CSV')}>
                <BsFileEarmarkSpreadsheet style={{ marginRight: '8px' }} /> Export as CSV
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </HStack>
      </Flex>

      {/* 2. REAL-TIME ALERTS ROW */}
      <Box mb={8}>
        <Heading size="sm" mb={3} display="flex" alignItems="center">
          <BsLightningCharge color="#D69E2E" style={{ marginRight: '8px' }} /> Live System Alerts
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {mockAlerts.map((alert) => (
            <Card.Root key={alert.id} borderLeft="4px solid" borderColor={alert.severity === 'High' ? 'red.500' : 'orange.400'}>
              <Card.Body py={3}>
                <Flex align="start" gap={3}>
                  <Box mt={1}>
                    {alert.type === 'Payment' && <BsCreditCard color="red" />}
                    {alert.type === 'Traffic' && <BsGraphUp color="orange" />}
                    {alert.type === 'Fraud' && <BsExclamationTriangle color="red" />}
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">{alert.type} Alert</Text>
                    <Text fontSize="sm" lineHeight="short">{alert.message}</Text>
                    <Text fontSize="xs" color="gray.400" mt={1}>{alert.timestamp}</Text>
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>

      {/* 3. VISUALIZATION GRID */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6} mb={8}>
        
        {/* Main Chart: Sales Trends */}
        <Card.Root gridColumn={{ lg: "span 2" }}>
          <Card.Header>
            <Flex justify="space-between">
              <Box>
                <Heading size="md">Ticket Sales Trends</Heading>
                <Text fontSize="sm" color="gray.500">Daily sales volume over selected period</Text>
              </Box>
              <Badge colorPalette="green" variant="surface">+12.5% Growth</Badge>
            </Flex>
          </Card.Header>
          <Card.Body>
             <SimpleBarChart data={salesTrendData} color="blue" />
          </Card.Body>
        </Card.Root>

        {/* Side Chart: Demographics or Revenue Mix */}
        <Card.Root>
          <Card.Header>
            <Heading size="md">User Demographics</Heading>
            <Text fontSize="sm" color="gray.500">Age distribution of active buyers</Text>
          </Card.Header>
          <Card.Body>
            {/* Simple Stacked visual for demographics */}
            <Stack gap={4} mt={4}>
              {demographicsData.map((d, i) => (
                <Box key={i}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm" fontWeight="medium">{d.label}</Text>
                    <Text fontSize="sm">{d.value}%</Text>
                  </Flex>
                  <Box w="100%" h="8px" bg="gray.100" borderRadius="full">
                    <Box h="100%" w={`${d.value}%`} bg="purple.500" borderRadius="full" />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>

      {/* 4. DETAILED DATA REPORT */}
      <Card.Root>
        <Card.Header>
          <Flex justify="space-between" align="center">
             <Heading size="md">Detailed Performance Report</Heading>
             <Select.Root 
                collection={createListCollection({ items: [{label:'Sales by Event', value:'Sales'}, {label:'Revenue by Organizer', value:'Revenue'}] })}                width="200px" size="sm" value={[reportType]} onValueChange={(e) => setReportType(e.value[0])}
             >
                <Select.Trigger>
                  <Select.ValueText placeholder="Report Type" />
                </Select.Trigger>
             </Select.Root>
          </Flex>
        </Card.Header>
        <Card.Body p={0}>
          <Table.Root >
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader>Event Name</Table.ColumnHeader>
                <Table.ColumnHeader>Organizer</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Total Revenue</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Tickets Sold</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Conversion Rate</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableData.map((row, index) => (
                <Table.Row key={index} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium">{row.event}</Table.Cell>
                  <Table.Cell color="gray.600">{row.organizer}</Table.Cell>
                  <Table.Cell textAlign="right" fontWeight="bold">GH₵ {row.revenue.toLocaleString()}</Table.Cell>
                  <Table.Cell textAlign="right">{row.tickets.toLocaleString()}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <Badge colorPalette={parseFloat(row.conversion) > 4 ? 'green' : 'gray'}>
                      {row.conversion}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card.Body>
        <Card.Footer borderTop="1px solid" borderColor="gray.100" py={2}>
           <Flex justify="center" width="100%">
             <Button variant="ghost" size="sm">View All Rows</Button>
           </Flex>
        </Card.Footer>
      </Card.Root>

    </Box>
  );
}