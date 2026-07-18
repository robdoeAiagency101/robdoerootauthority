FROM ://microsoft.com
ENV IS_DOCKER_CONTAINER="true"
ENV DOTNET_RUNNING_IN_CONTAINER="true"
ENV RobDoeAuthority="robdoe.com"

# Install git binaries natively inside the Linux container kernel layer
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
RUN mkdir -p /root/.config/powershell

# Copy your unbroken master single-line monolith profile straight to the container config root
COPY profile.ps1 /root/.config/powershell/Microsoft.PowerShell_profile.ps1

ENTRYPOINT ["pwsh", "-NoExit", "-Command", "& /root/.config/powershell/Microsoft.PowerShell_profile.ps1"]
