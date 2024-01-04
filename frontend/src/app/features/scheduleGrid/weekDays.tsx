import React, { useState, useEffect } from "react";
import moment from "moment";
import { Column, ReactGrid, Row } from "@silevis/reactgrid";

interface DayData {
  weekNumber: number;
  date: string;
}
const primaryColumns = (): Column[] => [
    { columnId: "WeekNumber", width: 400, resizable: true },
    { columnId: "Date", width: 400, resizable: true },
  ];

function WeekDays() {
  const [data, setData] = useState<DayData[]>([]);
  const [columns, setColumns] = React.useState<Column[]>(primaryColumns());

  const getColumns = (): Column[] => [
    { columnId: "weekNumber", width: 120},
    { columnId: "date", width: 240}
  ];
  
  

  const headerRow: Row = {
    rowId: "header",
    cells: [
      { type: "header", text: "Week Number" },
      { type: "header", text: "Date" }
    ]
  };
  const getRows = (dayData: DayData[]): Row[] => [
    headerRow,
    ...dayData.map<Row>((field, idx) => ({
      rowId: idx,
      cells: [
        { type: "number", value: field.weekNumber },
        { type: "text", text: field.date }
      ]
    }))
  ];
  const generateData = () => {
    const newData: DayData[] = [];
    const year = 2024;
    const endDate = moment(`${year}-12-31`);
    const totalWeeksInYear = moment(`${year}-12-31`).isoWeek();
    
    for (let i = 0; i < 366; i++) {
      const cdate = moment(`${year}-01-01`).add(i, 'days');
      const weekNumber = cdate.isoWeek();
      const date = cdate.format('dddd, MMMM DD YYYY');
      newData.push({ weekNumber, date });
    }

    // Adjust week numbers if there are more than 52 weeks in the year
    if (totalWeeksInYear > 52) {
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].weekNumber === 52 && endDate.isoWeek() === 1) {
          newData[i].weekNumber = 53;
        }
      }
    }

    setData(newData);
  };
  const rows = getRows(data);
//   const columns = getColumns();
  useEffect(() => {
    let columns = getColumns();
    setColumns(columns);
    generateData();
  }, []);

  return (
    <div>
      <ReactGrid 
        rows={rows} 
        columns={columns} 
      />
    </div>
  );
}

export default WeekDays;
