FROM alpine:3.19
WORKDIR /app
# Install structural network socket packages
RUN apk add --no-cache bash socat coreutils
# Verify local file presence and bind binary to container runtime space
COPY ./data/robdoe.MyWare /app/robdoe.MyWare
RUN chmod +x /app/robdoe.MyWare
