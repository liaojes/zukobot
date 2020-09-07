deploy:
	docker build --tag jesliao/yuki-bot:latest .
	docker push jesliao/yuki-bot
	kubectl rollout restart deployment/yuki-bot

get-db:
	kubectl -n yuki-bot port-forward service/yukibot-db-postgresql 5432:5432