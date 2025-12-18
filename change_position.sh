#!/bin/bash

# ==========================
# CONFIGURATION
# ==========================
API_URL="http://localhost:9080/positions"   # ← adapte si besoin
VEHICLE_ID=4
SLEEP_TIME=3   # secondes entre chaque envoi

# Liste de coordonnées (longitude, latitude)
COORDINATES=(
  "4.3517 50.8503"
  "4.3525 50.8510"
  "4.3532 50.8518"
  "4.3540 50.8525"
  "4.3530 50.8515"
)

# ==========================
# BOUCLE INFINIE
# ==========================
echo "📡 Démarrage du déplacement simulé du véhicule $VEHICLE_ID"

while true; do
  for coord in "${COORDINATES[@]}"; do
    LON=$(echo $coord | cut -d' ' -f1)
    LAT=$(echo $coord | cut -d' ' -f2)

    echo "➡️ Envoi position: lon=$LON lat=$LAT"

    curl -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{
        \"vehicleId\": $VEHICLE_ID,
        \"coordinate\": {
          \"type\": \"Point\",
          \"coordinates\": [$LON, $LAT]
        }
      }"

    echo ""
    sleep $SLEEP_TIME
  done
done

