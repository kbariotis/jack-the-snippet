const blessed = require('blessed');
const fs = require('fs');

const Editor = require('editor-widget');
const List = require('./List');

class Jack {
  constructor() {
    const size = process.stdout.getWindowSize();

    this.screen = blessed.screen({
      smartCSR: true,
      width: size[0],
      height: size[1],
      // debug: true
    });

    this.snippets = require('./../snippets.json')
      .slice(0, 3);

    this.list = new List({
      parent: this.screen,
      top: size[1] - 1,
      snippets: this.snippets
    })

    this.editor = new Editor({
      parent: this.screen,
      top: 0,
      left: '20%',
      width: '80%',
      height: '100%'
    });

    this.editor.hide();

    this.screen.title = 'my window title';

    this.screen.render();

    this.screen.key(['q', 'C-c'], this.handleExit)

    this.screen.key(['up'], (ch, key) => this.list.pageUp(ch, key));

    this.screen.key(['down'], (ch, key) => this.list.keyDown(ch, key));

    this.screen.key(['enter'], (ch, key) => this.handleEnter(ch, key))
    this.screen.key(['escape'], (ch, key) => this.handleEscape(ch, key))
  }

  handleEnter(ch, key) {
    if (this.list.focused) {
      fs.writeFileSync('./tmp', this.snippets[0].content, {
        encoding: 'utf8'
      })
      this.editor.open('./tmp');
      this.editor.show();
      this.editor.focus();
      this.screen.key(['C-s'], (ch, key) => { editor.save(filePath); });
      this.screen.render();
    }
  }

  handleEscape(ch, key) {
    if (this.editor.focused) {
      this.list.focus();
      this.editor.hide();
      this.screen.render();
    }
  }

  handleExit(ch, key) {
    process.exit(0);
  }
}

module.exports = Jack;
