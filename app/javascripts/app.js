/**
智能合约：Supplychain Blockchain Demo的前端逻辑
功能：1.生成供应链区块链各环节商家的注册信息
	 2.在供应链平台上对商家进行注册
	 3.供应商/制造商/经销商信息的发布
	 4.显示打赏金额
**/

//1.部署供应链平台(supplychainRegister)的合约地址
var supplychainRegistryAddress = "0xde2f00ccfeefadd1ecc87be765cf46ac901a6ac8";
var current_supplychainAddress;


//2.部署SupplierAccount/ManufatureAccount/DistributorAccount的合约地址所需的gas
var defaultGas = 4700000;

//3.公司账户注册
function register(){
	var supplychainRegistryInstance;
	var name = $("#companyName").val();
	var accountAddress;
	var supplierAccountAddress;
	var manufactureAccountAddress;
	var distributorAccountAddress;
	
	if($("#companyType").val()=='1'){
		name1 = name;
		
		SupplierAccount.new({         //创建一个新的供应商账号的合约对象
			from: web3.eth.accounts[0],gas:defaultGas	
		}).then(function(instance1){
			supplierAccountAddress = instance1.address;
			current_supplychainAddress = supplierAccountAddress;
			$("#supplierAddress").val(supplierAccountAddress);
			$("#companyAddress").val(supplierAccountAddress)
		}).then(function(){
			SupplychainRegister.at(supplychainRegistryAddress).then(function(instance1){
				supplychainRegistryInstance = instance1;
				return supplychainRegistryInstance.register(name1 ,supplierAccountAddress,{
						from: web3.eth.accounts[0],
						gas:defaultGas
				});
			}).then(function(txReciept){
				console.info(txReceipt);
			});	
		});	
	}else if($("#companyType").val()=='2'){
		name2 = name;
		
		ManufactureAccount.new({         //创建一个新的制造商账号的合约对象
			from: web3.eth.accounts[1],gas:defaultGas	
		}).then(function(instance2){
			manufactureAccountAddress = instance2.address;
			current_supplychainAddress = manufactureAccountAddress;
			$("#manufactureAddress").val(manufactureAccountAddress);
			$("#companyAddressAddress").val(manufactureAccountAddress)
		}).then(function(){
			SupplychainRegister.at(supplychainRegistryAddress).then(function(instance2){
				supplychainRegistryInstance = instance2;
				return supplychainRegistryInstance.register(name2 ,manufactureAccountAddress,{
						from: web3.eth.accounts[1],
						gas:defaultGas
				});
			}).then(function(txReciept){
				console.info(txReceipt);
			});	
		});		
	}else if($("#companyType").val()=='3'){
		name3 = name;
		DistributorAccount.new({         //创建一个新的经销商账号的合约对象
			from: web3.eth.accounts[2],gas:defaultGas	           /// web3.eth.accounts[2]?????
		}).then(function(instance3){
			distributorAccountAddress = instance3.address;
			current_supplychainAddress = distributorAccountAddress;
			$("#distributorAddress").val(distributorAccountAddress);
			$("#companyAddress").val(distributorAccountAddress)
		}).then(function(){
			SupplychainRegister.at(supplychainRegistryAddress).then(function(instance3){
				supplychainRegistryInstance = instance3;
				return supplychainRegistryInstance.register(name3 ,distributorAccountAddress,{
						from: web3.eth.accounts[2],
						gas:defaultGas
				});
			}).then(function(txReciept){
				console.info(txReceipt);
				
			});	
		});			
	}		
	showAllRegister();		
};

//4.根据公司ID获取公司注册的信息
function getRegisterUser(id){    
	var addr;
	return SupplychainRegister.at(supplychainRegistryAddress).then(function(instance){
		SupplychainRegisterInstance = instance;
		return SupplychainRegisterInstance.getAddressofId.call(id).then(function(a){
			addr=a;
			return SupplychainRegisterInstance.getNameofAddress.call(addr);
		}).then(function(name){
			return {id:id, name:name, addr:addr}
		})
	});	
};

