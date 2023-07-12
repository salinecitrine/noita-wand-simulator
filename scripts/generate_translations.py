import csv

# You may need to add 'key' to the first column in common.csv
srcFile = "./data_base/translations/common.csv"
srcFileBeta = "./data_base/translations/common.beta.csv"
dstFile = "./src/app/calc/__generated__/translations.ts"

translations = {}
translationsBeta = {}

language = 'en'

with open(srcFile) as inFile:
  reader = csv.DictReader(inFile)
  for row in reader:
    translations[row['key']] = row[language]

try:
  inFileBeta = open(srcFileBeta)
except IOError:
  print('beta translations not found, skipping')
with inFileBeta:
  reader = csv.DictReader(inFileBeta)
  for row in reader:
    translations[row['key']] = row[language]

with open(dstFile, 'w') as outFile:
  outFile.write('export const translations = {\n')
  for k, t in translations.items():
    outFile.write('  "' + k + "\": \"" + t + "\",\n")

  outFile.write('};\n')
