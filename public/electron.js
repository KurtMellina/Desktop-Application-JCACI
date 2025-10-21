const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { MongoClient, ServerApiVersion } = require('mongodb');

let mainWindow;
let mongoClient; // Reused client for the app lifecycle
let mongoDb; // Selected database reference

async function connectToMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB || 'my_desktop_app';

  mongoClient = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await mongoClient.connect();
  mongoDb = mongoClient.db(dbName);
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  const startUrl = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  try {
    await connectToMongo();
  } catch (error) {
    // Log and continue to open the window so user can see an error UI if desired
    console.error('Failed to connect to MongoDB:', error);
  }

  // IPC handlers
  ipcMain.handle('db:ping', async () => {
    if (!mongoClient) return { ok: false, error: 'Mongo client not initialized' };
    try {
      const admin = mongoDb.admin();
      const result = await admin.ping();
      return { ok: true, result };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  });

  ipcMain.handle('db:findOne', async (event, { collection, filter }) => {
    if (!mongoDb) return { ok: false, error: 'Database is not available' };
    try {
      const doc = await mongoDb.collection(collection).findOne(filter || {});
      return { ok: true, doc };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  });

  ipcMain.handle('db:insertOne', async (event, { collection, document }) => {
    if (!mongoDb) return { ok: false, error: 'Database is not available' };
    try {
      const result = await mongoDb.collection(collection).insertOne(document || {});
      return { ok: true, insertedId: result.insertedId };
    } catch (err) {
      return { ok: false, error: String(err) };
    }
  });

  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', async () => {
  if (mongoClient) {
    try {
      await mongoClient.close();
    } catch (e) {
      console.error('Error closing MongoDB client:', e);
    }
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
