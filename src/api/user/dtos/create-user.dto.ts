import { IsString, IsBoolean, IsNotEmpty, IsEmail, IsOptional, MinLength, MaxLength, IsDateString, IsArray, IsEnum } from 'class-validator'
import { AppRoles } from '../../../app.roles';
import { EnumToString } from 'src/common/helpers/enumToString';

export class CreateUserDto {

	@IsString()
	@IsOptional()
	uid: string

	@IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
	@IsString()
	@MinLength(2, { message: 'Nombre demasiado corto. Mínimo 2 carácteres' })
	@MaxLength(50, { message: 'Nombre demasiado largo, Máximo 10 carácteres' })
	username: string

	@IsNotEmpty({ message: 'El alias es obligatorio' })
	@IsString()
	alias: string

	@IsString()
	@IsEmail({}, {message: 'El correo eletrónico debe tener una formato válido. (nombre@dominio.com)'})
	@IsNotEmpty({
		message:
			'Oh, necesita escribir su correo electrónico habitual para poder registrarse',
	})
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6, { message: 'La contraseña debe contener mínimo 6 carácteres' })
	password: string

	@IsOptional()
	@IsString()
	uriAvatar: string

	@IsOptional()
	@IsString()
	genre: string

	@IsOptional()
	@IsString()
	secretKeyConfirmation: string

	@IsOptional()
	@IsBoolean()
	isAdmin: boolean

	@IsArray()
	@IsOptional()
	@IsEnum(AppRoles, {each: true, message: `Debe ser un rol válido ${EnumToString(AppRoles)}`})
	roles: string[]

	@IsOptional()
	@IsBoolean()
	isValid: boolean

	@IsOptional()
	@IsBoolean()
	isPublic: boolean

	@IsOptional()
	@IsBoolean()
	isVerifiedAccount: boolean

	@IsOptional()
	@IsDateString()
	updatedAt: Date

}
