import slugify from 'slugify';

export const slugifyData = (s: string) => {
	return slugify(s, {
		lower: true,
		remove: /[*+~.()'"!:@]/g,
	});
}
