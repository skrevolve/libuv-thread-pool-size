# libuv-thread-pool-size test

Nodejs, libuv의 스레드 풀 크기로 인해 애플리케이션에 병목 현상이 발생하는 방법과 이를 수정하는 방법입니다</br>
**libuv에 존재하는 I/O가 많은 애플리케이션의 경우 libuv 스레드 풀 크기는 심각한 병목 현상이 될 수 있으며**</br>
**총 처리량을 늘리는데 가장 큰 영향을 미치는 요인중 하나가 될 수 있습니다**

## libuv 란?

![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/9e54dc13-c90e-407d-a7de-6f913405c339)</br>
libuv는 비동기 I/O를 위한 다중 플랫폼 라이브러리입니다

- [libuv github](https://github.com/libuv/libuv)
- [libuv docs](https://docs.libuv.org/en/v1.x/threadpool.html)

## 반드시 알아야 할 사항

- Node.js의 I/O 방법 중 일부는 libuv에 의존합니다</br>
  가능한 경우 Node.js는 이미 비동기/비차단 API를 사용합니다</br>
  다른 경우 libuv는 스레드 풀을 사용하여 동기화/차단 I/O를 비동기/비차단으로 전환합니다</br>
- libuv의 스레드 풀 크기는 기본적으로 4 입니다

## 무엇이 문제일까

libuv의 기본 스레드 풀 크기는 4</br>
libv에 의존하는 4개 이상의 동시 I/O작업을 수행하면 각각의 추가 작업이 대기열에서 대기해야 하므로 libuv의 작은 스레드 풀 크기가 병목 현상을 발생시킵니다</br>
libuv의 스레드 풀을 사용하는 일부 I/O 작업:</br>

- 모든 파일 시스템 작업
- DNS 확인
- ub_queue_work를 호출하는 Lib 및 사용자 코드

## 해결 방법

Node.js 를 시작하기 전에 I/O호출을 수행하기 전에 UV_THREADPOOL_SIZE 변수 크기를 늘려 변경 해야 합니다</br>
libuv는 스레드 풀에 의존하는 I/O 메서드를 처음 호출할 때 스레드 풀을 인스턴스화 합니다</br>
일단 인스턴스화되면 스레드 풀 크기(UV_THREADPOOL_SIZE)에 대한 변경 사항은 적용되지 않습니다</br>
Node.js를 시작하기 전에 UV_THREADPOOL_SIZE를 변경하는 것이 좋습니다</br>
Node.js를 시작하기 전에 환경 변수를 설정하면 의도가 더 명확해지고 무언가 잘못된 가능성이 줄어듭니다(포함된 라이브러리가 부작용으로 I/O를 호출함)</br>

### Via Bash

```sh
UV_THREADPOOL_SIZE=64 node index.js
```

### Via Windows CLI

```sh
SET UV_THREADPOOL_SIZE=64 && node index.js
```

### As first instruction in your Node.js app: (not recommended)

```js
'use strict'
process.env.UV_THREADPOOL_SIZE=64;
```

## 얼마나 높게 설정해야 할까?

설정하는 값은 경우에 따라 다릅니다</br>
cpu 코어 수로 예시로한 자료들이 많은데 libuv 측에서는 상관이 없다고 합니다</br>
관련 링크: [Change default thread pool size from fixed 4 to number of logical cores #1578](https://github.com/joyent/libuv/issues/1578)

- 스레드 풀 크기는 최대 동시 I/O 작업의 정확한 양입니다
- 너무 높게 설정하면 너무 낮게 설정하는 것보다 처리량에 미치는 영향이 적습니다
- 극단적으로 높게 설정할 필요는 없습니다
- 메모리 오버헤드는 128개 스레드에 대해 ~1MB 입니다
- 최대값(1.30.0 이후)은 1024 입니다
- CPU 코어 수로 설정하는 것은 좋은 기준이 아닙니다. 이는 CPU 집약적인 작업이 아닌 I/O 작업입니다

### 다음을 사용하여 Linux에서 사용 중인 스레드를 계산할 수 있습니다

```sh
ps -Lef | grep "\<node\>" | wc -l
```

## Run Server

You can change **UV_THREADPOOL_SIZE** option in **package.json**

### Install & Build

```sh
npm install
npm run build
```

### Node

```sh
npm run start:dev
```

### PM2 fork mode

```sh
npm run start:fork
```

### PM2 cluster mode

```sh
npm run start:cluster
```

## Running Test

```sh
# if you need change chown
chmod +x curl.sh
# run test case 1
./curl.sh -c 1
# run test case 2
./curl.sh -c 2
# run test case 3
./curl.sh -c 3
```

## Running test result in pm2 fork mode

### test case 1

- parallels : 1
- curl request : 15

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 1             | 15               | 10                 | **0.454**    | 18.856       | 9.567            |
| 8                      | 1             | 15               | 10                 | **0.585**    | 12.009       | 6.325            |
| 12 (my cpu length)     | 1             | 15               | 10                 | 0.839        | 10.531       | **5.663**        |
| 16                     | 1             | 15               | 10                 | 0.875        | 10.483       | **5.809**        |
| 32                     | 1             | 15               | 10                 | 1.383        | 10.320       | 6.256            |
| 64                     | 1             | 15               | 10                 | 3.469        | 10.474       | 7.286            |
| 128                    | 1             | 15               | 10                 | 6.258        | **9.422**    | 8.508            |
| 256                    | 1             | 15               | 10                 | 7.175        | 10.382       | 9.569            |
| 512                    | 1             | 15               | 10                 | 6.381        | 10.640       | 9.614            |
| 1024                   | 1             | 15               | 10                 | 4.426        | 10.657       | 9.393            |

### test case 2

- parallels : 15
- curl request : 1

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 1                | 10                 | **0.448**    | 19.204       | 9.720            |
| 8                      | 15            | 1                | 10                 | **0.562**    | 12.131       | 6.396            |
| 12 (my cpu length)     | 15            | 1                | 10                 | 0.853        | 11.133       | **5.951**        |
| 16                     | 15            | 1                | 10                 | 0.877        | 10.664       | **5.876**        |
| 32                     | 15            | 1                | 10                 | 2.011        | 10.764       | 6.373            |
| 64                     | 15            | 1                | 10                 | 3.010        | 10.511       | 7.286            |
| 128                    | 15            | 1                | 10                 | 6.812        | **10.081**   | 9.028            |
| 256                    | 15            | 1                | 10                 | 6.734        | 10.903       | 10.227           |
| 512                    | 15            | 1                | 10                 | 7.130        | 10.822       | 10.306           |
| 1024                   | 15            | 1                | 10                 | 4.930        | 11.182       | 10.378           |

### test case 3

- parallels : 15
- curl request : 5

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 8                      | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 12 (my cpu length)     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 16                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 32                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 64                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 128                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 256                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 512                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 1024                   | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |


## 참고자료

- [libuv 설계 개요](https://docs.libuv.org/en/latest/design.html)
- [libuv API: 스레드 풀 작업 스케줄링](https://docs.libuv.org/en/v1.x/threadpool.html)
- [Node.js의 스레드 문제](https://kariera.future-processing.pl/blog/on-problems-with-threads-in-node-js/)
- [StackOverflow: "UV_THREADPOOL_SIZE 환경 변수를 사용해 본 사람이 있습니까?"](https://stackoverflow.com/questions/17554688/has-anyone-tried-using-the-uv-threadpool-size-environment-variable)
- []()
