# Script to replace GitHub colors with neutral colors
$componentsPath = "f:\MajorProject\CollabFrontend\collabFrontend\src\components"
$files = Get-ChildItem -Path $componentsPath -Filter "*.jsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace 'gh-accent', 'blue-500'
    $content = $content -replace 'gh-bg', 'gray-900'
    $content = $content -replace 'gh-canvas', 'gray-800'
    $content = $content -replace 'gh-border', 'gray-700'
    $content = $content -replace 'gh-hover', 'gray-700'
    $content = $content -replace 'gh-text', 'gray-200'
    $content = $content -replace 'gh-muted', 'gray-400'
    $content = $content -replace 'gh-success', 'green-600'
    $content = $content -replace 'gh-danger', 'red-600'
    $content | Set-Content $file.FullName -NoNewline
    Write-Host "Updated: $($file.Name)"
}

Write-Host "All component files updated!"
