import * as React from 'react';
import './form-style.css';
function ResponsiveForm(){
    return(
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container text-center pb-3">
                    <h2>Form</h2>
                </div>
                <div className="">
                    <form>
                        <div className="row">
                            <div className="col-12 input_field">
                                <label htmlFor="" className='form-label'>Total Number of Stations</label>
                                <input className='form-control' type="text" name="stationNumber" placeholder="Number of Stations" required />
                            </div>
                            <div className="col-12 col-md-6 input_field">
                                <label htmlFor="" className='form-label'>Station 1 value</label>
                                <input className='form-control' type="text" name="stationOneValue" placeholder="Station 1 Value" required />
                            </div>
                            <div className="col-12 col-md-6 input_field">
                                <label htmlFor="" className='form-label'>Station 1 duration</label>
                                <input className='form-control' type="text" name="stationOneDuration" placeholder="Station 1 Duration" required />
                            </div>
                            <div className="col-12 input_field">
                                <label htmlFor="" className='form-label'>Station 2 Value</label>
                                <input className='form-control' type="text" name="stationTwoDuration" placeholder="Station 2 Value" required />
                            </div>
                            <div className="col-12 input_field">
                                <label htmlFor="" className='form-label'>Calender Limit</label>
                                <input className='form-control' type="text" name="CalenderLimit" placeholder="Calender Limit" required />
                            </div>
                            <div className="col-12 input_field">
                                <label htmlFor="" className='form-label'>Calender Active Year</label>
                                <input className='form-control' type="text" name="CalenderActiveYear" placeholder="Calender Limit" required />
                            </div>
                            <div className="col-9 mx-auto">
                                <input className="btn blue-btn" type="submit" value="Register" />
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
export default ResponsiveForm;