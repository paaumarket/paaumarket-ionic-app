import React from "react";

export default function repeatComponent(element, n) {
  return Array(n)
    .fill(element)
    .map((v, i) =>
      React.createElement(React.Fragment, {
        key: i,
        children: v,
      })
    );
}
