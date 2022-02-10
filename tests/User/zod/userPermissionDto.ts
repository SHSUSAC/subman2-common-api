// Create an arbitrary which generates valid inputs for the schema
import {permissionLevelSchema, UserPermissionsDTO, userPermissionsDTOSchema} from "../../../src";
import {ZodFastCheck} from "zod-fast-check";
import {asciiString, assert, property, uuid} from "fast-check";
import {permissionLevelRegex} from "./permissionLevels";

const permissionDtoArbitrary = ZodFastCheck().inputOf(userPermissionsDTOSchema);

test("Schema accepts allowed patterns", () => {
	assert(
		property(permissionDtoArbitrary, (_permissionDto) => {
			const permissionDto = userPermissionsDTOSchema.parse(_permissionDto);

			expect(permissionDto.UID).not.toBeUndefined();

			if(permissionDto.Equipment) {
				const permissionLevel = permissionLevelSchema.parse(permissionDto.Equipment);
				if(permissionLevel) {
					expect(permissionLevel).toMatch(permissionLevelRegex);
				}
				else {
					expect(permissionLevel).toBe(null);
				}
			}
		})
	)
});

test("Schema rejects missing id values", ()=> {
	const permissionDto: UserPermissionsDTO = {
		UID: "",
		Equipment: null
	}
	const result = userPermissionsDTOSchema.safeParse(permissionDto);
	expect(result.success).toBe(false);
});

test("Child validator rejects invalid values", () => {
	assert(
		property(uuid(), asciiString(), (id, equipmentLevel) => {
			const permissionDto = {
				UID: id,
				Equipment: equipmentLevel
			};

			const result = userPermissionsDTOSchema.safeParse(permissionDto);
			expect(result.success).toBe(false);
		})
	);
});

const permissionLevelArbitrary = ZodFastCheck().inputOf(permissionLevelSchema);

test("Child validator accepts valid values", () => {
	assert(
		property(uuid(), permissionLevelArbitrary, (id, equipmentLevel) => {
			const permissionDto = {
				UID: id,
				Equipment: equipmentLevel
			};

			const result = userPermissionsDTOSchema.safeParse(permissionDto);
			expect(result.success).toBe(true);

			const permissionLevel = permissionLevelSchema.parse(permissionDto.Equipment);
			if(permissionLevel) {
				expect(permissionLevel).toMatch(permissionLevelRegex);
			}
			else {
				expect(permissionLevel).toBe(null);
			}
		})
	);
});