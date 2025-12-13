#!/bin/bash

# ============================================================================
# SCRIPT DE TEST - Données Utilisateur FleetMan
# ============================================================================
# Ce script teste les 3 appels API principaux :
# 1. Récupérer tous les véhicules d'un utilisateur
# 2. Récupérer tous les chauffeurs d'un utilisateur
# 3. Récupérer toutes les alertes d'un utilisateur
# ============================================================================

# Configuration
API_URL="${API_URL:-http://localhost:9080/api}"
USER_ID="${1:-1}"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction pour afficher un header
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Fonction pour afficher un sous-header
print_subheader() {
    echo -e "\n${YELLOW}─────────────────────────────────────────${NC}"
    echo -e "${YELLOW}$1${NC}"
    echo -e "${YELLOW}─────────────────────────────────────────${NC}\n"
}

# Fonction pour vérifier si jq est installé
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}❌ jq n'est pas installé${NC}"
        echo -e "${YELLOW}💡 Installe-le avec:${NC}"
        echo -e "   - Ubuntu/Debian: ${CYAN}sudo apt-get install jq${NC}"
        echo -e "   - macOS: ${CYAN}brew install jq${NC}"
        echo -e "   - ou continue sans jq (affichage JSON brut)${NC}\n"
        return 1
    fi
    return 0
}

# Vérifier jq
HAS_JQ=false
if check_jq; then
    HAS_JQ=true
fi

# ============================================================================
# DÉBUT DU TEST
# ============================================================================

print_header "🚀 TEST DES DONNÉES UTILISATEUR ID: $USER_ID"

echo -e "${CYAN}📡 URL de l'API: ${NC}$API_URL"
echo -e "${CYAN}👤 ID Utilisateur: ${NC}$USER_ID\n"

# ============================================================================
# VÉRIFIER QUE LE BACKEND EST ACCESSIBLE
# ============================================================================

echo -e "${YELLOW}🔍 Vérification de la connexion au backend...${NC}"
if curl -s --connect-timeout 5 "$API_URL/../" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend accessible${NC}\n"
else
    echo -e "${RED}❌ Backend non accessible${NC}"
    echo -e "${YELLOW}💡 Assure-toi que Spring Boot est démarré sur le port 9080${NC}\n"
    exit 1
fi

# ============================================================================
# TEST 1: RÉCUPÉRER TOUS LES VÉHICULES DE L'UTILISATEUR
# ============================================================================

print_subheader "🚗 TEST 1: VÉHICULES DE L'UTILISATEUR"

echo -e "${CYAN}🔍 Appel API:${NC} GET $API_URL/vehicles/user/$USER_ID"
echo ""

