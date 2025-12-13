'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Skeleton,
  Alert,
  Chip,
  Grid,
  Divider,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { Order } from '@/types/domain/order';
import { format } from 'date-fns';

interface OrderDetailResponse {
  success: boolean;
  data: Order;
  message: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
          {
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data: OrderDetailResponse = await response.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={600} />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Order not found'}</Alert>
      </Container>
    );
  }

  const getStatusColor = (status: string): any => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
            Order {order.orderNumber}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Placed on {format(new Date(order.createdAt), 'PPP')}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
          />
          <Chip
            label={order.paymentStatus}
            color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
          />
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Order Items */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Items
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'background.default' }}>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.ticketType}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {order.currency} {item.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        {order.currency} {item.totalPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Event Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Event Information
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Event Name
                </Typography>
                <Typography variant="body2">
                  {order.event.title}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Event Date
                </Typography>
                <Typography variant="body2">
                  {format(new Date(order.event.startDate), 'PPP p')}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body2">
                  {order.event.location}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Billing Address */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Billing Address
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2">
                {order.billingAddress.firstName} {order.billingAddress.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.billingAddress.address}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.billingAddress.city}, {order.billingAddress.state}{' '}
                {order.billingAddress.postalCode}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.billingAddress.country}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.billingAddress.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.billingAddress.phone}
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Order Summary */}
          <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Order Summary
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">
                    {order.currency} {order.subtotal.toFixed(2)}
                  </Typography>
                </Box>

                {order.tax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">
                      {order.currency} {order.tax.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                {order.fee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Service Fee</Typography>
                    <Typography variant="body2">
                      {order.currency} {order.fee.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                {order.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                      -{order.currency} {order.discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    {order.currency} {order.total.toFixed(2)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body2">
                    {order.paymentMethod}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Payment Status
                  </Typography>
                  <Chip
                    label={order.paymentStatus}
                    color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Stack>

              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<ReceiptIcon />}
                >
                  View Invoice
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<DownloadIcon />}
                >
                  Download Receipt
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
