# React と Electron によるIPC通信のひな型
下記の記事を参考に CRA と Electron を使い、IPC通信を試みたがエラーが出て上手くいきませんでした。
[electron化したReactアプリのプロセス間通信 - Qiita](https://qiita.com/cross-xross/items/eaf430b571c96b9e500a)

何カ所か手を加えることでIPC通信に成功したため、ひな型としてここに残しておきます。

## アプリをビルドする
```npm run build```

## アプリを起動する
```npm run electron-start```

## アプリをパッケージングする
```npm run electron-build```

## 動作確認の方法と注意点
アプリを起動し、表示された画面の「PUSH」ボタンを押してみてください。
正しくIPC通信ができていると、コンソール上に「通信成功！」と表示されます。

```npm run start``` でブラウザ上に画面を表示できますが、これだと React で実装したコンポーネントを表示するだけとなり、Electron での実装箇所は反映されません。
そのため、IPC通信はできないので注意してください。

ちなみにこのアプリで```npm run start```を実行しても、IPCに関する実装が原因でエラーが発生します。
動作を確認する際は必ず```npm run electron-start```実行の上、チェックしてください。