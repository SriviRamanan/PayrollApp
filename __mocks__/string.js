// __mocks__/string.js

module.exports =  function (stringName) {
	return {
		isAlpha: function () {
			if (!(/^[A-Za-z]+$/.test(stringName))){
				return false;
			}
			else {
				return true;
			}
		}
	};
};

