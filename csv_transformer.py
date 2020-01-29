import os
import csv # used to read and write csv files
import string

def transform(filename,filepath):

    # read csv file
    # opens input file
    try:
        csv_file = open(filepath, encoding='utf-8-sig', errors="ignore")
    except FileNotFoundError:
        print("File Not Found")
        return "File Not Found"
    csv_reader = csv.DictReader(csv_file)

    #get fieldnames
    try:
        csv_reader.fieldnames
    except UnicodeDecodeError:
        print("Invalid header")
        return "Invalid header"


    # writes into a new file
    with open('modified_'  + filename, mode='w' ,newline='', encoding='utf-8') as new_csv:
        headers = ['state']

        #creates CSV dictionary writer
        csv_writer=csv.DictWriter(new_csv, fieldnames=headers)
        csv_writer.writeheader()

        # iterates through rows of csv_reader dictionary object
        # adds values paired with a ket to an output index_array
        # and writes array to the row
        for i, row in enumerate(csv_reader):

            for row in csv_reader:
                print(row)
            #initializes empty dictionary to add keys-value pairs into
            output_dictionary = {}
            # Updates individual columns for each row into dictionary. If the column does not exist on original input file, leaves blank entry.
            output_dictionary.update({'state':'test'})

            csv_writer.writerow(output_dictionary)

if __name__ == "__main__":
    # print("test")
    transform('SCPRC-EST2019-18+POP-RES.csv', 'sources/SCPRC-EST2019-18+POP-RES.csv')
