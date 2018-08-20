pragma solidity ^0.4.18;

contract SupplierAccount{
    
    struct Supplier{
        uint timestamp;
        string supplierImformation;
    }
    
    mapping(uint => Supplier) _supplier;
    
    uint _numberofImformation;
    
    address _supplierAddress;
    
    modifier OnlyAdmin{
    require(msg.sender==_supplierAddress);
    _;
    }
    
    function SupplierAccount(){
        
         _numberofImformation = 0;
         _supplierAddress = msg.sender;
         
    }
    
    function supplierImformation_publish(string supplierImformation) OnlyAdmin{
        require(bytes(supplierImformation).length <=200);
        _supplier[_numberofImformation].timestamp = now;
        _supplier[_numberofImformation].supplierImformation = supplierImformation;
        _numberofImformation++;
    }
    
    function getSupplierImformation(uint imformationId) constant returns(string supplierImformation, uint timestamp){
        supplierImformation = _supplier[imformationId].supplierImformation;
        timestamp = _supplier[imformationId].timestamp;
    }
    
    function getLastImformation() constant returns(string supplierImformation,uint timestamp ,uint imformationId){
        supplierImformation = _supplier[_numberofImformation-1].supplierImformation;
        timestamp = _supplier[_numberofImformation-1].timestamp;
        imformationId = _numberofImformation;
    }
    
    function getSupplierAddress() constant returns(address supplierAddress){
        return _supplierAddress;
    }
    
    function getNumberofImformation() constant returns(uint imformationNumbers){
        return _numberofImformation;
    }
    
     function adminRetriveDonation() OnlyAdmin{
        assert(_supplierAddress.send(this.balance));
        
    }
    
    function adminDeleteRegistry()  OnlyAdmin{
        selfdestruct(_supplierAddress);
    }
    
    event LogDonate(address index_from, uint256 amount );
    
    function() payable{
        LogDonate(msg.sender, msg.value);
    }
}