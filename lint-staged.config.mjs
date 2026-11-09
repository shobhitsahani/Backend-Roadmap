const config = {
  "*.{ts,tsx,js,mjs,cjs,json,md,css}": ["prettier --write"],
  "*.{ts,tsx,js,mjs,cjs}": ["eslint --fix --max-warnings=0 --no-warn-ignored"],
};

export default config;
