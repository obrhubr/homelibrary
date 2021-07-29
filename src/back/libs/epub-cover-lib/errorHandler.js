/*= ============================================
=            errorHandler            =
============================================= */
/* establish an error handler for if anything goes wrong */
module.exports = (reject, cb) => message => {
  const err = new Error(message);
  /* if there's a callback, call it with the err obj and data as null */
  if (cb) {
    return cb(err, null);
  }
  /* reject the promise with the error object */
  return reject(err);
};

/*= ====  End of errorHandler  ====== */
