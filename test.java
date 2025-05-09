curl -v -X DELETE "https://localhost:8443/esignatureevents/$EVENT_ID/documentpackage" \
  -H "Content-Type: application/json" \
  -d '{"documents":["doc1","doc2"]}' \
  -k