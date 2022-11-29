build_image: @docker build -t nest-challenge .

dev_local: @docker compose --env-file config/env/local-docker.env down && \
		   docker compose --env-file config/env/local-docker.env up
