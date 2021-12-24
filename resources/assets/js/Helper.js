class Helper {

	test() {
		console.log('APP_ENV:', process.env.APP_ENV)
	}

	static log () {
		console.log('top')
	}
}
export default Helper
