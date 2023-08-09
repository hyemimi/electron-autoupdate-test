import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface IWindow {
    electron: ElectronAPI
    api: unknown
  }
}
