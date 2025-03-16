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
		client: {start:"_app/immutable/entry/start.Bt50BIZ5.js",app:"_app/immutable/entry/app.BmzzU-Mk.js",imports:["_app/immutable/entry/start.Bt50BIZ5.js","_app/immutable/chunks/D8g41Pc6.js","_app/immutable/chunks/D2TcuHkd.js","_app/immutable/entry/app.BmzzU-Mk.js","_app/immutable/chunks/D2TcuHkd.js","_app/immutable/chunks/1bXq2FG_.js","_app/immutable/chunks/BIIlYxzt.js","_app/immutable/chunks/G9UG2Ga4.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/","/detect","/rules"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
