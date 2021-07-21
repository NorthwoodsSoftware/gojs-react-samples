import * as go from "gojs";
import { render } from '@testing-library/react';
import App from './App';
import { Robot } from './Robot';

describe('ReactDiagram tests', () => {
  let diagram: go.Diagram | null = null;
  let robot: Robot | null = null;

  // initialize the Diagram and Robot prior to all tests
  beforeAll(() => {
    // use Jest's fake timers to ensure Diagram.delayInitialization is called in time
    jest.useFakeTimers();
    const { container } = render(<App />);
    jest.runOnlyPendingTimers();
    // grab the diagram via its div from the class name given to it
    diagram = (container.getElementsByClassName('diagram-component')[0] as any).goDiagram;
    robot = new Robot(diagram);
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

  test('node copied with simulated input', () => {
    const delta = diagram?.findNodeForKey(3) ?? null;
    const loc = delta?.actualBounds.center ?? new go.Point();

    // Simulate a mouse drag to move the Delta node:
    const options = { control: true, alt: true };
    robot?.mouseDown(loc.x, loc.y, 0, options);
    robot?.mouseMove(loc.x + 80, loc.y + 50, 50, options);
    robot?.mouseMove(loc.x + 20, loc.y + 100, 100, options);
    robot?.mouseUp(loc.x + 20, loc.y + 100, 150, options);
    // If successful, this will have made a copy of the "Delta" node below it.

    const newloc = new go.Point(loc.x + 20, loc.y + 100);
    const newnode = diagram?.findPartAt(newloc);

    expect(newnode).not.toBe(delta);
    expect(newnode?.key).toBe(4);
    expect(newnode?.isSelected).toBeTruthy();
  });
});
