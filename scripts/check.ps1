$ErrorActionPreference = "Stop"

$bundledNode = "C:\Users\ZeyuLiao\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue

if ($nodeCommand) {
  try {
    & $nodeCommand.Source scripts/validate-extension.mjs
    exit $LASTEXITCODE
  } catch {
    if (-not (Test-Path $bundledNode)) {
      throw
    }
  }
}

if (Test-Path $bundledNode) {
  & $bundledNode scripts/validate-extension.mjs
} else {
  throw "Node.js was not found. Install Node.js 20+ or add it to PATH."
}
