ui:
	npm run build

stk:	
	${GOPATH}/bin/statik -src=./static/ui/build

build:
	CGO_ENABLED=0 GOOS=linux go build -o crasher .
	
image: build
	docker build --platform linux/amd64 -t karolisr/crasher:latest -f Dockerfile .

push: image
	docker push karolisr/crasher:latest