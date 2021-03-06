import * as go from "gojs";
import { render } from '@testing-library/react';

import App from './App';
import { Robot } from './Robot';

window.scrollTo = jest.fn();  // mock scrollTo

describe('ReactDiagram tests', () => {
  let diagram: go.Diagram;
  let robot: Robot;

  // initialize the Diagram and Robot prior to each test
  beforeEach(() => {
    // use Jest's fake timers to ensure Diagram.delayInitialization is called in time
    jest.useFakeTimers();
    const { container } = render(<App />);
    jest.runOnlyPendingTimers();
    // grab the diagram from the class name given to its div
    diagram = (container.getElementsByClassName('diagram-component')[0] as any).goDiagram;
    // disable animation for testing;
    // jsdom has no layout by default, so we have to set a viewSize
    diagram.commit((d) => {
      d.animationManager.stopAnimation();
      d.animationManager.isEnabled = false;
      d.viewSize = new go.Size(400, 400);
    });

    robot = new Robot(diagram);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    jest.clearAllMocks()
  });

  test('renders diagram', () => {
    expect(diagram).not.toBeUndefined();
  });

  test('shows 4 nodes and 5 links', () => {
    expect(diagram.nodes.count).toBe(4);
    expect(diagram.links.count).toBe(5);
  });

  test('Beta is orange', () => {
    const beta = diagram.findNodeForKey(1);
    expect(beta).not.toBeNull();
    expect(beta?.data.color).toBe('orange');
  });

  test('Has selection adornment', () => {
    const beta = diagram.findNodeForKey(1);
    if (!beta) return;

    diagram.select(beta);
    diagram.maybeUpdate();  // force update since adornments are shown async
    expect(beta.adornments.count).toBe(1);
    expect(beta.findAdornment('Selection')).not.toBeNull();
  });

  test('node deleted', () => {
    const beta = diagram.findNodeForKey(1);
    diagram.select(beta);
    diagram.commandHandler.deleteSelection();

    expect(diagram.nodes.count).toBe(3);
    expect(diagram.findNodeForKey(1)).toBeNull();
  });

  test('node copied with simulated input', () => {
    const delta = diagram.findNodeForKey(3);
    const loc = delta?.actualBounds.center ?? new go.Point();

    // Simulate a mouse drag to move the Delta node:
    const options = { control: true, alt: true };
    robot.mouseDown(loc.x, loc.y, 0, options);
    robot.mouseMove(loc.x + 80, loc.y + 50, 50, options);
    robot.mouseMove(loc.x + 20, loc.y + 100, 100, options);
    robot.mouseUp(loc.x + 20, loc.y + 100, 150, options);
    // If successful, this will have made a copy of the "Delta" node below it.

    const newloc = new go.Point(loc.x + 20, loc.y + 100);
    const newnode = diagram.findPartAt(newloc);

    expect(newnode).not.toBe(delta);
    expect(newnode?.key).toBe(4);
    expect(newnode?.isSelected).toBeTruthy();
  });
});
