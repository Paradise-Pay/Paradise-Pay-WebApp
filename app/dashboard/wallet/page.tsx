'use client';

import { useState, useEffect } from 'react';
import { 
  AccountBalanceWallet,
  Delete as DeleteIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  Menu,
  MenuItem, 
  Skeleton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccountBalanceWallet as WalletIcon,
  Add as AddIcon,
  ArrowUpward as SendIcon,
  
  SwapHoriz as TransferIcon,
  Receipt as ReceiptIcon,
  MoreVert as MoreVertIcon,
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  CreditCard as CreditCardIcon,
  PhoneAndroid as PhoneIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'payout';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

interface PaymentMethod {
  id: string;
  type: 'bank' | 'momo' | 'card' | 'paypal' | 'crypto';
  last4?: string;
  bankName?: string;
  cardType?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    type: 'payment',
    amount: -49.99,
    date: '2023-06-15T14:30:00',
    description: 'Ticket Purchase - Summer Festival',
    status: 'completed',
    reference: 'EVT-2023-001'
  },
  {
    id: 'txn_2',
    type: 'deposit',
    amount: 200.00,
    date: '2023-06-10T09:15:00',
    description: 'Wallet Top-up',
    status: 'completed',
    reference: 'DEP-001'
  },
  {
    id: 'txn_3',
    type: 'withdrawal',
    amount: -150.00,
    date: '2023-06-05T16:45:00',
    description: 'Withdrawal to Bank',
    status: 'completed',
    reference: 'WDL-001'
  },
  {
    id: 'txn_4',
    type: 'refund',
    amount: 29.99,
    date: '2023-05-28T11:20:00',
    description: 'Refund - Cancelled Event',
    status: 'completed',
    reference: 'RFN-001'
  },
  {
    id: 'txn_5',
    type: 'payout',
    amount: 1250.75,
    date: '2023-05-20T10:00:00',
    description: 'Event Earnings - May 2023',
    status: 'completed',
    reference: 'PYT-001'
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    cardType: 'Visa',
    last4: '4242',
    expiryDate: '12/25',
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'bank',
    bankName: 'GTBank',
    last4: '7890',
    isDefault: false
  },
  {
    id: 'pm_3',
    type: 'momo',
    bankName: 'MTN Mobile Money',
    last4: '1234',
    isDefault: false
  },
  {
    id: 'pm_4',
    type: 'paypal',
    isDefault: false
  }
];

