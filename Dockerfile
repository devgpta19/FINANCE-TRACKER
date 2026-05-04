# Stage 1: Build the application
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy the entire backend directory
COPY fintrack ./fintrack

# Navigate to backend folder
WORKDIR /app/fintrack

# Add memory limits to Maven
ENV MAVEN_OPTS="-Xmx300m"

# Build the jar
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar file
COPY --from=build /app/fintrack/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run with memory limits
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]
