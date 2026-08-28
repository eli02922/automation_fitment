# Automotive Catalog Platform

Scalable Node.js/Express + Next.js platform for managing millions of vehicle fitment records, consumed by multiple enterprise applications.

## Architecture

- **backend/** — Express + TypeScript API (catalog management, fitment CRUD/search) backed by SQL Server via Sequelize (Oracle-compatible dialect switch). Publishes/consumes domain events on Kafka (KafkaJS) and runs scheduled ETL batch jobs for data synchronization.
- **frontend/** — Next.js (App Router) catalog UI that searches fitments through the backend API.
- **docker-compose.yml** — Local dev stack: SQL Server, Kafka/Zookeeper, backend, frontend.
- **k8s/** — Kubernetes manifests (Deployments, Services, ConfigMap/Secret, HPA, Ingress) for production rollout.
- **.github/workflows/ci-cd.yml** — CI (lint/build/test) and CD (build/push images to GHCR, deploy to Kubernetes).

## Local development

```powershell
# Start infra + services
docker compose up --build

# Or run individually
cd backend; npm install; npm run dev
cd frontend; npm install; npm run dev
```

Backend: http://localhost:4000/api/v1/health
Frontend: http://localhost:3000

## Batch / ETL

```powershell
cd backend
npm run batch:fitment-sync   # one-off run
```
The same job is scheduled in-process via `node-cron` (see `ETL_CRON_SCHEDULE`).

## Kafka

```powershell
cd backend
npm run kafka:consumer
```
Fitment create/update/delete events are published to `KAFKA_FITMENT_TOPIC` from the API layer.

## Deployment

Push to `main` triggers CI, builds/pushes Docker images to GHCR, and rolls out the `k8s/` manifests to the configured Kubernetes cluster (`KUBE_CONFIG` secret).
