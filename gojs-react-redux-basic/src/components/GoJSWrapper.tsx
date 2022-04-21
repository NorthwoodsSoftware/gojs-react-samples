/*
*  Copyright (C) 1998-2022 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import * as React from 'react';
import { batch, connect } from 'react-redux';

import { DiagramWrapper } from './Diagram';

import { AppState } from '../store';

import { insertLink, insertNode, modifyLink, modifyModel, modifyNode, removeLinks, removeNodes, setSkips } from '../store/diagram/actions';
import { changeInspected, editInspected } from '../store/inspector/actions';
import { SelectionInspector } from './SelectionInspector';

import { KeyService } from '../services/KeyService';

interface StateProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  selectedData: go.ObjectData | null;
}

interface DispatchProps {
  insertLink: typeof insertLink;
  insertNode: typeof insertNode;
  modifyLink: typeof modifyLink;
  modifyModel: typeof modifyModel;
  modifyNode: typeof modifyNode;
  removeLinks: typeof removeLinks;
  removeNodes: typeof removeNodes;
  setSkips: typeof setSkips;
  changeInspected: typeof changeInspected;
  editInspected: typeof editInspected;
}

type DiagramProps = StateProps & DispatchProps;

const mapStateToProps = (state: AppState): StateProps => {
  return {
    nodeDataArray: state.diagram.nodeDataArray,
    linkDataArray: state.diagram.linkDataArray,
    modelData: state.diagram.modelData,
    skipsDiagramUpdate: state.diagram.skipsDiagramUpdate,
    selectedData: state.inspector.selectedData
  };
};

const actionCreators = {
  insertLink,
  insertNode,
  modifyLink,
  modifyModel,
  modifyNode,
  removeLinks,
  removeNodes,
  setSkips,
  changeInspected,
  editInspected
};

class GoJSWrapper extends React.Component<DiagramProps> {
  // Maps to store key -> arr index for quick lookups
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;

  constructor(props: DiagramProps) {
    super(props);
    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.props.nodeDataArray);
    this.refreshLinkIndex(this.props.linkDataArray);
    // bind handler methods
    this.handleDiagramChange = this.handleDiagramChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRelinkChange = this.handleRelinkChange.bind(this);
    this.handleAddNode = this.handleAddNode.bind(this);
  }

  /**
   * Update map of node keys to their index in the array.
   */
  private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
    this.mapNodeKeyIdx.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      this.mapNodeKeyIdx.set(n.key, idx);
    });
  }

  /**
   * Update map of link keys to their index in the array.
   */
  private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
    this.mapLinkKeyIdx.clear();
    linkArr.forEach((l: go.ObjectData, idx: number) => {
      this.mapLinkKeyIdx.set(l.key, idx);
    });
  }

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  public handleDiagramChange(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        if (sel) {
          if (sel instanceof go.Node) {
            const idx = this.mapNodeKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const nd = this.props.nodeDataArray[idx];
              this.props.changeInspected(nd);
            }
          } else if (sel instanceof go.Link) {
            const idx = this.mapLinkKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const ld = this.props.linkDataArray[idx];
              this.props.changeInspected(ld);
            }
          }
        } else {
          this.props.changeInspected(null);
        }
        break;
      }
      default: break;
    }
  }

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method iterates over those changes and updates state to keep in sync with the GoJS model.
   * @param obj a JSON-formatted string
   */
  public handleModelChange(obj: go.IncrementalData) {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
    const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
    batch(() => {
      const narr = this.props.nodeDataArray;
      if (modifiedNodeData) {
        modifiedNodeData.forEach((nd: go.ObjectData) => {
          modifiedNodeMap.set(nd.key, nd);
          const idx = this.mapNodeKeyIdx.get(nd.key);
          if (idx !== undefined && idx >= 0) {
            this.props.modifyNode(idx, nd);
            if (this.props.selectedData && this.props.selectedData.key === nd.key) {
              this.props.changeInspected(nd);
            }
          }
        });
      }
      if (insertedNodeKeys) {
        insertedNodeKeys.forEach((key: go.Key) => {
          const nd = modifiedNodeMap.get(key);
          const idx = this.mapNodeKeyIdx.get(key);
          if (nd && idx === undefined) {
            this.mapNodeKeyIdx.set(nd.key, narr.length);
            this.props.insertNode(nd);
          }
        });
      }
      if (removedNodeKeys) {
        this.props.removeNodes(removedNodeKeys, this.refreshNodeIndex.bind(this));
      }
      const larr = this.props.linkDataArray;
      if (modifiedLinkData) {
        modifiedLinkData.forEach((ld: go.ObjectData) => {
          modifiedLinkMap.set(ld.key, ld);
          const idx = this.mapLinkKeyIdx.get(ld.key);
          if (idx !== undefined && idx >= 0) {
            this.props.modifyLink(idx, ld);
            if (this.props.selectedData && this.props.selectedData.key === ld.key) {
              this.props.changeInspected(ld);
            }
          }
        });
      }
      if (insertedLinkKeys) {
        insertedLinkKeys.forEach((key: go.Key) => {
          const ld = modifiedLinkMap.get(key);
          const idx = this.mapLinkKeyIdx.get(key);
          if (ld && idx === undefined) {
            this.mapLinkKeyIdx.set(ld.key, larr.length);
            this.props.insertLink(ld);
          }
        });
      }
      if (removedLinkKeys) {
        this.props.removeLinks(removedLinkKeys, this.refreshLinkIndex.bind(this));
      }
      // handle model data changes, for now just replacing with the supplied object
      if (modifiedModelData) {
        this.props.modifyModel(modifiedModelData);
      }
      this.props.setSkips(true); // the GoJS model already knows about these updates
    });
  }

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  public handleInputChange(path: string, value: string, isBlur: boolean) {
    const data = this.props.selectedData as go.ObjectData;  // only reached if selectedData isn't null
    if (isBlur) {
      const key = data.key;
      if (key < 0) {
        const idx = this.mapLinkKeyIdx.get(key);
        if (idx !== undefined && idx >= 0) {
          batch(() => {
            this.props.modifyLink(idx, data);
            this.props.setSkips(false);
          });
        }
      } else {
        const idx = this.mapNodeKeyIdx.get(key);
        if (idx !== undefined && idx >= 0) {
          batch(() => {
            this.props.modifyNode(idx, data);
            this.props.setSkips(false);
          });
        }
      }
    } else {
      this.props.editInspected(path, value);
    }
  }

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;
    batch(() => {
      this.props.modifyModel({ canRelink: value });
      this.props.setSkips(false);
    });
  }

  /**
   * Handle click of Add Node button.
   */
  public handleAddNode() {
    batch(() => {
      this.props.insertNode({ key: KeyService.generate(), text: "new node", color: "lime" });
      this.props.setSkips(false);
    });
  }

  public render() {
    const selectedData = this.props.selectedData;
    let inspector;
    if (selectedData !== null) {
      inspector = <SelectionInspector
                    selectedData={this.props.selectedData}
                    onInputChange={this.handleInputChange}
                  />;
    }

    return (
      <div>
        <p>
          Try moving around nodes, editing text, relinking, undoing (Ctrl-Z), etc. within the diagram
          and you'll notice the changes are reflected in the inspector area. You'll also notice that changes
          made in the inspector are reflected in the diagram. If you use the React dev tools,
          you can inspect the React state and see it updated as changes happen.
        </p>
        <p>
          Check out the <a href='https://gojs.net/latest/intro/react.html' target='_blank' rel='noopener noreferrer'>Intro page on using GoJS with React</a> for more information.
        </p>
        <DiagramWrapper
          nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
          modelData={this.props.modelData}
          skipsDiagramUpdate={this.props.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramChange}
          onModelChange={this.handleModelChange}
        />
        <label>
          Allow Relinking?
          <input
            type='checkbox'
            id='relink'
            checked={this.props.modelData.canRelink}
            onChange={this.handleRelinkChange} />
        </label>
        <button onClick={this.handleAddNode}>Add Node</button>
        {inspector}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actionCreators
)(GoJSWrapper);
