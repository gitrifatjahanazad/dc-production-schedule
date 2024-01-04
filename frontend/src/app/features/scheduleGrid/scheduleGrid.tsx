import * as React from "react";
import { useMediaQuery } from "react-responsive";
import { ReactGrid, CellChange } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./style.css";
import ScheduleGridMobile from "./ScheduleGridMobile";
import moment from "moment";
import ScheduleModal from "./ScheduleModal";
import { forEach } from "lodash";

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
interface Column {
  readonly columnId: Id;
  readonly width?: number;
  readonly reorderable?: boolean;
  readonly resizable?: boolean;
}
type Id = number | string;
const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
  const movedElements = arr.filter((_, idx) => idxs.includes(idx));
  const targetIdx = Math.min(...idxs) < to ? to += 1 : to -= idxs.filter(idx => idx < to).length;
  const leftSide = arr.filter((_, idx) => idx < targetIdx && !idxs.includes(idx));
  const rightSide = arr.filter((_, idx) => idx >= targetIdx && !idxs.includes(idx));
  return [...leftSide, ...movedElements, ...rightSide];
}
const primaryColumns = (): Column[] => [
  { columnId: "WeekNumber", width: 400, resizable: true },
  { columnId: "ProductionStartDate", width: 400, resizable: true },
  { columnId: "Serial", width: 400, resizable: true },
  { columnId: "JobContactLastName", width: 400, resizable: true },
  { columnId: "Model", width: 400, resizable: true },
  { columnId: "ProductionValue", width: 400, resizable: true },
  { columnId: "Dealer", width: 400, resizable: true },
  { columnId: "Status", width: 400, resizable: true },
  { columnId: "PreferredCompletion", width: 400, resizable: true },
  { columnId: "Remarks", width: 400, resizable: true },
];


