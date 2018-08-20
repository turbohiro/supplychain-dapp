pragma solidity ^0.4.18;

contract SupplychainRegister{
    
    mapping(address => string) _addressToAccountName;
    
    mapping(uint => address)  _accountIdToAccountAddress;
    
    mapping(string => address) _accountNameToAccountAddress;
    
    uint _numberofAccounts;
    
    address _registryAdmin;
    
    modifier OnlyRegistryAdmin{
        require(msg.sender==_registryAdmin);
        _;
    }
    
    function supplychainRegistry(){
        _registryAdmin = msg.sender;
        _numberofAccounts = 0;
    }
    
    
    function register(string name, address accountAddress){
        require(_accountNameToAccountAddress[name] == address(0));
        require(bytes(_addressToAccountName[accountAddress]).length == 0);
        
        require(bytes(name).length <= 64);
        
        _accountNameToAccountAddress[name] = accountAddress;
        _addressToAccountName[accountAddress] = name;
        _accountIdToAccountAddress[_numberofAccounts] = accountAddress;
        
        _numberofAccounts++;
    }
    
    function getNumberofAccounts() constant returns (uint numberofAccounts){
        numberofAccounts = _numberofAccounts; 
    }
    
    function getAddressofName(string name) constant returns (address addr){
        addr = _accountNameToAccountAddress[name];
    }
    
    function getNameofAddress(address addr) constant returns (string name){
        name = _addressToAccountName[addr];
    }
    
    function getAddressofId(uint id) constant returns (address addr){
        addr = _accountIdToAccountAddress[id];
    }
    
    function adminRetriveDonation() OnlyRegistryAdmin{
        assert(_registryAdmin.send(this.balance));
        
    }
    
    function adminDeleteRegistry()  OnlyRegistryAdmin{
        selfdestruct(_registryAdmin);
    }
    
    event LogDonate(address index_from, uint256 amount );
    
    function() payable{
        LogDonate(msg.sender, msg.value);
    }
}