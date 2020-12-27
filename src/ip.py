# code by Miyako Yakota (https://github.com/MiyakoYakota)

from socket import inet_ntoa
from random import randint
import struct
ip = inet_ntoa(struct.pack('>I', randint(1, 0xffffffff)))

print(ip)