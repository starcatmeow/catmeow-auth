#!/bin/sh
kubectl create namespace catmeow-auth

kubectl apply -n catmeow-auth -f mongo/generated_secret.yaml
kubectl apply -n catmeow-auth -f openid/generated_secret.yaml
kubectl apply -n catmeow-auth -f usercenter_backend/generated_secret.yaml

kubectl apply -n catmeow-auth -f openid/configmap.yaml
kubectl apply -n catmeow-auth -f usercenter_backend/configmap.yaml

kubectl apply -n catmeow-auth -f mongo/mongo.yaml
kubectl apply -n catmeow-auth -f openid/openid.yaml
kubectl apply -n catmeow-auth -f usercenter_backend/backend.yaml
kubectl apply -n catmeow-auth -f usercenter_frontend/frontend.yaml
