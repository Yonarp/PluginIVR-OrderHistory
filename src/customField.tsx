import React, { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FiveInitialize,
  List,
  Typography,
} from "./FivePluginApi";

import { CustomFieldProps } from "../../../common";
import { Container, ListItemButton } from "@mui/material";
import OrderDetails from "./component/OrderDetails";

FiveInitialize();

const CustomField = (props: CustomFieldProps) => {
  //@ts-ignore
  const { theme, value, onValueUpdated, variant, five, selectedRecord } = props;
  const ivrKey = selectedRecord.data?.IVR;
  const [dialogOpen, setDialogOpen] = useState(false);
  //@ts-ignore
  const [loading, setLoading] = useState(false);
  //@ts-ignore
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleDialogOpen = () => {
    setDialogOpen(true);
    console.log("Logging selected Record for Order History", selectedRecord);
    const IVR = {
      IVRKey: ivrKey,
    };

    const fetchData = async () => {
      setLoading(true);
      await five.executeFunction(
        "getOrders",
        //@ts-ignore
        IVR,
        null,
        null,
        null,
        (result) => {
          console.log("Logging Order History");
          const response = JSON.parse(result?.serverResponse?.results);
          console.log(response);
          setOrders(response.response.value);
          setLoading(false);
        }
      );
    };

    fetchData();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setPage(1);
  };

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box>
      <Button
        fullWidth
        onClick={handleDialogOpen}
        style={{
          background: "#225c79",
          color: "white",
        }}
      >
        Order History
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            width: "90%",
            height: "90%",
            padding: "20px",
          },
        }}
      >
        <DialogTitle style={{ backgroundColor: "#246382", color: "white" }}>
          Order History
        </DialogTitle>

        <DialogContent
          style={{ maxWidth: "100%", overflowX: "hidden", padding: "10px" }}
        >
          {page === 0 && (
            <Box>
              <Typography
                mt={6}
                variant="h5"
                style={{ textAlign: "center", marginBottom: "20px" }}
              >
                Orders
              </Typography>
              <Box
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0 30px", // Add padding to align with list items
                }}
              >
                <Typography
                  variant="body1"
                  style={{ width: "150px", margin: 0, padding: 10 }}
                >
                  <strong>Date</strong>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ width: "100px", margin: 0, padding: 10 }}
                >
                  <strong>Status</strong>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ width: "150px", margin: 0, padding: 10 }}
                >
                  <strong>Address</strong>
                </Typography>
                <Typography
                  variant="body1"
                  style={{ width: "100px", margin: 0, padding: 10 }}
                >
                  <strong>Total Amount</strong>
                </Typography>
              </Box>
              <List>
                {orders?.map((order, index) => (
                  <ListItemButton
                    key={index}
                    onClick={() => handleOrderClick(order)}
                    sx={{
                      borderBottom: "1px solid #00000033",
                      "&.Mui-selected": {
                        backgroundColor: "#F4F8D0",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "lightblue",
                        },
                      },
                      padding: "0 30px", // Ensure padding matches header
                    }}
                  >
                    <Box
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{ width: "150px", margin: 0, padding: 10 }}
                      >
                        {order?.DateText}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{ width: "100px", margin: 0, padding: 10 }}
                      >
                        {order?.Status}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{ width: "150px", margin: 0, padding: 10 }}
                      >
                        {order?.ShippingAddress}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ width: "100px", margin: 0, padding: 10 }}
                      >
                        {order?.Amount}
                      </Typography>
                    </Box>
                  </ListItemButton>
                ))}
              </List>
              <Box display="flex" justifyContent="center" width="100%">
                <Button
                  onClick={handleDialogClose}
                  style={{
                    width: "15vw",
                    backgroundColor: "#780000",
                    color: "white",
                    marginTop: "10px",
                  }}
                >
                  Close
                </Button>
                {/* @ts-ignore */}
              </Box>
            </Box>
          )}
          {page === 1 && (
            <OrderDetails
              setPage={setPage}
              order={selectedOrder}
              IVR={ivrKey}
              five={five}
              handleDialogClose={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomField;
