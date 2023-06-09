#! /bin/bash
set -- $(getopt c "$@")

case $1 in
    -c)
        if [ "$3" != 1 ] && [ "$3" != 2 ] && [ "$3" != 3 ]; then
            if [ -z "$3" ]; then
                echo you have to choice below
            else
                echo $3 is wrong value
                echo -e "you have to choice below by option -c"
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

cat << "EOF"
     _______ _     _  ______ _______ _______ ______        _____   _____   _____              _______ _______ _______ _______
        |    |_____| |_____/ |______ |_____| |     \      |_____] |     | |     | |              |    |______ |______    |
        |    |     | |    \_ |______ |     | |_____/      |       |_____| |_____| |_____         |    |______ ______|    |
EOF

curl_process() {
    echo -e "------------------ worker $1 ------------------"
    for ((i=1; i <= $range; i++)); do
        OUTPUT=$(curl -s -w '\n' -X GET $url) # seq 1 $range | xargs -I -P1 curl -w '\n' -X GET $url
        if [ "$OUTPUT" == "server: ok" ]; then
            echo [req::$i] "$OUTPUT"
        fi
    done
}

worker_process() {
    for ((i=1; i <= $workers; i++)); do
        curl_process $i > ./logs/log_worker${i}.txt &
    done
    wait

    for ((i=1; i <= $workers; i++)); do
        cat ./logs/log_worker${i}.txt &
    done
    wait
}

getParams() {
    case "$1" in
        1) range=15 workers=1;;
        2) range=1 workers=15;;
        3) range=5 workers=15;;
        *) exit0;;
    esac
    echo -e "\r\n"
    echo -e "           ::: TEST CASE "$1" :::\r\n"
    echo -e "         url : $url"
    echo -e "     request : $range"
    echo -e "   parallels : $workers\r\n"
}

init() {
    case_type=$1
    getParams $case_type
    worker_process
    echo -e "----------------------------------------------\r\n"
    echo -e "All background process are done\r\n"
}

init $3

exit 0