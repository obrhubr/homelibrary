module.exports = opfJs => {
  /* destructure the manifest from the opf */
  const {
    package: { manifest },
  } = opfJs;

  /* if there is no manifest, return; something went wrong */
  if (!manifest) {
    return;
  }

  /* filter the manifest for items with a properties attribute value of `cover-image`; destructure the first value */
  const [manifestCoverItem] = manifest.item.filter(
    item =>
      item._attributes.properties &&
      item._attributes.properties.includes('cover-image')
  );

  /* if there is no item with the properties attribute, or the item does not have an href attribute, return; something went wrong */
  if (!manifestCoverItem || !manifestCoverItem._attributes.href) {
    return;
  }

  /* return the href of the manifest item with the property `cover-image` */
  return manifestCoverItem._attributes.href;
};
