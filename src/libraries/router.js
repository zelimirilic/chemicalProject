export const isActivePath = function (path) {
	return this.$route.fullPath.startsWith(path);
}
