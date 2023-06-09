#! /bin/bash

set -- $(getopt c "$@")

case $1 in
    -c)
        if [ "$3" != 1 ] && [ "$3" != 2 ] && [ "$3" != 3 ]; then
            if [ -z "$3" ]; then
                echo you have to choice below
            else
                echo $3 is wrong value
                echo "you have to choice below by option -c"
            fi
            echo "case1) ./curl.sh -c 1"
            echo "case2) ./curl.sh -c 2"
            echo "case3) ./curl.sh -c 3"
            exit 0
        fi
        ;;
    --)
        exit 0
        ;;
    *)
        echo $1 is not an option
        exit 0
        ;;
esac

range=0
workers=0
url=http://localhost:8080/test
testurl=https://jsonplaceholder.typicode.com/todos/1

function curl_process() {
    echo -e "================== worker $1 ==================\r\n"
    for ((i=1; i <= $range; i++)); do
        echo -e "[$i] done..\r\n" # curl -w '\n' -X GET $url
    done
}

function worker_process() {

    echo worker process workers $workers

    # for ((i=1; i <= $workers; i++)); do
    #     curl_process $i # > ./logs/log_worker${i}.txt &
    # done

    wait

    # for i in $workers
    #     do
    #         cat ./logs/log_worker${i}.txt &
    #     done

    # wait

    echo -e "==============================================\r\n"
    echo -e "All background process are done\r\n"
}

function getParams() {
    case_type="$1"
    case $case_type in
        1)
            range=15
            workers=1
            ;;
        2)
            range=1
            workers=15
            ;;
        3)
            range=5
            workers=15
            ;;
        *)
            exit0
            ;;
    esac
}

function init() {
    case_type=$1
    getParams $case_type
    worker_process
}

init $3




# Case1
# seq 1 15 | xargs -I -P1 curl -X GET http://localhost:8080/

# Case2
# seq 1 15 | curl -X GET http://localhost:8080/

# Case3
# seq 1 5 | xargs -n1 -I -P15 curl -X GET "http://localhost:8080/" \ << (printf '%s\n' {1..5})

exit 0