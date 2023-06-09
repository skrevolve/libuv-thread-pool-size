#!/bin/bash
set -- $(getopt ab:cd "$@")
while [ -n "$1" ]
do
        case "$1" in
                -a) echo "Found the -a option";;
                -b) param=$2
                        echo "Found the -b option, with parameter value $param"
                        shift;;
                -c) echo "Found the -c option";;
                -d) echo "Found the -d option";;
                --) shift
                        break;;
                *) echo "$1 is not an option";;
        esac
        shift
done

cnt=$#
for (( i=1; i<=cnt; i++))
do
        echo "parameter #$i: $1"
        shift
done