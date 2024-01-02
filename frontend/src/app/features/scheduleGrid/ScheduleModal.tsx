import Modal from 'react-bootstrap/Modal';
import CustomDropDown from "./CustomDropDown";

function ScheduleModal(props:any){
    const {data, index} = props;
    const {RowID, ...fields} = data[0];
    const preferredData = data[index];
    // console.log(props);
    return (
        <Modal style={{zIndex: '500000'}}
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
            <div className="row gx-0 gx-lg-2">
                <div className="col-8">
                    {
                        Object.keys(fields).map((key, index) => {
                            return(
                                <div className="row gx-3" key={index}>
                                    <div className="col-6">
                                        <p className="font-sm text-black fw-medium">{data[0][key]}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="font-sm text-black">{preferredData[key]}</p>
                                    </div>
                                </div> 
                            )
                        })
                    }
                </div>
                <div className="col-4 d-flex flex-column align-items-end">
                    <p className="font-sm text-black fw-medium mb-1 rtl">Production Date</p>
                    <p className="font-sm text-black rtl">{preferredData['ProductionStartDate']}</p>
                    <p className="font-sm text-black fw-medium mb-1 rtl">Completion Date</p>
                    <p className="font-sm text-black rtl">{preferredData['PreferredCompletion']}</p>
                    <textarea className="form-control textarea--remarks" aria-label="With textarea" rows={8} cols={0} placeholder="Notes"></textarea>
                    <CustomDropDown/>  
                </div>
            </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={props.onHide}>Close</button>
      </Modal.Footer>
        </Modal>
    )
}
export default ScheduleModal;