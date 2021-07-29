const path = require('path');
const fs = require('fs-extra');
const { xml2js } = require('xml-js');

/*= ============================================
=            parseOpf            =
============================================= */

module.exports = async pathToEpub => {
  let containerXml;
  let relativeOpfPath;
  let opfXml;

  /* try to find META-INF/container.xml */
  try {
    containerXml = await fs.readFile(
      path.resolve(pathToEpub, `META-INF/container.xml`),
      'utf8'
    );
  } catch (e) {
    throw new Error(
      `Could not read META-INF/container.xml. Make sure the EPUB is unzipped.`
    );
  }

  /* try to get the path to opf */
  const containerJs = xml2js(containerXml, { compact: true });

  try {
    relativeOpfPath =
      containerJs.container.rootfiles.rootfile._attributes['full-path'];
  } catch (e) {
    throw new Error(
      `Could not get the path to the rootfile from META-INF/container.xml.`
    );
  }

  const opfPath = path.resolve(pathToEpub, relativeOpfPath);

  /* try to read the opf */
  try {
    opfXml = await fs.readFile(opfPath, 'utf8');
  } catch (e) {
    throw new Error(`Could not find the rootfile at ${pathToEpub}.`);
  }

  /* try to parse the xml  */
  const opfJs = xml2js(opfXml, { compact: true });

  /* return the OPF JS and the path to the OPF */
  return { opfJs, opfPath };
};

/*= ====  End of parseOpf  ====== */
