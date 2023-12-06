#!/bin/bash
"source" "/home/wdeng3/scARE/bin/activate"
"python" "$0" "$@"
##############################
 # @author [Wankun Deng]
 # @email [dengwankun@gmail.com]
 # @create date 2023-06-02 11:34:03
 # @modify date 2023-06-02 11:34:03
 # @desc [description]
#############################

import cgitb
import pandas as pd
import cgi
import json
# import MySQLdb
cgitb.enable()
print( 'Content_Type:text/json; charset=utf-8\r\n\n')

form=cgi.FieldStorage()
if 'Dataset' in form:
    dataset=form['Dataset'].value
else: 
    dataset='all'
with open(f'../data/{dataset}.txt','r') as f:
    print(json.dumps(f.readline().split(',')))