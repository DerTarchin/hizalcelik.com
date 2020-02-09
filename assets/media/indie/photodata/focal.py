# Copyright Hizal Celik, 2017
# Cannot use or modify this code without Hizal's permission

from collections import OrderedDict 
from os.path import exists, join
from datetime import datetime
from os import makedirs, walk
import logging, traceback
import exifread
import json

debug = False
default_folder = "/Volumes/ext/All_Old"
default_folder = "/Users/Hizal/Pictures"
extentions = ('.jpg','.jpeg','.png','.tif','.tiff','.gif')
focals = [18, 25, 35, 50, 75, 105, 200, 1000]
files = []
metadata = {}
data = {}

def load(folder = default_folder):
  global files

  for r, dir, f in walk(folder):
    for file in f:
      if join(r,file).lower().endswith(extentions):
        files.append(join(r, file))

  perc = 0
  count = 0
  for file in files:
    # if debug:
    #   print file

    image = None
    while not image:
      try:
        image = open(file, 'rb')
      except:
        print "ERROR: File not found: " + file
        raw_input("Press enter to continue when reconnected ");
    
    try:
      tags = exifread.process_file(image, details=False)  
      # timestamp
      ts = datetime.strptime(str(tags['EXIF DateTimeOriginal']), '%Y:%m:%d %H:%M:%S')

      # aperture
      fstop = str(tags['EXIF FNumber']).split('/')
      if len(fstop) > 1:
        f = float(fstop[0])/float(fstop[1])
      else:
        f = float(fstop[0])

      # shutter speed
      speed = str(tags['EXIF ExposureTime']).split('/')
      if len(speed) > 1:
        ss = float(speed[0])/float(speed[1])
      else:
        ss = float(speed[0])
      
      # iso
      iso = int(str(tags['EXIF ISOSpeedRatings']))

      # focal length
      mm = str(tags['EXIF FocalLength']).split('/')
      if len(mm) > 1:
        fl = float(mm[0])/float(mm[1])
      else:
        fl = float(mm[0])

      # if debug:
      #   print "\tTimestamp: " + str(ts)
      #   print "\tAperture: f" + str(f)
      #   print "\tShutter: " + str(tags['EXIF ExposureTime']) + " (" + str(ss) + ")"
      #   print "\tISO: " + str(iso)
      #   print "\tFocal length: " + str(fl) + "mm"

      metadata[file] = {'f':f, 'ss':ss, 'iso':iso, 'fl':fl, 'ts':ts}

    except Exception as e:
      if debug:
        print file
        logging.error(traceback.format_exc())
      pass

    # print progress
    if count == 0:
      print " 0% ",
    count += 1
    new_perc = int(round(((count * 1.0) / len(files)) * 100))
    if new_perc > perc and new_perc%10==0:
      print "\n" + str(new_perc) + "% ",
    elif new_perc > perc and new_perc%1==0:
      print ".",
    perc = new_perc

  print ""
  print str(len(files)) + " files found.\n"

def write():
  filename = "data1.js"
  if debug:
    filename = "debug.txt"

  print "Writing " + filename + "... ",
  with open(filename, 'w') as f:
    f.write("window.chartdata1 = [\n")
    for fl in focals:
      f.write(str(data[str(int(fl))]))
      if fl != focals[-1]:
        f.write(", ")
    f.write("];")
    f.close()

  print "\t\tdone."

def map(value, srcMin, srcMax, tgtMin, tgtMax):
  return tgtMin + (tgtMax - tgtMin) * ((float(value) - srcMin) / (srcMax - srcMin))

def constrain(value, min, max):
  if value < min:
    return min
  if value > max:
    return max
  return value

def analyze(index = None):
  global metadata, data

  for fl in focals:
    data[str(fl)] = 0

  total = 0
  count = 0
  perc = 0
  for img in metadata:
    meta = metadata[img]

    for fl in focals:
      if meta['fl'] <= fl and meta['fl'] >= 10:
        data[str(fl)] += 1
        total += 1
        break

    # print progress
    count += 1
    new_perc = int(round(((count * 1.0) / len(metadata)) * 100))
    if new_perc > perc and new_perc%10==0:
      print str(new_perc) + "% "
    perc = new_perc

  print data
  for key in data:
    data[key] = round(((data[key] * 1.0) / total) * 100)
  print str(len(metadata)) + " files processed, " + str(total) + " used."
  print data

def test():
  pass

while True:
  print "0: Exit (without saving)"
  print "1: Auto"
  print "2: Load"
  print "3: Analyze"
  print "4: Save data"
  choice = (int)(raw_input("> "))

  if choice == 0:
    break

  if choice == 1:
    load()
    analyze()
    write()
    
  elif choice == 2:
    folder = raw_input("Folder section: ")
    load(folder)
  elif choice == 3:
    analyze()
  elif choice == 4:
    write()
  elif choice == 626:
    test()
  else:
    print ""

  print ""