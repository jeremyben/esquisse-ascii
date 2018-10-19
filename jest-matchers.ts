// https://jestjs.io/docs/en/expect#expectextendmatchers

expect.extend({
	toBeOneOf(received, ...expected) {
		const pass = expected.includes(received)

		const message = pass
			? () => `expected ${received} not to be one of : ${expected.join(', ')}`
			: () => `expected ${received} to be one of : ${expected.join(', ')}`

		return { message, pass }
	}
})

declare namespace jest {
	interface Matchers<R> {
		/**
		 * Checks that a value is one of many.
		 */
		toBeOneOf(...expected): R
	}
}
