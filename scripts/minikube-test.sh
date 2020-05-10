#!/bin/bash
#echo '🎯 Deleting Minikube ️'
#minikube delete
#echo '🚢 Deleting Minikube Config Folder ️'
#rm -rf ~/.minikube
echo '☄️ Starting Minikube ☄️'
if minikube ip > /dev/null 2>&1
then
  echo '🚢Minikube is running'
else
   echo '🚢Starting Minikube'
  minikube start
fi
kubectx minikube
echo '🏟️ Applying CRD'
cd ./cluster/crd/

cd ./helm-operator/

kubectl apply -f .

sleep 5

cd ../prometheus/
kubectl apply -f .

echo '⛵️Installing Helm Operator'
#helm upgrade -i helm-operator fluxcd/helm-operator \
#    --namespace flux \
#    --set helm.versions=v3

echo '🚀Applying cdk8s charts'
cd ../../charts

kubectl apply -f .

sleep 5;

echo '🚀️️ Fetching Git Secret from Flux'
kubectl get secret flux-git-deploy --namespace=flux -o yaml | yq r - data.identity

