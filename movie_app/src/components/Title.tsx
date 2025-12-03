import React from "react";

type Props = {
  category: string;
};

function Title({ category }: Props) {
  return (
    <h1 className="font-extrabold text-2xl">{`${category} of the day`}</h1>
  );
}

export default Title;
