# Docker Setup - Quick Start Guide

## What Was Created

✅ **docker-compose.yml** - PostgreSQL + pgAdmin configuration  
✅ **.env.example** - Copy to `.env` with your credentials  
✅ **docker-helper.ps1** - Windows helper script (optional)

---

## 3-Step Quick Start

### 1. Copy Environment File
```powershell
Copy-Item .env.example .env
```

### 2. Start Docker Services
```powershell
docker compose up -d
```

### 3. Verify Services Running
```powershell
docker compose ps
```

Expected output:
```
NAME                    STATUS
expense_tracker_db      Up (healthy)
expense_tracker_pgadmin Up
```

---

## Access Your Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **pgAdmin** (Web UI) | http://localhost:5050 | admin@example.com / admin |
| **PostgreSQL** (CLI) | localhost:5432 | postgres / postgres |

**Connect via command line:**
```powershell
docker compose exec postgres psql -U postgres -d expense_tracker
```

---

## Essential Commands

```powershell
# Start services
docker compose up -d

# Stop services (keeps data)
docker compose down

# Check status
docker compose ps

# View logs
docker compose logs -f

# Connect to database
docker compose exec postgres psql -U postgres -d expense_tracker

# Backup database
docker compose exec -T postgres pg_dump -U postgres expense_tracker > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres expense_tracker < backup.sql
```

---

## Data Persistence

Your database data is stored in named volumes:
- **postgres_data** - Database files (persists after `docker compose down`)
- **pgadmin_data** - pgAdmin configuration

**To delete everything including data:**
```powershell
docker compose down -v
```

---

## Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Run `docker compose up -d`
3. ✅ Access http://localhost:5050
4. Install TypeORM for NestJS integration:
   ```powershell
   npm install @nestjs/typeorm typeorm pg
   ```
5. Update `app.module.ts` with database connection

---

## What's Inside

### docker-compose.yml
- **PostgreSQL 16 Alpine** - Lightweight database container
- **pgAdmin 4** - Web-based database management UI
- **Named Volumes** - Persistent data storage
- **Health Checks** - Ensures services are ready
- **Bridge Network** - Secure inter-container communication

### .env.example
```env
POSTGRES_DB=expense_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin
PGADMIN_PORT=5050

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
```

---

## Troubleshooting

**Docker daemon not running?**
- Open Docker Desktop and wait for it to start

**Port 5432 already in use?**
- Edit `.env` and change `POSTGRES_PORT=5433`
- Then restart: `docker compose down && docker compose up -d`

**Can't connect to database?**
- Run `docker compose logs postgres` to see errors
- Check that both containers are running: `docker compose ps`

**PostgreSQL won't start?**
- Reset volumes: `docker compose down -v && docker compose up -d`

---

## Windows Users: Helper Script

Use the included `docker-helper.ps1` for easier commands:

```powershell
.\docker-helper.ps1 start      # Start services
.\docker-helper.ps1 status     # Check status
.\docker-helper.ps1 logs       # View logs
.\docker-helper.ps1 psql       # Connect to database
.\docker-helper.ps1 backup     # Backup database
.\docker-helper.ps1 stop       # Stop services
.\docker-helper.ps1 help       # Show all commands
```

---

## Useful Links

- Docker Docs: https://docs.docker.com/
- PostgreSQL: https://www.postgresql.org/docs/
- pgAdmin: https://www.pgadmin.org/docs/

---

**That's it! Your Docker setup is ready to go.** 🚀
