
export type PermissionLevel = "reader" | "writer" | "admin" | null;

/**
 * DTO describing changes to a users permissions
 */
export type UserPermissionModificationDTO = {
	/**
	 * Target of the user to change permissions for
	 */
	UID: string;
} & UserPermissions;

/**
 * Permissions that can be attached to a user
 */
type UserPermissions = {
	Equipment?: PermissionLevel;
	Calender?: PermissionLevel;
	Chat?: PermissionLevel;
	Storage?: PermissionLevel;
	System?: PermissionLevel;
}

/**
 * The bare essentials needed to convey information about a user
 */
export type EssentialUserInformation = {
	UID: string;
	DisplayName: string
} & UserPermissions;