build image:

    make image

start Crasher container with StorageOS volume:

    docker run -it -d -v crasher-data:/data --volume-driver=storageos --restart always -p 8081:8081  karolisr/crasher

