const {Box} = require('blessed');

class ListItem extends Box {

  constructor(opts) {
    super(Object.assign({}, opts, {
      left: '0',
      width: '20%',
      shrink: true,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        border: {
          fg: opts.selected ? '#ff6600' : undefined
        }
      }
    }));
  }
}

module.exports = ListItem;
