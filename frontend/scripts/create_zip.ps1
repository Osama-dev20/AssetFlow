$source = 'C:\Users\Laptop\.gemini\antigravity\scratch\AssetFlow'
$stageParent = 'C:\Users\Laptop\.gemini\antigravity\scratch\temp_zip_staging'
$stage = Join-Path $stageParent 'AssetFlow'
$zipDownloads = 'C:\Users\Laptop\Downloads\AssetFlow-Complete-Project.zip'
$zipArtifacts = 'C:\Users\Laptop\.gemini\antigravity\brain\82da1342-f789-42d0-95c0-6bd346798190\AssetFlow-Complete-Project.zip'

if (Test-Path $stageParent) {
    Remove-Item -Recurse -Force $stageParent
}
New-Item -ItemType Directory -Path $stage -Force | Out-Null

# Copy root files
Copy-Item (Join-Path $source '.gitignore') $stage
Copy-Item (Join-Path $source 'README.md') $stage

# Copy frontend excluding node_modules and dist
$frontendDest = Join-Path $stage 'frontend'
New-Item -ItemType Directory -Path $frontendDest -Force | Out-Null

Get-ChildItem -Path (Join-Path $source 'frontend') | Where-Object { $_.Name -ne 'node_modules' -and $_.Name -ne 'dist' } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $frontendDest -Recurse -Force
}

# Remove existing zips if any
if (Test-Path $zipDownloads) { Remove-Item -Force $zipDownloads }
if (Test-Path $zipArtifacts) { Remove-Item -Force $zipArtifacts }

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stageParent, $zipDownloads)
Copy-Item -Path $zipDownloads -Destination $zipArtifacts -Force

Remove-Item -Recurse -Force $stageParent

Write-Host 'Zip created successfully!'
Get-Item $zipDownloads | Select-Object Name, Length, FullName
