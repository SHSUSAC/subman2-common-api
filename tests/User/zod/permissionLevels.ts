import * as fc from "fast-check";
import { ZodFastCheck } from "zod-fast-check";
import {permissionLevelSchema} from "../../../src";

// Create an arbitrary which generates valid inputs for the schema
const permissionLevelArbitrary = ZodFastCheck().inputOf(permissionLevelSchema);

export const permissionLevelRegex = new RegExp("(reader|writer|admin)");

test("Schema accepts allowed patterns", () => {
	fc.assert(
		fc.property(permissionLevelArbitrary, (_permissionLevel) => {
			const permissionLevel = permissionLevelSchema.parse(_permissionLevel);
			if(permissionLevel) {
				expect(permissionLevel).toMatch(permissionLevelRegex);
			}
			else {
				expect(permissionLevel).toBe(null);
			}
		})
	)
});

test("Schema allows nulls", () => {
	const result = permissionLevelSchema.safeParse(null);
	expect(result.success).toBe(true);
});

test("Schema rejects undefined", () => {
	const result = permissionLevelSchema.safeParse(undefined);
	expect(result.success).toBe(false);
})

test("Schema rejects random strings", () => {
	fc.assert(
		fc.property(fc.stringOf(fc.ascii()), level => {
			fc.pre(!permissionLevelRegex.test(level));

			const result = permissionLevelSchema.safeParse(level);
			expect(result.success).toBe(false);
		})
	)
})