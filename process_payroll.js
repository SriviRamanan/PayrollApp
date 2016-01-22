// Payroll process trigger module
var processPayroll = module.exports = function(inpArr){
	if(inpArr.length != 3) {
		console.log("Usage: node payroll.js <input csv file>");
		return;
	}
	var payroll = require("./payroll");
	console.log(inpArr[2]);
	payroll(inpArr[2]).main();
}

processPayroll(process.argv); 



