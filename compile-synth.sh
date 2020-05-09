#!/bin/bash
echo '⚡️ Compile and Synth Script ⚡️'

echo '🏃‍️Compiling Typescript 🏃'
tsc
echo '🏁 Typescript Compiled 🏁'
echo '🛠 Synthetizing manifests 🛠'
cdk8s synth
echo '🔥 Manifests Synthetized 🔥'
cd ./cluster/charts/

echo '🔨Hammering some workarrounds 🔨'
sed -i '' -e 's/[\|]/\|-/g' localpathcfg.k8s.yaml

echo '🌈Process Complete - Check out the Manifests on ./cluster🌈'