import React from "react";
import { Arrow } from "../icons/arrow";

export const TableHeaderInput = ({ column, label, type = "text", placeholder }) => {
  const isSortedDesc = column.getIsSorted() === "desc";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontWeight: 600,
          lineHeight: "1.2rem",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={column.getToggleSortingHandler()}
      >
        {label}
        <Arrow isDesc={isSortedDesc} />
      </div>
      <input
        type={type}
        value={column.getFilterValue() ?? ""}
        onChange={(e) => column.setFilterValue(type === "number" ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          marginTop: 2,
          padding: "2px 4px",
          borderRadius: 4,
          border: "1px solid #ccc",
          fontSize: "0.85rem",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
