jest.autoMockOff();
jest.dontMock('../payroll');
jest.dontMock('csv-streamify');
jest.dontMock('string');

var payrollModule = require('../payroll');
payroll = payrollModule();

describe('gross income validation', function () {
	it('calculates gross income for 60, 000 p.a', function() {
		expect(payroll.calcGrossIncome(60000)).toBe(5000);
	});
});

describe('income tax validation', function() {
	it('checks if no tax for income < 18,200', function() {
		expect(payroll.calcIncomeTax(17000)).toBe(0);
	});
	
	it('validates income tax formula for 60, 000 p.a', function() {
		expect(payroll.calcIncomeTax(60000)).toBe(921);
	});

});

describe('net income validation', function() {
	it('validates income tax formula for 60, 000 p.a', function() {
		expect(payroll.calcNetIncome(5000, 921)).toBe((5000-921));
	});
});

describe('super annuation validation', function() {
	it('validates annuation formula for 60, 000 p.a @ 10%', function() {
		expect(payroll.calcSuper(5000, 10)).toBe(500);
	});
});

describe('CSV input validation', function() {
	it('should throw when there are fewer than expected number of columns', function() {
		var employeeInfo1 = ["John", "Smith", 10000, "8%"];
		expect(function () { payroll.validateInput(employeeInfo1); }).toThrow();
	});
	it('should not throw when there are expected number of columns', function() {
		var employeeInfo1 = ["John", "Smith", 10000, "8%", "01 March – 31 March"];
		expect(function () { payroll.validateInput(employeeInfo1); }).not.toThrow();
	});
	it('validates each line of CSV file', function() {
		var employeeInfo1 = ["John", "Smith", 10000, "8%"];
		expect(function () { payroll.validateInput(employeeInfo1); }).toThrow();
	});
	it('validates employee first name', function() {
		var employeeInfo1 = {
			fname:"J##n",
			lname:"Smith",
			salary: 10000, 
			superRate: "8%" 
		};
		var employeeInfo2 = {
			fname:"John",
			lname:"Smith",
			salary: 10000, 
			superRate: "8%"
		};
		expect(function() {payroll.validateEmployeeInfo(employeeInfo1);}).toThrow();
		expect(function() {payroll.validateEmployeeInfo(employeeInfo2);}).not.toThrow();
	});
	it('validates employee last name', function() {
		var employeeInfo = {
			fname:"John",
			lname:"Sm1th",
			salary: 10000, 
			superRate: "8%"
		};
		expect(function() {payroll.validateEmployeeInfo(employeeInfo);}).toThrow();
	});
	it('validates employee salary', function() {
		var employeeInfo1 = {
			fname:"John",
			lname:"Smith",
			salary: -20000, 
			superRate: "8%"
		};
		var employeeInfo2 = {
			fname:"John",
			lname:"Smith",
			salary: 20000, 
			superRate: "8%"
		};
		expect(function() {payroll.validateEmployeeInfo(employeeInfo1);}).toThrow();
		expect(function() {payroll.validateEmployeeInfo(employeeInfo2);}).not.toThrow();
	});
	it('validates employee super annuation rate', function() {
		var employeeInfo1 = {
			fname:"John",
			lname:"Smith",
			salary: 20000, 
			superRate: "z"
		};
		var employeeInfo2 = {
			fname:"John",
			lname:"Smith",
			salary: 20000, 
			superRate: "8%" 
		};
		expect(function() {payroll.validateEmployeeInfo(employeeInfo1);}).toThrow();
		expect(function() {payroll.validateEmployeeInfo(employeeInfo2);}).not.toThrow();
	});
});
