deploy:
	docker build --tag jesliao/yuki-bot:latest .
	docker push jesliao/yuki-bot
	kubectl rollout restart deployment/yuki-bot

show-logs:
	kubectl logs -l app=yuki-bot -f

get-db:
	kubectl -n yuki-bot port-forward service/yukibot-db-postgresql 5432:5432

connect-db:
	PGPASSWORD=7tgyPR6hCx psql -h localhost -U postgres