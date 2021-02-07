#!/bin/sh
kubectl patch -n catmeow-auth -f mongo/mongo.yaml
kubectl patch -n catmeow-auth -f openid/openid.yaml
kubectl patch -n catmeow-auth -f usercenter_backend/backend.yaml
kubectl patch -n catmeow-auth -f usercenter_frontend/frontend.yaml
