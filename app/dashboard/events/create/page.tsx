"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Switch,
  FormControlLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  Divider,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { createTicketType, createEvent, getEventCategories } from "@/lib/api";
import type { TicketTypeDraft } from "@/types/domain/ticket";
import type { EventCategoryResponse } from "@/types/domain/event";

// --- Validation ---
const eventSchema = yup.object({
  title: yup.string().required("Event title is required").min(3),
  venueName: yup.string().required("Venue name is required"),
  imageUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Event image is required"),
  description: yup.string().required("Description is required").min(20),
  shortDescription: yup
    .string()
    .required("Short description is required")
    .min(10),
  tags: yup.string().required("At least one tag is required"),
  type: yup.string().required("Event type is required"),
  startDate: yup.string().required("Start date is required"),
  endDate: yup.string().required("End date is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
  capacity: yup.number().required("Capacity is required").positive(),
  category: yup.string().required("Category is required"),
  isFree: yup.boolean().required(),
  price: yup
    .number()
    .when("isFree", {
      is: false,
      then: (schema) => schema.required("Price is required").min(0),
      otherwise: (schema) => schema.transform(() => 0).default(0),
    })
    .required(),
});

type EventFormData = yup.InferType<typeof eventSchema>;

const STEPS = ["Basic Info", "Location", "Tickets & Pricing", "Review"];
const EVENT_TYPES = ["concert", "conference", "workshop", "meetup", "other"];

export default function CreateEventPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<EventCategoryResponse[]>([]);

  // --- Ticket State ---
  const [tickets, setTickets] = useState<TicketTypeDraft[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [newTicket, setNewTicket] = useState<TicketTypeDraft>({
    name: "",
    description: "",
    price: 0,
    available_quantity: 100,
    max_per_user: 5,
    sales_start_date: "",
    sales_end_date: "",
  });

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      imageUrl: "",
      tags: "",
      venueName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      type: "",
      category: "",
      startDate: "",
      endDate: "",
      capacity: 0,
      isFree: false,
      price: 0,
    },
  });

  const isFree = watch("isFree");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getEventCategories();
        const data = Array.isArray(response)
          ? response
          : (response as any).data || [];
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
        toast.error("Could not load event categories");
      }
    };
    fetchCategories();
  }, []);

  // --- Handlers ---
  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    let isValid = false;
    if (activeStep === 0) {
      isValid = await trigger([
        "title",
        "shortDescription",
        "description",
        "imageUrl",
        "tags", 
        "type",
        "category",
        "startDate",
        "endDate",
      ]);
    } else if (activeStep === 1) {
      isValid = await trigger([
        "venueName",
        "address",
        "city",
        "state",
        "country",
        "postalCode",
      ]);
    } else if (activeStep === 2) {
      isValid = await trigger(["capacity", "price"]);
      if (!isFree && tickets.length === 0) {
        toast.warning("Please add at least one ticket type.");
        return;
      }
      isValid = true;
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveStep((prev) => prev - 1);
  };

  const addOrUpdateTicket = () => {
    if (!newTicket.name || newTicket.available_quantity <= 0) {
      toast.error("Ticket name and quantity are required");
      return;
    }

    const eventStart = getValues("startDate");
    const eventEnd = getValues("endDate");

    const ticketToSave = {
      ...newTicket,
      sales_start_date:
        newTicket.sales_start_date ||
        (eventStart
          ? new Date(eventStart).toISOString()
          : new Date().toISOString()),
      sales_end_date:
        newTicket.sales_end_date ||
        (eventEnd
          ? new Date(eventEnd).toISOString()
          : new Date().toISOString()),
    };

    if (editIndex !== null) {
      const updatedTickets = [...tickets];
      updatedTickets[editIndex] = ticketToSave;
      setTickets(updatedTickets);
      setEditIndex(null);
      toast.info("Ticket updated");
    } else {
      setTickets([...tickets, ticketToSave]);
    }

    setNewTicket({
      name: "",
      description: "",
      price: 0,
      available_quantity: 100,
      max_per_user: 5,
      sales_start_date: "",
      sales_end_date: "",
    });
  };

  const handleEditTicket = (index: number) => {
    setNewTicket(tickets[index]);
    setEditIndex(index);
  };

  const removeTicket = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setNewTicket({
        name: "",
        description: "",
        price: 0,
        available_quantity: 100,
        max_per_user: 5,
        sales_start_date: "",
        sales_end_date: "",
      });
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setLoading(true);

      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

      const eventResponse = await createEvent({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        tags: tagsArray,
      });

      const eventResult = (eventResponse as any).data || eventResponse;
      const eventId = eventResult.id || eventResult.event_id;

      if (tickets.length > 0) {
        await Promise.all(
          tickets.map((ticket) =>
            createTicketType(eventId, {
              name: ticket.name,
              description: ticket.description,
              price: Number(ticket.price),
              currency: "GHS",
              available_quantity: Number(ticket.available_quantity),
              sales_start_date: ticket.sales_start_date,
              sales_end_date: ticket.sales_end_date,
              max_per_user: Number(ticket.max_per_user),
            })
          )
        );
      }

      toast.success("Event and tickets created successfully!");
      router.push(`/dashboard/events/${eventId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Create New Event
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
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Event Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
              <Controller
                name="shortDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Short Description"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.shortDescription}
                    helperText={errors.shortDescription?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cover Image URL"
                    fullWidth
                    error={!!errors.imageUrl}
                    helperText={
                      errors.imageUrl?.message ||
                      "Paste a link to your event poster"
                    }
                  />
                )}
              />
              {/* Tags Input Field */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tags"
                    fullWidth
                    placeholder="Music, Festival, 2024, Outdoor"
                    helperText="Separate tags with commas"
                    error={!!errors.tags}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Event Type"
                      fullWidth
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    >
                      {" "}
                      {EVENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </MenuItem>
                      ))}{" "}
                    </TextField>
                  )}
                />
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Category"
                      fullWidth
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      SelectProps={{ displayEmpty: true }}
                    >
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <MenuItem
                            key={cat.category_id}
                            value={cat.category_id}
                          >
                            {cat.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          Loading categories...
                        </MenuItem>
                      )}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        label="Start Date & Time"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                      />
                    )}
                  />{" "}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        label="End Date & Time"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.endDate}
                        helperText={errors.endDate?.message}
                      />
                    )}
                  />{" "}
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* STEP 2: Location */}
          {activeStep === 1 && (
            <Stack spacing={3}>
              <Controller
                name="venueName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Venue Name"
                    fullWidth
                    error={!!errors.venueName}
                    helperText={errors.venueName?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Street Address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />{" "}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="State/Province"
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state?.message}
                      />
                    )}
                  />{" "}
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Country"
                        fullWidth
                        error={!!errors.country}
                        helperText={errors.country?.message}
                      />
                    )}
                  />{" "}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {" "}
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Postal Code"
                        fullWidth
                        error={!!errors.postalCode}
                        helperText={errors.postalCode?.message}
                      />
                    )}
                  />{" "}
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* STEP 3: Tickets & Pricing */}
          {activeStep === 2 && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Event Capacity & Base Pricing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="capacity"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Total Event Capacity"
                          fullWidth
                          error={!!errors.capacity}
                          helperText={errors.capacity?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="isFree"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label="This is a Free Event (No Tickets)"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {!isFree && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ticket Types
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Create different ticket categories. You can set specific
                    sales dates for each type.
                  </Typography>

                  {/* Ticket Creation Form */}
                  <Card
                    variant="outlined"
                    sx={{ mb: 3, bgcolor: "background.default" }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mb: 2,
                          color: "primary.main",
                          fontWeight: "bold",
                        }}
                      >
                        {editIndex !== null
                          ? "Edit Ticket Type"
                          : "Add New Ticket Type"}
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Row 1: Basic Info */}
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Ticket Name"
                            fullWidth
                            size="small"
                            value={newTicket.name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g. Early Bird"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Price"
                            type="number"
                            fullWidth
                            size="small"
                            value={newTicket.price}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                price: Number(e.target.value),
                              })
                            }
                            InputProps={{
                              startAdornment: (
                                <Box component="span" mr={1}>
                                  GHS
                                </Box>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Quantity"
                            type="number"
                            fullWidth
                            size="small"
                            value={newTicket.available_quantity}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                available_quantity: Number(e.target.value),
                              })
                            }
                          />
                        </Grid>

                        {/* Row 2: Dates */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Sales Start (Optional)"
                            type="datetime-local"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={newTicket.sales_start_date}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                sales_start_date: e.target.value,
                              })
                            }
                            helperText="Leave blank to use event start date"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Sales End (Optional)"
                            type="datetime-local"
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={newTicket.sales_end_date}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                sales_end_date: e.target.value,
                              })
                            }
                            helperText="Leave blank to use event end date"
                          />
                        </Grid>

                        {/* Row 3: Description & Button */}
                        <Grid item xs={12} sm={10}>
                          <TextField
                            label="Description (Optional)"
                            fullWidth
                            size="small"
                            value={newTicket.description}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              setNewTicket({
                                ...newTicket,
                                description: e.target.value,
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button
                            variant="contained"
                            color={editIndex !== null ? "warning" : "primary"}
                            startIcon={
                              editIndex !== null ? <EditIcon /> : <AddIcon />
                            }
                            onClick={addOrUpdateTicket}
                            fullWidth
                            sx={{ height: "100%" }}
                          >
                            {editIndex !== null ? "Update" : "Add"}
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Ticket List */}
                  {tickets.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "action.hover" }}>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Sales Period</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tickets.map((t, index) => (
                            <TableRow
                              key={index}
                              selected={editIndex === index}
                            >
                              <TableCell>{t.name}</TableCell>
                              <TableCell>GHS {t.price}</TableCell>
                              <TableCell>{t.available_quantity}</TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "0.8rem",
                                  color: "text.secondary",
                                }}
                              >
                                {t.sales_start_date
                                  ? new Date(
                                      t.sales_start_date
                                    ).toLocaleDateString()
                                  : "Event Start"}
                                {" - "}
                                {t.sales_end_date
                                  ? new Date(
                                      t.sales_end_date
                                    ).toLocaleDateString()
                                  : "Event End"}
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleEditTicket(index)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeTicket(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Alert severity="warning">
                      No ticket types added yet. Please add at least one.
                    </Alert>
                  )}
                </Box>
              )}
            </Stack>
          )}

          {/* STEP 4: Review */}
          {activeStep === 3 && (
            <Stack spacing={2}>
              <Alert severity="info">
                Please review your event details before creating.
              </Alert>
              <Typography variant="subtitle1" fontWeight="bold">
                Tickets to be created:
              </Typography>
              {tickets.length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {tickets.map((t, i) => (
                    <li key={i}>
                      {t.name} - GHS {t.price} ({t.available_quantity})
                    </li>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">
                  No paid tickets (Free Event)
                </Typography>
              )}
            </Stack>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              type="button"
            >
              Back
            </Button>

            {activeStep === STEPS.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ ml: "auto" }}
              >
                {loading ? <CircularProgress size={24} /> : "Create Event"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={(e: React.MouseEvent) => handleNext(e)}
                type="button"
                sx={{ ml: "auto" }}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </form>
    </Container>
  );
}