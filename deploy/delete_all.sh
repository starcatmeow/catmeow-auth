#!/bin/sh
kubectl delete -n catmeow-auth -f mongo/mongo.yaml
kubectl delete -n catmeow-auth -f openid/openid.yaml
kubectl delete -n catmeow-auth -f usercenter_backend/backend.yaml
kubectl delete -n catmeow-auth -f usercenter_frontend/frontend.yaml

kubectl delete -n catmeow-auth -f mongo/generated_secret.yaml
kubectl delete -n catmeow-auth -f openid/generated_secret.yaml
kubectl delete -n catmeow-auth -f usercenter_backend/generated_secret.yaml

kubectl delete -n catmeow-auth -f openid/configmap.yaml
kubectl delete -n catmeow-auth -f usercenter_backend/configmap.yaml
