# Docker for local development

```
docker run --name hgs-mysql -d -p 3306:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD='true' mysql:5.6

docker run --name hgs-redis -d -p 6379:6379 redis:5.0

docker run --name hgs-s3-minio -d -p 9000:9000 -e MINIO_ACCESS_KEY='123' -e MINIO_SECRET_KEY='12345678' minio/minio server /data
```

# Docker - RDS Init

```
// make database
docker exec -it hgs-mysql mysql -u root -e "CREATE DATABASE development"
```