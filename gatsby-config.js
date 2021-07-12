const breakPoints = {
  md: '(min-width: 520px)',
  pc: '(min-width: 960px)',
};

module.exports = {
  siteMetadata: {
    title: `Challengy Blog`,
    author: {
      name: `Challengy`,
      summary: `who lives and works in Japan.`,
    },
    description: `A starter blog demonstrating what Gatsby can do.`,
    siteUrl: `https://gatsbystarterblogsource.gatsbyjs.io/`,
    social: {
      twitter: `Challengy1`,
    },
  },
  plugins: [
    `gatsby-plugin-emotion`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // Footnotes mode (default: true)
        footnotes: true,
        // GitHub Flavored Markdown mode (default: true)
        gfm: true,
        // Plugins configs
        plugins: [
          `gatsby-remark-katex`,
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-extract-image-attributes`,
            options: {
              properties: ['align'],
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 500,
            },
          },
          `gatsby-remark-images-insert-wrapper-attributes`,
          `gatsby-transformer-sharp`,
          {
            resolve: 'gatsby-plugin-breakpoints',
            options: {
              queries: breakPoints,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog/`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Challengy1 Blog`,
        short_name: `Challengy1`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/me.png`, // This path is relative to the root of the site.
      },
    },
  ],
};
