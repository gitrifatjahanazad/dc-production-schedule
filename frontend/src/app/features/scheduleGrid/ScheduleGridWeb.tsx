import * as React from "react";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./style.css";

function ScheduleGridWeb({data, validFields}:any){
    return (
        <div className="row">
            <div className="col-12">
              <div className="schedule__data-grid">
                <div>
                    <ReactGrid stickyTopRows={1}
                        rows={data.map((item: any, index:number) => {
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
    )

}
export default ScheduleGridWeb;