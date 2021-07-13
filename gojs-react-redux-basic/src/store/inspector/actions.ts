import { ObjectData } from 'gojs';
import { CHANGE_INSPECTED, EDIT_INSPECTED } from './types';

export function changeInspected(data: ObjectData | null) {
  return {
    type: CHANGE_INSPECTED,
    data
  };
}

export function editInspected(field: string, value: any) {
  return {
    type: EDIT_INSPECTED,
    field,
    value
  };
}
