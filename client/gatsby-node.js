const { createFilePath } = require('gatsby-source-filesystem');
// TODO: ideally we'd remove lodash and just use lodash-es, but we can't require
// es modules here.
const uniq = require('lodash/uniq');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');

const env = require('./config/env.json');
const {
  createChallengePages,
  createBlockIntroPages,
  createSuperBlockIntroPages
} = require('./utils/gatsby');

const createByIdentityMap = {
  blockIntroMarkdown: createBlockIntroPages,
  superBlockIntroMarkdown: createSuperBlockIntroPages
};

exports.onCreateNode = function onCreateNode({ node, actions, getNode }) {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });
    if (!slug.includes('LICENSE')) {
      createNodeField({ node, name: 'slug', value: slug });
    }
  }
};

exports.createPages = async function createPages({
  graphql,
  actions,
  reporter
}) {
  if (!env.algoliaAPIKey || !env.algoliaAppId) {
    if (process.env.FREECODECAMP_NODE_ENV === 'production') {
      throw new Error(
        'Algolia App id and API key are required to start the client!'
      );
    } else {
      reporter.info(
        'Algolia keys missing or invalid. Required for search to yield results.'
      );
    }
  }

  if (!env.stripePublicKey) {
    if (process.env.FREECODECAMP_NODE_ENV === 'production') {
      throw new Error('Stripe public key is required to start the client!');
    } else {
      reporter.info(
        'Stripe public key is missing or invalid. Required for Stripe integration.'
      );
    }
  }

  const { createPage } = actions;

  const result = await graphql(`
    {
      allChallengeNode(
        sort: {
          fields: [
            challenge___superOrder
            challenge___order
            challenge___challengeOrder
          ]
        }
      ) {
        edges {
          node {
            id
            challenge {
              block
              blockType
              blockLayout
              certification
              challengeType
              dashedName
              demoType
              disableLoopProtectTests
              disableLoopProtectPreview
              fields {
                slug
                blockHashSlug
              }
              id
              isLastChallengeInBlock
              order
              required {
                link
                src
              }
              challengeOrder
              challengeFiles {
                name
                ext
                contents
                head
                tail
                history
                fileKey
              }
              solutions {
                contents
                ext
                history
              }
              superBlock
              superOrder
              template
              usesMultifileEditor
              chapter
              module
            }
          }
        }
      }
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              nodeIdentity
            }
            frontmatter {
              certification
              block
              superBlock
              title
            }
            id
          }
        }
      }
    }
  `);

  const allChallengeNodes = result.data.allChallengeNode.edges.map(
    ({ node }) => node
  );

  const createIdToNextPathMap = nodes =>
    nodes.reduce((map, node, index) => {
      const nextNode = nodes[index + 1];
      const nextPath = nextNode ? nextNode.challenge.fields.slug : null;
      if (nextPath) map[node.id] = nextPath;
      return map;
    }, {});

  const createIdToPrevPathMap = nodes =>
    nodes.reduce((map, node, index) => {
      const prevNode = nodes[index - 1];
      const prevPath = prevNode ? prevNode.challenge.fields.slug : null;
      if (prevPath) map[node.id] = prevPath;
      return map;
    }, {});

  const idToNextPathCurrentCurriculum =
    createIdToNextPathMap(allChallengeNodes);

  const idToPrevPathCurrentCurriculum =
    createIdToPrevPathMap(allChallengeNodes);

  // Create challenge pages.
  result.data.allChallengeNode.edges.forEach(
    createChallengePages(createPage, {
      idToNextPathCurrentCurriculum,
      idToPrevPathCurrentCurriculum
    })
  );

  const blocks = uniq(
    result.data.allChallengeNode.edges.map(
      ({
        node: {
          challenge: { block }
        }
      }) => block
    )
  );

  const superBlocks = uniq(
    result.data.allChallengeNode.edges.map(
      ({
        node: {
          challenge: { superBlock }
        }
      }) => superBlock
    )
  );

  // Create intro pages
  // TODO: Remove allMarkdownRemark (populate from elsewhere)
  result.data.allMarkdownRemark.edges.forEach(edge => {
    const {
      node: { frontmatter, fields }
    } = edge;

    if (!fields) {
      return;
    }
    const { slug, nodeIdentity } = fields;
    if (slug.includes('LICENCE')) {
      return;
    }
    if (nodeIdentity === 'blockIntroMarkdown') {
      if (!blocks.includes(frontmatter.block)) {
        return;
      }
    } else if (!superBlocks.includes(frontmatter.superBlock)) {
      return;
    }

    try {
      const pageBuilder = createByIdentityMap[nodeIdentity](createPage);
      pageBuilder(edge);
    } catch (e) {
      console.log(e);
      console.log(`
            ident: ${nodeIdentity} does not belong to a function

            ${frontmatter ? JSON.stringify(edge.node) : 'no frontmatter'}


            `);
    }
  });
};

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const newPlugins = [
    // We add the shims of the node globals to the global scope
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ];
  // The monaco editor relies on some browser only globals so should not be
  // involved in SSR. Also, if the plugin is used during the 'build-html' stage
  // it overwrites the minfied files with ordinary ones.
  if (stage !== 'build-html') {
    newPlugins.push(
      new MonacoWebpackPlugin({ filename: '[name].worker-[contenthash].js' })
    );
  }
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
        path: require.resolve('path-browserify'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        util: require.resolve('util/util'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser')
      }
    },
    plugins: newPlugins
  });
};

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-function-bind'
  });
  actions.setBabelPlugin({
    name: '@babel/plugin-proposal-export-default-from'
  });
};

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;
  // Only update the `/challenges` page.
  if (page.path.match(/^\/challenges/)) {
    // page.matchPath is a special key that's used for matching pages
    // with corresponding routes only on the client.
    page.matchPath = '/challenges/*';
    // Update the page.
    createPage(page);
  }
};

