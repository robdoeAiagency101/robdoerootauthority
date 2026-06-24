param([int]$n)
while ($n -gt 1) {
    if ($n % 2 -eq 0) { $n = $n / 2 }
    else { $n = 3 * $n + 1 }
    Write-Host "Current State (HOCN): $n"
}
