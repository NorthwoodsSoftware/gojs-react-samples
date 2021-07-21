import * as go from "gojs";
import { render } from '@testing-library/react';
import App from './App';

describe('ReactDiagram tests', () => {
  let diagram: go.Diagram | null = null;

  // initialize the Diagram prior to all tests
  beforeAll(() => {
    // use Jest's fake timers to ensure Diagram.delayInitialization is called in time
    jest.useFakeTimers();
    const { container } = render(<App />);
    jest.runOnlyPendingTimers();
    // grab the diagram via it's div from the class name given to it
    diagram = (container.getElementsByClassName('diagram-component')[0] as any).goDiagram;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders diagram', () => {
    expect(diagram).not.toBeNull();
  });

  test('shows 4 nodes and 5 links', () => {
    expect(diagram?.nodes.count).toBe(4);
    expect(diagram?.links.count).toBe(5);
  });

  test('Beta is orange', () => {
    const beta = diagram?.findNodeForKey(1) ?? null;
    expect(beta).not.toBeNull();
    expect(beta?.data.color).toBe('orange');
  });

  test('node deleted', () => {
    const beta = diagram?.findNodeForKey(1) ?? null;
    diagram?.select(beta);
    diagram?.commandHandler.deleteSelection();

    expect(diagram?.nodes.count).toBe(3);
    expect(diagram?.findNodeForKey(1)).toBeNull();
  });
});