//5.供应链平台上所有注册用户的数量
function getTotalRegisterUser(){
	return SupplychainRegister.at(supplychainRegistryAddress).then(function(instance){
		SupplychainRegisterInstance = instance;
		return SupplychainRegisterInstance.getNumberofAccounts.call()
	}).then(function(total){
		return total;
	});
}



//6.查询平台上所有已注册的公司帐户
//{id: 1,name: " ", address: " "}
async function getAllRegister(){
	let users = [];
	let total = await getTotalRegisterUser();
	for (let i=0; i<total; i++){
		let user = await getTotalRegisterUser(i);
		users.push(user);
	}
	return users;
};

//7.在页面中显示已注册的用户
function showAllRegister(){
	getAllRegister().then(function(list){
		$("#companyList").html('');
		list.forEach(function(item,index){
			$("#companyList").append("<tr><td>"+item.id + "</td><td>"+item.name + "</td><td>" + item.addr + "</td></tr>");			
		});
		current_supplychainRegistryAddress = list[0].addr || "";
	});
};

//8.平台余额
function platformBalance(){
	let balance = web3.eth.getBalance(supplychainRegistryAddress);
	balance = web.fromWei(balance,'ether');
	return balance.toString();
}


//9.供应链平台基本信息
function getPlatformInfo(){
	$("#platformAccount").html(supplychainRegistryAddress);
	$("#platformBalance").html(platformBalance() + "ether");
}


/！--供应商页面的功能模块 --/
//10.供应商账号发布信息
function supplierSendInfo(){
	var supplierAccountInstance;
	var supplierInformation = $("#supplierInformation").val();
	return SupplierAccount.at(current_supplychainAddress).then(function(instance1){
		supplierAccountInstance = instance1;
		return supplierAccountInstance.supplierImformation_publish(supplierInformation,{from:web3.eth.accounts[0],gas:defaultGas});
	}).then(function(txReceipt){
		console.info(txReceipt);
		showSupplierInformation();
		$("#supplierInformation").val(' ');
	});
};

//10.1 返回supplierAccountAddress账户发出的第id条信息
function getSupplierInformation(supplierAddress,id){
	var supplierAccountInstance;
	return SupplierAccount.at(supplierAddress).then(function(instance1){
		supplierAccountInstance = instance1;
		return supplierAccountInstance.getSupplierImformation.call(id).then(function(w){
			return {id : id, supplierInformation: w[0], timestamp : w[1]};
		})
	});
};

//10.2 返回账户发的信息总数
function getTotalInfomation(supplierAddress){
	var supplierAccountInstance;
	return SupplierAccount.at(supplierAddress).then(function(instance1){
		supplierAccountInstance = instance1;
		return supplierAccountInstance.getNumberofImformation.call()	
	}).then(function(total){
		return total;
	});
};

//10.3 返回账户发的所有信息数
async function getAllsupplierInformation(supplierAddress){
	let informations = [];
	let total = await getTotalInfomation(supplierAddress);
	for (let i=0; i<total; i++){
		let information = await getSupplierInformation(supplierAddress,i);
		informations.push(information)
	}
	return informations;
};

//10.4 在页面中展示所有信息数

function showSupplierInformation(){
	return getAllsupplierInformation(current_supplychainAddress).then(function(list){
		$("#supplierContentList").html('');
		list.forEach(function(item, index){
			$("#supplierContentList").append("<td></td>" + item.id + "</td><td>" + item.content + "</td><td>"+ item.timestamp + "</td></tr>");
		});
	});
};

//10.5 供应商微博余额
function supplierBalance(){
	var Balance = web3.eth.getBalance(current_supplychainAddress);
	balance = web3.fromWei(Balance, 'ether');
	return balance.toString;
}

