const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('get-todos'),
  saveTodos: (todos) => ipcRenderer.invoke('save-todos', todos)
});
