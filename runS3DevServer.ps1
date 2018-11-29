$env:MINIO_ACCESS_KEY="123";
$env:MINIO_SECRET_KEY="12345678";
& '.\bin\minio.exe' @('server', '.\tmp\s3');
