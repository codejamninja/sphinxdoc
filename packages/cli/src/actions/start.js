import Err from 'err';
import { requireModule } from '../helpers';

export default async function build(config) {
  const { platform, platformName, output, options } = config;
  const { port, open } = options;
  if (!platformName) throw new Err('platform not specified', 400);
  if (!platform) throw new Err(`invalid platform '${platformName}'`, 400);
  const Platform = requireModule(platform);
  const platformModule = new Platform({ platform, output, port, open });
  await platformModule.install();
  await platformModule.start();
}