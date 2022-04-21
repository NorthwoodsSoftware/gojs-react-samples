/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

import InspectorRow from './InspectorRow';

import './Inspector.css';

export default function SelectionInspector(props) {
  /**
   * Render the object data, passing down property keys and values.
   */
  function renderObjectDetails() {
    const selObj = props.selectedData;
    const dets = [];
    for (const k in selObj) {
      const val = selObj[k];
      const row = <InspectorRow
                    key={k}
                    id={k}
                    value={val}
                    onInputChange={props.onInputChange} />;
      if (k === 'key') {
        dets.unshift(row); // key always at start
      } else {
        dets.push(row);
      }
    }
    return dets;
  }

  return (
    <div id='myInspectorDiv' className='inspector'>
      <table>
        <tbody>
          {renderObjectDetails()}
        </tbody>
      </table>
    </div>
  );
}
