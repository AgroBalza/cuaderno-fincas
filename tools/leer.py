"""Lee los datos del Cuaderno desde Firestore con el usuario analista (solo lectura).
Uso: FINCAS_EMAIL=... FINCAS_PASSWORD=... python3 leer.py <apiKey> <projectId> [carpeta_salida]
Guarda un JSON por colección para analizarlos."""
import json, os, sys, urllib.request

def post(url, body, token=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', **({'Authorization': 'Bearer ' + token} if token else {})})
    return json.load(urllib.request.urlopen(req))

def get(url, token):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'Authorization': 'Bearer ' + token})))

def val(v):
    k, x = next(iter(v.items()))
    if k == 'mapValue': return {a: val(b) for a, b in x.get('fields', {}).items()}
    if k == 'arrayValue': return [val(b) for b in x.get('values', [])]
    if k == 'integerValue': return int(x)
    if k == 'nullValue': return None
    return x

def main():
    key, project = sys.argv[1], sys.argv[2]
    out = sys.argv[3] if len(sys.argv) > 3 else 'datos'
    tok = post(f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={key}', {'email': os.environ['FINCAS_EMAIL'], 'password': os.environ['FINCAS_PASSWORD'], 'returnSecureToken': True})['idToken']
    base = f'https://firestore.googleapis.com/v1/projects/{project}/databases/(default)/documents'
    os.makedirs(out, exist_ok=True)
    for col in ['fincas', 'ajustes', 'lotes', 'registros', 'precios', 'labores', 'cierres']:
        docs, page = {}, ''
        while True:
            r = get(f'{base}/{col}?pageSize=300' + (f'&pageToken={page}' if page else ''), tok)
            for d in r.get('documents', []):
                docs[d['name'].rsplit('/', 1)[1]] = {a: val(b) for a, b in d.get('fields', {}).items()}
            page = r.get('nextPageToken')
            if not page: break
        json.dump(docs, open(f'{out}/{col}.json', 'w'), ensure_ascii=False, indent=1)
        print(col, len(docs))

main()
