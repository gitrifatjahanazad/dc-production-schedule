import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { ReactGrid, CellChange } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./style.css";
import ScheduleGridMobile from "./ScheduleGridMobile";
import moment from "moment";
import ScheduleModal from "./ScheduleModal";

const { REACT_APP_API_BASE_URL } = process.env;

interface Field {
  RowID: string;
  JobID: string;
  ProductionStartDate: string;
  WeekNumber: string;
  JobContactLastName: string;
  Model: string;
  Serial: string;
  ProductionValue: string;
  Dealer: string;
  Status: string;
  PreferredCompletion: string;
  Upper_x0020_cabinet: string;
  Lower_x0020_cabinet: string;
  Benchtops: string;
  Splash_x0020_Back: string;
  Exterior: string;
  Decal: string;
  Prot_x0020_Decal: string;
  Remarks: string;
}

function ScheduleGrid() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const [data, setData] = React.useState<Field[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [dataItemIndex, setDataItemIndex] = React.useState<number | undefined>();
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
    
    

  const fetchRemarks = (jobId: string) => {
    fetch(`${REACT_APP_API_BASE_URL}/get_remark/${jobId}`)
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.JobID === jobId ? { ...item, Remarks: data.remark } : item
          )
        );
      })
      .catch((error) => {
        console.error(`Error fetching remarks for job ${jobId}:`, error);
      });
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${REACT_APP_API_BASE_URL}/xml_to_json`);
      const responseData = await response.json();

      let headerAddedData = [
        ...responseData,
      ];
      // console.log(headerAddedData);

      let rowIdStart = 0;

      // for (let index = 0; index < headerAddedData.length; index++) {
      //   const field = headerAddedData[index];

      //   if (field.JobID) {
      //     const jobId = field.JobID;

      //     // Fetch remarks for the current job
      //     await fetchRemarks(jobId);
      //   }

      //   if (index !== 0) {
      //     field.RowID = rowIdStart.toString();
      //     field.WeekNumber = getWeekNumber(
      //       new Date(
      //         moment("2023-01-01").add(rowIdStart, "days").format("YYYY-MM-DD")
      //       )
      //     );
      //     field.PreferredCompletion = moment(field.PreferredCompletion).format(
      //       "DD/MM/yyyy"
      //     );
      //     field.ProductionStartDate = moment("2023-01-01")
      //       .add(rowIdStart, "days")
      //       .format("dddd, MMMM DD yyyy");
      //     field.ProductionValue = "";
      //     field.Remarks = "";
      //     rowIdStart += 1;
      //   }

      //   headerAddedData[index] = field;
      // }

      headerAddedData.sort((a, b) => {
        const noDate = moment(8640000000000000);
        const dateA = a.PreferredCompletion
          ? moment(a.PreferredCompletion, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
          : noDate;
        const dateB = b.PreferredCompletion
          ? moment(b.PreferredCompletion, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
          : noDate;
        return dateA.diff(dateB); 
      });

      // let rowIdStart = 0;

        
        headerAddedData = headerAddedData.filter(field=> moment(
          field.PreferredCompletion, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
        ).isBetween(moment('2022-12-31', "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"), moment('2024-01-01', "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"))? true : false);
        let mappedData = headerAddedData.map((field, index) => {
          const firstRow = 0;
          
            field.RowID = rowIdStart.toString();
            field.WeekNumber = getWeekNumber(
              new Date(moment(
                '2023-01-01',
                "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
              ).add(index, 'days').format("YYYY-MM-DD"))
            );
            field.PreferredCompletion = moment(
              field.PreferredCompletion, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
            ).format("DD/MM/yyyy");
            field.ProductionStartDate = moment(
              '2023-01-01',
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            ).add(index, 'days').format("dddd, MMMM DD yyyy");
            field.ProductionValue = "";
            field.Remarks = "";
            rowIdStart += 1;
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

      setData([{
        RowID: "Row ID",
        WeekNumber: "Week Number",
        ProductionStartDate: "Production Start Date",
        Serial: "Chassis number",
        JobContactLastName: "Customer Name",
        Model: "Model",
        ProductionValue: "Production Value",
        Dealer: "Dealer",
        Status: "Status",
        PreferredCompletion: "Completion date",
        Remarks: "Remarks",
      }, ...mappedData]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Initial data fetch when the component mounts
    fetchData();

    // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(fetchData, 300000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleChanges = (changes: CellChange[]) => {
    setData((prevData) =>
      prevData.map((item) => {
        const changedItem = changes.find(
          (change) =>
            change.rowId === item.RowID && change.columnId === "Remarks"
        );

        if (changedItem) {
          console.log("Changed Item:", changedItem);

          let updatedRemarks = "";

          if (
            changedItem.newCell &&
            "type" in changedItem.newCell &&
            changedItem.newCell.type === "text"
          ) {
            updatedRemarks = changedItem.newCell.text;

            fetch(`${REACT_APP_API_BASE_URL}/save_remark`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                job_id: item.JobID,
                remark: updatedRemarks,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Save Remark Response:", data);

                //window.location.reload();
              })
              .catch((error) => {
                console.error("Error saving remark:", error);
              });
          }

          return { ...item, Remarks: updatedRemarks };
        }

        return item;
      })
    );
  };
  const handleOpenModal = (selected:any) => {
    // setModalShow((prevModalShow) => !prevModalShow);
    // setDataItemIndex((prevDataItemIndex) => selected[0].rows[0].idx);
    setModalShow(true);
    setDataItemIndex(selected[0].rows[0].idx);
    console.log(modalShow, dataItemIndex)

  }

  return (
    <div>
      <div className="myGrid">
        <h1>Crusader Schedule Data</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Render the first row in a different div */}
            {/* <div className="header-row">
              {data.slice(0, 1).map((item) => (
                <div key={item.RowID}>
                  <span>{item.RowID}</span>
                  <span>{item.WeekNumber}</span>
                  <span>{item.ProductionStartDate}</span>
                  <span>{item.Serial}</span>
                  <span>{item.JobContactLastName}</span>
                  <span>{item.Model}</span>
                  <span>{item.ProductionValue}</span>
                  <span>{item.Dealer}</span>
                  <span>{item.Status}</span>
                  <span>{item.PreferredCompletion}</span>
                  <span>{item.Remarks}</span>
                </div>
              ))}
            </div> */}

            {/* Render the remaining rows using ReactGrid or ScheduleGridMobile */}
            {isBigScreen ? (
              <>
                <div className="row">
                <div className="col-12">
                  <div className="schedule__data-grid">
                    <div>
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
            columns={Object.keys(validFields).map((key) => {
              return {
                columnId: key,
                width: 400,
              };
            })}
          />
                    </div>
                  </div>
                </div>
              </div>
              {modalShow && dataItemIndex !== undefined && (
                <ScheduleModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={data}
                index={dataItemIndex}
                />
              )}
              </>
              
            ) : (
              <ScheduleGridMobile data={data}/>
            )}
          </>
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
  const weekNumber = Math.ceil(1+
    (dayOfYear - (8 - startOfWeek.getDay())) / 7
  ).toString();

  if (weekNumber === "NaN") {
    return "";
  }
  return weekNumber;
}

export default ScheduleGrid;
