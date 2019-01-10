import { Rectangle, screen, BrowserWindow } from 'electron';
import Store = require('electron-store');

export function read(defaultDimension?: { width: number, height: number }, defaultPosition?: { x: number, y: number }): Rectangle {
    const configStore = new Store();
    const {width, height} = configStore.get('dimension', {
        width: defaultDimension && defaultDimension.width ? defaultDimension.width : 1000,
        height: defaultDimension && defaultDimension.height ? defaultDimension.height : 700
    });
    const workAreaSize = screen.getPrimaryDisplay().workAreaSize;

    // by default we center the window
    // but if the user provides a custom position, we use that instead
    const {x, y} = configStore.get('position', defaultPosition ? defaultPosition : {
        x: (workAreaSize.width - width) / 2,
        y: (workAreaSize.height - height) / 2
    });
    return {
        width: width,
        height: height,
        x: x,
        y: y
    } as Rectangle;
}

export function writePosition(currentWindow: BrowserWindow): void {
    const configStore = new Store();
    const currentPosition = currentWindow.getPosition();
    configStore.set('position', {
        x: currentPosition[0],
        y: currentPosition[1],
    });
}

export function writeDimension(currentWindow: BrowserWindow): void {
    const configStore = new Store();
    const currentDimension = currentWindow.getSize();
    configStore.set('dimension', {
        width: currentDimension[0],
        height: currentDimension[1],
    });
}


export function infect(currentWindow: BrowserWindow): void {
    const _storeDimensions = () => {
        writeDimension(currentWindow);
    };

    const _storePosition = () => {
        writePosition(currentWindow);
    };

    currentWindow.addListener('resize', _storeDimensions);
    currentWindow.addListener('move', _storePosition);

    currentWindow.on('close', () => {
        currentWindow.removeListener('resize', _storeDimensions);
        currentWindow.removeListener('move', _storePosition);
    });
}
