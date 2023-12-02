import * as React from "react";
import { render } from "react-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import Header from "../header/Header";
const { REACT_APP_API_BASE_URL } = process.env;

export default function Table1() {
  const [responseContent, setResponseContent] = React.useState([]);
  const [intervalValue, setIntervalValue] = React.useState(30000);

  const fetchData = React.useCallback(() => {
    fetch(`${REACT_APP_API_BASE_URL}/main-line-status`)
      .then((response) => response.json())
      .then((responseData) => {
        if (Array.isArray(responseData.response_content)) {
          const newIntervalValue = responseData.interval;
          setIntervalValue(newIntervalValue);
          const groupedData = groupRowsByStation(responseData.response_content);
          setResponseContent(groupedData);
        } else {
          console.error("Invalid response format:", responseData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Function to group rows by station_name
  const groupRowsByStation = (data) => {
    const groupedData = {};
    data.forEach((row) => {
      const correctedRow = row.replace(/'/g, '"');
      const rowObject = JSON.parse(correctedRow);
      const stationName = rowObject.station_name;
      if (!groupedData[stationName]) {
        groupedData[stationName] = [];
      }
      groupedData[stationName].push(rowObject);
    });
    return groupedData;
  };

  React.useEffect(() => {
    // Fetch initial data when the component mounts
    fetchData();

    // Set up an interval for periodic data fetching
    const intervalId = setInterval(fetchData, intervalValue);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchData, intervalValue]);

  return (
    <Container maxWidth="md" style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        style={{
          color: "black",
          fontFamily: "Roboto",
          fontWeight: "bold",
        }}
      >
        <Header />
      </Typography>
      {Object.keys(responseContent).length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "8px" }}>
          <Table size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: "rgb(59, 17, 80)" }}>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "white", fontFamily: "Arial" }}
                  >
                    Station Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "white", fontFamily: "Arial" }}
                  >
                    Chassis No
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "white", fontFamily: "Arial" }}
                  >
                    Model
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    style={{ color: "white", fontFamily: "Arial" }}
                  >
                    Dealer
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(responseContent).map((stationName) => (
                <React.Fragment key={stationName}>
                  <TableRow>
                    <TableCell rowSpan={responseContent[stationName].length}>
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Arial" }}
                      >
                        {stationName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Arial" }}
                      >
                        {responseContent[stationName][0].chassisNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Arial" }}
                      >
                        {responseContent[stationName][0].model}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Arial" }}
                      >
                        {responseContent[stationName][0].dealer}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {responseContent[stationName].slice(1).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography
                          variant="body1"
                          style={{ fontFamily: "Arial" }}
                        >
                          {row.chassisNo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          style={{ fontFamily: "Arial" }}
                        >
                          {row.model}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          style={{ fontFamily: "Arial" }}
                        >
                          {row.dealer}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
