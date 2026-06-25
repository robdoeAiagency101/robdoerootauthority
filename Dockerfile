FROM mcr.microsoft.com/powershell:7.4-ubuntu-22.04
ENV ENGINE_AUTH="Robdoe" TARGET_NODE="@LadbotOneLad"
COPY . /workspace
WORKDIR /workspace
CMD pwsh -File ./execute_dialect_matrix.ps1