//10.6 得到供应商地址的用户名
function getNameOfsupplierAddress(){
	var supplierRegistryInstance;
	return SupplierchainRegister.at(supplychainRegistryAddress).then(function(instance){
		supplierRegistryInstance = instance;
		return supplierRegistryInstance.getNameofAddress.call(current_supplychainAddress);
	}).then(function(name){
		$("#myName1").html(name);
	});
};

//10.7 得到供应商信息
function getSupplierInfo(){
	getNameOfsupplierAddress();
	$("#myAddress1").html(current_supplychainAddress);      //这儿应该要修改  current_supplychainAddress有问题！！！
	$('#myBalance1').html(supplierBalance() + "ether");
}


     /！--制造商页面的功能模块 --/
//11.制造商账号信息发布
function manufactureSendInfo(){
	var manufactureAccountInstance;
	var manufactureInformation = $("#manufactureInformation").val();
	return ManufactureAccount.at(current_supplychainAddress).then(function(instance2){
		manufactureAccountInstance = Instance2;
		return manufactureAccountInstance.manufactureImformation_publish(manufactureInformation,{from:web3.eth.accounts[1],gas:defaultGas});
	}).then(function(txReceipt){
		console.info(txReceipt);
		showManufactureInformation();
		$("#manufactureInformation").val(' ');
	});
};

//11.1.返回manufactureAccountAddress账户发出的第id条信息
function getmanufactureInformation(manufactureAddress,id){
	var manufactureAccountInstance;
	return ManufactureAccount.at(manufactureAddress).then(function(instance2){
		manufactureAccountInstance = instance2;
		return manufactureAccountInstance.getManufactureImformation.call(id).then(function(w){
			return {id : id, manufactureInformation: w[0], timestamp : w[1]};
		})
	})
}

//11.2 返回账户发的信息总数
function getTotalInfomation(manufactureAddress){
	var manufactureAccountInstance;
	return ManufactureAccount.at(manufactureAddress).then(function(instance1){
		manufactureAccountInstance = instance1;
		return manufactureAccountInstance.getNumberofImformation.call()	
	}).then(function(total){
		return total;
	});
};

//11.3 返回账户发的所有信息数
async function getAllmanufactureInformation(manufactureAddress){
	let informations = [];
	let total = await getTotalInfomation(manufactureAddress);
	for (let i=0; i<total; i++){
		let information = await getmanufactureInformation(manufactureAddress,i);
		informations.push(information)
	}
	return informations;
};

//11.4 在页面中展示所有信息数
function showManufactureInformation(){
	return getAllmanufactureInformation(current_supplychainAddress).then(function(list){
		$("#manufactureContentList").html('');
		list.forEach(function(item, index){
			$("#manufactureContentList").append("<td></td>" + item.id + "</td><td>" + item.content + "</td><td>"+ item.timestamp + "</td></tr>");
		});
	});
};

//11.5 制造商微博余额
function manufactureBalance(){
	var Balance = web3.eth.getBalance(current_supplychainAddress);
	balance = web3.fromWei(Balance, 'ether');
	return balance.toString;
}

//11.6 得到制造商地址的用户名
function getNameOfmanufactureAddress(){
	var manufactureRegistryInstance;
	return SupplierchainRegister.at(supplychainRegistryAddress).then(function(instance){
		manufactureRegistryInstance = instance;
		return manufactureRegistryInstance.getNameofAddress.call(current_supplychainAddress);
	}).then(function(name){
		$("#myName2").html(name);
	});
};

//11.7 得到制造商信息
function getManufactureInfo(){
	getNameOfmanufactureAddress();
	$("#myAddress2").html(current_supplychainAddress);      //这儿应该要修改  current_supplychainAddress有问题！！！
	$('#myBalance2').html(manufactureBalance() + "ether");
}



