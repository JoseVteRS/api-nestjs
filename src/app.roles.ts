import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
	BASIC_USER = 'BASIC_USER',
	SUBSCRIPTOR = 'SUBSCRIPTOR',
	MODERATOR = 'MODERATOR',
	ADMIN = 'ADMIN',
	SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AppResource {
	USER = 'USER',
	AUTHOR = 'AUTHOR',
	GENRE = 'GENRE',
	BOOK = 'BOOK',
	LIST = 'LIST',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
	// USER ROLES
	.grant(AppRoles.BASIC_USER)
	.updateOwn([AppResource.USER])
	.deleteOwn([AppResource.USER])
	.createOwn([AppResource.LIST])
	.readAny([AppResource.LIST])
	.updateOwn([AppResource.LIST])
	.deleteOwn([AppResource.LIST])
	// SUBSCRIPTOR
	.grant(AppRoles.SUBSCRIPTOR)
	.extend(AppRoles.BASIC_USER)
	// MODERATOR ROLES
	.grant(AppRoles.MODERATOR)
	.extend(AppRoles.BASIC_USER)
	.createAny([AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE])
	.updateAny([AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE, AppResource.LIST])
	.deleteAny([AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE])
	// ADMIN ROLES
	.grant(AppRoles.ADMIN)
	.extend(AppRoles.BASIC_USER)
	.createAny([AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE, AppResource.LIST])
	.updateAny([AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE, AppResource.LIST])
	.deleteAny([AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE, AppResource.LIST])
	// SUPER_ADMIN ROLES
	.grant(AppRoles.SUPER_ADMIN)
	.extend(AppRoles.BASIC_USER)
	.createAny([AppResource.LIST, AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE])
	.readAny([AppResource.LIST, AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE])
	.updateAny([AppResource.LIST, AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE])
	.deleteAny([AppResource.LIST, AppResource.USER, AppResource.BOOK, AppResource.AUTHOR, AppResource.GENRE]);



