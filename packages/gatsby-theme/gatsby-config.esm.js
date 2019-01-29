import _ from 'lodash';

module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'markdown-pages'
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        commonmark: true,
        footnotes: true,
        pedantic: true,
        gfm: true,
        plugins: ['gatsby-remark-autolink-headers']
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png'
      }
    },
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: ['title', 'words'],
        resolvers: {
          MarkdownRemark: {
            path: node => node.frontmatter.path,
            title: node => node.frontmatter.title,
            words: node =>
              getWords(node.internal ? node.internal.content || '' : '')
          }
        }
      }
    }
  ]
};

function getWords(content) {
  return _.uniq(
    content
      .toLowerCase()
      .replace(/\s/g, ' ')
      .replace(/\w+:\/{2}[^ ]+/g, '')
      .replace(/[^\w ]/g, '')
      .split(' ')
  ).join(' ');
}
