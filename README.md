# libuv-thread-pool-size test

Nodejs, libuv의 스레드 풀 크기로 인해 애플리케이션에 병목 현상이 발생하는 방법과 이를 수정하는 방법입니다</br>
**libuv에 존재하는 I/O가 많은 애플리케이션의 경우 libuv 스레드 풀 크기는 심각한 병목 현상이 될 수 있으며**</br>
**총 처리량을 늘리는데 가장 큰 영향을 미치는 요인중 하나가 될 수 있습니다**
</br></br>

## libuv 란?

![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/9e54dc13-c90e-407d-a7de-6f913405c339)</br>
libuv는 비동기 I/O를 위한 다중 플랫폼 라이브러리입니다

- [libuv github](https://github.com/libuv/libuv)
- [libuv docs](https://docs.libuv.org/en/v1.x/threadpool.html)

</br>
</br>

## 반드시 알아야 할 사항

- Node.js의 I/O 방법 중 일부는 libuv에 의존합니다
  가능한 경우 Node.js는 이미 비동기/비차단 API를 사용합니다
  다른 경우 libuv는 스레드 풀을 사용하여 동기화/차단 I/O를 비동기/비차단으로 전환합니다
- libuv의 스레드 풀 크기는 기본적으로 4 입니다

## 무엇이 문제일까

- asdf

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
./curl.sh -c 3 // run test case3
```

## Running test result in pm2 fork mode

### case 1

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

### case 2

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

### case 3

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