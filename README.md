# Håndværker-chatbot

## Hurtig start
1. Upload alle filer til et GitHub-repo
2. Importér repoet i Vercel
3. Framework preset: Vite
4. Build command: `npm run build`
5. Output directory: `dist`

## Webhook
Redigér filen `src/configs/runtime.js` og indsæt din webhook-URL i `WEBHOOK_URL`.

Når et lead indsendes, sendes et JSON-payload til webhooken med:
- projectType
- answers
- estimate
- leadId
- submittedAt

## Filer du typisk redigerer
- `src/configs/projects/*.js` for nye nicher og opgavetyper
- `src/configs/runtime.js` for webhook
- `src/styles.css` for design

## Hvordan du tilføjer en ny niche
1. Opret en ny fil i `src/configs/projects/`, fx `solceller.js`
2. Eksportér et projektobjekt med:
   - `key`
   - `label`
   - `description`
   - `intro`
   - `sizeQuestion`
   - `sizeOptions`
   - `categoryQuestion`
   - `categoryOptions`
   - `detailQuestion`
   - `detailPlaceholder`
   - `elementGroups`
   - `estimateBase`
   - `feedback`
3. Registrér projektet i `src/configs/projects/index.js`

## Bemærkning
Denne version er lavet som en ren, deploy-klar MVP:
- fullscreen chat på mobil
- ingen højrebokse
- webhook-afsendelse
- modulær struktur