function ScheduleGrid() {
  const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
  const [data, setData] = React.useState<Field[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [dataItemIndex, setDataItemIndex] = React.useState<number | undefined>();
  const [columns, setColumns] = React.useState<Column[]>(primaryColumns());

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
      const response = await fetch(`${REACT_APP_API_BASE_URL}/xml_to_json_merged`);
      const responseData = await response.json();
      const headerAddedData: Field[] = [
        {
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
        },
        ...responseData,
      ];
      

      let rowIdStart = 0;

      for (let index = 0; index < headerAddedData.length; index++) {
        const field = headerAddedData[index];

        if (field.JobID) {
          const jobId = field.JobID;

          // Fetch remarks for the current job
          // await fetchRemarks(jobId);
        }

        if (index !== 0) {
          field.RowID = rowIdStart.toString();
          field.WeekNumber = getWeekNumber(
            new Date(
              moment("2023-01-01").add(rowIdStart, "days").format("YYYY-MM-DD")
            )
          );
          field.PreferredCompletion = moment(field.PreferredCompletion).format(
            "DD/MM/yyyy"
          );
          field.ProductionStartDate = moment("2023-01-01")
            .add(rowIdStart, "days")
            .format("dddd, MMMM DD yyyy");
          field.ProductionValue = "";
          field.Remarks = "";
          rowIdStart += 1;
        }

        headerAddedData[index] = field;
      }

      headerAddedData.sort((a, b) => {
        const noDate = moment(8640000000000000);
        const dateA = a.PreferredCompletion
          ? moment(a.PreferredCompletion, "DD/MM/yyyy")
          : noDate;
        const dateB = b.PreferredCompletion
          ? moment(b.PreferredCompletion, "DD/MM/yyyy")
          : noDate;
        return dateA.diff(dateB);
      });

      setData(headerAddedData);
      setLoading(false);

      // headerAddedData.sort((a, b) => {
      //   const noDate = moment(8640000000000000);
      //   const dateA = a.PreferredCompletion
      //     ? moment(a.PreferredCompletion, "DD/MM/yyyy")
      //     : noDate;
      //   const dateB = b.PreferredCompletion
      //     ? moment(b.PreferredCompletion, "DD/MM/yyyy")
      //     : noDate;
      //   return dateA.diff(dateB);
      // });

      // setData(headerAddedData);
      // setLoading(false);
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

  
  //Handle Field Text Changes
  const handleChanges = (changes: CellChange[]) => {
    setData((prevData) =>
      prevData.map((item) => {
        const changedItem = changes.find(
          (change) =>
            change.rowId === item.RowID && change.columnId === "Remarks"
        );

        if (changedItem) {

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
  //Handle Open Modal
  const handleOpenModal = (selected:any) => {
    if(selected[0].last.row.cells[0].text && selected[0].columns[0].columnId !== 'Remarks'){
      setModalShow(true);
      setDataItemIndex(selected[0].rows[0].idx);
    }
  }
  // Handle Rows Dragging
  const handleRowsReorder = (targetRowId: Id, rowIds: Id[]) => {
    setData((prevData) =>{
      const to = prevData.findIndex((item) => item.RowID === targetRowId);
      const rowIndices = rowIds.map((id:Id) => prevData.findIndex((item) => item.RowID === id));
      return reorderArray(prevData, rowIndices, to);
    });
  }
  const handleCanReorderRows = (targetRowId:Id, rowIds:Id[]): boolean => {
    return targetRowId !== 'header';
  }

  //Add New Row
  const getNewRowId = () => {
    // Check if the array is not empty
    if (data.length > 0) {
      const lastRowID = parseInt(data[data.length - 1].RowID, 10);
      const newRowId = lastRowID + 999999;
      // console.log('last rowID', lastRowID)
      return newRowId.toString();
    }
    else{
      return '';
    }
  }
  const isNewRow = (row:Field) => {
    // Check if the row has the RowID of a new row
    return row.RowID === getNewRowId();
  };

  const handleAddRow = () => {
    // Create a new row object with default values or initialize as needed
    console.log('handleAddRow called');
    const newRow: Field = {
      RowID: getNewRowId(),
      JobID: '',
      ProductionStartDate: '',
      WeekNumber: '',
      JobContactLastName: '',
      Model: '',
      Serial: '',
      ProductionValue: '',
      Dealer: '',
      Status: '',
      PreferredCompletion: '',
      Upper_x0020_cabinet: '',
      Lower_x0020_cabinet: '',
      Benchtops: '',
      Splash_x0020_Back: '',
      Exterior: '',
      Decal: '',
      Prot_x0020_Decal: '',
      Remarks: '',
    };

    // Update the state to include the new row
    setData((prevData) => [prevData[0], newRow, ...prevData.slice(1)]);
  };

  //Handle Column Resizing
  React.useEffect(() => {
    if(!loading){
      const getColumns = (data: Field[]): Column[] =>  {
        if (data && data.length > 0 ){
          return Object.keys(data[0]).filter((key) => key !== "RowID").map((key) => ({
            columnId: key,
            width: 400,
            resizable: true
          }));
        }
        else {
          return primaryColumns();
        }
      }
      const columns = getColumns(data);
      setColumns(columns);
    }
    
  }, [data, loading]);
  console.log(columns)

  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
      if (columnIndex !== -1){
        const resizedColumn = prevColumns[columnIndex];
        const updatedColumn = { ...resizedColumn, width };
        prevColumns[columnIndex] = updatedColumn;
        return [...prevColumns];
      }
      return prevColumns;
    });
  }

  return (
    <div>
      <div className="myGrid">
        <div className="d-flex align-items-center justify-content-between">
          <h1>Crusader Schedule Data</h1>
          <button className="btn blue-btn d-flex align-items-center justify-content-between gap-2" onClick={handleAddRow}>
            <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 128 128">
              <path d="M 64 6.0507812 C 49.15 6.0507812 34.3 11.7 23 23 C 0.4 45.6 0.4 82.4 23 105 C 34.3 116.3 49.2 122 64 122 C 78.8 122 93.7 116.3 105 105 C 127.6 82.4 127.6 45.6 105 23 C 93.7 11.7 78.85 6.0507812 64 6.0507812 z M 64 12 C 77.3 12 90.600781 17.099219 100.80078 27.199219 C 121.00078 47.499219 121.00078 80.500781 100.80078 100.80078 C 80.500781 121.10078 47.500781 121.10078 27.300781 100.80078 C 7.0007813 80.500781 6.9992188 47.499219 27.199219 27.199219 C 37.399219 17.099219 50.7 12 64 12 z M 64 42 C 62.3 42 61 43.3 61 45 L 61 61 L 45 61 C 43.3 61 42 62.3 42 64 C 42 65.7 43.3 67 45 67 L 61 67 L 61 83 C 61 84.7 62.3 86 64 86 C 65.7 86 67 84.7 67 83 L 67 67 L 83 67 C 84.7 67 86 65.7 86 64 C 86 62.3 84.7 61 83 61 L 67 61 L 67 45 C 67 43.3 65.7 42 64 42 z"></path>
            </svg>
            <span>Add New</span>
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {isBigScreen ? (
              <>
                <div className="row">
                <div className="col-12">
                  <div className="schedule__data-grid">
                    <div>
                      <ReactGrid stickyTopRows={1}
                        rows={data.map((item) => ({
                          rowId: item.RowID,
                          reorderable: true,
                          cells:
                          [
                            { type: "text", text: item.WeekNumber, nonEditable: isNewRow(item) ? false : true },
                            {
                              type: "text",
                              text: item.ProductionStartDate,
                              nonEditable: isNewRow(item) ? false : true,
                            },
                            { type: "text", text: item.Serial, nonEditable: isNewRow(item) ? false : true },
                            {
                              type: "text",
                              text: item.JobContactLastName,
                              nonEditable: isNewRow(item) ? false : true,
                            },
                            { type: "text", text: item.Model, nonEditable: isNewRow(item) ? false : true },
                            {
                              type: "text",
                              text: item.ProductionValue,
                              nonEditable: isNewRow(item) ? false : true,
                            },
                            { type: "text", text: item.Dealer, nonEditable: isNewRow(item) ? false : true },
                            { type: "text", text: item.Status, nonEditable: isNewRow(item) ? false : true },
                            {
                              type: "text",
                              text: item.PreferredCompletion,
                              nonEditable: isNewRow(item) ? false : true,
                            },
                            { type: "text", text: item.Remarks, nonEditable: false },
                          ],
                        }))}
                        columns={columns}
                        onCellsChanged={handleChanges}
                        onSelectionChanged={handleOpenModal}
                        onRowsReordered={handleRowsReorder}
                        canReorderRows={handleCanReorderRows}
                        onColumnResized={handleColumnResize} 
                        enableRowSelection
                        enableColumnSelection
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
  const weekNumber = Math.ceil(
    (dayOfYear - (8 - startOfWeek.getDay())) / 7
  ).toString();

  if (weekNumber === "NaN") {
    return "";
  }
  return weekNumber;
}

export default ScheduleGrid;
