# libuv-thread-pool-size benchmark

Nodejs, libuv의 스레드 풀 크기로 인해 애플리케이션에 병목 현상이 발생하는 방법과 이를 수정하는 방법입니다

libuv에 존재하는 I/O가 많은 애플리케이션의 경우 libuv 스레드 풀 크기는 심각한 병목 현상이 될 수 있으며
총 처리량을 늘리는데 가장 큰 영향을 미치는 요인중 하나가 될 수 있습니다.

### libuv 란?
![image](https://github.com/skrevolve/libuv-thread-pool-size/assets/41939976/0311c026-a5d8-4b52-b369-ecb7b0a71db5)
libuv는 비동기 I/O를 위한 다중 플랫폼 라이브러리입니다.

### 반드시 알아야 할 사항
- Node.js의 I/O 방법 중 일부는 libuv에 의존합니다
  가능한 경우 Node.js는 이미 비동기/비차단 API를 사용합니다
  다른 경우 libuv는 스레드 풀을 사용하여 동기화/차단 I/O를 비동기/비차단으로 전환합니다
- libuv의 스레드 풀 크기는 기본적으로 4 입니다

### 무엇이 문제일까


### run express
```sh
// you can change UV_THREADPOOL_SIZE=64 in package.json
npm run build && npm run start
```

### run shell
```sh
chmod +x curl.sh
./curl.sh
```

### test result

- test case 1
| UV_THREADPOOL_SIZE | max ms | curl requset | I/O operations |
| --- | --- | --- | --- |
| 4     | 18856 | 15 | 10 |
| 12    | 10341 | 15 | 10 |
| 32    |       | 15 | 10 |
| 64    |       | 15 | 10 |
| 128   |       | 15 | 10 |
| 256   |       | 15 | 10 |
| 512   |       | 15 | 10 |
| 1024  |       | 15 | 10 |