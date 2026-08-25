function slugify(value = '') {
  let slug = String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-');

  if (slug.startsWith('-')) {
    slug = slug.slice(1);
  }

  if (slug.endsWith('-')) {
    slug = slug.slice(0, -1);
  }

  return slug;
}

module.exports = slugify;
