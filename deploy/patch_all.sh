#!/bin/sh
kubectl apply -n catmeow-auth -f mongo/mongo.yaml
kubectl apply -n catmeow-auth -f openid/openid.yaml
kubectl apply -n catmeow-auth -f usercenter_backend/backend.yaml
kubectl apply -n catmeow-auth -f usercenter_frontend/frontend.yaml
