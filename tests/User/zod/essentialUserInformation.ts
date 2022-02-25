// Create an arbitrary which generates valid inputs for the schema
import {
	permissionLevelSchema,
	EssentialUserInformation,
	essentialUserInformationSchema
} from "../../../src";
import {ZodFastCheck} from "zod-fast-check";
import {asciiString, assert, property, uuid} from "fast-check";
import {permissionLevelRegex} from "./permissionLevels";

const userArbitrary = ZodFastCheck().inputOf(essentialUserInformationSchema);

test("Schema accepts allowed patterns", () => {
	assert(
		property(userArbitrary, (_permissionDto) => {
			const permissionDto = essentialUserInformationSchema.parse(_permissionDto);

			expect(permissionDto.UID).toBeTruthy();
			expect(permissionDto.DisplayName).toBeTruthy();

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
	);
});

test("Schema rejects missing uid value", ()=> {
	const permissionDto: EssentialUserInformation = {
		DisplayName: "TestName"
	} as EssentialUserInformation;
	const result = essentialUserInformationSchema.safeParse(permissionDto);
	expect(result.success).toBe(false);
});

test("Schema rejects missing display name value", ()=> {
	const permissionDto: EssentialUserInformation = {
		UID: "TestID",
	} as EssentialUserInformation;
	const result = essentialUserInformationSchema.safeParse(permissionDto);
	expect(result.success).toBe(false);
});

test("Child validator rejects invalid values", () => {
	assert(
		property(uuid(), asciiString(), asciiString(), (id, level1, level2) => {
			const permissionDto = {
				UID: id,
				Equipment: level1,
				Calender: level2,
				Chat: level1,
				Storage: level2,
				System: level1,
			};

			const result = essentialUserInformationSchema.safeParse(permissionDto);
			expect(result.success).toBe(false);
		})
	);
});

const permissionLevelArbitrary = ZodFastCheck().inputOf(permissionLevelSchema);

test("Child validator accepts valid values", () => {
	assert(
		property(uuid(), permissionLevelArbitrary, permissionLevelArbitrary, (id, equipmentLevel1, equipmentLevel2) => {
			const permissionDto = {
				UID: id,
				DisplayName: id,
				Equipment: equipmentLevel1,
				Calender: equipmentLevel2,
				Chat: equipmentLevel1,
				Storage: equipmentLevel2,
				System: equipmentLevel1,
			};

			const result = essentialUserInformationSchema.safeParse(permissionDto);
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