FROM ://microsoft.com
ENV IS_DOCKER_CONTAINER="true"
ENV DOTNET_RUNNING_IN_CONTAINER="true"
ENV RobDoeAuthority="robdoe.com"

# Install git natively inside the container core
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
RUN mkdir -p /root/.config/powershell

# Copy the exact master single-line string profile straight to the container configuration root
COPY profile.ps1 /root/.config/powershell/Microsoft.PowerShell_profile.ps1

ENTRYPOINT ["pwsh", "-NoExit", "-Command", "& /root/.config/powershell/Microsoft.PowerShell_profile.ps1"]
