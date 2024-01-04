import React, { useState, useEffect } from "react";
import "./settingsTextForm.css";

const ProductionForm = () => {
  const { REACT_APP_API_BASE_URL } = process.env;
  const [productionTargets, setProductionTargets] = useState({
    Monday: 7,
    Tuesday: 7,
    Wednesday: 7,
    Thursday: 6,
    Friday: 6,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`${REACT_APP_API_BASE_URL}/get_configuration_info`)
      .then((response) => response.json())
      .then((data) => {
        setProductionTargets({
          Monday: data.Monday,
          Tuesday: data.Tuesday,
          Wednesday: data.Wednesday,
          Thursday: data.Thursday,
          Friday: data.Friday,
        });
        const wallPrepStartNoElement = document.getElementById(
          "wallPrepStartNo"
        ) as HTMLInputElement;
        if (wallPrepStartNoElement) {
          wallPrepStartNoElement.value = data["Wall prep = Start No. + "];
        }

        const doorsStartNoElement = document.getElementById(
          "doorsStartNo"
        ) as HTMLInputElement;
        if (doorsStartNoElement) {
          doorsStartNoElement.value = data["Doors = Start No. - "];
        }

        const furnitureElement = document.getElementById(
          "furnitureStartNo"
        ) as HTMLInputElement;
        if (furnitureElement) {
          furnitureElement.value = data["Furniture = Start No. + "];
        }

        const cncElement = document.getElementById(
          "cncStartNo"
        ) as HTMLInputElement;
        if (cncElement) {
          cncElement.value = data["CNC = Start No. + "];
        }

        const timeIntervalElement = document.getElementById(
          "intervalInMinute"
        ) as HTMLInputElement;
        if (timeIntervalElement) {
          timeIntervalElement.value = data["Job Progress per Station"];
        }

        const excelPathElement = document.getElementById(
          "excelPath"
        ) as HTMLInputElement;
        if (excelPathElement) {
          excelPathElement.value =
            data["Main Line Daily Production Schedule Excel Path"];
        }

        const fileSavingTimeElement = document.getElementById(
          "fileSavedAt"
        ) as HTMLInputElement;
        if (fileSavingTimeElement) {
          fileSavingTimeElement.value = data["File save at"];
        }
        const itemsPerPageElement = document.getElementById(
          "itemsPerPage"
        ) as HTMLInputElement;
        if (itemsPerPageElement) {
          itemsPerPageElement.value = data["Items per page"];
        }
      })
      .catch((error) => {
        console.error("Error fetching configuration info:", error);
      });
  }, []);

  const handleDayChange = (day: string, value: number) => {
    setProductionTargets((prevTargets) => ({
      ...prevTargets,
      [day]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    const getElementValue = (id: string): string => {
      const element = document.getElementById(id) as HTMLInputElement | null;
      return element?.value || "";
    };

    const updatedData = {
      Monday: productionTargets.Monday.toString(),
      Tuesday: productionTargets.Tuesday.toString(),
      Wednesday: productionTargets.Wednesday.toString(),
      Thursday: productionTargets.Thursday.toString(),
      Friday: productionTargets.Friday.toString(),
      Job_Progress_per_Station: getElementValue("intervalInMinute"),
      Wall_prep_Start_No: getElementValue("wallPrepStartNo"),
      Roofs_Floor_Lino_Assembly: "",
      Doors_Start_No: getElementValue("doorsStartNo"),
      Furniture_Start_No: getElementValue("furnitureStartNo"),
      CNC_Start_No: getElementValue("cncStartNo"),
      Main_Line_Daily_Production_Schedule_Excel_Path:
        getElementValue("excelPath"),
      File_save_at: getElementValue("fileSavedAt"),
      Items_per_page: getElementValue("itemsPerPage"),
    };
    fetch(`${REACT_APP_API_BASE_URL}/update_configuration_info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => updatedData)
      .then((updatedData) => {
        console.log("Configuration info updated successfully:", updatedData);
      })
      .catch((error) => {
        console.error("Error updating configuration info:", error);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <h1 className="container text-center">Configurations</h1>
        <div className="col-md-6  text-center mx-auto bordered-section">
          <h2 className="container text-center">Production Target per Day</h2>
          {Object.entries(productionTargets).map(([day, value]) => (
            <div key={day} className="form-group">
              <label className="d-flex align-items-center">
                <span className="mr-2">{day}:</span>
                <select
                  className="form-control"
                  value={value}
                  onChange={(e) =>
                    handleDayChange(day, parseInt(e.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>

        <div className="col-md-6  text-center bordered-section">
          <h2 className="container text-center">Job Progress per Station</h2>
          <div className="form-group d-flex">
            <div className="d-flex align-items-center">
              <label htmlFor="inputPassword2" className="mr-2 label-width ">
                Wall prep:
              </label>
            </div>
            <input
              className="input form-control input-short"
              type="text"
              placeholder="Start No. +"
              readOnly
            ></input>
            <input
              type="input"
              className="input form-control input-shorter"
              id="wallPrepStartNo"
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group d-flex">
            <div className="d-flex align-items-center">
              <label htmlFor="inputPassword2" className="mr-2 label-width">
                Roofs:
              </label>
            </div>
            <input
              className="input form-control input-roof"
              type="text"
              placeholder=" Floor & Lino Assembly"
              readOnly
            ></input>
          </div>
          <div className="form-group d-flex">
            <div className="d-flex align-items-center">
              <label htmlFor="inputPassword2" className="mr-2 label-width ">
                Doors:
              </label>
            </div>
            <input
              className="input form-control input-short"
              type="text"
              placeholder="Start No. -"
              readOnly
            ></input>
            <input
              type="input"
              className="input form-control input-shorter"
              id="doorsStartNo"
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group d-flex">
            <div className="d-flex align-items-center">
              <label htmlFor="inputPassword2" className="mr-2 label-width ">
                Furniture:
              </label>
            </div>
            <input
              className="input form-control input-short"
              type="text"
              placeholder="Start No. +"
              readOnly
            ></input>
            <input
              type="input"
              className="input form-control input-shorter"
              id="furnitureStartNo"
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group d-flex">
            <div className="d-flex align-items-center">
              <label htmlFor="inputPassword2" className="mr-2 label-width">
                CNC:
              </label>
            </div>
            <input
              className="input form-control input-short"
              type="text"
              placeholder="Start No. +"
              readOnly
            ></input>
            <input
              type="input"
              className="input form-control input-shorter"
              id="cncStartNo"
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>
      <h3>Station Changing Interval in Minute:</h3>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="intervalInMinute"
          readOnly={!isEditing}
        />
      </div>

      <h3>Main Line Daily Production Schedule Excel Path:</h3>
      <div className="form-group">
        <label>Current Excel Path:</label>
        <input
          type="text"
          className="form-control"
          id="excelPath"
          readOnly={!isEditing}
        />
      </div>

      <h3>File Save At:</h3>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="fileSavedAt"
          readOnly={!isEditing}
        />
      </div>
      <h3>Item Per Page:</h3>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          id="itemsPerPage"
          readOnly={!isEditing}
        />
      </div>
      <div className="col-md-6 mx-auto text-center">
        {isEditing ? (
          <button className="btn btn-primary" onClick={handleSaveClick}>
            Save
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleEditClick}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductionForm;
