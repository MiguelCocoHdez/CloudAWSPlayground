[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $DistributionArchive,
    [Parameter(Mandatory = $true)]
    [string] $ExpectedSha512
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$archive = Resolve-Path -LiteralPath $DistributionArchive
$actualSha512 = (Get-FileHash -LiteralPath $archive.Path -Algorithm SHA512).Hash.ToLowerInvariant()
if ($actualSha512 -ne $ExpectedSha512.ToLowerInvariant()) {
    throw "Maven Wrapper distribution SHA-512 mismatch: expected $ExpectedSha512, got $actualSha512."
}
Write-Output "Maven Wrapper distribution SHA-512 verified: $actualSha512"
