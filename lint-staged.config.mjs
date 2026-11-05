const config = {
  "*.{ts,tsx,js,mjs,cjs,json,md,css}": ["prettier --write"],
  "*.{ts,tsx,js,mjs,cjs}": ["eslint --fix --max-warnings=0"],
};

export default config;
