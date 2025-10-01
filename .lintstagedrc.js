module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => {
    const filtered = filenames.filter(file => !file.includes('/index.js'));
    return filtered.length > 0
      ? [
          `eslint --fix ${filtered.join(' ')}`,
          `prettier --write ${filtered.join(' ')}`,
        ]
      : [];
  },
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
