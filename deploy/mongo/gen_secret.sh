cat > generated_secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: mongo-credential
type: kubernetes.io/basic-auth
stringData:
  username: $(openssl rand -hex 16)
  password: $(openssl rand -hex 16)
EOF