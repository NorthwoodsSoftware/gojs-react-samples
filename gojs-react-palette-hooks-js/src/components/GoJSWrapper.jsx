/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import React, { useCallback, useEffect, useRef } from 'react';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';

import './GoJSWrapper.css';

export default function GoJSWrapper(props) {
  const diagramRef = useRef(null);

  // add/remove listeners
  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', props.onDiagramEvent);
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener('ChangedSelection', props.onDiagramEvent);
      }
    }
  }, [props.onDiagramEvent]);

  // set whether diagram is read only
  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.isReadOnly = props.readOnly;
    }
  }, [props.readOnly]);

  function initDiagram() {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m, data) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m, data) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                return k;
              }
            })
        });

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'lightgray', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay()
        )
      );

    // relinking depends on modelData
    diagram.linkTemplate =
      $(go.Link,
        new go.Binding('relinkableFrom', 'canRelink').ofModel(),
        new go.Binding('relinkableTo', 'canRelink').ofModel(),
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' })
      );

    return diagram;
  }

  function initPalette() {
    const $ = go.GraphObject.make;
    return $(go.Palette);
  }

  return (
    <div className='gojs-wrapper-div'>
      <ReactPalette
        divClassName='palette-component'
        initPalette={initPalette}
        nodeDataArray={[{ key: 0, text: 'Alpha' }]}
      />
      <ReactDiagram
        ref={diagramRef}
        divClassName='diagram-component'
        initDiagram={initDiagram}
        nodeDataArray={props.nodeDataArray}
        linkDataArray={props.linkDataArray}
        modelData={props.modelData}
        onModelChange={props.onModelChange}
        skipsDiagramUpdate={props.skipsDiagramUpdate}
      />
    </div>
  );
}