/！--经销商页面的功能模块 --/
//12.经销商账号信息发布
function distributorSendInfo(){
	var distributorAccountInstance;
	var distributorInformation = $("#distributorInformation").val();
	return DistributorAccount.at(current_supplychainAddress).then(function(instance3){
		distributorAccountInstance = Instance3;
		return distributorAccountInstance.distributorImformation_publish(distributorInformation,{from:web3.eth.accounts[2],gas:defaultGas});
	}).then(function(txReceipt){
		console.info(txReceipt);
		showDistributorInformation();
		$("#distributorInformation").val(' ');
	});
};

//12.1 返回distributorAccountAddress账户发出的第id条信息
function getdistributorInformation(distributorAddress,id){
	var distributorAccountInstance;
	return DistributorAccount.at(distributorAddress).then(function(instance2){
		distributorAccountInstance = instance2;
		return distributorAccountInstance.getDistributorImformation.call(id).then(function(w){
			return {id : id, distributorInformation: w[0], timestamp : w[1]};
		})
	})
}

//12.2 返回账户发的信息总数
function getTotalInfomation(distributorAddress){
	var distributorAccountInstance;
	return DistributorAccount.at(distributorAddress).then(function(instance1){
		distributorAccountInstance = instance1;
		return distributorAccountInstance.getNumberofImformation.call()	
	}).then(function(total){
		return total;
	});
};

//12.3 返回账户发的所有信息数
async function getAlldistributorInformation(distributorAddress){
	let informations = [];
	let total = await getTotalInfomation(distributorAddress);
	for (let i=0; i<total; i++){
		let information = await getdistributorInformation(distributorAddress,i);
		informations.push(information)
	}
	return informations;
};

//12.4 在页面中展示所有信息数
function showDistributorInformation(){
	return getAlldistributorInformation(current_supplychainAddress).then(function(list){
		$("#distributorContentList").html('');
		list.forEach(function(item, index){
			$("#distributorContentList").append("<td></td>" + item.id + "</td><td>" + item.content + "</td><td>"+ item.timestamp + "</td></tr>");
		});
	});
};

//12.5 经销商微博余额
function distributorBalance(){
	var Balance = web3.eth.getBalance(current_supplychainAddress);
	balance = web3.fromWei(Balance, 'ether');
	return balance.toString;
}

//12.6 得到经销商地址的用户名
function getNameOfdistributorAddress(){
	var distributorRegistryInstance;
	return SupplierchainRegister.at(supplychainRegistryAddress).then(function(instance){
		distributorRegistryInstance = instance;
		return distributorRegistryInstance.getNameofAddress.call(current_supplychainAddress);
	}).then(function(name){
		$("#myName3").html(name);
	});
};

//12.7 得到经销商信息
function getDistributorInfo(){
	getNameOfdistributorAddress();
	$("#myAddress3").html(current_supplychainAddress);      //这儿应该要修改  current_supplychainAddress有问题！！！
	$('#myBalance3').html(distributorBalance() + "ether");
}



//13.init the page
window.onload = function(){

	getPlatformInfo();
	showAllRegister();

	$("#home_supplierchain_tab").click(function(e){
		e.preventDefault();
		getPlatformInfo();
		showAllRegister();
	})

	$("#supplier_tab").click(function(e){
		e.preventDEfault();
		getSupplierInfo();
		showSupplierInformation();
	})

	$("#manufacture_tab").click(function(e){
		e.preventDEfault();
		getManufactureInfo();
		showManufactureInformation();
	})

	$("#distributor_tab").click(function(e){
		e.preventDEfault();
		getDistributorInfo();
		showDistributorInformation();
	})

	$("#registerBtn").click(function(){
		register();
	})

	$("#sendsupplierInformationBtn").click(function(){
		supplierSendInfo();
	})

	$("#sendmanufactureInformationBtn").click(function(){
		manufactureSendInfo();
	})

	$("#senddistributorInformationBtn").click(function(){
		distributorSendInfo();
	})


}

