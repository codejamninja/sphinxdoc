import crossSpawn from 'cross-spawn';
import fs from 'fs-extra';
import path from 'path';
import pkgDir from 'pkg-dir';
import { Platform } from '@sphinxdoc/core';

export default class Rtd extends Platform {
  constructor(...args) {
    super(...args);
    this.gatsbyCli = path.resolve(
      pkgDir.sync(
        require.resolve('gatsby-cli', {
          paths: path.resolve(pkgDir.sync(process.cwd()), 'node_modules')
        })
      ),
      'lib/index.js'
    );
    this.gatsbyTheme = pkgDir.sync(
      require.resolve('@sphinxdoc/gatsby-theme', {
        paths: path.resolve(pkgDir.sync(process.cwd()), 'node_modules')
      })
    );
  }

  async build() {
    if (this.output !== 'gatsby' && this.output !== 'html') {
      return super.build();
    }
    const { paths } = this;
    const buildPath = path.resolve(paths.working, 'build');
    const distPath = path.resolve(paths.project, 'dist/docs/gatsby');
    await this.loadEnvironment();
    await this.python([
      '-m',
      'sphinx',
      '-M',
      'jekyll',
      paths.working,
      buildPath
    ]);
    fs.mkdirsSync(distPath);
    fs.copySync(
      path.resolve(buildPath, 'jekyll'),
      path.resolve(this.gatsbyTheme, 'src/pages')
    );
    await this.gatsby(['build']);
    fs.mkdirsSync(distPath);
    return fs.copySync(path.resolve(this.gatsbyTheme, 'public'), distPath);
  }

  async start() {
    return this.gatsby(['develop']);
  }

  async gatsby(args) {
    return new Promise((resolve, reject) => {
      const cp = crossSpawn('node', [this.gatsbyCli, ...args], {
        cwd: this.gatsbyTheme,
        stdio: 'inherit'
      });
      cp.on('close', resolve);
      cp.on('error', reject);
    });
  }
}
