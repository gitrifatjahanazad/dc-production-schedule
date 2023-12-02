import React, { useEffect } from "react";
import uuid from "react-uuid";
// import NoteDropdown from "./note-dropdown";
import { useForm } from "react-hook-form";
import _ from "lodash";

function Variations({ orders, updatedOrders, setVariations }: any) {
  const { register, handleSubmit, watch, setValue } = useForm();

  let variationNotes: any[] = _.map(orders?.variations, (_, index) => {
    return `variation-note-${index}`;
  });

  let variationRemarks: any[] = _.map(orders?.variations, (_, index) => {
    return `variation-remarks-${index}`;
  });

  let variationSpecs: any[] = _.map(orders?.variations, (_, index) => {
    return `variation-spec-${index}`;
  });
  let variationThreeDCads: any[] = _.map(orders?.variations, (_, index) => {
    return `variation-threeDCad-${index}`;
  });
  let variationDrawings: any[] = _.map(orders?.variations, (_, index) => {
    return `variation-drawing-${index}`;
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //console.log(value);
      setVariations({ ...value });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    _.each(orders?.variations, (_, index) => {
      setValue(`variation-note-${index}`, "");
      setValue(`variation-remarks-${index}`, "");
    });

    _.each(variationSpecs, (spec) => {
      setValue(spec, true);
    });
    _.each(variationThreeDCads, (spec) => {
      setValue(spec, false);
    });
    _.each(variationDrawings, (spec) => {
      setValue(spec, false);
    });
  }, [orders]);

  useEffect(() => {
    _.each(orders?.variations, (variation, index: any) => {
      var opt = _.find(updatedOrders?.variations, { id: index + 1 });
      setValue(`variation-note-${index}`, opt?.note || "");
      setValue(`variation-remarks-${index}`, opt?.remarks || "");

      setValue(variationSpecs[index], opt?.spec || variation?.spec || true);
      setValue(
        variationThreeDCads[index],
        opt?.three_d_cad || variation?.three_d_cad || false
      );
      setValue(
        variationDrawings[index],
        opt?.drawing || variation?.drawing || false
      );
    });
  }, [updatedOrders]);

  return (
    <>
      {orders?.variations.length > 0 && (
        <>
          <h5>Variations</h5>
          <div className="order-table">
            <div className="d-flex order-table-header">
              <div className="d-flex w-5">Item No.</div>
              <div className="d-flex w-95">
                <div className="w-33">Requests</div>
                <div className="w-20">Added By</div>
                <div className="w-8">Spec</div>
                <div className="w-8">3D CAD</div>
                <div className="w-8">Drawings</div>
                <div className="w-23">Remarks</div>
              </div>
            </div>
            <div className="order-table-body">
              {orders.variations.map((variation: any, index: any) => (
                <div className="order-table-row" key={uuid()}>
                  <div className="d-flex flex-row">
                    <div className="w-5 d-flex align-items-center">
                      <span>{index + 1}</span>
                    </div>
                    <div className="w-95">
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-row m-b-10">
                          <div className="w-33">{variation?.request}</div>
                          <div className="w-20">{variation?.added_by}</div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(variationSpecs[index])}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(variationThreeDCads[index])}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(variationDrawings[index])}
                            ></input>
                          </div>
                          <div className="w-23">
                            <input
                              className="form-control"
                              type="text"
                              {...register(variationRemarks[index])}
                            ></input>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="">
                            <>
                              <select
                                className=" form-select orders-center-row-values"
                                aria-label="Default select example"
                                disabled={
                                  !orders?.notes?.length ||
                                  orders?.notes.length === 0
                                }
                                {...register(variationNotes[index])}
                              >
                                <option value="">Select Note</option>
                                {orders?.notes?.length && (
                                  <>
                                    {orders?.notes.map((noteData: any) => (
                                      <option
                                        key={uuid()}
                                        value={noteData?.note?.trim()}
                                      >
                                        {noteData?.note}
                                      </option>
                                    ))}
                                  </>
                                )}
                              </select>
                            </>
                            {/* <NoteDropdown notes={orders?.notes}></NoteDropdown> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Variations;
