import { combineReducers, createStore } from 'redux';

import { diagramReducer } from './diagram/reducers';
import { DiagramState } from './diagram/types';
import { inspectorReducer } from './inspector/reducers';
import { InspectorState } from './inspector/types';

export interface AppState {
  diagram: DiagramState;
  inspector: InspectorState;
}

const rootReducer = combineReducers<AppState>({
  diagram: diagramReducer,
  inspector: inspectorReducer
});

export default function configureStore() {
  const store = createStore(rootReducer, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
  return store;
}
