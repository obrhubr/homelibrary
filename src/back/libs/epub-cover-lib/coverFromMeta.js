module.exports = opfJs => {
  /* destructure the manifest and meta arrays from the opf */
  const {
    package: {
      manifest,
      metadata: { meta },
    },
  } = opfJs;

  /* if these don't exist, return; the opf is not valid or something went wrong */
  if (!manifest || !meta) {
    return;
  }
  try {
    /* filter and destructure the meta cover tag */
    const [metaDataCoverReference] = meta.filter(
      item => item._attributes.name === 'cover'
    );
  } catch(err) {
    console.log(err);
    return;
  }

  /* if there is no meta cover tag or it does not have the content attribute, return; something's not right */
  if (!metaDataCoverReference || !metaDataCoverReference._attributes.content) {
    return;
  }

  /* store the meta cover tag's content attribute value as the cover id */
  const coverId = metaDataCoverReference._attributes.content;

  /* filter the manifest for an item with the id from the cover meta tag */
  const [metaCoverItem] = manifest.item.filter(
    item => item._attributes.id === coverId
  );

  /* if there is no item with the id specified in the cover meta tag or it does not have an href attribute, return; something's not right */
  if (!metaCoverItem || !metaCoverItem._attributes.href) {
    return;
  }

  /* return the href of the cover item */

  return metaCoverItem._attributes.href;
};
