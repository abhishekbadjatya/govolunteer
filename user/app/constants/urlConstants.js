

let urlConstants = () => {

	let baseUrl = "http://localhost/sampleASE/api/services/public/"
	return {

		"login" : baseUrl + 'login',
		"init" : baseUrl + 'getsession',
		"signUp" : baseUrl + 'signup',
		"logout" : baseUrl + 'logout',
		"metadata" : baseUrl + 'metadata',
		"event" : baseUrl + 'event',
		"post" : baseUrl + 'post',
		"userpost" : baseUrl + 'userpost'
	};


};

export default urlConstants();