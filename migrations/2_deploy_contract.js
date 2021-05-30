const Marketplace = artifacts.require("MarketPlace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
