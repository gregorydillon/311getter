wget -ximediaURLs.txt
find -name "*.jpg" | gawk 'BEGIN{ a=1 }{ printf "mv %s %04d.jpg\n", $0, a++ }' | bash
avconv -framerate 1/2  -i %04d.jpg video.webm
# avconv -framerate 2 -f image2 -i %04d.jpg  coffee.mp4
# avconv -framerate 1 -i %04d.jpg -c:v libx264 -r 30 out.mp4
