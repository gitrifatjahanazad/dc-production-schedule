import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import httpClient from "../../https/httpClient";
import ViewOrder from "./view-order";
import Selections from "./selections";
import Options from "./options";
import Variations from "./variations";
import Notes from "./notes";
import Attachments from "./attachments";
import { CircleLoader } from "react-spinners";
import "./orders.css";
import _ from "lodash";
import moment from "moment";
import $ from "jquery";
import useAxiosPrivate from "../../common/useAxiosPrivate";

function Orders() {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(true);
  const [orders, setOrders] = useState<any>();
  const [updatedOrders, setUpdatedOrders] = useState<any>([]);
  const [fileName, setFileName] = useState<any>("");
  const [orderFile, setOrderFile] = useState<any>();
  const [fileUploadEvent, setFileUploadEvent] = useState<any>(null);

  //let updatedOptions: any = null;

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const ordersDataString = localStorage.getItem("orders");
    if (!!ordersDataString) {
      setShowUploader(false);
      const ordersData = JSON.parse(ordersDataString);
      setOrders(ordersData?.orders);
      setFileName(ordersData?.fileName);
    } else {
      deleteOrders();
    }
    localStorage.setItem("updated-options", "");
    localStorage.setItem("updated-selections", "");
    localStorage.setItem("updated-variations", "");
    setUpdatedOrders([]);
  };

  const loadFile = () => {
    $("#load-file").click();
  };

  const handleFileeUpload = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (!!selectedFile) {
      setOrderFile(selectedFile);
      //event.target.value = null;
      setFileUploadEvent(event);
    }
  };

  const handleLoadFileUpload = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (!!selectedFile) {
      try {
        setUpdatedOrders([]);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await axiosPrivate.post("orders/loadCsv", formData);
        setUpdatedOrders(response?.data);
        toast.success("File loaded successfully!");
        setIsLoading(false);
        event.target.value = null;
      } catch (err: any) {
        setIsLoading(false);
        console.error(err);
        toast.error("Failed!");
      }

      // setOrderFile(selectedFile);
      // //event.target.value = null;
      // setFileUploadEvent(event);
    }
  };

  const setOptions = (options: any) => {
    //console.log(options);
    let updatedOptions = { ...options };
    localStorage.setItem("updated-options", JSON.stringify(updatedOptions));
  };

  const setSelections = (selections: any) => {
    let updatedSelections = { ...selections };
    localStorage.setItem(
      "updated-selections",
      JSON.stringify(updatedSelections)
    );
  };

  const setVariations = (variations: any) => {
    let updatedVariations = { ...variations };
    localStorage.setItem(
      "updated-variations",
      JSON.stringify(updatedVariations)
    );
  };

  const getSelections = () => {
    let allSelections = localStorage.getItem("updated-selections");
    let selections = {};
    if (!!allSelections) {
      let updatedSelections: any = JSON.parse(allSelections);
      selections = _.map(orders?.selections, (selection, index) => {
        return {
          area: selection?.area,
          selection: selection?.selection,
          spec: updatedSelections[`selection-spec-${index}`],
          three_d_cad: updatedSelections[`selection-threeDCad-${index}`],
          drawing: updatedSelections[`selection-drawing-${index}`],
          note: updatedSelections[`selection-note-${index}`],
          remarks: updatedSelections[`selection-remarks-${index}`],
        };
      });
    } else {
      selections = _.map(orders?.selections, (selection) => {
        return {
          area: selection?.area,
          selection: selection?.selection,
          spec: true,
          three_d_cad: false,
          drawing: false,
          note: "",
          remarks: "",
        };
      });
    }
    return selections;
  };
  const getVariations = () => {
    let allVariations = localStorage.getItem("updated-variations");
    let variations = {};
    if (!!allVariations) {
      let updatedVariations: any = JSON.parse(allVariations);
      variations = _.map(orders?.variations, (variation, index) => {
        return {
          request: variation?.request,
          added_by: variation?.added_by,
          spec: updatedVariations[`variation-spec-${index}`],
          three_d_cad: updatedVariations[`variation-threeDCad-${index}`],
          drawing: updatedVariations[`variation-drawing-${index}`],
          note: updatedVariations[`variation-note-${index}`],
          remarks: updatedVariations[`variation-remarks-${index}`],
        };
      });
    } else {
      variations = _.map(orders?.variations, (variation) => {
        return {
          request: variation?.request,
          added_by: variation?.added_by,
          spec: true,
          three_d_cad: false,
          drawing: false,
          note: "",
          remarks: "",
        };
      });
    }
    return variations;
  };

  const exportData = async () => {
    let options = {};
    let allOptions = localStorage.getItem("updated-options");
    if (!!allOptions) {
      let updatedOptions: any = JSON.parse(allOptions);
      options = _.map(orders?.options, (op, index) => {
        let notes = Object.keys(updatedOptions)
          .filter(function (k) {
            return k.indexOf(`option-note-${index}-`) !== -1;
          })
          .map(function (key) {
            return updatedOptions[key];
          }, []);
        return {
          description:
            updatedOptions[`description-text-input-${index}`] ||
            updatedOptions[`description-select-input-${index}`] ||
            op.description,
          spec: updatedOptions[`spec-${index}`],
          three_d_cad: updatedOptions[`threeDCad-${index}`],
          drawing: updatedOptions[`drawing-${index}`],
          notes: notes,
          remarks: updatedOptions[`option-remarks-${index}`],
        };
      });
    } else {
      options = _.map(orders?.options, (option) => {
        return {
          description: option.description,
          spec: true,
          three_d_cad: false,
          drawing: false,
          notes: [],
          remarks: "",
        };
      });
    }

    try {
      setIsLoading(true);
      const requestObj = {
        view_orders: getViewOrders(orders?.view_orders),
        options: options,
        variations: getVariations(),
        selections: getSelections(),
      };
      await axiosPrivate.post("orders/saveOrders", requestObj);
      const response = await axiosPrivate.post(
        "orders/prepareAndExport",
        requestObj
      );
      let url = window.URL.createObjectURL(
        new Blob([response?.data], { type: "text/csv" })
      );
      const dcNo = getSepcificViewOrderItem(orders?.view_orders, "Serial");
      let a = document.createElement("a");
      a.href = url;
      a.download = `DC${dcNo?.value}-submission-${moment(new Date()).format(
        "YYYY-MM-DD h:mm:ss"
      )}.csv`;

      a.click();
      a.remove();

      setIsLoading(false);
      reset();
    } catch (ex: any) {
      console.error(ex);
      toast.error("Failed!");
      setIsLoading(false);
    }
    //console.log(options);
  };

  const deleteOrders = async (event: any = null) => {
    event?.preventDefault();
    event?.stopPropagation();
    setOrders(null);
    setShowUploader(true);
    localStorage.setItem("orders", "");
    localStorage.setItem("noteOptions", "");
    localStorage.setItem("updated-options", "");
    localStorage.setItem("updated-selections", "");
    localStorage.setItem("updated-variations", "");
    setUpdatedOrders([]);
  };
  const getSepcificViewOrderItem = (view_orders: any, name: any) => {
    return _.first(
      _.filter(view_orders, (item) => item.property_name === name)
    );
  };
  const getViewOrders = (view_orders: any) => {
    if (!view_orders) {
      return [];
    }
    const model = getSepcificViewOrderItem(view_orders, "Model");
    const dcNo = getSepcificViewOrderItem(view_orders, "Serial");
    const dealer = getSepcificViewOrderItem(view_orders, "Dealer");
    const customer = getSepcificViewOrderItem(view_orders, "Owner");

    return [
      { property_name: "DC No", value: dcNo?.value },
      { property_name: "Model", value: model?.value },
      { property_name: "Dealer", value: dealer?.value },
      { property_name: "Customer", value: customer?.value },
    ];
  };

  const upload = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      if (!!orderFile) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", orderFile);
        const response = await axiosPrivate.post("orders/upload", formData);
        setFileName(orderFile.name);
        const orderData = { fileName: orderFile.name, orders: response.data };
        localStorage.setItem("orders", JSON.stringify(orderData));
        setOrders(response.data);
        toast.success("File uploaded successfully!");
        setIsLoading(false);
        setShowUploader(false);
        fileUploadEvent.target.value = null;
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      toast.error("Failed!");
    }
  };

  return (
    <>
      <div className={isLoading ? "disabled" : ""}>
        <div className="row m-b-10">
          <div className="col-md-12 d-flex justify-content-center">
            <h3>Production Schedule System</h3>
          </div>
        </div>
        {showUploader ? (
          <div className="row m-b-10">
            <div className="col-md-12">
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-shrink-1">
                  <div className="md-3">
                    <label className="form-label">Upload File</label>
                    <input
                      className="form-control"
                      type="file"
                      onChange={handleFileeUpload}
                    ></input>
                  </div>
                </div>
                <div className="d-flex align-items-end">
                  <div>
                    <button className="btn btn-success" onClick={upload}>
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row m-b-10">
            <div className="col-md-12">
              <div className="d-flex justify-content-center">
                <div className="d-flex align-items-center m-r-10">
                  <h5>{fileName || ""}</h5>
                </div>
                <div className="d-flex">
                  <div>
                    <button className="btn btn-danger" onClick={deleteOrders}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {orders && (
          <>
            <div className="row orders-container">
              <div className="col-md-10 order-items">
                <div className="row">
                  <div className="col-md-12">
                    <ViewOrder
                      viewOrders={getViewOrders(orders?.view_orders)}
                    ></ViewOrder>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Selections
                      orders={orders}
                      updatedOrders={updatedOrders}
                      setSelections={setSelections}
                    ></Selections>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Options
                      orders={orders}
                      updatedOrders={updatedOrders}
                      setOptions={setOptions}
                    ></Options>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Variations
                      orders={orders}
                      updatedOrders={updatedOrders}
                      setVariations={setVariations}
                    ></Variations>
                  </div>
                </div>
              </div>
              <div className="col-md-2 order-items">
                <div className="row">
                  <div className="col-md-12">
                    <Notes orders={orders}></Notes>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <Attachments orders={orders}></Attachments>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end p-r-10 p-t-10">
                <input
                  style={{ display: "none" }}
                  id="load-file"
                  type="file"
                  onChange={handleLoadFileUpload}
                ></input>
                <button
                  className="btn btn-success m-r-5"
                  onClick={(event: any) => {
                    event.preventDefault();
                    loadFile();
                  }}
                >
                  Load
                </button>
                <button
                  className="btn btn-success m-r-5"
                  onClick={(event: any) => {
                    event.preventDefault();
                    reset();
                  }}
                >
                  Reset
                </button>
                <button
                  className="btn btn-success"
                  onClick={(event: any) => {
                    event.preventDefault();
                    exportData();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <CircleLoader
        loading={isLoading}
        color="#36d7b7"
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderColor: "#36d7b7",
        }}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  );
}

export default Orders;
