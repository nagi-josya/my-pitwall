FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY MyPitwall.sln ./
COPY src/MyPitwall.Api/MyPitwall.Api.csproj src/MyPitwall.Api/
COPY src/MyPitwall.Application/MyPitwall.Application.csproj src/MyPitwall.Application/
COPY src/MyPitwall.Contracts/MyPitwall.Contracts.csproj src/MyPitwall.Contracts/
COPY src/MyPitwall.Domain/MyPitwall.Domain.csproj src/MyPitwall.Domain/
COPY src/MyPitwall.Infrastructure/MyPitwall.Infrastructure.csproj src/MyPitwall.Infrastructure/

RUN dotnet restore

COPY . ./
RUN dotnet publish src/MyPitwall.Api/MyPitwall.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 5170

ENV ASPNETCORE_URLS=http://+:5170
ENV ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyPitwall.Api.dll"]
