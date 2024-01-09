import { Id, ReactGrid } from "@silevis/reactgrid";
import React from "react";
import { useMediaQuery } from "react-responsive";
import { useLocation } from "react-router-dom";
import "./style.css";

const { REACT_APP_API_BASE_URL } = process.env;

interface Field {
    row_id: string;
    week_no: string;
    prod_start_date: string;
    chassis_no: string;
    customer_name: string;
    model: string;
    dealer: string;
    completion_date: string;
    notes: string;
    chassis_notes: string;
    electrical_system: string;
    updagrade_pack: string;
    drawn_by: string;
    drawn_date: string;
}
interface Column {
    readonly columnId: Id;
    readonly width?: number;
    readonly reorderable?: boolean;
    readonly resizable?: boolean;
  }
const primaryColumns = (): Column[] => [
    { columnId: "Week", width: 40},
    { columnId: "Pd Start Date", width: 180},
    { columnId: "Chassis No", width: 80},
    { columnId: "Customer Name", width: 100},
    { columnId: "Model", width: 100},
    { columnId: "Dealer", width: 140},
    { columnId: "Completion Date", width: 100},
    { columnId: "Notes", width: 100},
    { columnId: "Chassis Notes", width: 100},
    { columnId: "Electrical System", width: 100},
    { columnId: "Upgrade Pack", width: 100},
    { columnId: "Drawn By", width: 100},
    { columnId: "Drawn Date", width: 100},
  ];

