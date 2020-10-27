for i in *.mp3;
  do name=`echo "$i" | rev | cut -d'.' -f1 | rev`
  echo "$name"
  ffmpeg -hide_banner -loglevel panic -y -ss 0 -i "$i" -vn -t 40 -af "silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse,silenceremove=start_periods=1:start_duration=1:start_threshold=-60dB:detection=peak,aformat=dblp,areverse" "../processed/${name}.mp3"
done