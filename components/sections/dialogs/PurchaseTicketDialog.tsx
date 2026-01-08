"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Box,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SelectChangeEvent } from "@mui/material/Select";
import { getTicketTypes, purchaseTickets } from "@/lib/api";
import type { TicketTypeResponse } from "@/types/domain/ticket";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

const STEPS = ["Select Tickets", "Attendee Details", "Review & Pay"];

export default function PurchaseTicketDialog({
  open,
  onClose,
  eventId,
  eventTitle,
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeResponse[]>([]);

  // Form State
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [attendees, setAttendees] = useState<{ name: string; email: string; phone: string }[]>([]);

  useEffect(() => {
    if (open && eventId) {
      loadTicketTypes();
      setActiveStep(0);
      setQuantity(1);
      setAttendees([{ name: "", email: "", phone: "" }]);
    }
  }, [open, eventId]);

  useEffect(() => {
    setAttendees((prev) => {
      const newAttendees = [...prev];
      if (quantity > prev.length) {
        for (let i = prev.length; i < quantity; i++) {
          newAttendees.push({ name: "", email: "", phone: "" });
        }
      }
      return newAttendees.slice(0, quantity);
    });
  }, [quantity]);

  const loadTicketTypes = async () => {
    setLoading(true);
    try {
      const response = await getTicketTypes(eventId);
      const types = Array.isArray(response) ? response : (response as any).data || [];
      const activeTypes = types.filter((t: TicketTypeResponse) => t.is_active !== false);

      if (activeTypes.length > 0) {
        setTicketTypes(activeTypes);
        setSelectedTicketId(String(activeTypes[0].ticket_type_id));
        setQuantity(1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ticket options");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendeeChange = (index: number, field: string, value: string) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], [field]: value };
    setAttendees(updated);
  };

  const handleNext = async () => {
    if (activeStep === 1) {
      const isValid = attendees.every((a) => a.name.trim() && a.email.trim() && a.phone.trim());
      if (!isValid) {
        toast.warning("Please fill in all attendee details (Name, Email, Phone)");
        return;
      }
    }

    if (activeStep === STEPS.length - 1) {
      await handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const paymentRef = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      await purchaseTickets({
        event_id: eventId,
        ticket_type_id: selectedTicketId,
        quantity: quantity,
        attendee_details: attendees.map(a => ({
            name: a.name,
            email: a.email,
            phone: a.phone,
            seat_number: "General" 
        })),
        payment_method: "mobile_money", 
        payment_reference: paymentRef,
        notes: "Web purchase"
      });

      toast.success("Booking confirmed! Please check your email.");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedType = ticketTypes.find(
    (t) => String(t.ticket_type_id) === String(selectedTicketId)
  );
  
  const total = (Number(selectedType?.price) || 0) * quantity;

  // Calculate Remaining
  const remainingTickets = selectedType 
    ? (selectedType.available_quantity - (selectedType.sold_quantity || 0)) 
    : 0;

  const maxQty = selectedType 
    ? Math.min(selectedType.max_per_user || 10, remainingTickets)
    : 10;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Get Tickets
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4, display: { xs: "none", sm: "flex" } }}>
          {STEPS.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {/* STEP 1: Select Tickets (Unchanged logic, just keeping it consistent) */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h5" align="center" fontWeight="bold" mb={3}>{eventTitle}</Typography>
            {loading && ticketTypes.length === 0 ? (
              <Box display="flex" justifyContent="center" p={3}><CircularProgress size={24} /></Box>
            ) : (
              <Stack spacing={3} width="100%" mb={3}>
                {ticketTypes.length > 0 ? (
                  <TextField
                    select fullWidth label="Select Ticket Category" value={selectedTicketId}
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{
                      displayEmpty: true,
                      renderValue: (selected: any) => {
                        if (!selected) return "Select Ticket Category";
                        const type = ticketTypes.find((t) => String(t.ticket_type_id) === String(selected));
                        return type ? type.name : "Select Ticket Category";
                      },
                    }}
                    onChange={(e: SelectChangeEvent) => {
                      setSelectedTicketId(e.target.value);
                      setQuantity(1);
                    }}
                  >
                    {ticketTypes.map((type) => {
                      const left = type.available_quantity - (type.sold_quantity || 0);
                      return (
                        <MenuItem key={type.ticket_type_id} value={String(type.ticket_type_id)} disabled={left <= 0}>
                          <Box display="flex" justifyContent="space-between" width="100%">
                            <span>{type.name}</span>
                            <span>{Number(type.price) === 0 ? "Free" : `GHS ${Number(type.price).toFixed(2)}`}</span>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </TextField>
                ) : (
                  <Alert severity="warning">No tickets available.</Alert>
                )}

                {selectedType && (
                  <>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box flex={1}>
                        <Alert severity={remainingTickets > 10 ? "info" : "warning"} icon={false} sx={{ py: 0, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {remainingTickets} left
                        </Alert>
                      </Box>
                      <Box flex={1}>
                        <TextField
                          type="number" fullWidth label="Quantity"
                          InputProps={{ inputProps: { min: 1, max: maxQty } }}
                          value={quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setQuantity(val);
                          }}
                        />
                      </Box>
                    </Stack>
                    <Box bgcolor="action.hover" p={2} borderRadius={1} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1">Total Amount:</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">GHS {total.toFixed(2)}</Typography>
                    </Box>
                  </>
                )}
              </Stack>
            )}
          </Box>
        )}

        {/* STEP 2: Attendee Details - UPDATED with Phone */}
        {activeStep === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>Enter details for {quantity} attendee(s).</Alert>
            <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
              {attendees.map((attendee, index) => (
                <Box key={index} mb={3} borderBottom={1} borderColor="divider" pb={2}>
                  <Typography variant="subtitle2" gutterBottom color="primary">Attendee #{index + 1}</Typography>
                  <Stack spacing={2}>
                      <TextField 
                        fullWidth size="small" required label="Full Name" 
                        value={attendee.name} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAttendeeChange(index, "name", e.target.value)} 
                      />
                      <TextField 
                        fullWidth size="small" required type="email" label="Email Address" 
                        value={attendee.email} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAttendeeChange(index, "email", e.target.value)} 
                      />
                      <TextField 
                        fullWidth size="small" required type="tel" label="Phone Number" 
                        placeholder="+233..."
                        value={attendee.phone} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAttendeeChange(index, "phone", e.target.value)} 
                      />
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* STEP 3: Review & Pay (Unchanged logic) */}
        {activeStep === 2 && selectedType && (
          <Box>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Ticket Type:</Typography>
                  <Typography fontWeight="medium">{selectedType.name}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Quantity:</Typography>
                  <Typography fontWeight="medium">{quantity}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Price per ticket:</Typography>
                  <Typography fontWeight="medium">GHS {selectedType.price}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total To Pay:</Typography>
                  <Typography variant="h6" color="primary">GHS {total.toFixed(2)}</Typography>
                </Box>
              </Stack>
            </Paper>
            <Alert severity="success">Click below to complete your purchase.</Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={() => activeStep === 0 ? onClose() : setActiveStep((prev) => prev - 1)}>
          {activeStep === 0 ? "Cancel" : "Back"}
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={loading || ticketTypes.length === 0} size="large">
          {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === STEPS.length - 1 ? "Complete Purchase" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}