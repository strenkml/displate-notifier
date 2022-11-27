docker:
	docker-compose -f docker-compose.yml -p displate-discord-bot up --build -d

docker-dev:
	docker-compose -f dev-docker-compose.yml -p dev-displate-discord-bot up --build -d

docker-dev2:
	docker-compose -f dev-docker-compose.yml -p dev-displate-discord-bot down && \
	docker-compose -f dev-docker-compose.yml -p dev-displate-discord-bot up --build -d