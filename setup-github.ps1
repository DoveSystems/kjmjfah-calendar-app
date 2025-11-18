# GitHub Repository Setup Script
# First, create a repository on GitHub at https://github.com/new
# Name it: kjmjfah-calendar-app (or your preferred name)
# Then run this script with your GitHub username and repository name

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$true)]
    [string]$RepositoryName
)

Write-Host "Setting up GitHub remote..." -ForegroundColor Green

# Add remote origin
git remote add origin "https://github.com/$GitHubUsername/$RepositoryName.git"

# Rename branch to main if needed
$currentBranch = git branch --show-current
if ($currentBranch -eq "master") {
    git branch -M main
    Write-Host "Renamed branch from master to main" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepositoryName" -ForegroundColor Cyan

