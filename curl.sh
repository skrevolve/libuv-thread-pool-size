#! /bin/sh

# curl 명령 실행 수: 15
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
    do
        curl -X GET http://localhost:8080/
    done
echo All done

# 병렬 실행 수: 15
# xargs -I % -P 15 curl -X GET http://localhost:8080/

# 병렬 실행 수: 5
# curl 명령 실행 수: 10
# xargs -I % -P 5 curl -X GET http://localhost:8080/ << (printf '%s\n' {1..10})