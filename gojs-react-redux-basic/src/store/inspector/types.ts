import { ObjectData } from 'gojs';

export interface InspectorState {
  selectedData: ObjectData | null;
}

// Inspector action types
export const CHANGE_INSPECTED = 'CHANGE_INSPECTED';
export const EDIT_INSPECTED = 'EDIT_INSPECTED';

interface ChangeInspectedAction {
  type: typeof CHANGE_INSPECTED;
  data: ObjectData | null;
}

interface EditInspectedAction {
  type: typeof EDIT_INSPECTED;
  field: string;
  value: any;
}

export type InspectorActionTypes = ChangeInspectedAction | EditInspectedAction;
