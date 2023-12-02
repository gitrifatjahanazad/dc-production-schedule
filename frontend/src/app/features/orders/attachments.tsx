import React from "react";
import uuid from "react-uuid";

function Attachments({ orders }: any) {
  return (
    <>
      {orders?.attachments.length > 0 ? (
        <>
          <h5>Attachments {orders.attachments.length}</h5>
          {/* <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">File Name</th>
                <th scope="col">Attached By</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.attachments.map((attachment: any) => (
                <tr key={uuid()}>
                  <td>{attachment?.file_name}</td>
                  <td>{attachment?.attached_by}</td>
                  <td>{attachment?.date}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </>
      ) : (
        <h5>Attachments 0</h5>
      )}
    </>
  );
}

export default Attachments;
