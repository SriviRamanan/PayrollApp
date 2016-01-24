// __mocks__/isnumeric.js
module.exports =  function (isNum) {
	if (!(/^[0-9]+$/.test(isNum))){
		return false;
	}
	else {
		return true;
	}
};
