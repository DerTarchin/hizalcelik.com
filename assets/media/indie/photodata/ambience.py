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
default_folder = "imgs"
extentions = ('.jpg','.jpeg','.png','.tif','.tiff','.gif')
files = []
metadata = {}
days = {}
data = []

def load(folder = None):
  global files
  if not folder:
    folder = default_folder

  for r, dir, f in walk(folder):
    for file in f:
      if join(r,file).lower().endswith(extentions):
        files.append(join(r, file))

  perc = 0
  count = 0
  for file in files:
    if debug:
      print file

    image = None
    while not image:
      try:
        image = open(file, 'rb')
      except:
        print "ERROR: File not found: " + file
        raw_input("Press enter to continue when reconnected ");
    
    tags = exifread.process_file(image, details=False)  
    try:
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

      if debug:
        print "\tTimestamp: " + str(ts)
        print "\tAperture: f" + str(f)
        print "\tShutter: " + str(tags['EXIF ExposureTime']) + " (" + str(ss) + ")"
        print "\tISO: " + str(iso)
        print "\tFocal length: " + str(fl) + "mm"

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
  filename = "data.js"
  if debug:
    filename = "debug.txt"

  print "Writing " + filename + "... ",
  with open(filename, 'w') as f:
    f.write("window.chartdata = [\n")
    for day in data:
      f.write("[")
      for i in xrange(len(day)):
        f.write(str(day[i]))
        if i != len(day)-1:
          f.write(',')
        else:
          f.write('],\n')
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

def getRating(meta):
  iso = constrain(map(meta['iso'], 100, 6400, 0, 100), 0, 100)
  f = constrain(map(meta['f'], 22, 1.4, 0, 100), 0, 100)
  ss = constrain(map(meta['ss'], float(1.0/8000), 1, 0, 100), 0, 100)

  if debug:
    print "\tISO: " + str(meta['iso']) + "/" + str(iso)
    print "\tF: " + str(meta['f']) + "/" + str(f)
    print "\tSS: " + str(meta['ss']) + "/" + str(ss)

  return int(iso + f + ss)

def analyze(index = None):
  global metadata, data, days

  count = 0
  perc = 0
  for img in metadata:
    meta = metadata[img]
    rating = getRating(meta)
    if debug:
      print ""
      print img
      print rating
    if rating >= 250:
      print img

    if str(meta['ts'].date()) in days:
      days[str(meta['ts'].date())].append(rating)
    else:
      days[str(meta['ts'].date())] = [rating]

    # print progress
    count += 1
    new_perc = int(round(((count * 1.0) / len(metadata)) * 100))
    if new_perc > perc and new_perc%10==0:
      print str(new_perc) + "% "
    perc = new_perc

  # save as ordered days
  ordered = OrderedDict(sorted(days.items(), key=lambda t: t[0]))
  for day in ordered:
    data.append(ordered[day])

  if debug:
    print days
    print ordered
    print data

  print str(len(metadata)) + " files processed."

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