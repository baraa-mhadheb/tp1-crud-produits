#!/usr/bin/env bash
# Test manuel des 5 opérations CRUD avec curl (le backend doit tourner sur :8000)
API=http://localhost:8000
echo "── 1. CREATE ──"
RES=$(curl -s -X POST $API/products -H "Content-Type: application/json" \
  -d '{"name":"Souris","description":"Souris sans fil","price":25.5,"quantity":40}')
echo "$RES"
ID=$(echo "$RES" | sed -E 's/.*"id":([0-9]+).*/\1/')
echo "→ ID créé : $ID"
echo; echo "── 2. READ (liste) ──";   curl -s $API/products; echo
echo; echo "── 3. READ (détail) ──";  curl -s $API/products/$ID; echo
echo; echo "── 4. UPDATE ──"
curl -s -X PUT $API/products/$ID -H "Content-Type: application/json" \
  -d '{"name":"Souris Pro","description":"Souris ergonomique","price":39.9,"quantity":15}'; echo
echo; echo "── 5. DELETE ──"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X DELETE $API/products/$ID
echo; echo "── Vérification (doit être 404) ──"
curl -s -o /dev/null -w "HTTP %{http_code}\n" $API/products/$ID
