/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

import { InspectorRow } from './InspectorRow';

import './Inspector.css';

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: string, isBlur: boolean) => void;
}

export const SelectionInspector: React.FC<SelectionInspectorProps> = (props) => {
  const { selectedData, onInputChange } = props;

  const renderObjectDetails = () => {
    const dets = [];
    for (const k in selectedData) {
      const val = selectedData[k];
      const row = <InspectorRow
                    key={k}
                    id={k}
                    value={val}
                    onInputChange={onInputChange}
                     />;
      if (k === 'key') {
        dets.unshift(row); // key always at start
      } else {
        dets.push(row);
      }
    }
    return dets;
  };

  return (
    <div id='myInspectorDiv' className='inspector'>
      <table>
        <tbody>
          {renderObjectDetails()}
        </tbody>
      </table>
    </div>
  );
};
