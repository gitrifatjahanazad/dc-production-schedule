import React from "react";
import uuid from "react-uuid";
import "./orders.css";

function NoteDropdown({ notes }: any) {
  return (
    <>
      <select
        className=" form-select orders-center-row-values"
        aria-label="Default select example"
        disabled={!notes?.length || notes.length === 0}
      >
        <option value="">Select Note</option>
        {notes?.length && (
          <>
            {notes.map((noteData: any) => (
              <option key={uuid()} value={noteData?.note}>
                {noteData?.note}
              </option>
            ))}
          </>
        )}
      </select>
    </>
  );
}

export default NoteDropdown;
