var SupplierAccount = artifacts.require("SupplierAccount");

contract('SupplierAccount', function (accounts) {

    it("supplierImformation_publish", function () {
        var supplierAccountInstance;

        return SupplierAccount.deployed().then(function (instance) {
            supplierAccountInstance = instance;
            return supplierAccountInstance.supplierImformation_publish("hello world");
        }).then(function (id) {
            console.info(id);
            return supplierAccountInstance.getLastImformation();
        }).then(function (response, timestamp, numberOfImformation) {
            console.info(response[0])
            console.info(new Date(SupplierAccount.web3.toDecimal(response[1])))
            console.info(response[2].toString())
        });
    });

    it("getSupplierAddress", function () {
        var supplierAccountInstance;

        return SupplierAccount.deployed().then(function (instance) {
            supplierAccountInstance = instance;
            return supplierAccountInstancece.getSupplierAddress.call();
        }).then(function (adminAddress) {
            console.info(adminAddress)
        });
    });

    it("getNumberofImformation", function () {
        var supplierAccountInstance;

        return SupplierAccount.deployed().then(function (instance) {
            supplierAccountInstance = instance;
            return supplierAccountInstance.getNumberofImformation.call();
        }).then(function (numberOfImformation) {
            console.info(numberOfImformation)
        });
    });
});