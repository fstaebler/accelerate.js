import re
import operator

f = open("quickscope.js", "r")

s = f.read()
f.close()

#strip unnecessary whitespace, floats with integer values, line comments
           #leading whitespace
                  #trailing whitespace
                                  #whitespace in non
s = re.sub("(^\s+|\s+$|(?<=\W)\s+|\s+(?=\W)|//.*|\.0+(?=\D)|(?<=\W)0+(?=\.[1-9])|(/\*(\n|.)*\*/))", "", s, flags=re.MULTILINE)
#strip doubled up whitespace between word characters
s = re.sub("(?<=\w)\s{2,}(?=\w)", " ", s, flags=re.MULTILINE) 

f = open("webglcontext", "r");
c = f.read();
vs = re.finditer("(?<=GLenum )(\w+?)\s+?=\s+?(\w+?)(?=;)", c)
glconsts = {}
for v in vs:
  label, value = v.group(1, 2)
  if value[:2] == "0x":
    value = int(value, 16)
  else:
    value = int(value)
  s = re.sub("g\." + label + "(?=\W)", str(value), s)
  
occurences = {}
used_chars = []

shaderSources = re.finditer("SyncHttpGet\(\"(.*?)\"\)", s)
for ss in shaderSources:
  t, path = ss.group(0, 1)
  f = open(path, "r")
  sss = f.read()
  sss = re.sub("(^\s+|\s+$|(?<=\W)\s+|\s+(?=\W)|//.*|(?<=\.)0(?=\D)|(?<=\D)0(?=\.0*[1-9])|(/\*(\n|.)*\*/))", "", sss, flags=re.MULTILINE)
  f.close()
  s = s.replace(t, "\"" + sss + "\"")
  
words = {}
ws = re.finditer("[a-zA-Z]\w*", s)
for w in ws:
  word = w.group(0)
  if word in words:
    words[word] += 1
  else:
    words[word] = 1
    
#for w in words:
#  print("\'%s\': %i" % (w, words[w]))

for x in range(32, 126):
  c = chr(x)
  print("\'%s\': %i" % (c, s.count(c)))

f = open("quickscope.min.js", "w")
f.write(s)
f.close()
