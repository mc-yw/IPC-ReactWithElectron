import React from 'react';
import logo from './logo.svg';
import './App.css';
const electron = window.require('electron');
/*const { ipcRenderer } = require('electron');*/

class App extends React.Component {
  /**
   * Electron用
   */
private ipcRenderer = electron.ipcRenderer;
  /**
   * 画面描画メソッド
   */
  public render() {
    return <div><button onClick={this.onClickHandler}>PUSH</button></div>
  }

  private onClickHandler = () => {
    // Mainプロセスに通知する
    this.ipcRenderer.send('notifyText', "hogehoge");
  }

/*  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );*/
}

export default App;
