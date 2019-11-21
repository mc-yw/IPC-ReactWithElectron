import React from 'react';
import {EditorState, RichUtils, convertToRaw} from 'draft-js';
import Editor from "draft-js-plugins-editor";
import createCounterPlugin from 'draft-js-counter-plugin';
import logo from './logo.svg';
import './App.css';

const electron = window.require('electron');
const counterPlugin = createCounterPlugin();

interface Props {}
interface State {}

class App extends React.Component<Props, State> {

    /**
   * Electron用
   */
  private ipcRenderer = electron.ipcRenderer;

  // SAVEボタン押下時の挙動
  private onClickHandler = () => {
    // Mainプロセスに通知する
    const contentState = this.state.editorState.getCurrentContent();
    const content = convertToRaw(contentState);
    const content_json = JSON.stringify(content);
    this.ipcRenderer.send('notifyText', content_json);
  }

  private keyword1: React.RefObject<HTMLInputElement>;
  private keyword2: React.RefObject<HTMLInputElement>;
  private keyword3: React.RefObject<HTMLInputElement>;
  private keyword4: React.RefObject<HTMLInputElement>;
  private keyword5: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.keyword1 = React.createRef();
    this.keyword2 = React.createRef();
    this.keyword3 = React.createRef();
    this.keyword4 = React.createRef();
    this.keyword5 = React.createRef();

    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

    this.plugins = [
      counterPlugin,
    ];
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  focus = () => {
    this.editor.focus();
  };

  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  customCountFunction(str, keyword) {
    if (keyword) {
      if (keyword !== '') {
        var regexp = new RegExp(keyword, 'g');
        const wordArray  = str.match(regexp);  // matches words according to whitespace
        return wordArray ? keyword + '：' + wordArray.length : keyword + '：' + 0;
      }
    }
    return;
  }

  render() {
    const {editorState} = this.state;
    const { CharCounter, WordCounter, LineCounter, CustomCounter } = counterPlugin;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';

    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (
      <div className="App">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />

        <input id="keyword1" type="text" ref={this.keyword1} />
        <input id="keyword2" type="text" ref={this.keyword2} />
        <input id="keyword3" type="text" ref={this.keyword3} />
        <input id="keyword4" type="text" ref={this.keyword4} />
        <input id="keyword5" type="text" ref={this.keyword5} />

        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            plugins={[counterPlugin]}
            placeholder="Tell a story..."
            ref={(element) => { this.editor = element; }}

            spellCheck={false}
          />
          <div>文字数：<CharCounter editorState={this.state.editorState} limit={200} /></div>
          <div>キーワード数<br />
            <CustomCounter
              limit={40}
              countFunction={() => this.customCountFunction(contentState.getPlainText(), (this.keyword1.current || {}).value)}
            />
            <CustomCounter
              limit={40}
              countFunction={() => this.customCountFunction(contentState.getPlainText(), (this.keyword2.current || {}).value)}
            />
            <CustomCounter
              limit={40}
              countFunction={() => this.customCountFunction(contentState.getPlainText(), (this.keyword3.current || {}).value)}
            />
            <CustomCounter
              limit={40}
              countFunction={() => this.customCountFunction(contentState.getPlainText(), (this.keyword4.current || {}).value)}
            />
            <CustomCounter
              limit={40}
              countFunction={() => this.customCountFunction(contentState.getPlainText(), (this.keyword5.current || {}).value)}
            />

            {/*文章保存ボタン*/}
            <div><button onClick={this.onClickHandler}>SAVE</button></div>

          </div>
        </div>
      </div>
    );
  }
}

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote';
    default: return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'H4', style: 'header-four'},
  {label: 'H5', style: 'header-five'},
  {label: 'H6', style: 'header-six'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

export default App;
