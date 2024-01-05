import * as React from "react";
import ScheduleModal from "./ScheduleModal";
import CustomDropDown from "./CustomDropDown";
function ScheduleGridMobile({data}: any){
    const [modalShow, setModalShow] = React.useState(false);
    const [dataItemIndex, setDataItemIndex] = React.useState<number | undefined>();
    
    const handleOpenModal = (index:number) => {
        setModalShow(true);
        setDataItemIndex(index+1);
      }
    return(
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Crusader Schedule Data</h1>
            </div>
            {data.slice(1).map((item:any, index:number) => {
                return (
                    <div className="schedule__data--mobile mb-3" key={index} >
                        <div className="row gx-0 align-items-center" onClick={() => handleOpenModal(index)}>
                            <div className="col-8">
                                <div className="row gx-1">
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">Model:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{item['Model']}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">Chassis number:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{item['Serial']}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">Dealer:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{item['Dealer']}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">Customer Name:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{item['JobContactLastName']}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">Status:</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{item['Status']}</p>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="col-4 d-flex flex-column align-items-end">
                                <div className="d-flex flex-column align-items-end">
                                    <p className="font-sm text-black fw-medium mb-1 rtl">Production Date</p>
                                    <p className="font-sm text-black rtl">{item['ProductionStartDate']}</p>
                                    <p className="font-sm text-black fw-medium mb-1 rtl">Completion Date</p>
                                    <p className="font-sm text-black rtl">{item['PreferredCompletion']}</p>
                                </div>
                            </div>
                        </div>
                        <CustomDropDown/>
                    </div>
                )
            })}
            {modalShow && dataItemIndex !== undefined && (
                <ScheduleModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                data={data}
                index={dataItemIndex}
            />
            )}
        </>
        
    )
}
export default ScheduleGridMobile;