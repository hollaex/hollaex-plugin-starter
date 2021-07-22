const copydir = require('copy-dir');

copydir.sync('src/templates/view', 'src/views/view');
console.log('View has been added successfully');