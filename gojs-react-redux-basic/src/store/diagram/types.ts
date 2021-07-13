import { ObjectData } from 'gojs';

export interface DiagramState {
  nodeDataArray: Array<ObjectData>;
  linkDataArray: Array<ObjectData>;
  modelData: ObjectData;
  skipsDiagramUpdate: boolean;
}

// Node action types
export const MODIFY_NODE = 'MODIFY_NODE';
export const INSERT_NODE = 'INSERT_NODE';
export const REMOVE_NODE = 'REMOVE_NODE';

interface ModifyNodeAction {
  type: typeof MODIFY_NODE;
  index: number;
  data: ObjectData;
}

interface InsertNodeAction {
  type: typeof INSERT_NODE;
  data: ObjectData;
}

interface RemoveNodeAction {
  type: typeof REMOVE_NODE;
  index: number;
}

// Link action types
export const MODIFY_LINK = 'MODIFY_LINK';
export const INSERT_LINK = 'INSERT_LINK';
export const REMOVE_LINK = 'REMOVE_LINK';

interface ModifyLinkAction {
  type: typeof MODIFY_LINK;
  index: number;
  data: ObjectData;
}

interface InsertLinkAction {
  type: typeof INSERT_LINK;
  data: ObjectData;
}

interface RemoveLinkAction {
  type: typeof REMOVE_LINK;
  index: number;
}

export const MODIFY_MODEL = 'MODIFY_MODEL';

interface ModifyModelAction {
  type: typeof MODIFY_MODEL;
  data: ObjectData;
}

export const SET_SKIPS = 'SET_SKIPS';

interface SetSkipsAction {
  type: typeof SET_SKIPS;
  skips: boolean;
}

export type DiagramActionTypes =
  ModifyNodeAction | InsertNodeAction | RemoveNodeAction |
  ModifyLinkAction | InsertLinkAction | RemoveLinkAction |
  ModifyModelAction | SetSkipsAction;
