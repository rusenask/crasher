ui:
	npm run build

stk:	
	${GOPATH}/bin/statik -src=./static/ui/build

build:
	CGO_ENABLED=0 GOOS=linux go build -o crasher .
	
image: build
	docker build -t karolisr/crasher -f Dockerfile .

push:
	docker push karolisr/crasher