VEHICLES_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/vehicles/user/$USER_ID")
HTTP_STATUS=$(echo "$VEHICLES_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
VEHICLES_DATA=$(echo "$VEHICLES_RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Succès (Status: $HTTP_STATUS)${NC}\n"
    
    if [ "$HAS_JQ" = true ]; then
        VEHICLE_COUNT=$(echo "$VEHICLES_DATA" | jq '. | length')
        echo -e "${GREEN}📊 $VEHICLE_COUNT véhicule(s) trouvé(s)${NC}\n"
        
        if [ "$VEHICLE_COUNT" -gt 0 ]; then
            echo -e "${CYAN}📋 Liste des véhicules:${NC}"
            echo "$VEHICLES_DATA" | jq -r '.[] | "
\u001b[1m\(.vehicleName // "Sans nom")\u001b[0m
   ID: \(.vehicleId)
   Marque: \(.vehicleMake)
   Immatriculation: \(.vehicleRegistrationNumber)
   Type: \(.vehicleType)
   Carburant: \(.vehicleFuelLevel // "N/A")%
   Vitesse: \(.vehicleSpeed // 0) km/h"'
        else
            echo -e "${YELLOW}⚠️  Aucun véhicule trouvé${NC}"
        fi
    else
        echo -e "${CYAN}📄 Réponse JSON:${NC}"
        echo "$VEHICLES_DATA" | python3 -m json.tool 2>/dev/null || echo "$VEHICLES_DATA"
    fi
else
    echo -e "${RED}❌ Erreur (Status: $HTTP_STATUS)${NC}"
    echo -e "${YELLOW}💡 L'endpoint /vehicles/user/$USER_ID n'existe peut-être pas${NC}"
    echo -e "${CYAN}Réponse:${NC} $VEHICLES_DATA"
fi

# ============================================================================
# TEST 2: RÉCUPÉRER TOUS LES CHAUFFEURS (VIA VÉHICULES)
# ============================================================================

print_subheader "👨‍✈️ TEST 2: CHAUFFEURS DE L'UTILISATEUR"

if [ "$HTTP_STATUS" = "200" ] && [ "$HAS_JQ" = true ]; then
    VEHICLE_COUNT=$(echo "$VEHICLES_DATA" | jq '. | length')
    
    if [ "$VEHICLE_COUNT" -gt 0 ]; then
        echo -e "${CYAN}🔍 Récupération des chauffeurs via les véhicules...${NC}\n"
        
        VEHICLE_IDS=$(echo "$VEHICLES_DATA" | jq -r '.[].vehicleId')
        
        ALL_DRIVERS="[]"
        for VEHICLE_ID in $VEHICLE_IDS; do
            echo -e "${CYAN}   Véhicule ID $VEHICLE_ID...${NC}"
            
            DRIVERS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/vehicles/$VEHICLE_ID/drivers")
            DRIVERS_HTTP_STATUS=$(echo "$DRIVERS_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
            DRIVERS_DATA=$(echo "$DRIVERS_RESPONSE" | sed '/HTTP_STATUS:/d')
            
            if [ "$DRIVERS_HTTP_STATUS" = "200" ]; then
                ALL_DRIVERS=$(echo "$ALL_DRIVERS $DRIVERS_DATA" | jq -s 'add | unique_by(.driverId)')
            fi
        done
        
        DRIVER_COUNT=$(echo "$ALL_DRIVERS" | jq '. | length')
        echo -e "\n${GREEN}✅ $DRIVER_COUNT chauffeur(s) unique(s) trouvé(s)${NC}\n"
        
        if [ "$DRIVER_COUNT" -gt 0 ]; then
            echo -e "${CYAN}📋 Liste des chauffeurs:${NC}"
            echo "$ALL_DRIVERS" | jq -r '.[] | "
\u001b[1m\(.driverName)\u001b[0m
   ID: \(.driverId)
   Email: \(.driverEmail // "Non renseigné")
   Téléphone: \(.driverPhoneNumber // "Non renseigné")
   Contact urgence: \(.emergencyContactName // "Non renseigné")
   Tél. urgence: \(.emergencyContact // "Non renseigné")"'
        else
            echo -e "${YELLOW}⚠️  Aucun chauffeur trouvé${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Aucun véhicule, donc impossible de récupérer les chauffeurs${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Impossible de récupérer les chauffeurs (véhicules non disponibles)${NC}"
fi

# ============================================================================
# TEST 3: RÉCUPÉRER TOUTES LES NOTIFICATIONS DE L'UTILISATEUR
# ============================================================================

print_subheader "🔔 TEST 3: ALERTES/NOTIFICATIONS DE L'UTILISATEUR"

echo -e "${CYAN}🔍 Appel API:${NC} GET $API_URL/notifications/user/$USER_ID"
echo ""

NOTIFS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "$API_URL/notifications/user/$USER_ID")
NOTIFS_HTTP_STATUS=$(echo "$NOTIFS_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
NOTIFS_DATA=$(echo "$NOTIFS_RESPONSE" | sed '/HTTP_STATUS:/d')

if [ "$NOTIFS_HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Succès (Status: $NOTIFS_HTTP_STATUS)${NC}\n"
    
    if [ "$HAS_JQ" = true ]; then
        NOTIF_COUNT=$(echo "$NOTIFS_DATA" | jq '. | length')
        echo -e "${GREEN}📊 $NOTIF_COUNT notification(s) trouvée(s)${NC}\n"
        
        if [ "$NOTIF_COUNT" -gt 0 ]; then
            UNREAD_COUNT=$(echo "$NOTIFS_DATA" | jq '[.[] | select(.notificationState == false)] | length')
            READ_COUNT=$(echo "$NOTIFS_DATA" | jq '[.[] | select(.notificationState == true)] | length')
            
            echo -e "${RED}📋 Notifications NON LUES ($UNREAD_COUNT):${NC}"
            if [ "$UNREAD_COUNT" -gt 0 ]; then
                echo "$NOTIFS_DATA" | jq -r '.[] | select(.notificationState == false) | "
\u001b[1;31m❌ \(.notificationSubject)\u001b[0m
   ID: \(.notificationId)
   Date: \(.notificationDateTime)
   Message: \(.notificationContent)"' | head -20
            else
                echo -e "   ${GREEN}✅ Aucune notification non lue${NC}"
            fi
            
            echo -e "\n${GREEN}📋 Notifications LUES ($READ_COUNT):${NC}"
            if [ "$READ_COUNT" -gt 0 ]; then
                echo "$NOTIFS_DATA" | jq -r '.[] | select(.notificationState == true) | "
\u001b[32m✅ \(.notificationSubject)\u001b[0m
   ID: \(.notificationId)
   Date: \(.notificationDateTime)
   Message: \(.notificationContent)"' | head -20
                
                if [ "$READ_COUNT" -gt 5 ]; then
                    echo -e "\n   ${CYAN}... et $(($READ_COUNT - 5)) autre(s) notification(s)${NC}"
                fi
            else
                echo -e "   ${YELLOW}Aucune notification lue${NC}"
            fi
            
            echo -e "\n${CYAN}📊 Statistiques:${NC}"
            echo -e "   Total: $NOTIF_COUNT"
            echo -e "   Non lues: ${RED}$UNREAD_COUNT${NC}"
            echo -e "   Lues: ${GREEN}$READ_COUNT${NC}"
        else
            echo -e "${YELLOW}⚠️  Aucune notification trouvée${NC}"
        fi
    else
        echo -e "${CYAN}📄 Réponse JSON:${NC}"
        echo "$NOTIFS_DATA" | python3 -m json.tool 2>/dev/null || echo "$NOTIFS_DATA"
    fi
else
    echo -e "${RED}❌ Erreur (Status: $NOTIFS_HTTP_STATUS)${NC}"
    echo -e "${YELLOW}💡 L'endpoint /notifications/user/$USER_ID n'existe peut-être pas${NC}"
    echo -e "${CYAN}Réponse:${NC} $NOTIFS_DATA"
fi

# ============================================================================
# RÉSUMÉ FINAL
# ============================================================================

print_header "✅ RÉSUMÉ DES TESTS"

echo -e "${CYAN}Utilisateur ID:${NC} $USER_ID"
echo -e "${CYAN}API URL:${NC} $API_URL"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Véhicules${NC}: Endpoint fonctionnel"
else
    echo -e "${RED}❌ Véhicules${NC}: Endpoint non disponible (Status: $HTTP_STATUS)"
fi

if [ "$NOTIFS_HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Notifications${NC}: Endpoint fonctionnel"
else
    echo -e "${RED}❌ Notifications${NC}: Endpoint non disponible (Status: $NOTIFS_HTTP_STATUS)"
fi

echo ""
echo -e "${YELLOW}💡 Pour tester avec un autre utilisateur:${NC}"
echo -e "   ${CYAN}./test-user-data.sh 2${NC}"
echo -e "   ${CYAN}./test-user-data.sh 5${NC}"
echo ""
echo -e "${YELLOW}💡 Pour changer l'URL de l'API:${NC}"
echo -e "   ${CYAN}API_URL=http://localhost:8080/api ./test-user-data.sh${NC}"
echo ""

print_header "🎉 TESTS TERMINÉS"