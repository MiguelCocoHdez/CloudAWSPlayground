# Build this image after `./mvnw -B verify` (or `mvnw.cmd -B verify` on Windows).
FROM node:24.22.1-alpine AS web-build
WORKDIR /workspace/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:25.0.5_8-jre-alpine AS runtime
WORKDIR /app
RUN addgroup -S cloudplayground && adduser -S cloudplayground -G cloudplayground
COPY --from=web-build --chown=cloudplayground:cloudplayground /workspace/frontend/dist ./static
COPY --chown=cloudplayground:cloudplayground target/cloudplayground-0.1.0-SNAPSHOT.jar ./app.jar
USER cloudplayground
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
