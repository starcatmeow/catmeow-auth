#!/bin/sh
mkdir temp_secret
docker run --rm -it -v "$PWD/temp_secret:/app/secret" registry.starcatmeow.cn/dongruixuan/catmeow-auth-service/openid:full-k8s-test yarn genkey
cat > generated_secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: secretkeys.openid.starcatmeow.cn
type: Opaque
data:
  jwks.json: $(cat temp_secret/jwks.json | base64 | tr -d '\n')
  cookiekeys.json: $(cat temp_secret/cookiekeys.json | base64 | tr -d '\n')
EOF
rm -r temp_secret