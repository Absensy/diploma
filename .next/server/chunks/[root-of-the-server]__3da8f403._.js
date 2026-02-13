module.exports = [
"[project]/.next-internal/server/app/api/upload/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/cloudStorage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Cloud Storage конфигурация для продакшена
// Базовый тип для Cloudinary
__turbopack_context__.s([
    "CloudinaryProvider",
    ()=>CloudinaryProvider,
    "LocalStorageProvider",
    ()=>LocalStorageProvider,
    "cloudStorageConfig",
    ()=>cloudStorageConfig,
    "createStorageProvider",
    ()=>createStorageProvider
]);
const cloudStorageConfig = {
    provider: process.env.CLOUD_STORAGE_PROVIDER || 'local',
    bucket: process.env.CLOUD_STORAGE_BUCKET,
    region: process.env.CLOUD_STORAGE_REGION,
    apiKey: process.env.CLOUD_STORAGE_API_KEY,
    apiSecret: process.env.CLOUD_STORAGE_API_SECRET
};
class LocalStorageProvider {
    async uploadFile(file, fileName, folder) {
        const path = await __turbopack_context__.A("[externals]/path [external] (path, cjs, async loader)");
        const fs = await __turbopack_context__.A("[externals]/fs [external] (fs, cjs, async loader)").then((m)=>m.promises);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
        const filePath = path.join(uploadDir, fileName);
        // Создаем папку если не существует
        await fs.mkdir(uploadDir, {
            recursive: true
        });
        // Сохраняем файл
        await fs.writeFile(filePath, file);
        return {
            url: `/uploads/${folder}/${fileName}`,
            fileName
        };
    }
    async deleteFile(publicId) {
        try {
            const fs = await __turbopack_context__.A("[externals]/fs [external] (fs, cjs, async loader)").then((m)=>m.promises);
            const path = await __turbopack_context__.A("[externals]/path [external] (path, cjs, async loader)");
            // publicId в локальном хранилище - это путь к файлу
            const filePath = path.join(process.cwd(), 'public', publicId);
            await fs.unlink(filePath);
            return true;
        } catch  {
            return false;
        }
    }
}
class CloudinaryProvider {
    cloudinary = null;
    constructor(){
    // Ленивая загрузка модуля
    }
    async loadCloudinaryModule() {
        if (!this.cloudinary) {
            try {
                const cloudinary = (await __turbopack_context__.A("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript, async loader)")).v2;
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                });
                this.cloudinary = cloudinary;
            } catch  {
                throw new Error('cloudinary package not found. Please install it with: npm install cloudinary');
            }
        }
        return this.cloudinary;
    }
    async uploadFile(file, fileName, folder) {
        const cloudinary = await this.loadCloudinaryModule();
        return new Promise((resolve, reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: `granit-memory/${folder}`,
                public_id: fileName.replace(/\.[^/.]+$/, ""),
                resource_type: 'auto'
            }, (error, result)=>{
                if (error) {
                    reject(error);
                } else {
                    const cloudinaryResult = result;
                    resolve({
                        url: cloudinaryResult.secure_url,
                        publicId: cloudinaryResult.public_id,
                        fileName
                    });
                }
            });
            uploadStream.end(file);
        });
    }
    async deleteFile(publicId) {
        try {
            const cloudinary = await this.loadCloudinaryModule();
            await cloudinary.uploader.destroy(publicId);
            return true;
        } catch  {
            return false;
        }
    }
}
function createStorageProvider() {
    switch(cloudStorageConfig.provider){
        case 'cloudinary':
            return new CloudinaryProvider();
        case 'local':
        default:
            return new LocalStorageProvider();
    }
}
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloudStorage.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type'); // 'product', 'category', 'example'
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Файл не найден'
            }, {
                status: 400
            });
        }
        if (!type) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Тип файла не указан'
            }, {
                status: 400
            });
        }
        // Проверяем тип файла
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ];
        if (!allowedTypes.includes(file.type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP, PDF'
            }, {
                status: 400
            });
        }
        // Проверяем размер файла (10MB для PDF, 5MB для изображений)
        const maxSize = file.type === 'application/pdf' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Размер файла не должен превышать ${file.type === 'application/pdf' ? '10MB' : '5MB'}`
            }, {
                status: 400
            });
        }
        // Создаем уникальное имя файла
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${type}_${timestamp}.${fileExtension}`;
        // Получаем провайдер хранилища
        const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudStorage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStorageProvider"])();
        // Конвертируем файл в Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Загружаем файл в облачное хранилище
        const result = await storage.uploadFile(buffer, fileName, type);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            fileUrl: result.url,
            fileName: result.fileName,
            publicId: result.publicId
        });
    } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Ошибка сервера при загрузке файла'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3da8f403._.js.map