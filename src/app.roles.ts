import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
	BASIC_USER = 'BASIC_USER',
	SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AppResource {
	USER = 'USER',
	POST = 'POST',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
	// USER ROLES
	.grant(AppRoles.BASIC_USER)
	.updateOwn([AppResource.USER])
	.deleteOwn([AppResource.USER])
	.createOwn([AppResource.POST])
	.updateOwn([AppResource.POST])
	.deleteOwn([AppResource.POST])
	// SUPER_ADMIN ROLES
	.grant(AppRoles.SUPER_ADMIN)
	.extend(AppRoles.BASIC_USER)
	.createAny([AppResource.USER])
	.updateAny([AppResource.POST, AppResource.USER])
	.deleteAny([AppResource.POST, AppResource.USER]);



