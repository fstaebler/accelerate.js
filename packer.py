import operator
import re
#{code: data}

def pack(data, coding):
  r = b"eval(\""
  r += data.replace(b"\\", b"\\\\").replace(b"\"", b"\\\"")
  r += b"\".split(\"\").map("
  r += b"x=>["
  c = dict(coding)
  for x in c:
    if data.count(x) == 0:
      c[x] = b""
    elif c[x] == b"\"":
      c[x] = b"\"\\\"\""
    else:
      c[x] = b"\"" + c[x] + b"\""
  r += b",".join(c.values())
  r += b"][x.charCodeAt(0)-32]).join(\"\"))"
  return r
    
def ascii_coding():
  r = {}
  for x in range(32, 126):
    r[x] = bytes([x])
  return r
  
def find_unused_codes(data, coding):
  r = {}
  for x in coding:
    c = data.count(x)
    if c == 0:
      r[x] = coding[x]
  return r
  
def find_most_common_code(data, coding): #coded data
  code = 0
  count = 0
  for x in coding:
    c = data.count(coding[x])
    if c > count:
      code = x
      count = c
  return code, count

def find_most_common_code_2(data, coding): #coded data
  code = 0
  count = 0
  for x in coding:
    c = data.count(coding[x])
    if c > count:
      code = x
      count = c
  return code, count

def decode_data(data, coding):
  r = b""
  for d in data:
    r += coding[d]
  return r
  
def decode_data_2(data, coding):
  r = b""
  for d in data:
    if len(coding[d]) > 1:
      r += b"\x00"
    else:
      r += coding[d]
  return r
  
def encode_data(data, coding):
  r = bytearray(len(data))
  _coding = dict(coding)
  while len(_coding) > 0:
    code = 0
    length = 0
    for x in _coding:
      l = len(_coding[x])
      if l > length:
        code = x
        length = l
    del _coding[code]
    while data.find(coding[code]) > -1:
      p = data.find(coding[code])
      data = data.replace(coding[code], b"\x00" * len(coding[code]), 1)
      r[p] = code
  return r.replace(b"\x00", b"")

def widen_code(data, coding): #coded data
  decoded = decode_data(data, coding)
  decoded_masked = decode_data_2(data, coding)
  unused = next(iter(find_unused_codes(data, coding).keys()))
  words = {}
  ws = re.finditer(b"[a-zA-Z]\w*", decoded_masked)
  for w in ws:
    word = w.group(0)
    if word in words:
      words[word] -= len(word) - 1
    else:
      words[word] = 3 + len(word)
  score = 0
  word = ""
  for w in words:
    if words[w] < score:
      word = w
      score = words[w]
  new_code = word
  coding[unused] = new_code
  new_data = encode_data(decoded, coding)
  return new_data, coding
    
if __name__=="__main__":
  f = open("quickscope.min.js", "rb")
  s = f.read()
  f.close()
  
  coding = ascii_coding()
  while len(find_unused_codes(s, coding)) > 0:
  #s, coding = widen_code(s, coding)
    s, coding = widen_code(s, coding)
  print(str(pack(s, coding), "ascii"))
  
