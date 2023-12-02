import React, { useEffect, useState } from "react";
// import NoteDropdown from "./note-dropdown";
import "./orders.css";
import _ from "lodash";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import $ from "jquery";

function Options({ orders, updatedOrders, setOptions }: any) {
  //const [specs, setSpec] = useState<any>([]);

  const { register, handleSubmit, watch, setValue } = useForm();

  let updatedTextDescriptons: any[] = _.map(orders?.options, (_, index) => {
    return "description-text-input-" + index;
  });
  let updatedDescriptons: any[] = _.map(orders?.options, (_, index) => {
    return "description-select-input-" + index;
  });
  const descriptionRefs: any = React.useRef([]);
  let specs: any[] = _.map(orders?.options, (_, index) => {
    return `spec-${index}`;
  });
  let threeDCads: any[] = _.map(orders?.options, (_, index) => {
    return `threeDCad-${index}`;
  });
  let drawings: any[] = _.map(orders?.options, (_, index) => {
    return `drawing-${index}`;
  });
  let optionRemarks: any[] = _.map(orders?.options, (_, index) => {
    return `option-remarks-${index}`;
  });
  const isCheckBox = (name: any) => {
    return _.indexOf("spec,threeDCad,drawing".split(","), name) !== -1;
  };
  const getNumberOfNoteDropdowns = (option: any) => {
    if (
      option.description.toLowerCase().includes("specify location in notes")
    ) {
      return parseInt(option.quantity) || 1;
    }
    return 1;
  };
  let selectedNotes: any[][] = _.map(orders?.options, (option, index) => {
    let numberOfDropdowns = getNumberOfNoteDropdowns(option);
    if (numberOfDropdowns === 1) {
      return ["option-note-" + index + "-0"];
    }
    return _.map(Array.from(Array(numberOfDropdowns).keys()), (_, ind) => {
      return "option-note-" + index + "-" + ind;
    });
  });
  const getNotes = (keywords: any, notes: any, index: any) => {
    //return notes;
    if (!keywords || keywords.length === 0) {
      return [];
    }
    let allNotes = _.flatten(
      _.map(keywords, (keyword: any) => {
        return _.filter(notes, (note: any) => {
          return note.note.toLowerCase().includes(keyword.toLowerCase());
        });
      })
    );
    return allNotes;
  };
  useEffect(() => {
    //console.log(selectedNotes);
    const subscription = watch((value, { name, type }) => {
      //console.log(value, name, type);
      setOptions({ ...value });
      let nameParts = name?.split("-") || [];
      if (
        !isCheckBox(_.first(nameParts)) &&
        nameParts[1] !== "note" &&
        nameParts[1] !== "remarks"
      ) {
        let index: any = _.last(nameParts);
        const currentVal = value[name || ""];
        let ref = descriptionRefs.current[index];
        if (nameParts[1] === "select" && currentVal === "") {
          $("#select-" + index).toggleClass("display-none");
          $("#input-" + index).toggleClass("display-none");
          setValue(updatedTextDescriptons[index], "");
          $("#input-btn-" + index).toggleClass("display-none");
          ref.classList.remove("description-cross");
        } else {
          if (!!currentVal && ref.textContent !== currentVal) {
            ref.classList.remove("description-cross");
            ref.classList.add("description-cross");
          } else {
            ref.classList.remove("description-cross");
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    var len = selectedNotes.length;
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < selectedNotes[i].length; j++) {
        setValue(selectedNotes[i][j], "");
      }
    }
    // _.each(orders?.options, (option, index) => {
    //   setValue("description-select-input-" + index, option.description);
    // });
    // _.each(orders?.options, (_, index) => {
    //   setValue(`description-text-input-${index}`, "");
    // });

    _.each(orders?.options, (option: any, index: any) => {
      setValue("description-select-input-" + index, option.description);
      setValue(`description-text-input-${index}`, "");
      setValue(`option-remarks-${index}`, "");
      setValue(specs[index], option?.spec);
      setValue(threeDCads[index], option?.three_d_cad);
      setValue(drawings[index], option?.drawing);
    });
  }, [orders]);

  useEffect(() => {
    _.each(orders?.options, (option: any, index: any) => {
      var opt = _.find(updatedOrders?.options, { id: index + 1 });

      if (!_.isEmpty(opt)) {
        for (var j = 0; j < selectedNotes[index].length; j++) {
          setValue(selectedNotes[index][j], opt.notes[j]);
        }
      }

      if (!_.isEmpty(opt)) {
        if (
          !_.isEmpty(
            _.find(option.options, (op) => op.description === opt?.description)
          )
        ) {
          setValue("description-select-input-" + index, opt?.description);
          setValue(`description-text-input-${index}`, "");
        } else {
          setValue(`description-text-input-${index}`, opt.description);
          if (option.options.length > 1) {
            $("#select-" + index).toggleClass("display-none");
            $("#input-" + index).toggleClass("display-none");
            $("#input-btn-" + index).toggleClass("display-none");
            let ref = descriptionRefs.current[index];
            ref.classList.add("description-cross");
          }
        }
      } else {
        setValue("description-select-input-" + index, option.description);
      }
      setValue(`option-remarks-${index}`, opt?.remarks || "");
      setValue(specs[index], opt?.spec || option?.spec);
      setValue(threeDCads[index], opt?.three_d_cad || option?.three_d_cad);
      setValue(drawings[index], opt?.drawing || option?.drawing);
    });
  }, [updatedOrders]);

  const showDropdown = (event: any, description: any, index: any) => {
    event.stopPropagation();
    event.preventDefault();
    $("#select-" + index).toggleClass("display-none");
    $("#input-" + index).toggleClass("display-none");
    $("#input-btn-" + index).toggleClass("display-none");
    let ref = descriptionRefs.current[index];
    ref.classList.remove("description-cross");
    setValue(updatedDescriptons[index], description);
    setValue(updatedTextDescriptons[index], "");
  };
  const getDropdownWidth = (option: any) => {
    return 100 / (1 + getNumberOfNoteDropdowns(option));
  };
  return (
    <>
      {orders?.options.length && (
        <>
          <h5>Options</h5>
          <div className="order-table">
            <div className="d-flex order-table-header">
              <div className="d-flex w-5">Item No.</div>
              <div className="d-flex w-95">
                <div className="w-45">Description</div>
                <div className="w-8">Qty</div>
                <div className="w-8">Spec</div>
                <div className="w-8">3D CAD</div>
                <div className="w-8">Drawings</div>
                <div className="w-23">Remarks</div>
              </div>
            </div>
            <div className="order-table-body">
              {orders.options.map((option: any, index: any) => (
                <div className="order-table-row" key={uuid()}>
                  <div className="d-flex flex-row">
                    <div className="w-5 d-flex align-items-center">
                      <span>{index + 1}</span>
                    </div>
                    <div className="w-95">
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-row m-b-10">
                          <div
                            className="w-45"
                            ref={(el) => (descriptionRefs.current[index] = el)}
                          >
                            {option?.description}
                          </div>
                          <div className="w-8">{option?.quantity}</div>
                          <div className="w-8">
                            <input
                              className="spec-checkbox"
                              type="checkbox"
                              //defaultChecked={true}
                              {...register(specs[index])}
                              //checked={specs[index]}
                              // onChange={(event) => {
                              //   let allSpecs = [...specs];
                              //   allSpecs[index].selected = event.target.checked;
                              //   setSpec([...allSpecs]);
                              // }}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(threeDCads[index])}
                            ></input>
                          </div>
                          <div className="w-8">
                            <input
                              type="checkbox"
                              {...register(drawings[index])}
                            ></input>
                          </div>
                          <div className="w-23">
                            <input
                              className="form-control"
                              type="text"
                              {...register(optionRemarks[index])}
                            ></input>
                          </div>
                        </div>
                        <div className="d-flex flex-row">
                          <div
                            className=""
                            style={{ width: `${getDropdownWidth(option)}%` }}
                          >
                            <>
                              <select
                                className={
                                  "form-select option-dropdown" +
                                  (option.options.length > 1
                                    ? ""
                                    : " display-none")
                                }
                                aria-label="Default select example"
                                // defaultValue={option?.description}
                                {...register(updatedDescriptons[index])}
                                id={"select-" + index}
                              >
                                {option?.options?.length && (
                                  <>
                                    {option.options.map((option: any) => (
                                      <option
                                        key={uuid()}
                                        value={option.description}
                                      >
                                        {option.description}
                                      </option>
                                    ))}
                                    <option value="">--Type--</option>
                                  </>
                                )}
                              </select>
                              {option.options.length > 1 ? (
                                <>
                                  <div className="input-group">
                                    <input
                                      type="text"
                                      {...register(
                                        updatedTextDescriptons[index]
                                      )}
                                      className={
                                        "form-control option-input" +
                                        (option.options.length > 1
                                          ? " display-none"
                                          : "")
                                      }
                                      placeholder="Type Here"
                                      aria-label="Recipient's username"
                                      aria-describedby="button-addon2"
                                      id={"input-" + index}
                                    ></input>
                                    <button
                                      className="btn btn-outline-secondary pdding-5 display-none optoin-textbox-remove-btn"
                                      type="button"
                                      id={"input-btn-" + index}
                                      onClick={(event) => {
                                        showDropdown(
                                          event,
                                          option?.description,
                                          index
                                        );
                                      }}
                                    >
                                      Dropdown
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <input
                                  type="text"
                                  {...register(updatedTextDescriptons[index])}
                                  className={
                                    "form-control option-input" +
                                    (option.options.length > 1
                                      ? " display-none"
                                      : "")
                                  }
                                  placeholder="Type Here"
                                  aria-label="Recipient's username"
                                  aria-describedby="button-addon2"
                                  id={"input-" + index}
                                ></input>
                              )}
                            </>
                          </div>
                          {Array(getNumberOfNoteDropdowns(option))
                            .fill(0)
                            .map((_, ind) => {
                              let notes = getNotes(
                                option?.note_keywords,
                                orders?.notes,
                                index
                              );
                              // console.log(index + " " + ind);
                              // console.log(selectedNotes[index][ind]);
                              return (
                                <div
                                  key={uuid()}
                                  className="p-l-10"
                                  style={{
                                    width: `${getDropdownWidth(option)}%`,
                                  }}
                                >
                                  <>
                                    <select
                                      className=" form-select orders-center-row-values"
                                      aria-label="Default select example"
                                      disabled={
                                        !notes?.length || notes.length === 0
                                      }
                                      {...register(selectedNotes[index][ind])}
                                    >
                                      <option value="">Select Note</option>
                                      {notes?.length && (
                                        <>
                                          {notes.map((noteData: any) => (
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

                                  {/* <NoteDropdown
                                  notes={getNotes(
                                    option?.description,
                                    orders?.notes
                                  )}
                                ></NoteDropdown> */}
                                </div>
                              );
                            })}
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

export default Options;
