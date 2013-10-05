module.exports = {
	extend: ["wnComponent"],
	private: { mocha: 1 },
	dependencies: ["npm","mocha","commander","falseModule"],
	methods: {
		getMocha: function ()
		{
			return mocha;
		}
	}
}