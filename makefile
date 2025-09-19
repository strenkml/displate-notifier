bot:
	docker compose -f docker-compose.yml -p displate-discord-bot up --build --force-recreate -d

bot-clean:
	docker compose -f docker-compose.yml -p displate-discord-bot down --volumes --rmi all