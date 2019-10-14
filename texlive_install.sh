#!/usr/bin/env sh

wget http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
tar -xzf install-tl-unx.tar.gz
cd install-tl*
./install-tl --profile=../texlive.profile

PATH=/usr/local/texlive/2019/bin/x86_64-linux:$PATH 

tlmgr install   \
  exam          \
  amsfonts      \
  stmaryrd      \
  amsmath

tlmgr update --self --all --no-auto-install