// import { Draft, produce } from 'immer';
import { ObjectData } from 'gojs';
import {
  CHANGE_INSPECTED,
  EDIT_INSPECTED,
  InspectorActionTypes,
  InspectorState
} from './types';

const initialState: InspectorState = {
  selectedData: null
};

export const inspectorReducer = (state: InspectorState = initialState, action: InspectorActionTypes): InspectorState => {
  switch (action.type) {
    case CHANGE_INSPECTED: {
      return {
        ...state,
        selectedData: action.data
      };
    }
    case EDIT_INSPECTED: {
      const newdata: ObjectData = { ...state.selectedData };
      newdata[action.field] = action.value;
      return {
        ...state,
        selectedData: newdata
      };
    }
    default: {
      return state;
    }
  }
};
