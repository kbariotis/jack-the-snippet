const blessed = require('blessed');
const size = process.stdout.getWindowSize();

const screen = blessed.screen({
  smartCSR: true,
  debug: true
});

screen.title = 'my window title';

const snippets = require('./snippets.json')
  .slice(0, 5);

let selectedIndex = 0;
let currentPage = 1;
const itemHeight = 5;
const pageSize = size[1]/5;
const totalPages = Math.ceil(snippets.length / pageSize);
const firstItemIndex = 0;

const menu = blessed.listbar({
  parent: screen,
  top: size[1] - 1,
  left: '0',
  width: '100%',
  style: {
    fg: 'white'
  },
  items: [
    'New'
  ]
})

let parent;
function renderPageFactory(snippets) {
  return function (page) {

    parent = blessed.box({
      parent: screen,
      top: '0',
      left: '0',
      width: '100%',
      height: size[1] - 1,
      style: {
        fg: 'white'
      }
    });

    const offsetStart = (page-1) * pageSize;
    const offsetEnd = offsetStart + pageSize;
    screen.debug(`From:${offsetStart} to:${offsetEnd}`)

    const pagedSnippets = snippets.slice(offsetStart, offsetEnd);
    pagedSnippets.map((s, index) => {
      const box = blessed.box({
        parent,
        top: index * itemHeight,
        left: '0',
        width: '100%',
        height: size[1]/pageSize,
        shrink: true,
        content: `${s.title}
        - ${s.description}`,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          border: {
            fg: index === selectedIndex ? '#ff6600' : undefined
          }
        }
      });

      screen.debug(`index:${index}`)
    })

    screen.debug(`childrens: ${parent.children.length}`)
  }
}

const renderPage = renderPageFactory(snippets);
renderPage(1);

screen.key(['q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key(['up'], function(ch, key) {
  if (selectedIndex === firstItemIndex) {
    currentPage = currentPage === 1 ? totalPages : --currentPage;
    screen.debug(`currentPage:${currentPage}`);
    renderPage(currentPage);
  }
  screen.debug(`selectedIndex:${selectedIndex}`);
  parent.children[selectedIndex].style.border.fg = undefined;

  const lastItemIndex = (parent.children.length - 1)
  screen.debug(`lastItemIndex:${lastItemIndex}`);
  selectedIndex = selectedIndex === firstItemIndex ? lastItemIndex : --selectedIndex;
  screen.debug(`selectedIndex:${selectedIndex}`);

  parent.children[selectedIndex].style.border.fg = '#ff6600';
  screen.render();
});

screen.key(['down'], function(ch, key) {
  const lastItemIndex = (parent.children.length - 1)

  if (selectedIndex === lastItemIndex) {
    currentPage = currentPage === totalPages ? 1 : ++currentPage;
    renderPage(currentPage);
  }
  parent.children[selectedIndex].style.border.fg = undefined;

  selectedIndex = selectedIndex === lastItemIndex ? firstItemIndex : ++selectedIndex;

  parent.children[selectedIndex].style.border.fg = '#ff6600';
  screen.render();
});

screen.render();
