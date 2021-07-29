# gojs-react-jest

### By Northwoods Software for [GoJS 2.1](https://gojs.net)

This project provides a testing example for a gojs-react application and is based off of [gojs-react-basic](https://github.com/NorthwoodsSoftware/gojs-react-basic).

It makes use of the [gojs-react](https://github.com/NorthwoodsSoftware/gojs-react) package to handle some boilerplate for setting up and tearing down a Diagram component.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In addition to the packages included with CRA, this sample requires the `canvas` npm package to allow `jsdom` to mock a Canvas HTML Element.

See the [App.test.tsx](./src/App.test.tsx) file for an example of testing using Jest. Note the following requirements to make Jest and jsdom work effectively for React diagram testing:
- the scrollTo function should be mocked, as it's used internally in GoJS,
- [jest timer mocks](https://jestjs.io/docs/timer-mocks) are used to ensure the diagram is created in time,
- the diagram's div is given explicit sizing, as jsdom doesn't have layout:

```tsx
window.scrollTo = jest.fn();  // mock scrollTo

...

// initialize the Diagram and Robot prior to each test
beforeEach(() => {
  // use Jest's fake timers to ensure Diagram.delayInitialization is called in time
  jest.useFakeTimers();
  const { container } = render(<App />);
  jest.runOnlyPendingTimers();
  
  // grab the diagram from the class name given to its div
  diagram = (container.getElementsByClassName('diagram-component')[0] as any).goDiagram;
  robot = new Robot(diagram);

  // jsdom has no layout by default, so we have to add width/height manually
  Object.defineProperty(diagram.div, 'clientWidth', { configurable: true, value: 400 });
  Object.defineProperty(diagram.div, 'clientHeight', { configurable: true, value: 400 });
  diagram.animationManager.stopAnimation();
  diagram.maybeUpdate(); // will trigger a resize with the new width/height
});
```

Our example resets the timers and mocks afterwards:

```tsx
afterEach(() => {
  jest.useRealTimers();
});

afterAll(() => {
  jest.clearAllMocks()
});
```

Additionally, this sample makes use of the [GoJS Robot extension](https://gojs.net/latest/api/symbols/Robot.html) to simulate input on the diagram.

## Installation

Start by running npm install to install all necessary dependencies.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
