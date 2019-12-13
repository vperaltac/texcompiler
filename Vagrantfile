# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"

  config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.provision :ansible do |ansible|
    config.vm.network "forwarded_port", guest: 80, host: 8086
    ansible.playbook = "provision/playbook.yml"
  end
end