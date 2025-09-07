module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // Set input and output directories
  return {
    dir: {
      input: "src",
      output: "docs"
    }
  };
};
