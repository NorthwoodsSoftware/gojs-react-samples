/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          layout: $(go.ForceDirectedLayout),
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m: go.Model, data: any) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                data.key = k;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                data.key = k;
                return k;
              }
            })
        });

    const nodeHoverAdornment =
      $(go.Adornment, 'Spot',
        {
          background: 'transparent',
          alignment: go.Spot.Right,
          // hide the Adornment when the mouse leaves it
          mouseLeave: function (e, obj) {
            var ad = obj.part as go.Adornment;
            ad.adornedPart?.removeAdornment('mouseHover');
          },
        },
        $(go.Placeholder, {
          background: 'transparent', // to allow this Placeholder to be "seen" by mouse events
          isActionable: true, // needed because this is in a temporary Layer
          click: (e: go.InputEvent, obj: go.GraphObject) => {
            var node = (obj.part as go.Adornment).adornedPart;
            node?.diagram?.select(node);
          },
        }),
        $(go.Panel, 'Auto', // this whole Panel is a link label
          { name: 'TESTPANEL', alignment: go.Spot.RightCenter, alignmentFocus: go.Spot.RightCenter },
          $(go.Shape, 'RoundedRectangle',
            {
              name: 'MENU_SHAPE',
              fill: 'white',
              strokeWidth: 0,
              cursor: 'pointer',
              height: 40,
            }
          ),
          $('Button',
            {
              'ButtonBorder.fill': 'white',
              'ButtonBorder.stroke': 'white',
              _buttonFillOver: '#EFF1F3',
              _buttonStrokeOver: '#EFF1F3',
              width: 100
            },
            $(go.TextBlock, 'View details', { margin: 4, alignment: go.Spot.Left })
          )
        )
      );

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        // {
        //   selectionAdornmentTemplate:
        //     $(go.Adornment, 'Spot',
        //       $(go.Panel, 'Auto',
        //         $(go.Shape, { fill: null, stroke: 'dodgerblue', strokeWidth: 3 }),
        //         $(go.Placeholder)
        //       ),
        //       $('Button',
        //         {
        //           alignment: go.Spot.TopRight, alignmentFocus: go.Spot.BottomRight,
        //           mouseEnter: (e, obj) => {
        //             var node = obj.part;
        //             nodeHoverAdornment.adornedObject = node;
        //             node?.addAdornment('mouseHover', nodeHoverAdornment);
        //           }
        //         },
        //         $(go.TextBlock, 'View')
        //       )
        //     )
        // },
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '10px sans-serif' },  // some room around the text
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

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName='diagram-component'
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
