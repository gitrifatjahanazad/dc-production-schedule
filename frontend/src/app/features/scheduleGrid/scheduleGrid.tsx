import * as React from "react";
import { render } from "react-dom";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./style.css";
import moment from "moment";
const { REACT_APP_API_BASE_URL } = process.env;

function ScheduleGrid() {
  const [data, setData] = React.useState([{}]);
  const [loading, setLoading] = React.useState(true);
  const validFields = {
    WeekNumber: "",
    ProductionStartDate: "",
    Serial: "", //Chassis number
    JobContactLastName: "", //Customer name
    Model: "",
    ProductionValue: "", //not given
    Dealer: "",
    PreferredCompletion: "",
    Status: "",
    Remarks: "",
  };

  const fetchData = () => {
    setLoading(true);

    // Make a GET request to your API
    fetch(`${REACT_APP_API_BASE_URL}/xml_to_json`)
      .then((response) => response.json())
      .then((data) => {
        var headerAddedData = [
          {
            RowID: "Row ID",
            JobID: "Job ID",
            ProductionStartDate: "Production Start Date",
            WeekNumber: "Week Number",
            JobContactLastName: "Customer Name",
            Model: "Model",
            Serial: "Chassis number",
            ProductionValue: "Production Value",
            Dealer: "Dealer",
            Status: "Status",
            PreferredCompletion: "Completion date",
            Upper_x0020_cabinet: "Upper_x0020_cabinet",
            Lower_x0020_cabinet: "Lower_x0020_cabinet",
            Benchtops: "Benchtops",
            Splash_x0020_Back: "Splash_x0020_Back",
            Exterior: "Exterior",
            Decal: "Decal",
            Prot_x0020_Decal: "Prot_x0020_Decal",
            Remarks: "Remarks",
          },
        ];

        headerAddedData = headerAddedData.concat(data);
        
        let rowIdStart = 0;

        let mappedData = headerAddedData.map((field, index) => {
          const firstRow = 0;
          // if(moment(
          //   field.PreferredCompletion, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
          // ).isAfter(moment('2023-01-05')))
          if (firstRow !== index) {
            field.RowID = rowIdStart.toString();
            field.WeekNumber = getWeekNumber(
              new Date(moment(
                '2023-01-01',
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              ).add(index, 'days').format("YYYY-MM-DD"))
            );
            field.PreferredCompletion = moment(
              field.PreferredCompletion,
            ).format("DD/MM/yyyy");
            field.ProductionStartDate = moment(
              '2023-01-01',
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ).add(index, 'days').format("dddd, MMMM DD yyyy");
            field.ProductionValue = "";
            field.Remarks = "";
            rowIdStart += 1;
          }
          let validFields = {
            WeekNumber: field.WeekNumber,
            ProductionStartDate: field.ProductionStartDate,
            Serial: field.Serial, //Chassis number
            JobContactLastName: field.JobContactLastName, //Customer name
            Model: field.Model,
            ProductionValue: field.ProductionValue, //not given
            Dealer: field.Dealer,
            Status: field.Status,
            RowId: field.RowID,
          };
          return field;
        });

        mappedData.sort((a, b) => {
          const noDate = moment(8640000000000000);
          const dateA = a.PreferredCompletion
            ? moment(a.PreferredCompletion, 'DD/MM/yyyy')
            : noDate;
          const dateB = b.PreferredCompletion
            ? moment(b.PreferredCompletion, 'DD/MM/yyyy')
            : noDate;
          return dateA.diff(dateB); 
        });
        setData(mappedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  React.useEffect(() => {
    // Initial data fetch when the component mounts
    fetchData();

    // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(fetchData, 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className="App">
        <h1>Crusader Schedule Data</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ReactGrid
            rows={data.map((item: any, index) => {
              return {
                rowId: item.RowID,
                cells: Object.keys(validFields).map((key) => {
                  if (key === "Status") {
                    return {
                      type: index === 0 ? "header" : "text",
                      text: item[key] ? item[key] : "",
                      nonEditable: true,
                    };
                  }
                  if (key === "Remarks") {
                    return {
                      type: index === 0 ? "header" : "text",
                      text: item[key] ? item[key] : "",
                      nonEditable: false,
                    };
                  }
                  return {
                    type: index === 0 ? "header" : "text",
                    text: item[key] ? item[key] : "",
                    nonEditable: true,
                  };
                }),
              };
            })}
            columns={Object.keys(data[0]).map((key) => {
              return {
                columnId: key,
                width: 400,
              };
            })}
          />
        )}
      </div>
    </div>
  );
}

function getWeekNumber(dateString: any) {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0); // Set time to the beginning of the day

  // Get the day of the week (0 is Sunday)
  const dayOfWeek = date.getDay();

  // Adjust the date to the previous or current Monday
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - ((dayOfWeek + 6) % 7));

  // Calculate the number of days from the start of the year to the current date
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear =
    Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    ) + 1;

  // ISO 8601 standard
  const weekNumber = Math.ceil(
    (dayOfYear - (8 - startOfWeek.getDay())) / 7
  ).toString();

  if (weekNumber === "NaN") {
    return "";
  }
  return weekNumber;
}

export default ScheduleGrid;
