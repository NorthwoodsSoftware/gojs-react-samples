import { Key, ObjectData } from 'gojs';
import { INSERT_LINK, INSERT_NODE, MODIFY_LINK, MODIFY_MODEL, MODIFY_NODE, REMOVE_LINK, REMOVE_NODE, SET_SKIPS } from './types';

export function modifyNode(index: number, data: ObjectData) {
  return {
    type: MODIFY_NODE,
    index,
    data
  };
}

export function insertNode(data: ObjectData) {
  return {
    type: INSERT_NODE,
    data
  };
}

export function removeNodes(keys: Array<Key>, cb: (arr: Array<ObjectData>) => void) {
  return {
    type: REMOVE_NODE,
    keys,
    cb
  };
}

export function modifyLink(index: number, data: ObjectData) {
  return {
    type: MODIFY_LINK,
    index,
    data
  };
}

export function insertLink(data: ObjectData) {
  return {
    type: INSERT_LINK,
    data
  };
}

export function removeLinks(keys: Array<Key>, cb: (arr: Array<ObjectData>) => void) {
  return {
    type: REMOVE_LINK,
    keys,
    cb
  };
}

export function modifyModel(data: ObjectData) {
  return {
    type: MODIFY_MODEL,
    data
  };
}

export function setSkips(skips: boolean) {
  return {
    type: SET_SKIPS,
    skips
  };
}