// Take care to QA the challenges when modifying this. It has broken certain
// types of challenge in the past.
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type ChallengeNode implements Node {
      challenge: Challenge
    }
    type Challenge {
      blockType: String
      blockLayout: String
      challengeFiles: [FileContents]
      chapter: String
      explanation: String
      notes: String
      url: String
      assignments: [String]
      prerequisites: [PrerequisiteChallenge]
      module: String
      msTrophyId: String
      fillInTheBlank: FillInTheBlank
      scene: Scene
      transcript: String
      quizzes: [Quiz]
    }
    type FileContents {
      fileKey: String
      ext: String
      name: String
      contents: String
      head: String
      tail: String
      editableRegionBoundaries: [Int]
    }
    type PrerequisiteChallenge {
      id: String
      title: String
    }
    type FillInTheBlank {
      sentence: String
      blanks: [Blank]
    }
    type Blank {
      answer: String
      feedback: String
    }
    type Scene {
      setup: SceneSetup
      commands: [SceneCommands]
    }
    type SceneSetup {
      background: String
      characters: [SetupCharacter]
      audio: SetupAudio
      alwaysShowDialogue: Boolean
    }
    type SetupCharacter {
      character: String
      position: CharacterPosition
      opacity: Float
    }
    type SetupAudio {
      filename: String
      startTime: Float
      startTimestamp: Float
      finishTimestamp: Float
    }
    type SceneCommands {
      background: String
      character: String
      position: CharacterPosition
      opacity: Float
      startTime: Float
      finishTime: Float
      dialogue: Dialogue
    }
    type Dialogue {
      text: String
      align: String
    }
    type CharacterPosition {
      x: Float
      y: Float
      z: Float
    }
    type Quiz {
      questions: [QuizQuestion]
    }
    type QuizQuestion {
      text: String
      distractors: [String]
      answer: String
    }
  `;
  createTypes(typeDefs);
};
