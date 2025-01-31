# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./
# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o crasher .

# Final stage
FROM busybox
LABEL maintainer="karolis.rusenas@gmail.com"

# Copy binary from builder
COPY --from=builder /app/crasher /bin/crasher

ENTRYPOINT ["/bin/crasher"]

EXPOSE 8081