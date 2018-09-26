module.exports = {
  verbose: true,
  persistent: true,
  plugins: {
    local: {
      skipSeleniumInstall: true,
      browsers: ["chrome", "firefox"]
    },
    sauce: false
  }
}
