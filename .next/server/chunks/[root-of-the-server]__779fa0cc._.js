module.exports = [
"[externals]/path [external] (path, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_path_e30b8067._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/path [external] (path, cjs)");
    });
});
}),
"[externals]/fs [external] (fs, cjs, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_fs_54ffce70._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/fs [external] (fs, cjs)");
    });
});
}),
"[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/node_modules_e10160b7._.js",
  "server/chunks/[root-of-the-server]__09afd4fb._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
    });
});
}),
];