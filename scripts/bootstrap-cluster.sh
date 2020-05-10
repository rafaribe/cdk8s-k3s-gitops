#!/bin/bash

# Given that SSH keys are on the Pis

echo '----------------------------------'
echo '🧠Installing k3s on the master node'
echo '----------------------------------'
k3sup install --ip 192.168.1.3 --user pi --local-path ~/.kube/config --k3s-extra-args '--no-deploy servicelb'
sleep 1
echo '----------------------------------'
echo '💼Installing k3s on the slave node'
echo '----------------------------------'
echo '🐥Renaming default context to k3s'
echo '----------------------------------'
kubectl config rename-context default k3s

mv ~/.kube/config ~/.kube/k3s
echo '----------------------------------'
echo 'Merging Kubeconfig files'
cd ~/.kube/
KUBECONFIG=work1:work2:k3s:minikube kubectl config view --merge --flatten > ~/.kube/config
echo '----------------------------------'
echo 'Setting k3s to default context'
kubectx k3s

k3sup join --ip 192.168.1.2 --server-ip 192.168.1.3 --user pi
