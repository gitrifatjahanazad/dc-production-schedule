import React from "react";
import uuid from "react-uuid";

function ViewOrder({ viewOrders }: any) {
  return (
    <>
      {viewOrders?.length > 0 && (
        <>
          <h5>View Order</h5>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {viewOrders?.length && (
                <>
                  {viewOrders.map((viewOrder: any) => (
                    <tr key={uuid()}>
                      <td>{viewOrder?.property_name}:</td>
                      <td>{viewOrder?.value}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}

export default ViewOrder;
