import os
import csv # used to read and write csv files
import string

# function that checks to see if the file passed in is of type .xls/.xlsx
def is_xls_xlsx(file):
    good_file = [".xls", ".xlsx"]
    #get index of last period
    index = file.rfind('.')
    ext = file[index:]
    # handle extensions in all caps
    ext = ext.lower()
     # if the file extension is something other than xls/xlsx, return false
    if ext not in good_file:
        return False
    # otherwise, return true! file is xls/xlsx
    return True

# accepts xls and xlsx files and their paths and converts to csv file
def convert_xls_xlsx_to_csv(filename, filepath):
    # 'pip install xlrd' in command line
    import xlrd
    # list of good sheet names to return
    good_sheets = []
    # list of sheets that we don't want to convert
    bad_sheets = ['T&C', 'XDO_METADATA', "Summary"];
    # error handling for file opening
    try:
        # open file
        wb = xlrd.open_workbook(filepath)
    except FileNotFoundError:
        print("XLS/XLSX File Not Found")
        return "error"
    # get all psible sheet names (could be more than 1)
    sheets = wb.sheet_names()

    for sheet in sheets:
    # check if the sheet is a bad sheet
        if sheet in bad_sheets:
        #     # skip the sheet if it is
            continue
        else:
            break
    # get specific sheet as a Sheet object (needed for sh.nrows below)
    sh = wb.sheet_by_name(sheet)
    # head is raw file name without its file extension
    head, sep, tail = filename.partition('.')
    # append csv file extension to string
    # head += sheet + ".csv" ******** ONLY WITH MULTIPLE SHEETS
    head += ".csv"
    # create csv file with same name
    csv_file = open(head, 'w', newline='')
    wr = csv.writer(csv_file, quoting=csv.QUOTE_ALL)
    # write to csv file
    for rownum in range(sh.nrows):
        wr.writerow(sh.row_values(rownum))

    csv_file.close()
    # add this sheet file path to good sheet list
    good_sheets.append(csv_file.name)

    # return the array of sheets as csv file (with path) ******ONLY SEND FIRST SHEET SO IT WORKS ON FRONT END || DONT RETURN
    # return good_sheets[0]

def transform(filename,filepath):

    # first, if the file type is not csv, convert to csv
    # check to see if the file type is .xls, .xlsx
    if is_xls_xlsx(filename) == True:
        # if the file is .xls, .xlsx
        convert_xls_xlsx_to_csv(filename, filepath)
        index = filename.rfind('.')
        ext = filename[index:]
        filepath = filename.replace(ext, ".csv")
        filename = filepath

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
    # ************* TESTING *************
    transform('SCPRC-EST2019-18+POP-RES.xlsx', 'sources/SCPRC-EST2019-18+POP-RES.xlsx')
