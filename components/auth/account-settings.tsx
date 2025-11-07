"use client";

import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Switch from "@mui/joy/Switch";
import Chip from "@mui/joy/Chip";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import CountrySelector from "@/components/country-selector";

export default function MyProfile() {
  const [isEditingAccount, setIsEditingAccount] = React.useState(false);
  const [isEditingPayment, setIsEditingPayment] = React.useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = React.useState(false);
  const [addPaymentModalOpen, setAddPaymentModalOpen] = React.useState(false);
  const [paymentMethodType, setPaymentMethodType] = React.useState("card");

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = React.useState([
    {
      id: 1,
      type: "card",
      provider: "Visa",
      lastFour: "1234",
      expiry: "12/2025",
      isPrimary: true,
      name: "John Doe",
    },
    {
      id: 2,
      type: "card",
      provider: "Mastercard",
      lastFour: "5678",
      expiry: "08/2024",
      isPrimary: false,
      name: "John Doe",
    },
    {
      id: 3,
      type: "mobile",
      provider: "MTN Mobile Money",
      phone: "+233 24 123 4567",
      isPrimary: false,
      name: "John Doe",
    },
  ]);

  // New payment method state
  const [newPaymentMethod, setNewPaymentMethod] = React.useState({
    type: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    phone: "",
    provider: "MTN",
  });

  const handleAddPaymentMethod = () => {
    if (paymentMethodType === "card") {
      const newMethod = {
        id: Math.floor(Math.random() * 1000000) + 1000000,
        type: "card",
        provider: newPaymentMethod.cardNumber.startsWith("4")
          ? "Visa"
          : "Mastercard",
        lastFour: newPaymentMethod.cardNumber.slice(-4),
        expiry: newPaymentMethod.expiry,
        isPrimary: false,
        name: newPaymentMethod.name,
      };
      setPaymentMethods((prev) => [...prev, newMethod]);
    } else {
      const newMethod = {
        id: Math.floor(Math.random() * 1000000) + 1000000,
        type: "mobile",
        provider: `${newPaymentMethod.provider} Mobile Money`,
        phone: newPaymentMethod.phone,
        isPrimary: false,
        name: newPaymentMethod.name,
      };
      setPaymentMethods((prev) => [...prev, newMethod]);
    }

    // Reset form
    setNewPaymentMethod({
      type: "card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      name: "",
      phone: "",
      provider: "MTN",
    });
    setAddPaymentModalOpen(false);
  };

  const handleDeletePaymentMethod = (id: number) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleSetPrimary = (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isPrimary: method.id === id,
      }))
    );
  };

  const renderPaymentMethodIcon = (type: string, provider: string) => {
    if (type === "mobile") {
      return <SmartphoneRoundedIcon color="primary" />;
    }
    return <CreditCardRoundedIcon color="primary" />;
  };

  const renderPaymentMethod = (method: any) => (
    <Box
      key={method.id}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "sm",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1 }}>
        {renderPaymentMethodIcon(method.type, method.provider)}
        <Box sx={{ flexGrow: 1 }}>
          <Typography level="title-sm">
            {method.type === "card"
              ? `${method.provider} ending in ${method.lastFour}`
              : `${method.provider}`}
          </Typography>
          <Typography level="body-xs">
            {method.type === "card" ? `Expires ${method.expiry}` : method.phone}
          </Typography>
          {method.name && (
            <Typography level="body-xs" textColor="text.tertiary">
              {method.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {method.isPrimary ? (
          <Chip size="sm" variant="soft" color="primary">
            Primary
          </Chip>
        ) : (
          <Button
            size="sm"
            variant="plain"
            onClick={() => handleSetPrimary(method.id)}
          >
            Set Primary
          </Button>
        )}

        {isEditingPayment && (
          <IconButton
            size="sm"
            variant="plain"
            color="danger"
            onClick={() => handleDeletePaymentMethod(method.id)}
          >
            <DeleteRoundedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Box
        sx={{
          position: "sticky",
          top: { sm: -100, md: -110 },
          bgcolor: "background.body",
          zIndex: 9995,
        }}
      >
        <Box sx={{ px: { xs: 2, md: 6 } }}>
          <Breadcrumbs
            size="sm"
            aria-label="breadcrumbs"
            separator={<ChevronRightRoundedIcon fontSize="sm" />}
            sx={{ pl: 0 }}
          >
            <Link
              underline="none"
              color="neutral"
              href="#some-link"
              aria-label="Home"
            >
              <HomeRoundedIcon />
            </Link>
            <Link
              underline="hover"
              color="neutral"
              href="#some-link"
              sx={{ fontSize: 12, fontWeight: 500 }}
            >
              Account
            </Link>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
              Setting
            </Typography>
          </Breadcrumbs>
          <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            General Setting
          </Typography>
        </Box>
      </Box>
      <Stack
        spacing={4}
        sx={{
          display: "flex",
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        {/* Account Info Card */}
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography level="title-md">Account Info</Typography>
              <Typography level="body-sm">
                Manage your personal information and account details.
              </Typography>
            </Box>
            <IconButton
              aria-label="edit account info"
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setIsEditingAccount(!isEditingAccount)}
            >
              <EditRoundedIcon />
            </IconButton>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: "100%" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                  srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </AspectRatio>
              {isEditingAccount && (
                <IconButton
                  aria-label="upload new picture"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: "background.body",
                    position: "absolute",
                    zIndex: 2,
                    borderRadius: "50%",
                    left: 100,
                    top: 170,
                    boxShadow: "sm",
                  }}
                >
                  <EditRoundedIcon />
                </IconButton>
              )}
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{
                    display: { sm: "flex-column", md: "flex-row" },
                    gap: 2,
                  }}
                >
                  {isEditingAccount ? (
                    <>
                      <Input size="sm" placeholder="First name" />
                      <Input
                        size="sm"
                        placeholder="Last name"
                        sx={{ flexGrow: 1 }}
                      />
                    </>
                  ) : (
                    <>
                      <Typography level="body-sm" sx={{ py: 0.75 }}>
                        First name Last name
                      </Typography>
                    </>
                  )}
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Account Type</FormLabel>
                  {isEditingAccount ? (
                    <Input size="sm" defaultValue="Administrator" readOnly />
                  ) : (
                    <Typography level="body-sm" sx={{ py: 0.75 }}>
                      Administrator
                    </Typography>
                  )}
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  {isEditingAccount ? (
                    <Input
                      size="sm"
                      type="email"
                      startDecorator={<EmailRoundedIcon />}
                      placeholder="email"
                      defaultValue="admin@paradisepay.com"
                      sx={{ flexGrow: 1 }}
                    />
                  ) : (
                    <Typography level="body-sm" sx={{ py: 0.75 }}>
                      admin@paradisepay.com
                    </Typography>
                  )}
                </FormControl>
              </Stack>
              <div>
                <CountrySelector editable={isEditingAccount} />
              </div>
              <div>
                <FormControl sx={{ display: { sm: "contents" } }}>
                  <FormLabel>Timezone</FormLabel>
                  {isEditingAccount ? (
                    <Select
                      size="sm"
                      startDecorator={<AccessTimeFilledRoundedIcon />}
                      defaultValue="1"
                    >
                      <Option value="1">
                        Ghana (Ghana){" "}
                        <Typography textColor="text.tertiary" sx={{ ml: 0.5 }}>
                          — GMT+0:00
                        </Typography>
                      </Option>
                    </Select>
                  ) : (
                    <Typography level="body-sm" sx={{ py: 0.75 }}>
                      Ghana (Ghana) — GMT+0:00
                    </Typography>
                  )}
                </FormControl>
              </div>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={108}
                  sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                    loading="lazy"
                    alt=""
                  />
                </AspectRatio>
                {isEditingAccount && (
                  <IconButton
                    aria-label="upload new picture"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: "background.body",
                      position: "absolute",
                      zIndex: 2,
                      borderRadius: "50%",
                      left: 85,
                      top: 180,
                      boxShadow: "sm",
                    }}
                  >
                    <EditRoundedIcon />
                  </IconButton>
                )}
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: "flex-column",
                      md: "flex-row",
                    },
                    gap: 2,
                  }}
                >
                  {isEditingAccount ? (
                    <>
                      <Input size="sm" placeholder="First name" />
                      <Input size="sm" placeholder="Last name" />
                    </>
                  ) : (
                    <Typography level="body-sm" sx={{ py: 0.75 }}>
                      First name Last name
                    </Typography>
                  )}
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Role</FormLabel>
              {isEditingAccount ? (
                <Input size="sm" defaultValue="UI Developer" />
              ) : (
                <Typography level="body-sm" sx={{ py: 0.75 }}>
                  UI Developer
                </Typography>
              )}
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Email</FormLabel>
              {isEditingAccount ? (
                <Input
                  size="sm"
                  type="email"
                  startDecorator={<EmailRoundedIcon />}
                  placeholder="email"
                  defaultValue="siriwatk@test.com"
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography level="body-sm" sx={{ py: 0.75 }}>
                  siriwatk@test.com
                </Typography>
              )}
            </FormControl>
            <div>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Phone Number</FormLabel>
                {isEditingAccount ? (
                  <Input
                    size="sm"
                    type="phone"
                    startDecorator={<EmailRoundedIcon />}
                    placeholder="email"
                    defaultValue="siriwatk@test.com"
                    sx={{ flexGrow: 1 }}
                  />
                ) : (
                  <Typography level="body-sm" sx={{ py: 0.75 }}>
                    Phone number
                  </Typography>
                )}
              </FormControl>
            </div>
            <div>
              <CountrySelector editable={isEditingAccount} />
            </div>
            <div>
              <FormControl sx={{ display: { sm: "contents" } }}>
                <FormLabel>Timezone</FormLabel>
                {isEditingAccount ? (
                  <Select
                    size="sm"
                    startDecorator={<AccessTimeFilledRoundedIcon />}
                    defaultValue="1"
                  >
                    <Option value="1">
                      Ghana (Ghana){" "}
                      <Typography textColor="text.tertiary" sx={{ ml: 0.5 }}>
                        — GMT+07:00
                      </Typography>
                    </Option>
                  </Select>
                ) : (
                  <Typography level="body-sm" sx={{ py: 0.75 }}>
                    Ghana (Ghana) — GMT+07:00
                  </Typography>
                )}
              </FormControl>
            </div>
          </Stack>
          {isEditingAccount && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setIsEditingAccount(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => setIsEditingAccount(false)}
                >
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          )}
        </Card>

        {/* Payment Methods Card */}
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography level="title-md">Payment Methods</Typography>
              <Typography level="body-sm">
                Manage your payment methods and billing information.
              </Typography>
            </Box>
            <IconButton
              aria-label="edit payment methods"
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setIsEditingPayment(!isEditingPayment)}
            >
              <EditRoundedIcon />
            </IconButton>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 2 }}>
            {paymentMethods.map(renderPaymentMethod)}

            {isEditingPayment && (
              <Button
                variant="outlined"
                size="sm"
                startDecorator={<CreditCardRoundedIcon />}
                onClick={() => setAddPaymentModalOpen(true)}
              >
                Add Payment Method
              </Button>
            )}
          </Stack>
          {isEditingPayment && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setIsEditingPayment(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => setIsEditingPayment(false)}
                >
                  Save
                </Button>
              </CardActions>
            </CardOverflow>
          )}
        </Card>

        {/* Preferences Card */}
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
              <Typography level="title-md">Preferences</Typography>
              <Typography level="body-sm">
                Customize your application preferences and settings.
              </Typography>
            </Box>
            <IconButton
              aria-label="edit preferences"
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setIsEditingPreferences(!isEditingPreferences)}
            >
              <EditRoundedIcon />
            </IconButton>
          </Box>
          <Divider />
          <Stack spacing={3} sx={{ my: 2 }}>
            <FormControl>
              <FormLabel>Language</FormLabel>
              {isEditingPreferences ? (
                <Select size="sm" defaultValue="en">
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                  <Option value="de">German</Option>
                </Select>
              ) : (
                <Typography level="body-sm" sx={{ py: 0.75 }}>
                  English
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Currency</FormLabel>
              {isEditingPreferences ? (
                <Select size="sm" defaultValue="usd">
                  <Option value="ghs">GHS - Ghanaian Cedi</Option>
                  <Option value="usd">USD - US Dollar</Option>
                  <Option value="eur">EUR - Euro</Option>
                  <Option value="gbp">GBP - British Pound</Option>
                </Select>
              ) : (
                <Typography level="body-sm" sx={{ py: 0.75 }}>
                  GHS - Ghanaian Cedi
                </Typography>
              )}
            </FormControl>

            <FormControl>
              <FormLabel>Notifications</FormLabel>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography level="body-sm">Email notifications</Typography>
                  {isEditingPreferences ? (
                    <Switch defaultChecked />
                  ) : (
                    <Chip size="sm" variant="soft" color="success">
                      Enabled
                    </Chip>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography level="body-sm">Push notifications</Typography>
                  {isEditingPreferences ? (
                    <Switch defaultChecked />
                  ) : (
                    <Chip size="sm" variant="soft" color="success">
                      Enabled
                    </Chip>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography level="body-sm">SMS alerts</Typography>
                  {isEditingPreferences ? (
                    <Switch />
                  ) : (
                    <Chip size="sm" variant="soft" color="neutral">
                      Disabled
                    </Chip>
                  )}
                </Box>
              </Stack>
            </FormControl>

          
          </Stack>
          {isEditingPreferences && (
            <CardOverflow
              sx={{ borderTop: "1px solid", borderColor: "divider" }}
            >
              <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={() => setIsEditingPreferences(false)}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => setIsEditingPreferences(false)}
                >
                  Save Preferences
                </Button>
              </CardActions>
            </CardOverflow>
          )}
        </Card>
      </Stack>

      {/* Add Payment Method Modal */}
      <Modal
        open={addPaymentModalOpen}
        onClose={() => setAddPaymentModalOpen(false)}
      >
        <ModalDialog>
          <ModalClose />
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Payment Method Type</FormLabel>
                <Select
                  value={paymentMethodType}
                  onChange={(e, newValue) =>
                    setPaymentMethodType(newValue as string)
                  }
                >
                  <Option value="card">Credit/Debit Card</Option>
                  <Option value="mobile">Mobile Money</Option>
                </Select>
              </FormControl>

              {paymentMethodType === "card" ? (
                <>
                  <FormControl>
                    <FormLabel>Card Number</FormLabel>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <Stack direction="row" spacing={2}>
                    <FormControl>
                      <FormLabel>Expiry Date</FormLabel>
                      <Input
                        placeholder="MM/YY"
                        value={newPaymentMethod.expiry}
                        onChange={(e) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            expiry: e.target.value,
                          }))
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>CVV</FormLabel>
                      <Input
                        placeholder="123"
                        value={newPaymentMethod.cvv}
                        onChange={(e) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                      />
                    </FormControl>
                  </Stack>
                  <FormControl>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input
                      placeholder="John Doe"
                      value={newPaymentMethod.name}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl>
                    <FormLabel>Mobile Money Provider</FormLabel>
                    <Select
                      value={newPaymentMethod.provider}
                      onChange={(e, newValue) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          provider: newValue as string,
                        }))
                      }
                    >
                      <Option value="MTN">MTN Mobile Money</Option>
                      <Option value="Vodafone">Vodafone Cash</Option>
                      <Option value="AirtelTigo">AirtelTigo Money</Option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      placeholder="+233 24 123 4567"
                      value={newPaymentMethod.phone}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Account Name</FormLabel>
                    <Input
                      placeholder="John Doe"
                      value={newPaymentMethod.name}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </>
              )}

              <Button
                variant="solid"
                onClick={handleAddPaymentMethod}
                disabled={
                  paymentMethodType === "card"
                    ? !newPaymentMethod.cardNumber ||
                      !newPaymentMethod.expiry ||
                      !newPaymentMethod.cvv ||
                      !newPaymentMethod.name
                    : !newPaymentMethod.phone || !newPaymentMethod.name
                }
              >
                Add Payment Method
              </Button>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
