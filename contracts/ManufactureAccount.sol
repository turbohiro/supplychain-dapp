pragma solidity ^0.4.18;

contract ManufactureAccount{
    
    struct Manufacture{
        uint timestamp;
        string manufactureImformation;
    }
    
    mapping(uint => Manufacture) _manufacture;
    
    uint _numberofImformation;
    
    address _manufactureAddress;
    
    modifier OnlyAdmin{
    require(msg.sender==_manufactureAddress);
    _;
    }
    
    function ManufactureAccount(){
        
         _numberofImformation = 0;
         _manufactureAddress = msg.sender;
         
    }
    
    function manufactureImformation_publish(string manufactureImformation) OnlyAdmin{
        require(bytes(manufactureImformation).length <=200);
        _manufacture[_numberofImformation].timestamp = now;
        _manufacture[_numberofImformation].manufactureImformation = manufactureImformation;
        _numberofImformation++;
    }
    
    function getManufactureImformation(uint imformationId) constant returns(string manufactureImformation, uint timestamp){
        manufactureImformation = _manufacture[imformationId].manufactureImformation;
        timestamp = _manufacture[imformationId].timestamp;
    }
    
    function getLastImformation() constant returns(string manufactureImformation,uint timestamp ,uint imformationId){
        manufactureImformation = _manufacture[_numberofImformation-1].manufactureImformation;
        timestamp = _manufacture[_numberofImformation-1].timestamp;
        imformationId = _numberofImformation;
    }
    
    function getManufactureAddress() constant returns(address manufactureAddress){
        return _manufactureAddress;
    }
    
    function getNumberofImformation() constant returns(uint imformationNumbers){
        return _numberofImformation;
    }
    
     function adminRetriveDonation() OnlyAdmin{
        assert(_manufactureAddress.send(this.balance));
        
    }
    
    function adminDeleteRegistry()  OnlyAdmin{
        selfdestruct(_manufactureAddress);
    }
    
    event LogDonate(address index_from, uint256 amount);
    
    function() payable{
        LogDonate(msg.sender, msg.value);
    }
    
}