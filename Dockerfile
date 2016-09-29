FROM scratch
MAINTAINER karolis.rusenas@gmail.com

COPY       crasher /bin/crasher

ENTRYPOINT ["/bin/crasher"]

EXPOSE 8081