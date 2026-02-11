import React from "react";
import { Arrow } from "../icons/arrow";

export const TableHeaderSelect = ({ column, label, options = [], multiple = false }) => {
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
      <select
        multiple={multiple}
        value={column.getFilterValue() ?? (multiple ? [] : "")}
        onChange={(e) => {
          const selected = multiple
            ? Array.from(e.target.selectedOptions, (option) => option.value)
            : e.target.value;
          column.setFilterValue(selected);
        }}
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
      >
        {!multiple && <option value="">All</option>}
        {options.map((o) => (
          <option key={`option-${o}`} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};
