# ping-notify

a simple ping and notify script to check if a website is active and then alert through Simplepush

## Install

update the ExecStart in `ping-notify` to this repo's location

run:
`mv ping-notify.service /etc/systemd/system/`
`sudo systemctl start ping-notify`
