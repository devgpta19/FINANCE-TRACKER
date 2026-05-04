# Stage 1: Build the application
FROM openjdk:17-jdk-slim AS build
WORKDIR /app

# Copy the entire backend directory to ensure we have mvnw and .mvn folder
COPY fintrack ./fintrack

# Navigate to backend folder
WORKDIR /app/fintrack

# Add memory limits to Maven to prevent crashing on Render's free tier
ENV MAVEN_OPTS="-Xmx300m"

# Ensure mvnw has execution permissions and build the jar
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar file
COPY --from=build /app/fintrack/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Command to run the application with memory limits for the runtime
ENTRYPOINT ["java", "-Xmx300m", "-jar", "app.jar"]

