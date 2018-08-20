pragma solidity ^0.4.18;

contract DistributorAccount{
    
    struct Distributor{
        uint timestamp;
        string distributorImformation;
    }
    
    mapping(uint => Distributor) _distributor;
    
    uint _numberofImformation;
    
    address _distributorAddress;
    
    modifier OnlyAdmin{
    require(msg.sender==_distributorAddress);
    _;
    }
    
    function DistributorAccount(){
        
         _numberofImformation = 0;
         _distributorAddress = msg.sender;
         
    }
    
    function distributorImformation_publish(string distributorImformation) OnlyAdmin{
        require(bytes(distributorImformation).length <=200);
        _distributor[_numberofImformation].timestamp = now;
        _distributor[_numberofImformation].distributorImformation = distributorImformation;
        _numberofImformation++;
    }
    
    function getDistributorImformation(uint imformationId) constant returns(string distributorImformation, uint timestamp){
        distributorImformation = _distributor[imformationId].distributorImformation;
        timestamp = _distributor[imformationId].timestamp;
    }
    
    function getLastImformation() constant returns(string distributorImformation,uint timestamp ,uint imformationId){
        distributorImformation = _distributor[_numberofImformation-1].distributorImformation;
        timestamp = _distributor[_numberofImformation-1].timestamp;
        imformationId = _numberofImformation;
    }
    
    function getDistributorAddress() constant returns(address distributorAddress){
        return _distributorAddress;
    }
    
    function getNumberofImformation() constant returns(uint imformationNumbers){
        return _numberofImformation;
    }
    
     function adminRetriveDonation() OnlyAdmin{
        assert(_distributorAddress.send(this.balance));
        
    }
    
    function adminDeleteRegistry()  OnlyAdmin{
        selfdestruct(_distributorAddress);
    }
    
    event LogDonate(address index_from, uint256 amount );
    
    function() payable{
        LogDonate(msg.sender, msg.value);
    }
}