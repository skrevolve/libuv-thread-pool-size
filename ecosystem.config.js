module.exports = {
    apps: [
        {
            name: 'libuv-threadpool-node', // app name
            script: './out/main.js', // execute file path
            instances: '2', // make process by CPU core length
            autorestart: true,
            watch: false,
            exec_mode: 'cluster', // cluster mode
            max_memory_restart: '300M', // when process memory over 300MB -> reload
            wait_ready: true, // ready event standby of master process
            listen_timeout: 50000, // wait time for ready event(ms)
            kill_timeout: 5000, // SIGINT ~ SIGKILL standby time 5sec
        }
    ]
};