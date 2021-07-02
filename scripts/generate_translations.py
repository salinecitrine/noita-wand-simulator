import csv

srcFile = "./data_base/translations/common.csv"
dstFile = "./src/app/calc/__generated__/translations.ts"

translations = {}

language = 'en'

with open(srcFile) as inFile:
  reader = csv.DictReader(inFile)
  for row in reader:
    translations[row['key']] = row[language]

with open(dstFile, 'w') as outFile:
  outFile.write('export const translations = {\n')
  for k, t in translations.items():
    outFile.write('\t"' + k + "\": \"" + t + "\",\n")

  outFile.write('};\n')
