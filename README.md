# MAALSI TUBE

## Environment values

    ```env
    VITE_CLERK_PUBLISHABLE_KEY=[your-clerk-public-key]
    VITE_BASE_API_URL=[your-base-api-url]
    ```

## Running steps for starting the API

1. Clone the maalsi-tube-api repository
2. Run `npm install`
3. Run `npx json-server db.json`

## Running steps for the project

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:5173` in your browser
5. Enjoy 🎉

## Virtualization

### Serve With Multipass and Caddy

1. Run `npm run build` to build the project for production
2. Start a multipass instance with `multipass launch --name maalsi-tube-server --cpus 2 --mem 2G --disk 10G`
3. Run `multipass shell maalsi-tube-server`
4. Run `sudo apt update -y`
5. Run `sudo apt install caddy -y` (to install and start the server with de default page)
6. Run `exit`
7. Run `multipass mount ./dist/ maalsi-tube-server:/usr/share/caddy`

## Containerization

### Serve With Docker and Caddy (imperative)

1. Run `npm run build` to build the project for production
2. Run `docker run -d -p 8080:80 --name maalsi-tube-server-caddy -v $(pwd)/dist:/usr/share/caddy caddy`

### Serve With Docker and Nginx (imperative)

1. Run `npm run build` to build the project for production
2. Run `docker run -d -p 8081:80 --name maalsi-tube-server-nginx -v $(pwd)/dist:/usr/share/nginx/html nginx`

### Serve With Docker and Apache (imperative)

1. Run `npm run build` to build the project for production
2. Run `docker run -d -p 8082:80 --name maalsi-tube-server-apache -v $(pwd)/dist:/usr/local/apache2/htdocs httpd`

### Serve With Docker and Caddy (Dockerfile) (imperative)

1. Run `npm run build` to build the project for production
2. Run `docker build -t maalsi-tube-server-caddy .`
3. Run `docker run -d -p 8083:80 --name maalsi-tube-server-caddy-dockerfile maalsi-tube-server-caddy`

### Dockerfile for Caddy (imperative)

```Dockerfile
FROM ubuntu:latest
RUN apt update -y
RUN apt install -y caddy
COPY ./dist /usr/share/caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
```

### Docker compose for the stack (declarative)

```yml
version: "3"
services:
    web_front:
        container_name: web_front
        build:
            context: ./
            args:
                - VITE_CLERK_PUBLISHABLE_KEY=[your-clerk-key]
                - VITE_BASE_API_URL=http://localhost:3000
        ports:
            - "80:80"
    video_api:
        container_name: video_api
        build: ./video_api
        ports:
            - "3000:3000"
```

To start the stack run `docker-compose up -d --build`

Info to build the images

```bash
docker build --build-arg VITE_BASE_API_URL=[your-api-url] --build-arg VITE_CLERK_PUBLISHABLE_KEY=[your-clerk-key] -t maalsi-tube-server-caddy .
docker build -t maalsi-tube-api ./video_api
```

### Publish the image to Docker Hub

1. Create a Docker Hub account
2. Run `docker login`
3. Run `docker build -t neodigit/maalsi-tube-server-caddy:v1.0 .`
4. Run `docker push neodigit/maalsi-tube-server-caddy:v1.0`

## Docker Swarm

### Docker Swarm Init

```bash
multipass launch --name maalsi-tube-server-master docker # we use a docker-installed variant of ubuntu
multipass shell maalsi-tube-server-master
docker swarm init
# copy the join command to the other instances
```

### Docker Swarm Join

```bash
multipass launch --name maalsi-tube-server-worker1 docker # we use a docker-installed variant of ubuntu
multipass shell maalsi-tube-server-worker1
# paste the join command from the master
```

```bash
multipass launch --name maalsi-tube-server-worker2 docker # we use a docker-installed variant of ubuntu
multipass shell maalsi-tube-server-worker2
# paste the join command from the master
```

### Docker Swarm check

```bash
multipass shell maalsi-tube-server-master
docker node ls
```

To start the stack run:

```bash
multipass mount . maalsi-tube-server-master:/maalsi-tube-server-master
multipass shell maalsi-tube-server-master
cd maalsi-tube-server-master
docker build -t maalsi-tube-video-api ./video_api/
docker build --build-arg VITE_BASE_API_URL=[http://your-master-server-ip] --build-arg VITE_CLERK_PUBLISHABLE_KEY=[your-clerk-key] -t maalsi-tube-web-front .
docker stack deploy -c docker-compose.yml maalsi-tube
```

To check the stack run:

```bash
docker stack ls
docker service ls
```

To test the application run:

```bash
curl http://localhost
```
