For [Electron](https://electronjs.org/) applications you can specify the size and positioning of `BrowserWindow` instances. No API could be used to store and retrieve those configuration values across an application restart. `electron-memento` will change this. `electron-memento` provides a simple set of APIs that allows you to store and load the `dimension` and the `position` of your application's main window.

`electron-memento` is licensed under [MIT](./LICENSE).

## Install
```
npm install electron-memento --save
```

## Usage

`electron-memento` is meant to be used from within the **main process** of an Electron app. 

```
const { app, BrowserWindow } = require('electron');
const Memento = require('electron-memento'),
    path = require('path'),
    url = require('url');

let mainWindow;

function createWindow() {
  const bounds = Memento.read();
  const mainWindowConfig = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    title: 'MyElectronApp'
  };
  const mainWindowUrl = url.format({
    pathname: path.join(__dirname, 'www', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow = new BrowserWindow(mainWindowConfig);
  Memento.infect(mainWindow);
  mainWindow.loadURL(mainWindowUrl);
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if(mainWindow === null) {
    createWindow();
  }
});
```

## API

### `read(defaultDimension?: { width: number, height: number }, defaultPosition?: { x: number, y: number }): Rectangle`

Will read the dimension and position from the configuration file. If no configuration exists, either *internal defaults* or default values provided by the caller will be returned.

Type: `Rectangle`

#### Internal Defaults

If you don't specify default values, the window will be `centered` and the dimension will be set to `1000x700 pixels`


### `writePosition(mainApplicationWindow: BrowserWindow): void`

Will store the position of `mainApplicationWindow` (`Electron.BrowserWindow`).

### `writeDimension(mainApplicationWindow: BrowserWindow): void`

Will store the dimension of `mainApplicationWindow` (`Electron.BrowserWindow`).

### `infect(mainApplicationWindow: BrowserWindow): void`

`Infect` will register `writePosition` and `writeDimension` to the corresponding events of 'mainApplicationWindow' (`move` and `resize`). Once infected, `electron-memento` will always be invoked to store both,
`dimension` and `position` of `mainApplicationWindow`.

Both `listeners` are unregistered using **explicit** de-registration in `mainApplicationWindow.on('close')`.

## Credits

The project has been built using [electron-store](https://github.com/sindresorhus/electron-store) from [Sindre Sorhus](https://github.com/sindresorhus).

## Other libraries

* [ngx-electron](https://github.com/ThorstenHans/ngx-electron)

&copy; [Thorsten Hans](https://thorsten-hans.com)
