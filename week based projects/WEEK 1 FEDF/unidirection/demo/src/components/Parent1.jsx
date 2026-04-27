import React from "react";
import Child1 from "./Child1";

const Parent1 = () => {
  return (
    <div>
      <h1>Parent Component</h1>

      <Child1 key1="Hello " key2={2026}> </Child1>
    </div>
  );
};

export default Parent1;