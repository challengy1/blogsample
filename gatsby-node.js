require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'esnext',
  },
});

const { createPages } = require('./src/gatsby-node/createPages');
const { onCreateNode } = require('./src/gatsby-node/onCreateNode');
const { createSchemaCustomization } = require('./src/gatsby-node/createSchemaCustomization');

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
exports.createSchemaCustomization = createSchemaCustomization;
