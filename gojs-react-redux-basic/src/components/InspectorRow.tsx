/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

interface InspectorRowProps {
  id: string;
  value: any;
  onInputChange: (field: string, value: any, isBlur: boolean) => void;
}

export const InspectorRow: React.FC<InspectorRowProps> = (props) => {
  const { id, value, onInputChange } = props;

  const handleInputChange = (e: any) => {
    onInputChange(id, e.target.value, e.type === 'blur');
  };

  const formatLocation = (loc: string) => {
    const locArr = loc.split(' ');
    if (locArr.length === 2) {
      const x = parseFloat(locArr[0]);
      const y = parseFloat(locArr[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return `${x.toFixed(0)} ${y.toFixed(0)}`;
      }
    }
    return loc;
  };

  let val = value;
  if (id === 'loc') {
    val = formatLocation(value);
  }
  return (
    <tr>
      <td>{id}</td>
      <td>
        <input
          disabled={id === 'key'}
          value={val}
          onChange={handleInputChange}
          onBlur={handleInputChange}>
        </input>
      </td>
    </tr>
  );
};
