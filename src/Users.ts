export type PermissionLevel = "reader" | "writer" | "admin" | null;

/**
 * DTO describing changes to a users permissions
 */
export type UserPermissionsDTO = {
	UID: string;
	Equipment?: PermissionLevel;
	Calender?: PermissionLevel;
	Chat?: PermissionLevel;
	Storage?: PermissionLevel;
	System?: PermissionLevel;
}