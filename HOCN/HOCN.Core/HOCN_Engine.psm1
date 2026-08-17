function Invoke-Collatz {
    param([Parameter(Mandatory)][long]$n)
    process {
        while ($n -gt 1) {
            $n = if ($n % 2 -eq 0) { $n / 2 } else { 3 * $n + 1 }
            [PSCustomObject]@{
                Timestamp = Get-Date -Format 'o'
                Input = $n
                Status = 'Processing'
                Layer = 'HOCN'
            } | ConvertTo-Json -Compress
        }
    }
}
