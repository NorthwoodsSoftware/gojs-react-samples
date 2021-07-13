import {
  DiagramActionTypes,
  DiagramState,
  INSERT_LINK,
  INSERT_NODE,
  MODIFY_LINK,
  MODIFY_MODEL,
  MODIFY_NODE,
  REMOVE_LINK,
  REMOVE_NODE,
  SET_SKIPS
} from './types';

const initialState: DiagramState = {
  nodeDataArray: [
    { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
    { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
    { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
    { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
  ],
  linkDataArray: [
    { key: -1, from: 0, to: 1 },
    { key: -2, from: 0, to: 2 },
    { key: -3, from: 1, to: 1 },
    { key: -4, from: 2, to: 3 },
    { key: -5, from: 3, to: 0 }
  ],
  modelData: {},
  skipsDiagramUpdate: false
};

function insertItem(array: Array<any>, action: any) {
  const newArr = array.slice();
  newArr.push(action.data);
  return newArr;
}

function modifyItem(array: Array<any>, action: any) {
  return array.map((item, index) => {
    if (index !== action.index) {
      return item;
    }
    return action.data;
  });
}

function removeItems(array: Array<any>, action: any) {
  const newArr = array.filter((item, index) => !action.keys.includes(item.key));
  action.cb(newArr);
  return newArr;
}

export const diagramReducer = (state: DiagramState = initialState, action: DiagramActionTypes): DiagramState => {
  switch (action.type) {
    case INSERT_NODE: {
      return {
        ...state,
        nodeDataArray: insertItem(state.nodeDataArray, action)
      };
    }
    case MODIFY_NODE: {
      return {
        ...state,
        nodeDataArray: modifyItem(state.nodeDataArray, action)
      };
    }
    case REMOVE_NODE: {
      return {
        ...state,
        nodeDataArray: removeItems(state.nodeDataArray, action)
      };
    }
    case INSERT_LINK: {
      return {
        ...state,
        linkDataArray: insertItem(state.linkDataArray, action)
      };
    }
    case MODIFY_LINK: {
      return {
        ...state,
        linkDataArray: modifyItem(state.linkDataArray, action)
      };
    }
    case REMOVE_LINK: {
      return {
        ...state,
        linkDataArray: removeItems(state.linkDataArray, action)
      };
    }
    case MODIFY_MODEL: {
      return {
        ...state,
        modelData: action.data
      };
    }
    case SET_SKIPS: {
      return {
        ...state,
        skipsDiagramUpdate: action.skips
      };
    }
    default: return state;
  }
};
