# libuv-thread-pool-size benchmark

UV_THREADPOOL_SIZE default 4

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
| UV_THREADPOOL_SIZE | max ms (done) | loop |
| --- | --- | --- |
| 4     |     |     |
| 12    |     |     |
| 32    |     |     |
| 64    |     |     |
| 128   |     |     |
| 256   |     |     |
| 512   |     |     |
| 1024  |     |     |