function Schedule(){
    console.log("test")
    const isBigScreen = useMediaQuery({ query: "(min-width: 992px)" });
    const [data, setData] = React.useState<Field[]>([]);
    const [loading, setLoading] = React.useState(true);
    // const [modalShow, setModalShow] = React.useState(false);
    // const [dataItemIndex, setDataItemIndex] = React.useState<number | undefined>();
    const [columns, setColumns] = React.useState<Column[]>(primaryColumns());
    // const [selectedPDSData, setSelectedPDSData] = React.useState<any>();

    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(400);
    const [totalItems, setTotalItems] = React.useState(0);
    // const [configData, setConfigData] = React.useState<any>();
    
    const location = useLocation();
    const searchQuery  = location.state;

    React.useEffect(() => {
        
        const fetchData = async (srcQuery?: any) => {
          setLoading(true);
          
          const query = !srcQuery ? `page_num=${currentPage}&page_size=${pageSize}` : `query=${srcQuery}`;
    
          try {
            // const configResponse = await fetch(`${REACT_APP_API_BASE_URL}/get_configuration_info`);
            // const configResponseData = await configResponse.json();
            // setPageSize(configResponseData["Items per page"]);
            // setConfigData(configResponseData);
            // console.log(configData);
            const response = await fetch(`${REACT_APP_API_BASE_URL}/merged_data?${query}`);
            const responseData = await response.json();
            const headerAddedData: Field[] = [
              {
                row_id: "Row Id",
                week_no: "Week",
                prod_start_date: "Production Start Date",
                chassis_no: "Chassis Number",
                customer_name: "Customer Name",
                model: "Model",
                dealer: "Dealer",
                completion_date: "Completion Date",
                notes: "Notes",
                chassis_notes: "Chassis Notes",
                electrical_system: "Electrical System",
                updagrade_pack: "Upgrade Pack",
                drawn_by: "Drawnn By",
                drawn_date: "Drawn Date"
              },
              ...responseData.data,
            ];
            
            let rowIdStart = 0;
            for (let index = 0; index < headerAddedData.length; index++) {
                
                const field = headerAddedData[index];
        
                if (index !== 0) {
                  field.row_id = rowIdStart.toString();
                  rowIdStart += 1;
                }
                headerAddedData[index] = field;
              }
            setData(headerAddedData);
            setLoading(false);
            setTotalItems(responseData.total_items);
          } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
          }
        };
        fetchData(searchQuery);
        // Set up an interval to fetch data every 5 minutes (300,000 milliseconds)
        const intervalId = setInterval(fetchData, 300000);
        
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    
    }, [pageSize, searchQuery, currentPage]);
    
    React.useEffect(() => {
        if(!loading){
        
            const getColumns = (data: Field[]): Column[] => [
                { columnId: "Week", width: 20},
                { columnId: "Pd Start Date", width: 30},
                { columnId: "Chassis No", width: 140},
                { columnId: "Customer Name", width: 140},
                { columnId: "Model", width: 320},
                { columnId: "Dealer", width: 150},
                { columnId: "Completion Date", width: 200, resizable: true },
                { columnId: "Notes", width: 200},
                { columnId: "Chassis Notes", width: 150},
                { columnId: "Electrical System", width: 100},
                { columnId: "Drawn By", width: 100},
                { columnId: "Drawn Date", width: 100},
            ]
            const columns = getColumns(data);
            setColumns(columns);
        }
    }, []);

    const handleAddRow = () => {

        const newRow: Field = {
            row_id: getNewRowId(),
            week_no: '',
            prod_start_date: '',
            chassis_no: '',
            customer_name: '',
            model: '',
            dealer: '',
            completion_date: '',
            notes: '',
            chassis_notes: '',
            electrical_system: '',
            updagrade_pack: '',
            drawn_by: '',
            drawn_date: '',
        };

        // Update the state to include the new row
        setData((prevData) => [prevData[0], newRow, ...prevData.slice(1)]);
    };
    const getNewRowId = () => {
        // Check if the array is not empty
        if (data.length > 0) {
            const lastRowID = parseInt(data[data.length - 1].row_id, 10);
            const newRowId = lastRowID + 999999;
            return newRowId.toString();
        }
        else{
            return '';
        }
    }
    const isNewRow = (row:Field) => {
        // Check if the row has the RowID of a new row
        return row.row_id === getNewRowId();
    };

    return(
        <div>
            <div className="myGrid">
                
                {loading ? (
                    <p>Loading...</p>
                ) : (
                <>
                    {isBigScreen ? (
                    <>
                    <div className="d-flex align-items-center justify-content-between">
                        <h1>Crusader Schedule Data</h1>
                    </div>
                        <div className="row">
                        <div className="col-12">
                            <div className="schedule__data-grid_user">
                            <div>
                                <ReactGrid stickyTopRows={1}
                                rows={data.map((item) => ({
                                    rowId: item.row_id,
                                    reorderable: true,
                                    cells:
                                    [
                                        { 
                                            type: "text", 
                                            text: item.week_no, 
                                        },
                                        {
                                            type: "text",
                                            text: item.prod_start_date
                                        },
                                        { 
                                            type: "text", 
                                            text: item.chassis_no
                                        },
                                        {
                                            type: "text",
                                            text: item.customer_name
                                        },
                                        { 
                                            type: "text", 
                                            text: item.model
                                        },
                                        { 
                                            type: "text", 
                                            text: item.dealer 
                                        },
                                        {
                                            type: "text",
                                            text: item.completion_date,
                                        },
                                        { 
                                            type: "text", 
                                            text: item.notes 
                                        },
                                        { 
                                            type: "text", 
                                            text: item.chassis_notes 
                                        },
                                        {
                                            type: "text", 
                                            text: item.electrical_system 
                                        },
                                        {
                                            type: "text", 
                                            text: item.updagrade_pack 
                                        },
                                        {
                                            type: "text", 
                                            text: item.drawn_by 
                                        },
                                        {
                                            type: "text", 
                                            text: item.drawn_date 
                                        },
                                    ],
                                }))}
                                columns={columns}
                                // onCellsChanged={handleChanges}
                                // onSelectionChanged={handleOpenModal}
                                // onRowsReordered={handleRowsReorder}
                                // canReorderRows={handleCanReorderRows}
                                // onColumnResized={handleColumnResize} 
                                // enableRowSelection
                                // enableColumnSelection
                                />
                            </div>
                            </div>
                            {/* <ReactPaginate
                                previousLabel={"<<"}
                                nextLabel={">>"}
                                breakLabel={"..."}
                                pageCount={Math.ceil(totalItems/pageSize)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination justify-content-center"}
                                pageClassName={"page-item"}
                                pageLinkClassName={"page-link"}
                                previousClassName={"page-item"}
                                previousLinkClassName={"page-link"}
                                nextClassName={"page-item"}
                                nextLinkClassName={"page-link"}
                                breakClassName={"page-item"}
                                breakLinkClassName={"page-link"}
                                activeClassName={"active"}
                                forcePage={currentPage - 1}
                            /> */}
                        </div>
                    </div>
                    {/* {modalShow && dataItemIndex !== undefined && (
                        <ScheduleModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        data={data}
                        index={dataItemIndex}
                        />
                    )} */}
                    </>
                    
                    ) : (
                        <div></div>
                    )}
                </>
                )}
            </div>
            </div>
    );
}

export default Schedule;