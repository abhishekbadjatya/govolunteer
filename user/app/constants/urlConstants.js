

let urlConstants = () => {

	let baseUrl = "http://localhost/sampleASE/api/services/public/"
	return {

		"login" : baseUrl + 'login',
		"init" : baseUrl + 'getsession',
		"signUp" : baseUrl + 'signup',
		"logout" : baseUrl + 'logout',
		"categories" : baseUrl + 'categories',
		"locations" : baseUrl + 'locations',
		"search" : baseUrl + 'search'
	};


};

export default urlConstants();