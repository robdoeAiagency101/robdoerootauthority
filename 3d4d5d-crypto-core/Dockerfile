# Multi-stage build for minimal, reproducible container

# Stage 1: Builder
FROM python:3.12-slim as builder

WORKDIR /build

# Copy only requirements first (layer caching)
COPY requirements.txt .

# Install dependencies in isolated layer
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime (minimal production image)
FROM python:3.12-slim

# Metadata for reproducibility and attestation
LABEL org.opencontainers.image.title="3D+4D+5D Cryptographic Triangle"
LABEL org.opencontainers.image.description="Immutable Pythagorean triple validator with Merkle tree integrity"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/robdoeAiagency101/robdoerootauthority"
LABEL org.opencontainers.image.vendor="ROBDOE AI Agency"

# Non-root user for security
RUN useradd -m -u 1000 -s /sbin/nologin crypto-user

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder /root/.local /home/crypto-user/.local

# Copy application code
COPY main.py api.py ./

# Set environment for Python path
ENV PATH="/home/crypto-user/.local/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user
USER crypto-user

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# Expose API port
EXPOSE 8000

# Run API server
CMD ["python", "-m", "uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
