import pandas as pd
from unidecode import unidecode
import random
import sys

path  = f'english-spanish/Part 1/Part 1-combined.csv'
df = pd.read_csv(sys.argv[1],header=None)
df.columns = ['en', 'sp']

while True:
    menu = int(input('\nHow many review to do? 0 or less breaks: \n'))
    if menu < 1:
        break

    for _, question in df.sample(menu).iterrows():
        pair = [question['en'].lower(), unidecode(question['sp'].lower())]
        random.shuffle(pair)
        answer = input(f'Translate: {pair[0]}\n').lower()
        if answer == unidecode(pair[1]):
            print('Correct!')
        else:
            print(f'You are a loser. Should have been: {pair[1]}')
