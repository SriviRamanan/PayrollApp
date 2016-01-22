## Synopsis

"MYOB payroll application"; This library process payroll information for employees whose details such as name, annual salary, super annuation rate are provided through a CSV file. The payroll details are generated in a CSV file format.


## Assumptions and observations
- Input CSV file to contain data only and no header. 
- Super rate to have whole numbers only; decimal precisions not handled.
- Payroll will not have any details about leave balances, IRD number or tax code (!).
- Income tax rates applicable for 2012-2013 from 1 July 2012 has been adopted for the entire financial year.
- The output CSV is always written to 'result.csv'. Incase of errors, the result.csv file will still hold the CSV list of payee details that has been processed thus far. 

##Installation
The application requires Node.js environment and has been tested with node v4.2.4. To get the application working, please follow the steps below:
1. Clone the repository from git hub URL: https://github.com/SriviRamanan/PayrollApp.git
2. Run 'npm install'
3. Run the application using the command mentioned in the 'Usage' section. The output CSV list will be stored in result.csv. 
4. Run the tests using the command mentioned in the 'Tests' section

## Usage

Usage: node process_payroll.js <input csv file>

## Tests
npm test

