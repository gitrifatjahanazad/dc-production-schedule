import React, { useState, useEffect } from "react";
import moment from "moment";
import { Column, Id, MenuOption, ReactGrid, Row } from "@silevis/reactgrid";

interface DayData {
  weekNumber: number;
  date: string;
  jobId: string;
}
const primaryColumns = (): Column[] => [
    { columnId: "WeekNumber", width: 400},
    { columnId: "ProductionStartDate", width: 400},
    { columnId: "JobId", width: 100 },
  ];

function WeekDays(props: { configData: any; onRowSelect: (selectedRow: any) => void }) {
  const [data, setData] = useState<DayData[]>([]);
  const [columns, setColumns] = React.useState<Column[]>(primaryColumns());
  const { configData, onRowSelect } = props;
  const getColumns = (): Column[] => [
    { columnId: "weekNumber", width: 130},
    { columnId: "productionStartDate", width: 240},
    { columnId: "jobId", width: 100}
  ];
  
  

  const headerRow: Row = {
    rowId: "header",
    cells: [
      { type: "header", text: "Week Number" },
      { type: "header", text: "Production Start Date" },
      { type: "header", text: "Job Id" }
    ]
  };
  const getRows = (dayData: DayData[]): Row[] => [
    headerRow,
    ...dayData.map<Row>((field, idx) => ({
      rowId: idx,
      cells: [
        { type: "number", value: field.weekNumber },
        { type: "text", text: field.date },
        { type: "text", text: field.jobId }
      ]
    }))
  ];
  const generateData = () => {
    const newData: DayData[] = [];
    const year = 2024;

    const mondayVal = parseInt(configData.Monday, 10) ?? 1 ;
    const tuesdayVal = parseInt(configData.Tuesday, 10) ?? 1 ;
    const wednesdayVal = parseInt(configData.Wednesday, 10) ?? 1 ;
    const thursdaydayVal = parseInt(configData.Thursday, 10) ?? 1 ;
    const fridaydayVal = parseInt(configData.Friday, 10) ?? 1 ;

    const totalDays = 366 + mondayVal + tuesdayVal + wednesdayVal + thursdaydayVal + fridaydayVal;

    for (let i = 0; i < totalDays; i++) {
      const cdate = moment(`${year}-01-01`).add(i, 'days');
      const weekNumber = cdate.isoWeek();
      const date = cdate.format('dddd, MMMM DD YYYY');
      if(cdate.isoWeekday() === 1){
        for(let i = 0; i < mondayVal; i++){
          newData.push({ weekNumber, date, jobId: "" });
        }
      }
      else if(cdate.isoWeekday() === 2){
        for(let i = 0; i < tuesdayVal; i++){
          newData.push({ weekNumber, date, jobId: "" });
        }
      }
      else if(cdate.isoWeekday() === 3){
        for(let i = 0; i < wednesdayVal; i++){
          newData.push({ weekNumber, date, jobId: "" });
        }
      }
      else if(cdate.isoWeekday() === 4){
        for(let i = 0; i < thursdaydayVal; i++){
          newData.push({ weekNumber, date, jobId: "" });
        }
      }
      else if(cdate.isoWeekday() === 5){
        for(let i = 0; i < fridaydayVal; i++){
          newData.push({ weekNumber, date, jobId: "" });
        }
      }
      
    }

    // Adjust week numbers if there are more than 52 weeks in the year
    // if (totalWeeksInYear > 52) {
    //   for (let i = 0; i < newData.length; i++) {
    //     if (newData[i].weekNumber === 52 && endDate.isoWeek() === 1) {
    //       newData[i].weekNumber = 53;
    //     }
    //   }
    // }

    setData(newData);
  };
  const rows = getRows(data);
  useEffect(() => {
    let columns = getColumns();
    setColumns(columns);
    generateData();
  }, []);

  const handleSelectJobId = (selectedRowIds: any) => {
    
    if (selectedRowIds.length === 1) {
      const selectedRowId = selectedRowIds[0];
      console.log("Selected Row ID:", selectedRowId);
      onRowSelect(selectedRowId);
    }
  };
  
  return (
    <div className="schedule__calender-grid">
      <ReactGrid  stickyTopRows={1}
        rows={rows} 
        columns={columns} 
        onSelectionChanged={handleSelectJobId}
        enableRowSelection
        //onContextMenu={simpleHandleContextMenu}
      />
    </div>
  );
}

export default WeekDays;
