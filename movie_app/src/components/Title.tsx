// import React from "react";

type Props = {
  category: string;
};

function Title({ category }: Props) {
  return (
    <h1 className="font-extrabold text-4xl underline decoration-red-500 underline-offset-10">{`${category} of the day`}</h1>
  );
}

export default Title;
