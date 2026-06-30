param([int]$Port = 8000)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $requestedPath = $context.Request.Url.AbsolutePath
        if ($requestedPath -eq "/") { $requestedPath = "/index.html" }

        $relativePath = $requestedPath.TrimStart('/')
        $fullPath = Join-Path $root $relativePath

        if (-not (Test-Path $fullPath -PathType Leaf)) {
            $fullPath = Join-Path $root "index.html"
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $extension = [System.IO.Path]::GetExtension($fullPath)
            $contentType = "text/html"
            switch ($extension) {
                ".css" { $contentType = "text/css" }
                ".js" { $contentType = "application/javascript" }
                ".png" { $contentType = "image/png" }
                ".jpg" { $contentType = "image/jpeg" }
                ".jpeg" { $contentType = "image/jpeg" }
                ".svg" { $contentType = "image/svg+xml" }
            }

            $buffer = [System.IO.File]::ReadAllBytes($fullPath)
            $context.Response.ContentType = $contentType
            $context.Response.ContentLength64 = $buffer.Length
            $context.Response.OutputStream.Write($buffer, 0, $buffer.Length)
            $context.Response.OutputStream.Close()
        }
        else {
            $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
            $context.Response.StatusCode = 404
            $context.Response.ContentType = "text/plain"
            $context.Response.ContentLength64 = $body.Length
            $context.Response.OutputStream.Write($body, 0, $body.Length)
            $context.Response.OutputStream.Close()
        }
    }
    catch {
        break
    }
}

$listener.Stop()
$listener.Close()
