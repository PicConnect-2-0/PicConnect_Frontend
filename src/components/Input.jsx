import React from "react";

export default function Input ({ type, value, onChange, label, className }) {
  return (
    <div className={`w-full pt-6 ${className}`}>
      <label htmlFor={label} className="block text-left font-bold">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full h-10 border-2 border-grey-500 p-2 rounded"
      />
    </div>
  );
}
