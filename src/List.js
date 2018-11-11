const {Box} = require('blessed');
const ListItem = require('./ListItem');

class List extends Box {
  constructor (opts) {
    super(Object.assign({}, opts, {
      top: '0',
      left: '0',
      width: '20%',
      height: opts.parent.height - 1,
      style: {
        fg: 'white',
        border: {}
      }
    }))

    this.items = opts.snippets;
    this.itemHeight = 5;
    this.currentPage = 1;
    this.pageSize = opts.parent.height/5;
    this.totalPages = Math.ceil(opts.snippets.length / this.pageSize);
    this.selectedIndex = 0;
    this.firstItemIndex = 0;

    this.snippets = [];
    this.renderPage()
  }

  renderPage(page = 1) {
    const offsetStart = (page-1) * this.pageSize;
    const offsetEnd = offsetStart + this.pageSize;

    this.snippets = [];
    this.items.slice(offsetStart, offsetEnd).map((s, index) => {
      this.snippets.push(new ListItem({
        parent: this.parent,
        top: index * this.itemHeight,
        height: this.parent.height/this.pageSize,
        content: `${s.title}`,
        selected: index === this.selectedIndex
      }))
    })
    this.parent.screen.render();
  }

  down(ch, key) {
    const lastItemIndex = (this.snippets.length - 1)

    if (this.selectedIndex === lastItemIndex) {
      this.currentPage = this.currentPage === this.totalPages
        ? 1
        : ++this.currentPage;

      this.renderPage(this.currentPage);
    }
    this.snippets[this.selectedIndex].style.border.fg = undefined;
    this.selectedIndex = this.selectedIndex === lastItemIndex
      ? this.firstItemIndex
      : (this.selectedIndex + 1);

    this.snippets[this.selectedIndex].style.border.fg = '#ff6600';
    this.parent.screen.render();
  }

  up(ch, key) {
    if (this.selectedIndex === this.firstItemIndex) {
      this.currentPage = this.currentPage === 1 ? this.totalPages : --this.currentPage;
      this.renderPage(this.currentPage);
    }
    this.snippets[this.selectedIndex].style.border.fg = undefined;

    const lastItemIndex = (this.snippets.length - 1)
    this.selectedIndex = this.selectedIndex === this.firstItemIndex ? lastItemIndex : --this.selectedIndex;

    this.snippets[this.selectedIndex].style.border.fg = '#ff6600';
    this.parent.screen.render();
  }

}

module.exports = List;
