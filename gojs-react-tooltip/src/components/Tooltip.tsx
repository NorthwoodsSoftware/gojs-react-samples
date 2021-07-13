/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';

import './Tooltip.css';

interface TooltipProps {
  text: string;
  x: number;
  y: number;
}

export class ToolTip extends React.PureComponent<TooltipProps, {}> {
  public render() {
    return <div id='myTooltipDiv' className='tooltip' style={{top: this.props.y, left: this.props.x}}>{this.props.text}</div>
  }
}