const WalletCard = ({ balance, loading }: { balance: number; loading: boolean }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #3f51b5 0%, #1a237e 100%)', color: 'white' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)" gutterBottom>
              Available Balance
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={150} height={60} />
            ) : (
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                GH₵{balance.toFixed(2)}
              </Typography>
            )}
            <Box mt={2} display="flex" gap={2} flexWrap="wrap">
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<AddIcon />}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } 
                }}
              >
                Add Money
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                startIcon={<SendIcon />}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                Send
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                startIcon={<TransferIcon />}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)' 
                  } 
                }}
              >
                Transfer
              </Button>
            </Box>
          </Box>
          <WalletIcon sx={{ fontSize: 64, opacity: 0.2 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const PaymentMethodItem = ({ method, onSetDefault }: { method: PaymentMethod; onSetDefault: (id: string) => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetDefault = () => {
    onSetDefault(method.id);
    handleClose();
  };

  const handleRemove = () => {
    // Implement remove payment method
    console.log('Remove payment method:', method.id);
    handleClose();
  };

  const getMethodIcon = () => {
    switch (method.type) {
      case 'card':
        return <CreditCardIcon />;
      case 'bank':
        return <BankIcon />;
      case 'momo':
        return <PhoneIcon />;  
      case 'paypal':
        return <PaymentIcon />;
      case 'crypto':
        return <AccountBalanceWallet />;
      default:
        return <PaymentIcon />;
    }
  };

  const getMethodLabel = () => {
    switch (method.type) {
      case 'card':
        return `${method.cardType} •••• ${method.last4}`;
      case 'bank':
        return `${method.bankName} •••• ${method.last4}`;
      case 'momo':
        return `${method.bankName} •••• ${method.last4}`;
      case 'paypal':
        return 'PayPal';
      case 'crypto':
        return 'Cryptocurrency Wallet';
      default:
        return 'Payment Method';
    }
  };

  return (
    <ListItem
      secondaryAction={
        <>
          {method.isDefault ? (
            <Chip 
              label="Default" 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
          ) : (
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleSetDefault}
              sx={{ mr: 1 }}
            >
              Set as Default
            </Button>
          )}
          <IconButton
            edge="end"
            aria-label="more"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        </>
      }
      sx={{
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 1, 
        mb: 1,
        bgcolor: 'background.paper'
      }}
    >
      <ListItemIcon>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          {getMethodIcon()}
        </Avatar>
      </ListItemIcon>
      <ListItemText 
        primary={getMethodLabel()} 
        secondary={method.type === 'card' ? `Expires ${method.expiryDate}` : ''}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleSetDefault} disabled={method.isDefault}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Set as Default</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleRemove} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
}

export default function WalletPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(1250.75);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this from your API
        // const [balanceRes, transactionsRes, paymentMethodsRes] = await Promise.all([
        //   fetch('/api/wallet/balance'),
        //   fetch('/api/wallet/transactions'),
        //   fetch('/api/wallet/payment-methods')
        // ]);
        
        // Mock data for demonstration
        setTimeout(() => {
          setTransactions(mockTransactions);
          setPaymentMethods(mockPaymentMethods);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleAddPaymentMethod = () => {
    // Implement add payment method flow
    console.log('Add payment method');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
      case 'payout':
        return <ArrowDownwardIcon color="success" />;
      case 'withdrawal':
      case 'payment':
        return <ArrowUpwardIcon color="error" />;
      default:
        return <ReceiptIcon color="action" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? 'success.main' : 'error.main';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1">
          Wallet
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="outlined" 
            startIcon={<HistoryIcon />}
            onClick={() => setTabValue(1)}
          >
            Transaction History
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddPaymentMethod}
          >
            Add Payment Method
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 1 }} />
      ) : (
        <WalletCard balance={balance} loading={loading} />
      )}

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Payment Methods" />
        <Tab label="Transaction History" />
        <Tab label="Payouts" />
      </Tabs>

      {tabValue === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your payment methods for quick and easy checkouts.
            </Typography>
            
            {loading ? (
              <Box>
                {[1, 2].map((item) => (
                  <Skeleton key={item} variant="rectangular" height={80} sx={{ mb: 1, borderRadius: 1 }} />
                ))}
              </Box>
            ) : paymentMethods.length > 0 ? (
              <List disablePadding>
                {paymentMethods.map((method) => (
                  <PaymentMethodItem 
                    key={method.id} 
                    method={method} 
                    onSetDefault={handleSetDefaultPaymentMethod} 
                  />
                ))}
              </List>
            ) : (
              <Box textAlign="center" py={4}>
                <PaymentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No payment methods found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Add a payment method to make purchases or receive payouts.
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddPaymentMethod}
                  sx={{ mt: 2 }}
                >
                  Add Payment Method
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Transaction History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your wallet transaction history
                </Typography>
              </Box>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<ReceiptIcon />}
              >
                Export as CSV
              </Button>
            </Box>
            
            {loading ? (
              <Box>
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} variant="rectangular" height={70} sx={{ mb: 1, borderRadius: 1 }} />
                ))}
              </Box>
            ) : transactions.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box mr={2}>
                              {getTransactionIcon(transaction.type)}
                            </Box>
                            <Box>
                              <Typography variant="body2">
                                {transaction.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            color={getTransactionColor(transaction.amount)}
                            fontWeight="medium"
                          >
                            GH₵{transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(transaction.date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            size="small"
                            color={transaction.status === 'completed' ? 'success' : 
                                   transaction.status === 'pending' ? 'warning' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.reference}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <ReceiptIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No transactions found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Your transaction history will appear here.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payouts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage your earnings and payment preferences.
            </Typography>
            
            <Box textAlign="center" py={4}>
              <MonetizationOnIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No payouts yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                When you earn money from ticket sales, your payouts will appear here.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<PaymentIcon />}
                sx={{ mt: 1 }}
              >
                Set Up Payout Method
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
