export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.C7CWq652.js","app":"_app/immutable/entry/app.OBYqCvSG.js","imports":["_app/immutable/entry/start.C7CWq652.js","_app/immutable/chunks/DcXORR_k.js","_app/immutable/chunks/BZzQXbv5.js","_app/immutable/entry/app.OBYqCvSG.js","_app/immutable/chunks/BZzQXbv5.js","_app/immutable/chunks/Bv2CX0pF.js","_app/immutable/chunks/oEOo3hgt.js","_app/immutable/chunks/DI6-0i3U.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/rules",
				pattern: /^\/rules\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
