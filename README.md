# libuv-thread-pool-size test

![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/08647e01-0b8f-482f-844f-ed9ff2f4e324)</br>
Node.js 구성도

Nodejs libuv의 스레드 풀 크기로 인해 애플리케이션에 병목 현상이 발생하는 방법과 이를 수정하는 방법입니다.</br>
**libuv에 존재하는 I/O가 많은 애플리케이션의 경우 libuv 스레드 풀 크기는 심각한 병목 현상이 될 수 있으며 총 처리량을 늘리는데 가장 큰 영향을 미치는 요인중 하나가 될 수 있습니다.**

## What is libuv?

![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/9e54dc13-c90e-407d-a7de-6f913405c339)</br>
libuv는 비동기 I/O를 위한 다중 플랫폼 라이브러리입니다

- [libuv github](https://github.com/libuv/libuv)
- [libuv docs](https://docs.libuv.org/en/v1.x/threadpool.html)

![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/10dc5dd4-cde3-47af-b764-43375bc93f5d)</br>
libuv 구성도

## Must Knows

- Node.js의 I/O 방법 중 일부는 libuv에 의존합니다.</br>
  가능한 경우 Node.js는 이미 비동기/비차단 API를 사용합니다.</br>
  다른 경우 libuv는 스레드 풀을 사용하여 동기화/차단 I/O를 비동기/비차단으로 전환합니다</br>
- libuv의 스레드 풀 크기는 기본적으로 4 입니다

## What’s the Problem?

libuv의 기본 스레드 풀 크기는 4입니다.</br>
libv에 의존하는 4개 이상의 동시 I/O작업을 수행하면 각각의 추가 작업이 대기열에서 대기해야 하므로 libuv의 작은 스레드 풀 크기가 병목 현상을 발생시킵니다.</br>

다음은 libuv의 thread pool을 사용하는 일부 I/O 작업입니다.

- file system : fs.FSWatcher(), syncrhonus fs를 제외한 모든 파일 시스템 작업
- DNS : dns.lookup(), dns.lookupService()
- Crypto : crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill()..
- Zlib : synchronous API 제외
- ub_queue_work를 호출하는 Lib 및 사용자 코드

## Solving It

Node.js 를 시작하기 전에 I/O호출을 수행하기 전에 UV_THREADPOOL_SIZE 변수 크기를 늘려 변경 해야 합니다.</br>
libuv는 스레드 풀에 의존하는 I/O 메서드를 처음 호출할 때 스레드 풀을 인스턴스화 합니다.</br>
일단 인스턴스화되면 스레드 풀 크기(UV_THREADPOOL_SIZE)에 대한 변경 사항은 적용되지 않습니다.</br>

## Examples

Node.js를 시작하기 전에 UV_THREADPOOL_SIZE를 변경하는 것이 좋습니다.</br>
Node.js를 시작하기 전에 환경 변수를 설정하면 의도가 더 명확해지고 무언가 잘못된 가능성이 줄어듭니다.(포함된 라이브러리가 부작용으로 I/O를 호출함)</br>

### Via Bash

```sh
UV_THREADPOOL_SIZE=64 node ./out/main.js
```

### Via Windows CLI

```sh
SET UV_THREADPOOL_SIZE=64 && node ./out/main.js
```

### As first instruction in Node.js app: (not recommended)

```js
'use strict'
process.env.UV_THREADPOOL_SIZE=64
```

## How High Should I Set It?

설정하는 값은 경우에 따라 다릅니다.</br>
cpu 코어 수로 예시로한 자료들이 많은데 libuv측 이슈에서 상관이 있는지에 대한 논쟁이 있었습니다.</br>
-> [Change default thread pool size from fixed 4 to number of logical cores #1578](https://github.com/joyent/libuv/issues/1578)</br>
CPU intensive한 작업은 thread pool에서 처리되므로 thread 수를 늘리면 그만큼 context switching 이 늘어나 보통 물리코어 수만큼 size 설정하기를 권장한다고 합니다.</br>
이에 대한 논쟁은 아래 테스트 결과를 통해 알아 보면 되겠습니다.

- 스레드 풀 크기는 최대 동시 I/O 작업의 정확한 양입니다
- 너무 높게 설정하면 너무 낮게 설정하는 것보다 처리량에 미치는 영향이 적습니다
- 극단적으로 높게 설정할 필요는 없습니다
- 메모리 오버헤드는 128개 스레드에 대해 ~1MB 입니다
- 최대값(1.30.0 이후)은 1024 입니다
- CPU 코어 수로 설정하는 것은 좋은 기준이 아닙니다. 이는 CPU 집약적인 작업이 아닌 I/O 작업입니다

### You can count threads in Linux

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

## Running Test By shell

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

## Running test

### case 1 (pm2 fork mode)

- parallels : 1
- curl request : 15

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 1             | 15               | 10                 | **0.446**    | 18.723       | 9.620            |
| 8                      | 1             | 15               | 10                 | 0.591        | 11.809       | 6.130            |
| 12 (my cpu length)     | 1             | 15               | 10                 | 0.844        | 10.408       | **5.536**        |
| 16                     | 1             | 15               | 10                 | 0.902        | 10.526       | 5.770            |
| 32                     | 1             | 15               | 10                 | 1.413        | 10.249       | 6.160            |
| 64                     | 1             | 15               | 10                 | 3.569        | 9.970        | 7.033            |
| 128                    | 1             | 15               | 10                 | 6.394        | **9.602**    | 8.693            |
| 256                    | 1             | 15               | 10                 | 7.048        | 10.731       | 9.846            |
| 512                    | 1             | 15               | 10                 | 6.755        | 10.396       | 9.561            |
| 1024                   | 1             | 15               | 10                 | 7.233        | 10.691       | 9.732            |

### case 2 (pm2 fork mode)

- parallels : 15
- curl request : 1

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 1                | 10                 | **0.513**    | 18.930       | 9.722            |
| 8                      | 15            | 1                | 10                 | 0.655        | 11.780       | 6.150            |
| 12 (my cpu length)     | 15            | 1                | 10                 | 0.837        | 11.037       | **5.850**        |
| 16                     | 15            | 1                | 10                 | 0.956        | 11.171       | 6.077            |
| 32                     | 15            | 1                | 10                 | 2.106        | 10.768       | 6.495            |
| 64                     | 15            | 1                | 10                 | 3.953        | 10.805       | 7.509            |
| 128                    | 15            | 1                | 10                 | 6.287        | **10.451**   | 9.230            |
| 256                    | 15            | 1                | 10                 | 5.707        | 10.945       | 10.004           |
| 512                    | 15            | 1                | 10                 | 5.106        | 10.697       | 10.091           |
| 1024                   | 15            | 1                | 10                 | 4.726        | 10.976       | 9.933            |

### case 3 (pm2 fork mode)

- parallels : 15
- curl request : 5

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)**  | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|---------------|------------------|
| 4                      | 15            | 5                | 10                 | **0.563**    | 95.393        | 47.842           |
| 8                      | 15            | 5                | 10                 | 0.661        | 57.982        | 29.125           |
| 12 (my cpu length)     | 15            | 5                | 10                 | 0.903        | 54.387        | **27.639**       |
| 16                     | 15            | 5                | 10                 | 0.932        | 54.397        | 27.845           |
| 32                     | 15            | 5                | 10                 | 1.605        | 53.590        | 27.916           |
| 64                     | 15            | 5                | 10                 | 3.250        | 53.544        | 29.213           |
| 128                    | 15            | 5                | 10                 | 8.490        | 51.981        | 30.532           |
| 256                    | 15            | 5                | 10                 | 9.516        | **51.348**    | 33.927           |
| 512                    | 15            | 5                | 10                 | 24.724       | 49.495        | 39.482           |
| 1024                   | 15            | 5                | 10                 | 12.087       | 53.127        | 48.663           |

### case 1 (pm2 cluster mode :2 instances)

- parallels : 1
- curl request : 15

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 5                | 10                 | 0.566        | 12.160       | 6.179            |
| 8                      | 15            | 5                | 10                 | 0.889        | 10.332       | 5.611            |
| 12 (my cpu length)     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 16                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 32                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 64                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 128                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 256                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 512                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 1024                   | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |

### case 2 (pm2 cluster mode :2 instances)

- parallels : 15
- curl request : 1

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 1                | 10                 | 0.642        | 12.685       | 6.411            |
| 8                      | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 12 (my cpu length)     | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 16                     | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 32                     | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 64                     | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 128                    | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 256                    | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 512                    | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |
| 1024                   | 15            | 1                | 10                 | 0.000        | 0.000        | 0.000            |

### case 3 (pm2 cluster mode :2 instances)

- parallels : 15
- curl request : 5

| **UV_THREADPOOL_SIZE** | **parallels** | **curl request** | **I/O operations** | **min(sec)** | **max(sec)** | **average(sec)** |
|------------------------|---------------|------------------|--------------------|--------------|--------------|------------------|
| 4                      | 15            | 5                | 10                 | 0.665        | 62.578       | 29.898           |
| 8                      | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 12 (my cpu length)     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 16                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 32                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 64                     | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 128                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 256                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 512                    | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |
| 1024                   | 15            | 5                | 10                 | 0.000        | 0.000        | 0.000            |

</br>

## 참고자료

- [libuv 설계 개요](https://docs.libuv.org/en/latest/design.html)
- [libuv API: 스레드 풀 작업 스케줄링](https://docs.libuv.org/en/v1.x/threadpool.html)
- [Node.js의 스레드 문제](https://kariera.future-processing.pl/blog/on-problems-with-threads-in-node-js/)
- [StackOverflow: "UV_THREADPOOL_SIZE 환경 변수를 사용해 본 사람이 있습니까?"](https://stackoverflow.com/questions/17554688/has-anyone-tried-using-the-uv-threadpool-size-environment-variable)
- [Change default thread pool size from fixed 4 to number of logical cores](https://github.com/joyent/libuv/issues/1578)
