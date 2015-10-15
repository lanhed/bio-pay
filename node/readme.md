# Node
Contains 3 different systems and an app to tie them together.

The systems are:
* gui
* nfc reader
* payment service

## App
Running the app currently requires a folder "_nfc-pay" in the home directory with two files "nfc.json" and "blockchain.json" which contains data needed to test tha app. 

nfc.json
```
{
	"bitcoins": {
		"username": "your blockchain guid",
		"password": "your blockchain password"
	}
}
```

blockchain.json
```
{
	"receiveAddress": "your blockchain address",
	"callbackUrl": "public facing url for confirmation callbacks"
}
```

Running the app will start up a server that host's the gui and expose an api for creating payments.

To run the app type the following.

```
npm run app
```

## GUI
To run only gui without payment enabled type

```
npm run gui
```

## Nfc
Nfc module currently only returns what's found in nfc.json in "~/_nfc-pay" for the type sent in.


## Payment service
Make actual payments with blockchain API but doesn't listen to confirmations yet.
