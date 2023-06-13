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

case_type="$3"
range=0
workers=0
url=http://localhost:8080/test
Green="\033[0;32m"
Reset="\033[0m"

logo() {
    echo -e "${Green}"
    echo -e "           ████████╗██████╗ ████████╗\r"
    echo -e "           ╚══██╔══╝██╔══██╗╚══██╔══╝\r"
    echo -e "              ██║   ██████╔╝   ██║   \r"
    echo -e "              ██║   ██╔═══╝    ██║   \r"
    echo -e "              ██║   ██║        ██║   \r"
    echo -e "              ╚═╝   ╚═╝        ╚═╝   \r"
}

set_args() {
    case $case_type in
        1) range=15 workers=1;;
        2) range=1 workers=15;;
        3) range=5 workers=15;;
        *) exit 0;;
    esac
    echo -e "${Reset}\r"
    echo -e "             ::: TEST CASE $case_type:::\r\n"
    echo -e "         url : $url\r"
    echo -e "     request : $range\r"
    echo -e "   parallels : $workers\r\n"
}

curl_process() {
    echo -e "------------------ worker $1 ---------------------"
    # seq 1 $range | xargs -I -P1 curl -s -w '\n' -X GET $url
    for ((i=1; i <= $range; i++)); do
        OUTPUT=$(curl -s -w '\n' -X GET $url)
        if [ "$OUTPUT" == "ok" ]; then
            echo [req::$i] "$OUTPUT"
        fi
    done
}

worker_process() {
    for ((i=1; i <= $workers; i++)); do
        curl_process $i > ./logs/worker${i}.log &
    done
    wait
    for ((i=1; i <= $workers; i++)); do
        cat ./logs/worker${i}.log &
    done
    wait
    echo -e "-------------------------------------------------\r\n"
    echo -e "All background process are done\r\n"
}

init() {
    logo
    set_args
    worker_process
}

init
exit 0