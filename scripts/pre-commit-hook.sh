echo '-----------------------------'
echo ' 🤩Pre commit hook started'
echo '-----------------------------'
echo '⚙️Importing CRDs'
npm run import
echo '-----------------------------'
echo '💅🏻 Running Prettier on the code'
npm run prettier
echo '-----------------------------'
echo '👀 Linting the code'
npm run lint
echo '-----------------------------'
echo '😎Compile and Synth'
npm run compile-synth
echo '-----------------------------'
echo '🏁 Pre-commit hook finished'
git stage .