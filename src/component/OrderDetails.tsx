//@ts-nocheck
import {
  CircularProgress,
  Container,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Box, Paper, Table, TableContainer } from "../FivePluginApi";

const OrderDetails = ({ order, five, IVR, handleDialogClose, setPage }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  //@ts-ignore
  const [productList, setProductList] = useState([]);
  const [orderProducts, setOrderProducts] = useState([
    { product: "", price: 0, qty: 1, discount: 0, amount: 0 },
  ]);


  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressName, setAddressName] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);
  const [orderLines, setOrderLines] = useState([]);

  useEffect(() => {
    setLoading(true);
    const ivrObject = {
      IVR: IVR,
    };
    const fetchData = async () => {
     
      await five.executeFunction(
        "getIVRDetails",
        //@ts-ignore
        ivrObject,
        null,
        null,
        null,
        async (result) => {
          console.log("Logging Order");
          const response = JSON.parse(result.serverResponse.results);
          console.log(response);
          setData(response);
          setProductList(response.productList);
          const primaryAddress = response.address.find(
            (addr) => addr._isPrimary === 1
          );
          setSelectedAddress(primaryAddress?.___ADD || "");
          setAddressName(primaryAddress?.AddressName);
          setFullAddress(primaryAddress);
          setLoading(false);

          const logObject = {
            ORD: order.___ORD,
            ivr: response.ivr,
            type: "Order"
          }
    
          await five.executeFunction(
            "TriggerOpenIVRLog",
            logObject,
            null,
            null,
            null,
            async (result) => {}
          );
        }
      );

      const orderObj = {
        ORD: order.___ORD,
      };

      await five.executeFunction(
        "getOrderLines",
        //@ts-ignore
        orderObj,
        null,
        null,
        null,
        (result) => {
          console.log("Logging Order Lines");
          const response = JSON.parse(result.serverResponse.results);
          console.log(response);
          setOrderLines(response);
        }
      );

 

      await five.executeFunction(
        "getOrderLines",
        //@ts-ignore
        orderObj,
        null,
        null,
        null,
        (result) => {
          console.log("Logging Order Lines");
          const response = JSON.parse(result.serverResponse.results);
          console.log(response);
          setOrderLines(response);
        }
      );
    };

    



    fetchData();
  }, []);

  const handleDialog = () => {
    setPage(0);
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
      <Typography variant="h6" mt={5}>
        Details:{" "}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody style={{ border: "1px solid black" }}>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Products:</strong>
              </TableCell>
              <TableCell>{"Zenith-Q4523"}</TableCell>
              <TableCell component="th" scope="row">
                <strong>Wound Size (CM²):</strong>
              </TableCell>
              <TableCell>{data?.ivr?.WoundSizeCalc}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Wound Type:</strong>
              </TableCell>
              <TableCell>{data?.ivr?.WoundType}</TableCell>
              <TableCell component="th" scope="row">
                <strong>Account:</strong>
              </TableCell>
              <TableCell>{data?.ivr?.Account}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Approval Date:</strong>
              </TableCell>
              <TableCell>{data?.ivr?.ApprovalDate}</TableCell>
              <TableCell component="th" scope="row">
                <strong>Date Of Service:</strong>
              </TableCell>
              <TableCell>{data?.ivr?.DateOfBirth}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Place Of Service:</strong>
              </TableCell>
              <TableCell>{data?.ivr?.PlaceofService}</TableCell>
              <TableCell component="th" scope="row">
                <strong>MAC:</strong>
              </TableCell>
              <TableCell>{data?.account?.MacValue}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" mt={5}>
        Address Details:{" "}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody style={{ border: "1px solid black" }}>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>Address Street:</strong>
              </TableCell>
              <TableCell>{fullAddress?.AddressStreet}</TableCell>
              <TableCell component="th" scope="row">
                <strong> Suite:</strong>
              </TableCell>
              <TableCell>{fullAddress?.AddressStreet2}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                <strong>City:</strong>
              </TableCell>
              <TableCell>{fullAddress?.AddressCity}</TableCell>
              <TableCell component="th" scope="row">
                <strong>State:</strong>
              </TableCell>
              <TableCell>{fullAddress?.AddressState}</TableCell>
              <TableCell component="th" scope="row">
                <strong> Zip:</strong>
              </TableCell>
              <TableCell>{fullAddress?.AddressZip}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" mt={5}>
        Products:{" "}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {" "}
              <strong>Product </strong>
            </TableCell>
            <TableCell>
              {" "}
              <strong>Price</strong>
            </TableCell>
            <TableCell>
              {" "}
              <strong>Qty</strong>
            </TableCell>
            <TableCell>
              {" "}
              <strong>Amount</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ padding: 10 }}>
          {orderLines.map((order, index) => (
            <TableRow key={index}>
              <TableCell>
                {" "}
                <strong>{order?.Product} </strong>
              </TableCell>
              <TableCell>{"$" + order?.Price}</TableCell>
              <TableCell>{order?.Qty}</TableCell>
              <TableCell>{"$" + order?.LineTotal}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} align="right">
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Total Amount
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {"$" + order?.Amount}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box display="flex" justifyContent="center" width="100%">
        <Button
          onClick={handleDialog}
          style={{
            width: "15vw",
            backgroundColor: "#1e546e",
            color: "white",
            marginTop: "10px",
          }}
        >
          Back
      </Button>
        {/* @ts-ignore */}
      </Box>
    </Box>
  );
};

export default OrderDetails;
