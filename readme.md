build image:

    make image

start Crasher container with StorageOS volume:

    docker run -d -it -v crasher-data:/data --volume-driver=storageos -p 8081:8081  karolisr/crasher

or using helm:

    helm install . --name crash01
