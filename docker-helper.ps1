#!/usr/bin/env pwsh
# Docker Helper Script for Windows PowerShell
# Usage: ./docker-helper.ps1 [command]

param(
    [Parameter(Position = 0)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'clean', 'backup', 'psql', 'help')]
    [string]$Command = 'help'
)

function Show-Help {
    Write-Host @"
Docker Helper Script for Expense Tracker

Usage: .\docker-helper.ps1 [command]

Commands:
  start       - Start all Docker containers
  stop        - Stop all Docker containers (keeps data)
  restart     - Restart all containers
  logs        - View real-time logs from all services
  status      - Check status of all containers
  clean       - Remove containers and volumes (WARNING: Deletes data!)
  backup      - Backup PostgreSQL database to SQL file
  psql        - Connect to PostgreSQL command line
  help        - Show this help message

Examples:
  .\docker-helper.ps1 start
  .\docker-helper.ps1 logs
  .\docker-helper.ps1 psql

"@
}

function Start-Services {
    Write-Host "Starting Docker services..." -ForegroundColor Green
    docker compose up -d
    Write-Host "Services started! Check status with: .\docker-helper.ps1 status" -ForegroundColor Green
}

function Stop-Services {
    Write-Host "Stopping Docker services..." -ForegroundColor Yellow
    docker compose down
    Write-Host "Services stopped. Data in volumes is preserved." -ForegroundColor Green
}

function Restart-Services {
    Write-Host "Restarting Docker services..." -ForegroundColor Yellow
    docker compose restart
    Write-Host "Services restarted!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "Showing live logs (Ctrl+C to exit)..." -ForegroundColor Cyan
    docker compose logs -f
}

function Show-Status {
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker compose ps
    Write-Host "`nPgAdmin: http://localhost:5050" -ForegroundColor Green
    Write-Host "PostgreSQL: localhost:5432" -ForegroundColor Green
}

function Clean-Services {
    Write-Host "WARNING: This will delete all containers and volumes!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq 'yes') {
        Write-Host "Removing containers and volumes..." -ForegroundColor Yellow
        docker compose down -v
        Write-Host "Cleanup complete!" -ForegroundColor Green
    }
    else {
        Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    }
}

function Backup-Database {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "expense_tracker_backup_$timestamp.sql"
    
    Write-Host "Backing up PostgreSQL database to $filename..." -ForegroundColor Cyan
    docker compose exec -T postgres pg_dump -U postgres expense_tracker > $filename
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup complete: $filename" -ForegroundColor Green
    }
    else {
        Write-Host "Backup failed!" -ForegroundColor Red
    }
}

function Connect-PSQL {
    Write-Host "Connecting to PostgreSQL (type \q to exit)..." -ForegroundColor Cyan
    docker compose exec postgres psql -U postgres -d expense_tracker
}

# Execute the selected command
switch ($Command) {
    'start' { Start-Services }
    'stop' { Stop-Services }
    'restart' { Restart-Services }
    'logs' { Show-Logs }
    'status' { Show-Status }
    'clean' { Clean-Services }
    'backup' { Backup-Database }
    'psql' { Connect-PSQL }
    'help' { Show-Help }
    default { Show-Help }
}
