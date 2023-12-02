import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
// import NoteDropdown from "./note-dropdown";
import "./orders.css";
import _ from "lodash";
import { useForm } from "react-hook-form";

function Selections({ orders, updatedOrders, setSelections }: any) {
  //const [specs, setSpec] = useState<any>([]);
  const { register, handleSubmit, watch, setValue } = useForm();

  let selectionSpecs: any[] = _.map(orders?.selections, (_, index) => {
    return `selection-spec-${index}`;
  });
  let selectionThreeDCads: any[] = _.map(orders?.selections, (_, index) => {
    return `selection-threeDCad-${index}`;
  });
  let selectionDrawings: any[] = _.map(orders?.selections, (_, index) => {
    return `selection-drawing-${index}`;
  });
  let selectionNotes: any[] = _.map(orders?.selections, (_, index) => {
    return `selection-note-${index}`;
  });

  let selectionRemarks: any[] = _.map(orders?.selections, (_, index) => {
    return `selection-remarks-${index}`;
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      //console.log(value);
      setSelections({ ...value });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    // let allSpecs = _.map(orders?.selections, (s) => {
    //   return { selected: true };
    // });
    // setSpec([...allSpecs]);

    _.each(orders?.selections, (_, index) => {
      setValue(`selection-note-${index}`, "");
      setValue(`selection-remarks-${index}`, "");
    });

    _.each(selectionSpecs, (spec) => {
      setValue(spec, true);
    });
    _.each(selectionThreeDCads, (spec) => {
      setValue(spec, false);
    });
    _.each(selectionDrawings, (spec) => {
      setValue(spec, false);
    });
  }, [orders]);

  useEffect(() => {
    _.each(orders?.selections, (selection: any, index: any) => {
      var opt = _.find(updatedOrders?.selections, { id: index + 1 });

      setValue(`selection-note-${index}`, opt?.note || "");
      setValue(`selection-remarks-${index}`, opt?.remarks || "");
      setValue(selectionSpecs[index], opt?.spec || selection?.spec || true);
      setValue(
        selectionThreeDCads[index],
        opt?.three_d_cad || selection?.three_d_cad || false
      );
      setValue(
        selectionDrawings[index],
        opt?.drawing || selection?.drawing || false
      );
    });
  }, [updatedOrders]);

  return (
    <>
      {orders?.selections.length > 0 && (
        <>
          <h5>Selection</h5>
          <div className="order-table">
            <div className="d-flex order-table-header">
              <div className="d-flex w-5">Item No.</div>
              <div className="d-flex w-95">
                <div className="w-20">Area</div>
                <div className="w-33">Selection</div>
                <div className="w-8">Spec</div>
                <div className="w-8">3D CAD</div>
                <div className="w-8">Drawings</div>
                <div className="w-23">Remarks</div>
              </div>
            </div>
            <div className="order-table-body">
              {orders.selections.map((selection: any, index: any) => (
                <div className="order-table-row" key={uuid()}>
                  <div className="d-flex flex-row">
                    <div className="w-5 d-flex align-items-center">
                      <span>{index + 1}</span>
                    </div>
                    <div className="w-95">
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-row m-b-10">
                          <div className="w-20">{selection?.area}</div>
                          <div className="w-33">{selection?.selection}</div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(selectionSpecs[index])}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(selectionThreeDCads[index])}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(selectionDrawings[index])}
                            ></input>
                          </div>
                          <div className="w-23">
                            <input
                              className="form-control"
                              type="text"
                              {...register(selectionRemarks[index])}
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
                                {...register(selectionNotes[index])}
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

export default Selections;
