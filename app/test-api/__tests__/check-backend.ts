// ============================================================================
// FICHIER: __tests__/check-backend.ts
// DESCRIPTION: Script simple pour vérifier la connexion au backend
// ============================================================================

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080/api';

async function checkBackendConnection() {
  console.log('\n🔍 Vérification de la connexion au backend...');
  console.log(`📡 URL de l'API: ${API_URL}\n`);

  try {
    // Test 1: Connexion de base
    console.log('1️⃣  Test de connexion de base...');
    const response = await axios.get(API_URL.replace('/api', ''), {
      timeout: 5000,
    });
    console.log('✅ Backend accessible !');
    console.log(`   Status: ${response.status}`);

    // Test 2: Test des endpoints API
    console.log('\n2️⃣  Test des endpoints API...');
    
    const endpoints = [
      '/users',
      '/vehicles',
      '/drivers',
      '/trips',
      '/positions',
      '/maintenances',
      '/fuel-recharges',
      '/notifications',
    ];

    for (const endpoint of endpoints) {
      try {
        const res = await axios.get(`${API_URL}${endpoint}`, {
          timeout: 3000,
        });
        console.log(`   ✅ ${endpoint.padEnd(20)} - ${res.status} - ${res.data?.length || 0} élément(s)`);
      } catch (error: any) {
        if (error.response) {
          console.log(`   ⚠️  ${endpoint.padEnd(20)} - ${error.response.status} - ${error.response.statusText}`);
        } else {
          console.log(`   ❌ ${endpoint.padEnd(20)} - Endpoint non disponible`);
        }
      }
    }

    console.log('\n✅ ========================================');
    console.log('   Vérification terminée !');
    console.log('========================================\n');
  } catch (error: any) {
    console.error('\n❌ ========================================');
    console.error('   ERREUR DE CONNEXION');
    console.error('========================================');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🚫 Impossible de se connecter au backend.');
      console.error('   Vérifiez que Spring Boot est démarré sur le port 9080.\n');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n⏱️  Timeout: Le backend ne répond pas.');
      console.error('   Vérifiez que le serveur fonctionne correctement.\n');
    } else {
      console.error(`\n❌ Erreur: ${error.message}\n`);
    }
    
    console.error('💡 Solutions:');
    console.error('   1. Démarrez Spring Boot: cd backend && mvn spring-boot:run');
    console.error('   2. Vérifiez le port dans .env.local');
    console.error('   3. Vérifiez que Docker/PostgreSQL fonctionne\n');
  }
}

// Exécution
if (require.main === module) {
  checkBackendConnection();
}

export default checkBackendConnection;