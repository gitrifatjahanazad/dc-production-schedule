import React from "react";
import uuid from "react-uuid";

function Notes({ orders }: any) {
  return (
    <>
      {orders?.notes.length > 0 && (
        <>
          <h5>Notes</h5>
          <table className="table table-striped table-hover">
            {/* <thead>
              <tr>
                <th scope="col">Notes</th>
                <th scope="col">Added By</th>
              </tr>
            </thead> */}
            <tbody>
              {orders.notes.map((note: any) => (
                <tr key={uuid()}>
                  <td>{note?.note}</td>
                  {/* <td>{note?.added_by}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default Notes;
