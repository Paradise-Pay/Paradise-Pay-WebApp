"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { getEventById, updateEvent, createTicketType } from "@/lib/api";

// --- Types ---
interface BackendEvent {
  title: string;
  description: string;
  venue_name: string;
  venue_address: string;
  city: string;
  state: string;
  country: string;
  event_date: string;
  event_end_date: string;
  max_attendees: number;
  ticket_price: string | number;
  event_image_url: string;
  event_banner_url?: string;
  status: string;
  tags: string[] | string;
}

// Data shape for listing existing tickets
interface TicketType {
  id: string;
  name: string;
  price: number;
  available_quantity: number;
  sales_start_date?: string;
  sales_end_date?: string;
}

const eventSchema = yup.object({
  title: yup.string().required("Event title is required").min(3),
  description: yup.string().required("Description is required").min(20),
  venueName: yup.string().required("Venue name is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  capacity: yup.number().required("Capacity is required").positive(),
  price: yup.number().required("Price is required").min(0),
  isFree: yup.boolean().required(),
  imageUrl: yup.string().url("Must be a valid URL").required("Image URL is required"),
  status: yup.string().oneOf(["draft", "published", "cancelled", "completed"]).required(),
  tags: yup.string().default(""),
});

type EventFormData = yup.InferType<typeof eventSchema>;

const STEPS = ["Basic Info", "Location", "Tickets & Pricing", "Review"];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Ticket State
  const [existingTickets, setExistingTickets] = useState<TicketType[]>([]);
  const [newTicket, setNewTicket] = useState({
    name: "",
    description: "",
    price: 0,
    available_quantity: 100,
    max_per_user: 5,
    sales_start_date: "",
    sales_end_date: ""
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      isFree: false,
      price: 0,
      status: "published",
      tags: "",
    },
  });

  const isFree = watch("isFree");

  // 1. Fetch Event AND Ticket Data
  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        // A. Fetch Event Details
        const eventResponse = await getEventById(eventId);
        const rawData = (eventResponse as any).data || eventResponse;
        const data = rawData as BackendEvent;

        reset({
          title: data.title,
          description: data.description,
          venueName: data.venue_name,
          address: data.venue_address,
          city: data.city,
          state: data.state,
          country: data.country,
          startDate: new Date(data.event_date).toISOString().slice(0, 16),
          endDate: data.event_end_date
            ? new Date(data.event_end_date).toISOString().slice(0, 16)
            : "",
          capacity: data.max_attendees,
          price: parseFloat(String(data.ticket_price || 0)),
          isFree: parseFloat(String(data.ticket_price || 0)) === 0,
          imageUrl: data.event_image_url || data.event_banner_url || "",
          status: (data.status as "draft" | "published" | "cancelled" | "completed") || "published",
          tags: Array.isArray(data.tags)
            ? data.tags.join(", ")
            : typeof data.tags === "string"
            ? data.tags
            : "",
        });

        // B. Fetch Ticket Types
        try {
          const ticketRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/ticket-types`,
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            }
          );
          if (ticketRes.ok) {
            const ticketData = await ticketRes.json();
            setExistingTickets(
              Array.isArray(ticketData) ? ticketData : ticketData.data || []
            );
          }
        } catch (e) {
          console.warn("Failed to fetch tickets", e);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, reset]);

  // --- Handlers ---

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveStep((prev) => prev - 1);
  };

  const handleAddTicket = async () => {
    if (!eventId) return;

    if (!newTicket.name || newTicket.available_quantity <= 0) {
      toast.warning("Please fill in Name and Quantity");
      return;
    }

    try {
      const eventStart = getValues("startDate");
      const eventEnd = getValues("endDate");

      const res = await createTicketType(eventId, {
        name: newTicket.name,
        description: newTicket.description,
        price: newTicket.price,
        currency: "GHS",
        available_quantity: newTicket.available_quantity,
        max_per_user: newTicket.max_per_user,
        // Use manual dates if provided, otherwise default to event dates
        sales_start_date: newTicket.sales_start_date 
            ? new Date(newTicket.sales_start_date).toISOString().slice(0, 16)
            : (eventStart ? new Date(eventStart).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)),
        sales_end_date: newTicket.sales_end_date 
            ? new Date(newTicket.sales_end_date).toISOString().slice(0, 16)
            : (eventEnd ? new Date(eventEnd).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)),
      });

      toast.success("Ticket Type added!");

      const addedTicket = (res as any).data || res;
      setExistingTickets((prev) => [...prev, addedTicket]);

      // Reset form
      setNewTicket({
        name: "",
        description: "",
        price: 0,
        available_quantity: 100,
        max_per_user: 5,
        sales_start_date: "",
        sales_end_date: ""
      });
    } catch (error) {
      console.error(error);
      toast.error("Error creating ticket type");
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!eventId) return;
    try {
      setSubmitting(true);
      const updatePayload = {
        title: data.title,
        description: data.description,
        venue_name: data.venueName,
        venue_address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        event_date: new Date(data.startDate).toISOString().slice(0, 19).replace("T", " "),
        event_end_date: new Date(data.endDate).toISOString().slice(0, 19).replace("T", " "),
        max_attendees: Number(data.capacity),
        ticket_price: data.isFree ? 0 : Number(data.price),
        currency: "GHS",
        event_image_url: data.imageUrl,
        status: data.status,
        tags: data.tags
          ? data.tags.split(",").map((t: string) => t.trim())
          : [],
      };

      await updateEvent(eventId, updatePayload);
      toast.success("Event updated successfully!");
      router.push(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Edit Event: {watch("title")}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 4, mb: 3 }}>
          {/* STEP 1: Basic Info */}
          {activeStep === 0 && (
            <Stack spacing={3}>
               {/* ... (Existing code) ... */}
               <Controller name="title" control={control} render={({ field }) => ( <TextField {...field} label="Event Title" fullWidth error={!!errors.title} helperText={errors.title?.message} /> )} />
               <Controller name="description" control={control} render={({ field }) => ( <TextField {...field} label="Description" fullWidth multiline rows={4} error={!!errors.description} helperText={errors.description?.message} /> )} />
               <Controller name="imageUrl" control={control} render={({ field }) => ( <TextField {...field} label="Cover Image URL" fullWidth error={!!errors.imageUrl} helperText={errors.imageUrl?.message} /> )} />
               <Controller name="tags" control={control} render={({ field }) => ( <TextField {...field} label="Tags (comma separated)" fullWidth /> )} />
            </Stack>
          )}

          {/* STEP 2: Location & Time */}
          {activeStep === 1 && (
            <Stack spacing={3}>
               {/* ... (Existing code) ... */}
               <Controller name="venueName" control={control} render={({ field }) => ( <TextField {...field} label="Venue Name" fullWidth error={!!errors.venueName} helperText={errors.venueName?.message} /> )} />
               <Controller name="address" control={control} render={({ field }) => ( <TextField {...field} label="Address" fullWidth error={!!errors.address} helperText={errors.address?.message} /> )} />
               <Grid container spacing={2}>
                 <Grid item xs={6}> <Controller name="city" control={control} render={({ field }) => ( <TextField {...field} label="City" fullWidth error={!!errors.city} helperText={errors.city?.message} /> )} /> </Grid>
                 <Grid item xs={6}> <Controller name="country" control={control} render={({ field }) => ( <TextField {...field} label="Country" fullWidth error={!!errors.country} helperText={errors.country?.message} /> )} /> </Grid>
               </Grid>
               <Grid container spacing={2}>
                 <Grid item xs={6}> <Controller name="startDate" control={control} render={({ field }) => ( <TextField {...field} type="datetime-local" label="Start Date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.startDate} helperText={errors.startDate?.message} /> )} /> </Grid>
                 <Grid item xs={6}> <Controller name="endDate" control={control} render={({ field }) => ( <TextField {...field} type="datetime-local" label="End Date" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.endDate} helperText={errors.endDate?.message} /> )} /> </Grid>
               </Grid>
            </Stack>
          )}

          {/* STEP 3: Tickets & Status */}
          {activeStep === 2 && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6">Status & Capacity</Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}> <Controller name="capacity" control={control} render={({ field }) => ( <TextField {...field} type="number" label="Max Attendees" fullWidth error={!!errors.capacity} helperText={errors.capacity?.message} /> )} /> </Grid>
                  <Grid item xs={6}> <Controller name="status" control={control} render={({ field }) => ( <TextField {...field} select label="Event Status" fullWidth> {["draft", "published", "cancelled", "completed"].map( (status) => ( <MenuItem key={status} value={status}> {status.charAt(0).toUpperCase() + status.slice(1)} </MenuItem> ) )} </TextField> )} /> </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* TICKET MANAGEMENT SECTION */}
              <Box>
                <Typography variant="h6" gutterBottom>Ticket Management</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Add new ticket types here. Existing tickets cannot be modified directly (delete and recreate if needed).
                </Typography>

                {/* Add New Ticket Form */}
                <Card variant="outlined" sx={{ mb: 3, bgcolor: "background.default" }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>Add New Ticket Type</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField label="Name" fullWidth size="small" value={newTicket.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({ ...newTicket, name: e.target.value }) } />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField label="Price" type="number" fullWidth size="small" value={newTicket.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({ ...newTicket, price: Number(e.target.value), }) } InputProps={{ startAdornment: ( <Box component="span" mr={1}> GHS </Box> ), }} />
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <TextField label="Quantity" type="number" fullWidth size="small" value={newTicket.available_quantity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({ ...newTicket, available_quantity: Number(e.target.value), }) } />
                      </Grid>

                      {/* NEW: Date Fields */}
                      <Grid item xs={12} sm={6}>
                          <TextField 
                            label="Sales Start (Optional)" 
                            type="datetime-local" 
                            fullWidth size="small" 
                            InputLabelProps={{ shrink: true }}
                            value={newTicket.sales_start_date} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({...newTicket, sales_start_date: e.target.value})}
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField 
                            label="Sales End (Optional)" 
                            type="datetime-local" 
                            fullWidth size="small" 
                            InputLabelProps={{ shrink: true }}
                            value={newTicket.sales_end_date} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTicket({...newTicket, sales_end_date: e.target.value})}
                          />
                      </Grid>

                      <Grid item xs={12}>
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddTicket} fullWidth>
                          Add Ticket
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Existing Tickets List */}
                {existingTickets.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                          <TableCell>Ticket Name</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Total Qty</TableCell>
                          <TableCell>Sales Dates</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {existingTickets.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell>{t.name}</TableCell>
                            <TableCell>GHS {t.price}</TableCell>
                            <TableCell>{t.available_quantity}</TableCell>
                            <TableCell sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                {t.sales_start_date ? new Date(t.sales_start_date).toLocaleDateString() : '-'} 
                                {' - '} 
                                {t.sales_end_date ? new Date(t.sales_end_date).toLocaleDateString() : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    No ticket types found for this event.
                  </Alert>
                )}
              </Box>
            </Stack>
          )}

          {/* STEP 4: Review */}
          {activeStep === 3 && (
            <Alert severity="info">
              Review your changes above. Click "Update Event" to save general event details.
            </Alert>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="outlined" onClick={handleBack} disabled={activeStep === 0} type="button">
              Back
            </Button>
            {activeStep === STEPS.length - 1 ? (
              <Button variant="contained" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Update Event"}
              </Button>
            ) : (
              <Button variant="contained" onClick={(e: React.MouseEvent) => handleNext(e)} type="button">
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </form>
    </Container>
  );
}