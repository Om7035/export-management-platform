import React from "react";

const ShipmentMetrics = ({ shipments }) => {
  const delayedShipments = shipments.filter((shipment) => shipment.delay).length;
  const onTimeShipments = shipments.length - delayedShipments;

  return (
    <div>
      <h3>Shipment Metrics</h3>
      <p>Total Shipments: {shipments.length}</p>
      <p>On Time: {onTimeShipments}</p>
      <p>Delayed: {delayedShipments}</p>
    </div>
  );
};

export default ShipmentMetrics;
