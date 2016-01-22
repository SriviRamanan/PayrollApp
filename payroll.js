var payroll = module.exports = function(iFname) {
	return {
	
	// employeeInfo - process gross income 
	calcGrossIncome: function(annualPay){
		return Math.round(annualPay / 12);
	},

	// employeeInfo - process income tax
	calcIncomeTax: function(annualPay){
		/*
			0 - $18,200     Nil
			$18,201 - $37,000       19c for each $1 over $18,200
			$37,001 - $80,000       $3,572 plus 32.5c for each $1 over $37,000
			$80,001 - $180,000      $17,547 plus 37c for each $1 over $80,000
			$180,001 and over       $54,547 plus 45c for each $1 over $180,000
		*/
		var incomeTax = 0;

		if (annualPay > 18200){
			incomeTax = incomeTax + ((annualPay > 37000) ? (37000 - 18200) * 0.19 : (annualPay - 18200) * 0.19);
			//incomeTax = incomeTax + (37000 - 18200) * 0.19; 
		}
		if (annualPay > 37000){
			incomeTax = incomeTax + ((annualPay > 80000) ? (80000 - 37000) * 0.325 : (annualPay - 37000) * 0.325);
		}
		if (annualPay > 80000){
			incomeTax = incomeTax + ((annualPay > 180000) ? (180000 - 80000) * 0.37 : (annualPay - 80000) * 0.37);
		}
		if (annualPay > 180000){
			incomeTax = incomeTax + ((annualPay - 180000) * 0.45);
		}
	    return Math.round(incomeTax/12);
	},

	//employeeInfo - process net income
	calcNetIncome: function(grossPay, incomeTax) {
    		return (grossPay - incomeTax);
	},

	//employeeInfo - process super annuation
	calcSuper: function(grossPay, superRate) {
	    return Math.round(grossPay * superRate/100); 
	},

 	// employeeInfo - validate input
	validateInput: function(csvLine){
		var errStr = [];
		if (csvLine.length != 5){
			errStr.push('Invalid employee('+csvLine[0]+' '+csvLine[1]+') input format.\n\t \
Valid format is: First name, Last name, Annual Income, Super Rate, Pay Duration(e.g 01 March - 31 March).'); 
			throw errStr;
		}
	},
 	//employeeInfo - validate input details
	validateEmployeeInfo: function(employeeInfo){
		
		var errStr = [];
		var vStr = require('string');
		if(!vStr(employeeInfo.fname).isAlpha()) {
			errStr.push('Employee('+employeeInfo.fname+' '+employeeInfo.lname+') first name has invalid character(s).\n\t \
Name should have alphabetic characters only.'); 
			throw errStr;
		}
		if(!vStr(employeeInfo.lname).isAlpha()) {
			errStr.push('Employee('+employeeInfo.fname+' '+employeeInfo.lname+') last name has invalid character(s).\n \t\
Name should have alphabetic characters only.'); 
			throw errStr;
		}
		
		var vNum = require('validate.io-nan');
		if (isNaN(employeeInfo.salary) || (employeeInfo.salary < 0)){
			errStr.push('Employee('+employeeInfo.fname+' '+employeeInfo.lname+') salary is not a valid number.\n \t\
Salary should be a positive number.'); 
			throw errStr;
		}
	

 		if(!(/^[0-9]*%$/.test(employeeInfo.superRate))){
			errStr.push('Employee('+employeeInfo.fname+' '+employeeInfo.lname+') super rate is \
not a valid number.\n\tSuper rate should be between 0 - 50% (inclusive).'); 
			throw errStr;
			
		}
		else {
			employeeInfo.superRateConv = parseInt(employeeInfo.superRate.substring(0, employeeInfo.superRate.length - 1));
			if((employeeInfo.superRateConv < 0) || (employeeInfo.superRateConv > 50)){ 
				errStr.push('Employee('+employeeInfo.fname+' '+employeeInfo.lname+') super rate is \
not a valid number.\n\tSuper rate should be between 0 - 50% (inclusive).'); 
				throw errStr;
			}

		}

	},

	main: function () {
		var csvStreamifyModule = require('csv-streamify');
		var csvParser = csvStreamifyModule({objectMode: true});
		var fsRead = require('fs');
		var fsWrite = require('fs');
		var csvWrite = require('fast-csv');
		var csvStream = csvWrite.format({headers: true}),
			writeStream = fsWrite.createWriteStream("result.csv");
		// Object to store and process employee information
		var employeeInfo = new Object();
		var paySlip = new Object();

		// Pipe the csv writes to file stream
		csvStream.pipe(writeStream);

		csvParser.on('data', function(columns) {
			employeeInfo.fname = columns[0];
			employeeInfo.lname = columns[1];
			employeeInfo.salary = parseInt(columns[2]);
			//employeeInfo.superRate = parseInt(columns[3].substring(0, columns[3].length - 1));
			employeeInfo.superRate = columns[3];
			employeeInfo.payPeriod = columns[4];
			employeeInfo.superRateConv = 0;
			/*employeeInfo.fnCalcGrossIncome = module.exports.calcGrossIncome;
			employeeInfo.fnValidateInput = module.exports.validateInput;
			employeeInfo.fnValidateEmployeeInfo = module.exports.validateEmployeeInfo;
			employeeInfo.fnCalcIncomeTax = module.exports.calcIncomeTax;
			employeeInfo.fnCalcNetIncome = module.exports.calcNetIncome;
			employeeInfo.fnCalcSuper= module.exports.calcSuper;*/

			employeeInfo.fnCalcGrossIncome = payroll().calcGrossIncome;
			employeeInfo.fnValidateInput = payroll().validateInput;
			employeeInfo.fnValidateEmployeeInfo = payroll().validateEmployeeInfo;
			employeeInfo.fnCalcIncomeTax = payroll().calcIncomeTax;
			employeeInfo.fnCalcNetIncome = payroll().calcNetIncome;
			employeeInfo.fnCalcSuper= payroll().calcSuper;

			try {
				//employeeInfo.fnValidateInput(columns);
				employeeInfo.fnValidateEmployeeInfo(employeeInfo);
			}
			catch(err) {
				console.log("Error: "+err);
				return;
			}

			// Process payslip - using the employeeInfo structure to improve code readability 
			paySlip.name = employeeInfo.fname +" "+ employeeInfo.lname;
			paySlip.payPeriod = employeeInfo.payPeriod;
			paySlip.grossIncome = employeeInfo.fnCalcGrossIncome(employeeInfo.salary);
			paySlip.incomeTax = employeeInfo.fnCalcIncomeTax(employeeInfo.salary);
			paySlip.netIncome = employeeInfo.fnCalcNetIncome(paySlip.grossIncome, paySlip.incomeTax);
			paySlip.super = employeeInfo.fnCalcSuper(paySlip.grossIncome, employeeInfo.superRateConv);
			csvStream.write(paySlip);

		});

		csvParser.on('end', function (error) {
    			csvStream.end();
			if (error) {
				return console.error(error);
			}
		});

		// Read input csv file and pipe it to the parser 
		try {
			var inputStream = fsRead.createReadStream(iFname);
			inputStream.on('error', function (error) {
				console.log(error);
			});
			inputStream.pipe(csvParser);
		}
		catch(err) {
			console.log("Error: "+err);
			return;
		}
	 
	}
}
};


