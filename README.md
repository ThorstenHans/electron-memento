For [Electron](https://electronjs.org/) applications you can specify the size and positioning of `BrowserWindow` instances. No API could be used to store and retrieve those configuration values across an application restart. `electron-memento` will change this. `electron-memento` provides a simple set of APIs that allows you to store and load the `dimension` and the `position` of your application's main window.

`electron-memento` is licensed under [MIT](./LICENSE).

## Build Status

### Release build on `master`

[![Build Status](https://dev.azure.com/thns/electron-memento/_apis/build/status/ThorstenHans.electron-memento?branchName=master)](https://dev.azure.com/thns/electron-memento/_build/latest?definitionId=3?branchName=master)

### CI build on `develop`

[![Build Status](https://dev.azure.com/thns/electron-memento/_apis/build/status/electron-memento-ci?branchName=develop)](https://dev.azure.com/thns/electron-memento/_build/latest?definitionId=4?branchName=develop)

## Support me

[![Become a Patron!](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/bePatron?u=16380186)

## Install

```
npm install electron-memento --save
```

## Usage

`electron-memento` is meant to be used from within the **main process** of an Electron app. 

```
const { app, BrowserWindow } = require('electron');
const Memento = require('electron-memento');

let mainWindow;

function createWindow() {
  const bounds = Memento.read();
  const mainWindowConfig = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    title: 'Memento Sample'
  };
  const mainWindowUrl = 'some-url.html';

  mainWindow = new BrowserWindow(mainWindowConfig);
  Memento.infect(mainWindow);
  mainWindow.loadURL(mainWindowUrl);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
 // ...
```

## API

### read

The `read` method will read the dimension and position from the configuration file. If no configuration exists, either *internal defaults* or default values provided by the caller will be returned.

`read(defaultDimension?: { width: number, height: number }, defaultPosition?: { x: number, y: number }): Rectangle`
Type: `Rectangle`

#### Internal Defaults
If you don't specify default values, the window will be `centered` and the dimension will be set to `1000x700 pixels`


### writePosition

You can instruct `electron-memento` explicitly to store the position of the current window by calling the `writePosition` method. It will store the position of `mainApplicationWindow` (`Electron.BrowserWindow`).

`writePosition(mainApplicationWindow: BrowserWindow): void`


### writeDimension

You can instruct `electron-memento` explicitly to store the dimension of the current window by calling the `writeDimension` method. It will store the dimension of `mainApplicationWindow` (`Electron.BrowserWindow`).

`writeDimension(mainApplicationWindow: BrowserWindow): void`


### infect

The `infect` method will register `writePosition` and `writeDimension` to the corresponding events of 'mainApplicationWindow' (`move` and `resize`). Once infected, `electron-memento` will always be invoked to store both,
`dimension` and `position` of `mainApplicationWindow`. Both `listeners` are unregistered using **explicit** de-registration in `mainApplicationWindow.on('close')`.

`infect(mainApplicationWindow: BrowserWindow): void`


## Credits

The project has been built using [electron-store](https://github.com/sindresorhus/electron-store) from [Sindre Sorhus](https://github.com/sindresorhus).

## Other libraries

* [ngx-electron](https://github.com/ThorstenHans/ngx-electron)

## Copyright

&copy; [Thorsten Hans](https://thorsten-hans.com)
