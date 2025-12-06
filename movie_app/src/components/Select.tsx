// import { useState } from "react";

type Props = {
  change: (value: string) => void;
  value: string;
  options: string[];
  childrenClassName?: string;
};

function Select({ change, value, options, childrenClassName }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => change(event.target.value)}
      className={childrenClassName}
    >
      {options.map((option) => {
        return (
          <option key={option} value={option} className="bg-white/5 text-black">
            {option}
          </option>
        );
      })}
    </select>
  );
}

export default Select;
