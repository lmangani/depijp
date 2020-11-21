# depijp
WSS Pipes and Forwarding Echo Chambers

<img src="https://user-images.githubusercontent.com/1423657/99881049-acce4000-2c17-11eb-9c5d-c2498f33af86.png" width=200 />


### Install
```
npm install -g depijp
```

### Usage

#### Chat Example
Open two (or 100) terminals and run the following:
```
depijp {secret_channel_key}
```

##### Use [Custom WSS Relay](https://github.com/meething/ws-multisocket)
```
depijp {secret_channel_key} {wss://your.server:port}
```

#### Pipe Example
Open a reading socket, writing to a file:
```
depijp {secret_channel_key} > /tmp/mynewfile.txt
```
Open a writing socket, reading from a file:
```
depijp {secret_channel_key} < /tmp/myoldfile.txt
```


