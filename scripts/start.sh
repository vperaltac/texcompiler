#!/bin/sh
service rabbitmq-server start
PATH=/usr/local/texlive/2019/bin/x86_64-linux:$PATH; export PATH
grunt start