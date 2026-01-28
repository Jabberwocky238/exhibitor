# exhibitor

To install dependencies:

```bash
bun install
```

curl -X POST https://distributor.app238.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "worker_id": "exhibitor",
    "owner_id": "distributoradmin",
    "image": "ghcr.io/jabberwocky238/exhibitor:latest",
    "port": 10086
  }'


curl -X POST https://distributor.app238.com/api/register -H "Content-Type: application/json" -d "{\"worker_id\": \"exhibitor\",\"owner_id\": \"distributoradmin\",\"image\": \"ghcr.io/jabberwocky238/exhibitor:latest\",\"port\": 10086}"

https://exhibitor.distributoradmin.worker.app238.com/

curl -X POST "https://combinator.app238.com/rdb/exec" -H "Content-Type: application/json" -H "X-Combinator-RDB-ID: 1" -d "{\"stmt\":\"CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY, name TEXT);\",\"args\":[]}"

