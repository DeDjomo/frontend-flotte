"use strict";
// ============================================================================
// FICHIER: __tests__/check-backend.ts
// DESCRIPTION: Script simple pour vérifier la connexion au backend
// ============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080/api';
function checkBackendConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var response, endpoints, _i, endpoints_1, endpoint, res, error_1, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('\n🔍 Vérification de la connexion au backend...');
                    console.log("\uD83D\uDCE1 URL de l'API: ".concat(API_URL, "\n"));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    // Test 1: Connexion de base
                    console.log('1️⃣  Test de connexion de base...');
                    return [4 /*yield*/, axios_1.default.get(API_URL.replace('/api', ''), {
                            timeout: 5000,
                        })];
                case 2:
                    response = _b.sent();
                    console.log('✅ Backend accessible !');
                    console.log("   Status: ".concat(response.status));
                    // Test 2: Test des endpoints API
                    console.log('\n2️⃣  Test des endpoints API...');
                    endpoints = [
                        '/users',
                        '/vehicles',
                        '/drivers',
                        '/trips',
                        '/positions',
                        '/maintenances',
                        '/fuel-recharges',
                        '/notifications',
                    ];
                    _i = 0, endpoints_1 = endpoints;
                    _b.label = 3;
                case 3:
                    if (!(_i < endpoints_1.length)) return [3 /*break*/, 8];
                    endpoint = endpoints_1[_i];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL).concat(endpoint), {
                            timeout: 3000,
                        })];
                case 5:
                    res = _b.sent();
                    console.log("   \u2705 ".concat(endpoint.padEnd(20), " - ").concat(res.status, " - ").concat(((_a = res.data) === null || _a === void 0 ? void 0 : _a.length) || 0, " \u00E9l\u00E9ment(s)"));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    if (error_1.response) {
                        console.log("   \u26A0\uFE0F  ".concat(endpoint.padEnd(20), " - ").concat(error_1.response.status, " - ").concat(error_1.response.statusText));
                    }
                    else {
                        console.log("   \u274C ".concat(endpoint.padEnd(20), " - Endpoint non disponible"));
                    }
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    console.log('\n✅ ========================================');
                    console.log('   Vérification terminée !');
                    console.log('========================================\n');
                    return [3 /*break*/, 10];
                case 9:
                    error_2 = _b.sent();
                    console.error('\n❌ ========================================');
                    console.error('   ERREUR DE CONNEXION');
                    console.error('========================================');
                    if (error_2.code === 'ECONNREFUSED') {
                        console.error('\n🚫 Impossible de se connecter au backend.');
                        console.error('   Vérifiez que Spring Boot est démarré sur le port 9080.\n');
                    }
                    else if (error_2.code === 'ETIMEDOUT') {
                        console.error('\n⏱️  Timeout: Le backend ne répond pas.');
                        console.error('   Vérifiez que le serveur fonctionne correctement.\n');
                    }
                    else {
                        console.error("\n\u274C Erreur: ".concat(error_2.message, "\n"));
                    }
                    console.error('💡 Solutions:');
                    console.error('   1. Démarrez Spring Boot: cd backend && mvn spring-boot:run');
                    console.error('   2. Vérifiez le port dans .env.local');
                    console.error('   3. Vérifiez que Docker/PostgreSQL fonctionne\n');
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Exécution
if (require.main === module) {
    checkBackendConnection();
}
exports.default = checkBackendConnection;
