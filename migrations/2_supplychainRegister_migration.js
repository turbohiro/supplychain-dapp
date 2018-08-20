var SupplychainRegister = artifacts.require("./SupplychainRegister.sol");

module.exports = function(deployer) {
    deployer.deploy(SupplychainRegister);
};
