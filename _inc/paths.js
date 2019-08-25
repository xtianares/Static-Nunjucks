// folders paths
module.exports = {
  site: {
    src: '_src/',
    dest: '_dist/'
  },
  html: {
    sitePages: '_src/pages/**/*.+(html|njk)',
    siteFolder: '_src/pages/',
    templatesFiles: '_src/templates/**/*',
    templatesFolder: '_src/templates/'
  },
  images: {
    siteFiles: '_src/images/**/*',
    siteFolder: '_src/images/',
    siteDest: '_dist/images/',
  },
  css: {
    siteFiles: '_src/scss/**/*',
    siteFolder: '_src/scss/',
    siteSass: '_src/scss/site.scss',
    siteDest: '_dist/css/',
    bsFiles: '_src/bootstrap/scss/**/*',
    bsFolder: '_src/bootstrap/scss/',
    bsSass: '_src/scss/bootstrap/scss/bootstrap.scss',
    bsDest: '_dist/css/bootstrap'
  },
  js: {
    siteFiles: '_src/js/**/*',
    siteRootFiles: '_src/js/*',
    siteFolder: '_src/js/',
    siteDest: '_dist/js/',
  },
  downloads: {
    files: '_src/downloads/**/*',
    folder: '_src/downloads',
    dest: '_dist/downloads/'
  },
  root: {
    files: '_src/root/**/*'
  }
}
