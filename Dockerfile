FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["src/FitX.API/FitX.API.csproj", "src/FitX.API/"]
COPY ["src/FitX.Application/FitX.Application.csproj", "src/FitX.Application/"]
COPY ["src/FitX.Domain/FitX.Domain.csproj", "src/FitX.Domain/"]
COPY ["src/FitX.Infrastructure/FitX.Infrastructure.csproj", "src/FitX.Infrastructure/"]
COPY ["src/FitX.Persistence/FitX.Persistence.csproj", "src/FitX.Persistence/"]
COPY ["src/FitX.Identity/FitX.Identity.csproj", "src/FitX.Identity/"]
RUN dotnet restore src/FitX.API/FitX.API.csproj

COPY . .
WORKDIR /src/src/FitX.API
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FitX.API.dll"]
